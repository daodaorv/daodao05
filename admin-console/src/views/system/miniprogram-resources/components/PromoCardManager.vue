<template>
  <div class="promo-card-manager">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd"> 添加推广卡片 </el-button>
      <el-text class="tip-text"> 建议尺寸：690×200px，支持 JPG/PNG，不超过 300KB </el-text>
    </div>

    <!-- 卡片列表展示 -->
    <div v-loading="loading" class="card-grid">
      <el-empty v-if="!loading && cardList.length === 0" description="暂无推广卡片" />

      <el-card v-for="card in cardList" :key="card.id" class="promo-card" shadow="hover">
        <img :src="card.image" class="card-image" @click="handlePreview(card.image)" />
        <div class="card-info">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-subtitle">{{ card.subtitle }}</div>
          <div class="card-meta">
            <el-tag :type="card.isEnabled ? 'success' : 'info'" size="small">
              {{ card.isEnabled ? '已启用' : '已禁用' }}
            </el-tag>
            <span class="sort-order">排序: {{ card.sortOrder }}</span>
          </div>
        </div>
        <div class="card-actions">
          <el-button link type="primary" @click="handleEdit(card)"> 编辑 </el-button>
          <el-button link type="danger" @click="handleDelete(card)"> 删除 </el-button>
        </div>
      </el-card>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="卡片标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入卡片标题" clearable />
        </el-form-item>

        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="formData.subtitle" placeholder="请输入副标题" clearable />
        </el-form-item>

        <el-form-item label="背景图片" prop="images">
          <ImageUploader
            v-model="formData.images"
            :limit="1"
            :max-size="0.3"
            accept="image/jpeg,image/jpg,image/png"
          >
            <template #tip>
              <span>建议尺寸：690×200px，支持 JPG/PNG，不超过 300KB</span>
            </template>
          </ImageUploader>
        </el-form-item>

        <el-form-item label="跳转路径" prop="route">
          <el-input
            v-model="formData.route"
            placeholder="如：/pages/special-offer/list"
            clearable
          />
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

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="[previewImage]"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getPromoCards,
  createPromoCard,
  updatePromoCard,
  deletePromoCard,
} from '@/api/miniprogramResources'
import type { PromoCard, PromoCardFormData } from '@/types/miniprogramResources'
import ImageUploader from '@/components/common/ImageUploader.vue'

// 数据
const loading = ref(false)
const cardList = ref<PromoCard[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<PromoCardFormData>({
  title: '',
  subtitle: '',
  images: [],
  route: '',
  sortOrder: 100,
  isEnabled: true,
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入卡片标题', trigger: 'blur' }],
  subtitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }],
  images: [{ required: true, message: '请上传背景图片', trigger: 'change' }],
  route: [{ required: true, message: '请输入跳转路径', trigger: 'blur' }],
}

// 加载推广卡片列表
const loadCards = async () => {
  loading.value = true
  try {
    const res = await getPromoCards()
    cardList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载推广卡片失败')
  } finally {
    loading.value = false
  }
}

// 添加推广卡片
const handleAdd = () => {
  dialogTitle.value = '添加推广卡片'
  Object.assign(formData, {
    id: undefined,
    title: '',
    subtitle: '',
    images: [],
    route: '',
    sortOrder: 100,
    isEnabled: true,
  })
  dialogVisible.value = true
}

// 编辑推广卡片
const handleEdit = (card: PromoCard) => {
  dialogTitle.value = '编辑推广卡片'
  Object.assign(formData, {
    id: card.id,
    title: card.title,
    subtitle: card.subtitle,
    images: [card.image],
    route: card.route,
    sortOrder: card.sortOrder,
    isEnabled: card.isEnabled,
  })
  dialogVisible.value = true
}

// 删除推广卡片
const handleDelete = async (card: PromoCard) => {
  try {
    await ElMessageBox.confirm('确定要删除这个推广卡片吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deletePromoCard(card.id)
    ElMessage.success('删除成功')
    loadCards()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 预览图片
const handlePreview = (image: string) => {
  previewImage.value = image
  previewVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) return

    submitLoading.value = true
    try {
      const data: Partial<PromoCard> = {
        title: formData.title,
        subtitle: formData.subtitle,
        image: formData.images[0],
        route: formData.route,
        sortOrder: formData.sortOrder,
        isEnabled: formData.isEnabled,
      }

      if (formData.id) {
        await updatePromoCard(formData.id, data)
        ElMessage.success('更新成功')
      } else {
        await createPromoCard(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadCards()
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
  loadCards()
})
</script>

<style scoped lang="scss">
.promo-card-manager {
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

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    min-height: 200px;

    .promo-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .card-image {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
      }

      .card-info {
        margin-top: 12px;

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .card-subtitle {
          font-size: 13px;
          color: #606266;
          margin-bottom: 8px;
        }

        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .sort-order {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .card-actions {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }
    }
  }

  .form-tip {
    margin-left: 8px;
    font-size: 12px;
    color: #909399;
  }
}
</style>
