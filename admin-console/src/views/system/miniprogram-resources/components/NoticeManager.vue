<template>
  <div class="notice-manager">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd"> 添加公告 </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="noticeList" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="content" label="公告内容" min-width="300" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getNoticeTypeTag(row.type)" size="small">
            {{ getNoticeTypeLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="排序" width="100" />
      <el-table-column prop="isEnabled" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isEnabled ? 'success' : 'info'" size="small">
            {{ row.isEnabled ? '已启用' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" width="180">
        <template #default="{ row }">
          <div class="time-range">
            <div v-if="row.startTime">开始: {{ row.startTime }}</div>
            <div v-if="row.endTime">结束: {{ row.endTime }}</div>
            <div v-if="!row.startTime && !row.endTime">长期有效</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button link type="danger" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="3"
            placeholder="请输入公告内容，建议50字以内"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="公告类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio value="info">普通</el-radio>
            <el-radio value="warning">警告</el-radio>
            <el-radio value="promotion">促销</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跳转链接" prop="link">
          <el-input
            v-model="formData.link"
            placeholder="选填，如：/pages/help/article?id=1"
            clearable
          />
        </el-form-item>

        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" :max="999" />
          <span class="form-tip">数字越大越靠前</span>
        </el-form-item>

        <el-form-item label="生效时间" prop="timeRange">
          <el-date-picker
            v-model="formData.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getNotices, createNotice, updateNotice, deleteNotice } from '@/api/miniprogramResources'
import type { Notice, NoticeFormData, NoticeType } from '@/types/miniprogramResources'

// 数据
const loading = ref(false)
const noticeList = ref<Notice[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<NoticeFormData>({
  content: '',
  type: 'info',
  link: '',
  sortOrder: 100,
  isEnabled: true,
  timeRange: undefined,
})

// 表单验证规则
const formRules: FormRules = {
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
  type: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
}

// 加载公告列表
const loadNotices = async () => {
  loading.value = true
  try {
    const res = await getNotices()
    noticeList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载公告失败')
  } finally {
    loading.value = false
  }
}

// 获取公告类型标签
const getNoticeTypeTag = (type: NoticeType) => {
  const map: Record<NoticeType, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    info: 'info',
    warning: 'warning',
    promotion: 'success',
  }
  return map[type] || 'info'
}

// 获取公告类型标签文本
const getNoticeTypeLabel = (type: NoticeType) => {
  const map = {
    info: '普通',
    warning: '警告',
    promotion: '促销',
  }
  return map[type] || '普通'
}

// 添加公告
const handleAdd = () => {
  dialogTitle.value = '添加公告'
  Object.assign(formData, {
    id: undefined,
    content: '',
    type: 'info',
    link: '',
    sortOrder: 100,
    isEnabled: true,
    timeRange: undefined,
  })
  dialogVisible.value = true
}

// 编辑公告
const handleEdit = (notice: Notice) => {
  dialogTitle.value = '编辑公告'
  Object.assign(formData, {
    id: notice.id,
    content: notice.content,
    type: notice.type,
    link: notice.link || '',
    sortOrder: notice.sortOrder,
    isEnabled: notice.isEnabled,
    timeRange: notice.startTime && notice.endTime ? [notice.startTime, notice.endTime] : undefined,
  })
  dialogVisible.value = true
}

// 删除公告
const handleDelete = async (notice: Notice) => {
  try {
    await ElMessageBox.confirm('确定要删除这个公告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteNotice(notice.id)
    ElMessage.success('删除成功')
    loadNotices()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      const data: Partial<Notice> = {
        content: formData.content,
        type: formData.type,
        link: formData.link || undefined,
        sortOrder: formData.sortOrder,
        isEnabled: formData.isEnabled,
        startTime: formData.timeRange?.[0],
        endTime: formData.timeRange?.[1],
      }

      if (formData.id) {
        await updateNotice(formData.id, data)
        ElMessage.success('更新成功')
      } else {
        await createNotice(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadNotices()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadNotices()
})
</script>

<style scoped lang="scss">
.notice-manager {
  .toolbar {
    margin-bottom: 20px;
  }

  .time-range {
    font-size: 12px;
    line-height: 1.5;
  }

  .form-tip {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
