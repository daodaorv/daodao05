<template>
  <div class="service-menu-config-form">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar">
        <el-button type="primary" :icon="Plus" @click="handleAdd"> 添加服务菜单 </el-button>
        <el-text class="tip-text"> 拖拽卡片可调整排序，排序权重越大越靠前 </el-text>
      </div>

      <!-- 拖拽排序列表 -->
      <draggable
        v-model="menuList"
        item-key="id"
        class="menu-list"
        handle=".drag-handle"
        @end="handleDragEnd"
      >
        <template #item="{ element, index }">
          <el-card class="menu-item" shadow="hover">
            <div class="menu-header">
              <div class="menu-title">
                <el-icon class="drag-handle" :size="20">
                  <Rank />
                </el-icon>
                <span class="menu-name">{{ element.name }}</span>
                <el-tag :type="element.isEnabled ? 'success' : 'info'" size="small">
                  {{ element.isEnabled ? '已启用' : '已禁用' }}
                </el-tag>
              </div>
              <div class="menu-actions">
                <el-button link type="primary" @click="handleEdit(element, index)">
                  编辑
                </el-button>
                <el-button link type="danger" @click="handleDelete(element, index)">
                  删除
                </el-button>
              </div>
            </div>

            <div class="menu-info">
              <div class="info-item">
                <span class="label">图标：</span>
                <span class="value">{{ element.icon }}</span>
              </div>
              <div class="info-item">
                <span class="label">路径：</span>
                <span class="value">{{ element.path }}</span>
              </div>
              <div class="info-item">
                <span class="label">排序：</span>
                <span class="value">{{ element.sortOrder }}</span>
              </div>
            </div>
          </el-card>
        </template>
      </draggable>

      <el-empty v-if="!loading && menuList.length === 0" description="暂无服务菜单" />

      <!-- 保存按钮 -->
      <div class="save-actions">
        <el-button type="primary" :loading="submitLoading" @click="handleSave">
          保存配置
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="formData.name" placeholder="如：租车" clearable />
        </el-form-item>

        <el-form-item label="图标名称" prop="icon">
          <el-input v-model="formData.icon" placeholder="如：car" clearable />
          <div class="form-tip">
            常用图标：car（汽车）、discount（折扣）、location（位置）、map（地图）
          </div>
        </el-form-item>

        <el-form-item label="跳转路径" prop="path">
          <el-input v-model="formData.path" placeholder="如：/pages/vehicle/list" clearable />
        </el-form-item>

        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="999" />
          <span class="form-tip">数字越大越靠前</span>
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnabled">
          <el-switch v-model="formData.isEnabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 保存 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Rank } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import type { FormInstance, FormRules } from 'element-plus'
import { getServiceMenu, updateServiceMenu } from '@/api/miniprogramResources'
import type { ServiceMenuItem } from '@/types/miniprogramResources'

// 数据
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const menuList = ref<ServiceMenuItem[]>([])
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  icon: '',
  path: '',
  sortOrder: 100,
  isEnabled: true,
})

// 编辑索引
let editIndex = -1

// 原始数据备份（用于重置）
let originalData: ServiceMenuItem[] = []

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请输入图标名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入跳转路径', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入排序权重', trigger: 'blur' }],
}

// 加载服务菜单
const loadMenu = async () => {
  loading.value = true
  try {
    const res = await getServiceMenu()
    menuList.value = res.data || []
    originalData = JSON.parse(JSON.stringify(menuList.value))
  } catch (error) {
    ElMessage.error('加载服务菜单失败')
  } finally {
    loading.value = false
  }
}

// 拖拽结束
const handleDragEnd = () => {
  // 更新排序权重
  menuList.value.forEach((item, index) => {
    item.sortOrder = (menuList.value.length - index) * 10
  })
  ElMessage.success('排序已更新，请点击保存按钮保存配置')
}

// 添加菜单
const handleAdd = () => {
  dialogTitle.value = '添加服务菜单'
  editIndex = -1
  Object.assign(formData, {
    id: '',
    name: '',
    icon: '',
    path: '',
    sortOrder: 100,
    isEnabled: true,
  })
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (menu: ServiceMenuItem, index: number) => {
  dialogTitle.value = '编辑服务菜单'
  editIndex = index
  Object.assign(formData, {
    id: menu.id,
    name: menu.name,
    icon: menu.icon,
    path: menu.path,
    sortOrder: menu.sortOrder,
    isEnabled: menu.isEnabled,
  })
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = async (menu: ServiceMenuItem, index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个服务菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    menuList.value.splice(index, 1)
    ElMessage.success('删除成功，请点击保存按钮保存配置')
  } catch (error) {
    // 用户取消
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    if (editIndex >= 0) {
      // 编辑
      menuList.value[editIndex] = { ...formData }
      ElMessage.success('更新成功，请点击保存按钮保存配置')
    } else {
      // 新增
      const newMenu: ServiceMenuItem = {
        id: Date.now().toString(),
        name: formData.name,
        icon: formData.icon,
        path: formData.path,
        sortOrder: formData.sortOrder,
        isEnabled: formData.isEnabled,
      }
      menuList.value.push(newMenu)
      ElMessage.success('添加成功，请点击保存按钮保存配置')
    }

    dialogVisible.value = false
  })
}

// 保存配置
const handleSave = async () => {
  if (menuList.value.length === 0) {
    ElMessage.warning('请至少添加一个服务菜单')
    return
  }

  submitLoading.value = true
  try {
    await updateServiceMenu(menuList.value)
    ElMessage.success('保存成功')
    loadMenu()
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    submitLoading.value = false
  }
}

// 重置
const handleReset = () => {
  menuList.value = JSON.parse(JSON.stringify(originalData))
  ElMessage.info('已重置为原始配置')
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadMenu()
})
</script>

<style scoped lang="scss">
.service-menu-config-form {
  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    .tip-text {
      color: #909399;
      font-size: 13px;
    }
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    min-height: 100px;

    .menu-item {
      cursor: move;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }

      .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .menu-title {
          display: flex;
          align-items: center;
          gap: 12px;

          .drag-handle {
            cursor: move;
            color: #909399;

            &:hover {
              color: #409eff;
            }
          }

          .menu-name {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }
        }

        .menu-actions {
          display: flex;
          gap: 8px;
        }
      }

      .menu-info {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;

        .info-item {
          font-size: 13px;

          .label {
            color: #909399;
          }

          .value {
            color: #606266;
          }
        }
      }
    }
  }

  .save-actions {
    display: flex;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;
  }

  .form-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
