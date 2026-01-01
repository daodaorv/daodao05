<template>
  <div class="banner-manager">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd"> 添加轮播图 </el-button>
      <el-text class="tip-text">
        建议尺寸：{{ type === 'home' ? '750×320px' : '750×300px' }}，支持 JPG/PNG，不超过 500KB
      </el-text>
    </div>

    <!-- 卡片列表展示 -->
    <div v-loading="loading" class="banner-grid">
      <el-empty v-if="!loading && bannerList.length === 0" description="暂无轮播图" />

      <el-card v-for="banner in bannerList" :key="banner.id" class="banner-card" shadow="hover">
        <img :src="banner.image" class="banner-image" @click="handlePreview(banner.image)" />
        <div class="banner-info">
          <div class="banner-title">{{ banner.link || '轮播图' }}</div>
          <div class="banner-meta">
            <el-tag :type="banner.isEnabled ? 'success' : 'info'" size="small">
              {{ banner.isEnabled ? '已启用' : '已禁用' }}
            </el-tag>
            <span class="sort-order">排序: {{ banner.sortOrder }}</span>
          </div>
          <div v-if="banner.startTime || banner.endTime" class="banner-time">
            <el-icon><Clock /></el-icon>
            <span>{{ formatTimeRange(banner) }}</span>
          </div>
        </div>
        <div class="banner-actions">
          <el-button link type="primary" @click="handleEdit(banner)"> 编辑 </el-button>
          <el-button link type="danger" @click="handleDelete(banner)"> 删除 </el-button>
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
        <el-form-item label="轮播图片" prop="images">
          <ImageUploader
            v-model="formData.images"
            :limit="1"
            :max-size="0.5"
            accept="image/jpeg,image/jpg,image/png"
          >
            <template #tip>
              <span
                >建议尺寸：{{ type === 'home' ? '750×320px' : '750×300px' }}，支持 JPG/PNG，不超过
                500KB</span
              >
            </template>
          </ImageUploader>
        </el-form-item>

        <el-form-item label="跳转链接" prop="link">
          <el-input
            v-model="formData.link"
            placeholder="选填，如：/pages/special-offer/list"
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
import { Plus, Clock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/api/miniprogramResources'
import type { Banner, BannerFormData } from '@/types/miniprogramResources'
import ImageUploader from '@/components/common/ImageUploader.vue'

// Props
interface Props {
  type: 'home' | 'hosting'
}

const props = defineProps<Props>()

// 数据
const loading = ref(false)
const bannerList = ref<Banner[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<BannerFormData>({
  type: props.type,
  images: [],
  link: '',
  sortOrder: 100,
  isEnabled: true,
  timeRange: undefined,
})

// 表单验证规则
const formRules: FormRules = {
  images: [{ required: true, message: '请上传轮播图片', trigger: 'change' }],
  sortOrder: [{ required: true, message: '请输入排序权重', trigger: 'blur' }],
}

// 加载轮播图列表
const loadBanners = async () => {
  loading.value = true
  try {
    const res = await getBanners(props.type)
    bannerList.value = res.data || []
  } catch (error) {
    ElMessage.error('加载轮播图失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间范围
const formatTimeRange = (banner: Banner) => {
  if (banner.startTime && banner.endTime) {
    return `${banner.startTime} ~ ${banner.endTime}`
  }
  if (banner.startTime) {
    return `${banner.startTime} 起`
  }
  if (banner.endTime) {
    return `至 ${banner.endTime}`
  }
  return '长期有效'
}

// 添加轮播图
const handleAdd = () => {
  dialogTitle.value = '添加轮播图'
  Object.assign(formData, {
    id: undefined,
    type: props.type,
    images: [],
    link: '',
    sortOrder: 100,
    isEnabled: true,
    timeRange: undefined,
  })
  dialogVisible.value = true
}

// 编辑轮播图
const handleEdit = (banner: Banner) => {
  dialogTitle.value = '编辑轮播图'
  Object.assign(formData, {
    id: banner.id,
    type: banner.type,
    images: [banner.image],
    link: banner.link || '',
    sortOrder: banner.sortOrder,
    isEnabled: banner.isEnabled,
    timeRange: banner.startTime && banner.endTime ? [banner.startTime, banner.endTime] : undefined,
  })
  dialogVisible.value = true
}

// 删除轮播图
const handleDelete = async (banner: Banner) => {
  try {
    await ElMessageBox.confirm('确定要删除这个轮播图吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteBanner(banner.id)
    ElMessage.success('删除成功')
    loadBanners()
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
      const data: Partial<Banner> = {
        type: formData.type,
        image: formData.images[0],
        link: formData.link || undefined,
        sortOrder: formData.sortOrder,
        isEnabled: formData.isEnabled,
        startTime: formData.timeRange?.[0],
        endTime: formData.timeRange?.[1],
      }

      if (formData.id) {
        await updateBanner(formData.id, data)
        ElMessage.success('更新成功')
      } else {
        await createBanner(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadBanners()
    } catch (error) {
      ElMessage.error('保存失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 生命周期
onMounted(() => {
  loadBanners()
})
</script>

<style scoped lang="scss">
.banner-manager {
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

  .banner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    min-height: 200px;

    .banner-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .banner-image {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
      }

      .banner-info {
        margin-top: 12px;

        .banner-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .banner-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          .sort-order {
            font-size: 12px;
            color: #909399;
          }
        }

        .banner-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #909399;
        }
      }

      .banner-actions {
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
