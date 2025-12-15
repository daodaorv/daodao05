<template>
  <div class="image-uploader">
    <el-upload
      v-model:file-list="fileList"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      :multiple="multiple"
      :limit="limit"
      :accept="accept"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :disabled="disabled"
      list-type="picture-card"
      :class="{ 'is-disabled': disabled }"
    >
      <el-icon class="upload-icon"><Plus /></el-icon>
      <template #tip>
        <div class="upload-tip">
          <slot name="tip">
            <span>支持 {{ acceptText }}，单个文件不超过 {{ maxSizeMB }}MB</span>
            <span v-if="limit">，最多上传 {{ limit }} 张</span>
          </slot>
        </div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="图片预览"
      width="800px"
      append-to-body
    >
      <img :src="previewUrl" alt="预览图片" style="width: 100%; display: block" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile, UploadFile } from 'element-plus'

// Props 定义
interface Props {
  modelValue?: string[]           // v-model 绑定的图片 URL 数组
  uploadUrl?: string              // 上传接口地址
  headers?: Record<string, string> // 上传请求头
  data?: Record<string, any>      // 上传额外参数
  multiple?: boolean              // 是否支持多选
  limit?: number                  // 最大上传数量
  maxSize?: number                // 单个文件最大大小（MB）
  accept?: string                 // 接受的文件类型
  disabled?: boolean              // 是否禁用
  compress?: boolean              // 是否压缩图片
  compressQuality?: number        // 压缩质量 0-1
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  uploadUrl: '/api/upload/image',
  headers: () => ({}),
  data: () => ({}),
  multiple: true,
  limit: 12,
  maxSize: 5,
  accept: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
  disabled: false,
  compress: true,
  compressQuality: 0.8,
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'change': [urls: string[]]
  'success': [response: any, file: UploadFile]
  'error': [error: Error, file: UploadFile]
}>()

// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 预览相关
const previewVisible = ref(false)
const previewUrl = ref('')

// 计算属性
const maxSizeMB = computed(() => props.maxSize)
const acceptText = computed(() => {
  const types = props.accept.split(',').map(type => type.split('/')[1].toUpperCase())
  return types.join('、')
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
    ...props.headers,
  }
})

const uploadData = computed(() => props.data)

// 监听 modelValue 变化，同步到 fileList
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      fileList.value = []
      return
    }

    // 将 URL 数组转换为 UploadUserFile 格式
    fileList.value = newVal.map((url, index) => ({
      name: `image-${index + 1}`,
      url,
      uid: Date.now() + index,
      status: 'success',
    }))
  },
  { immediate: true }
)

// 上传前校验
const handleBeforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  // 文件类型校验
  const acceptTypes = props.accept.split(',')
  if (!acceptTypes.includes(rawFile.type)) {
    ElMessage.error(`只能上传 ${acceptText.value} 格式的图片`)
    return false
  }

  // 文件大小校验
  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (rawFile.size > maxSizeBytes) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  // 图片压缩
  if (props.compress && rawFile.type.startsWith('image/')) {
    try {
      const compressedFile = await compressImage(rawFile, props.compressQuality)
      return compressedFile
    } catch (error) {
      console.error('图片压缩失败:', error)
      return rawFile // 压缩失败则使用原图
    }
  }

  return true
}

// 图片压缩函数
const compressImage = (file: File, quality: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // 计算压缩后的尺寸（最大宽度 1920px）
        const maxWidth = 1920
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (maxWidth / width) * height
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          file.type,
          quality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
  })
}

// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (response, file) => {
  // 假设后端返回格式: { code: 200, data: { url: 'xxx' } }
  const url = response.data?.url || response.url
  if (!url) {
    ElMessage.error('上传成功但未返回图片地址')
    return
  }

  // 更新文件列表中的 URL
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value[index].url = url
  }

  // 提取所有已上传的图片 URL
  const urls = fileList.value
    .filter(f => f.status === 'success' && f.url)
    .map(f => f.url!)

  emit('update:modelValue', urls)
  emit('change', urls)
  emit('success', response, file)
  ElMessage.success('上传成功')
}

// 上传失败
const handleError: UploadProps['onError'] = (error, file) => {
  ElMessage.error(`上传失败: ${error.message || '未知错误'}`)
  emit('error', error, file)
}

// 超出数量限制
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

// 删除图片
const handleRemove: UploadProps['onRemove'] = (file) => {
  const urls = fileList.value
    .filter(f => f.uid !== file.uid && f.status === 'success' && f.url)
    .map(f => f.url!)

  emit('update:modelValue', urls)
  emit('change', urls)
}

// 预览图片
const handlePreview: UploadProps['onPreview'] = (file) => {
  previewUrl.value = file.url || ''
  previewVisible.value = true
}

// 暴露方法供父组件调用
defineExpose({
  clearFiles: () => {
    fileList.value = []
    emit('update:modelValue', [])
    emit('change', [])
  },
})
</script>

<script lang="ts">
export default {
  name: 'ImageUploader',
}
</script>

<style scoped lang="scss">
.image-uploader {
  :deep(.el-upload-list--picture-card) {
    .el-upload-list__item {
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  :deep(.el-upload--picture-card) {
    width: 148px;
    height: 148px;
    line-height: 148px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: var(--el-color-primary);
    }

    .upload-icon {
      font-size: 28px;
      color: #8c939d;
    }
  }

  :deep(.is-disabled) {
    .el-upload--picture-card {
      cursor: not-allowed;
      background-color: var(--el-disabled-bg-color);

      &:hover {
        border-color: var(--el-border-color);
      }
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
    margin-top: 8px;

    span {
      display: block;
    }
  }
}
</style>
