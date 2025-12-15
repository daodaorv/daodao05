<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <!-- 文本格式 -->
      <el-button-group>
        <el-button
          size="small"
          title="粗体"
          @click="execCommand('bold')"
        >
          <strong>B</strong>
        </el-button>
        <el-button
          size="small"
          title="斜体"
          @click="execCommand('italic')"
        >
          <em>I</em>
        </el-button>
        <el-button
          size="small"
          title="下划线"
          @click="execCommand('underline')"
        >
          <u>U</u>
        </el-button>
        <el-button
          size="small"
          title="删除线"
          @click="execCommand('strikeThrough')"
        >
          <s>S</s>
        </el-button>
      </el-button-group>

      <!-- 标题 -->
      <el-select
        v-model="currentHeading"
        size="small"
        style="width: 100px; margin-left: 8px"
        @change="handleHeadingChange"
      >
        <el-option label="正文" value="p" />
        <el-option label="标题1" value="h1" />
        <el-option label="标题2" value="h2" />
        <el-option label="标题3" value="h3" />
        <el-option label="标题4" value="h4" />
      </el-select>

      <!-- 对齐方式 -->
      <el-button-group style="margin-left: 8px">
        <el-button
          size="small"
          title="左对齐"
          @click="execCommand('justifyLeft')"
        >
          ←
        </el-button>
        <el-button
          size="small"
          title="居中"
          @click="execCommand('justifyCenter')"
        >
          ↔
        </el-button>
        <el-button
          size="small"
          title="右对齐"
          @click="execCommand('justifyRight')"
        >
          →
        </el-button>
      </el-button-group>

      <!-- 列表 -->
      <el-button-group style="margin-left: 8px">
        <el-button
          :icon="List"
          size="small"
          title="无序列表"
          @click="execCommand('insertUnorderedList')"
        />
        <el-button
          :icon="List"
          size="small"
          title="有序列表"
          @click="execCommand('insertOrderedList')"
        />
      </el-button-group>

      <!-- 插入 -->
      <el-button-group style="margin-left: 8px">
        <el-button
          :icon="Link"
          size="small"
          title="插入链接"
          @click="handleInsertLink"
        />
        <el-button
          :icon="Picture"
          size="small"
          title="插入图片"
          @click="handleInsertImage"
        />
        <el-button
          :icon="VideoPlay"
          size="small"
          title="插入视频"
          @click="handleInsertVideo"
        />
      </el-button-group>

      <!-- 其他 -->
      <el-button-group style="margin-left: 8px">
        <el-button
          :icon="RemoveFilled"
          size="small"
          title="清除格式"
          @click="execCommand('removeFormat')"
        />
        <el-button
          :icon="Delete"
          size="small"
          title="清空内容"
          @click="handleClear"
        />
      </el-button-group>

      <!-- 字数统计 -->
      <div v-if="showWordCount" class="word-count">
        字数: {{ wordCount }} / {{ maxLength || '∞' }}
      </div>
    </div>

    <!-- 编辑器内容区 -->
    <div
      ref="editorRef"
      class="editor-content"
      :style="{ height: height, minHeight: minHeight }"
      contenteditable="true"
      @input="handleInput"
      @paste="handlePaste"
      @blur="handleBlur"
    ></div>

    <!-- 插入链接对话框 -->
    <el-dialog
      v-model="linkDialogVisible"
      title="插入链接"
      width="500px"
    >
      <el-form :model="linkForm" label-width="80px">
        <el-form-item label="链接文本">
          <el-input v-model="linkForm.text" placeholder="请输入链接文本" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="打开方式">
          <el-radio-group v-model="linkForm.target">
            <el-radio value="_self">当前窗口</el-radio>
            <el-radio value="_blank">新窗口</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="linkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertLink">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入图片对话框 -->
    <el-dialog
      v-model="imageDialogVisible"
      title="插入图片"
      width="500px"
    >
      <el-tabs v-model="imageTabActive">
        <el-tab-pane label="图片URL" name="url">
          <el-input
            v-model="imageUrl"
            placeholder="请输入图片URL"
            clearable
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleImageUploadSuccess"
            :before-upload="beforeImageUpload"
            accept="image/*"
            drag
          >
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">点击或拖拽图片到此处上传</div>
            <template #tip>
              <div class="upload-tip">支持 JPG、PNG、GIF 格式，大小不超过 5MB</div>
            </template>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="imageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertImage">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入视频对话框 -->
    <el-dialog
      v-model="videoDialogVisible"
      title="插入视频"
      width="500px"
    >
      <el-input
        v-model="videoUrl"
        placeholder="请输入视频URL或嵌入代码"
        type="textarea"
        :rows="4"
      />
      <template #footer>
        <el-button @click="videoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertVideo">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  List,
  Link,
  Picture,
  VideoPlay,
  RemoveFilled,
  Delete,
  Upload,
} from '@element-plus/icons-vue'

// Props 定义
interface Props {
  modelValue?: string             // v-model 绑定的 HTML 内容
  height?: string                 // 编辑器高度
  minHeight?: string              // 最小高度
  placeholder?: string            // 占位符
  disabled?: boolean              // 是否禁用
  maxLength?: number              // 最大字数限制
  showWordCount?: boolean         // 是否显示字数统计
  uploadUrl?: string              // 图片上传地址
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '400px',
  minHeight: '200px',
  placeholder: '请输入内容...',
  disabled: false,
  maxLength: 0,
  showWordCount: true,
  uploadUrl: '/api/upload/image',
})

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'blur': []
}>()

// 响应式数据
const editorRef = ref<HTMLElement>()
const currentHeading = ref('p')
const wordCount = ref(0)

// 链接对话框
const linkDialogVisible = ref(false)
const linkForm = ref({
  text: '',
  url: '',
  target: '_blank',
})

// 图片对话框
const imageDialogVisible = ref(false)
const imageTabActive = ref('url')
const imageUrl = ref('')

// 视频对话框
const videoDialogVisible = ref(false)
const videoUrl = ref('')

// 计算属性
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
  }
})

// 执行编辑命令
const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

// 处理标题变化
const handleHeadingChange = (value: string) => {
  execCommand('formatBlock', value)
}

// 处理输入
const handleInput = () => {
  if (!editorRef.value) return

  const html = editorRef.value.innerHTML
  const text = editorRef.value.innerText

  // 更新字数统计
  wordCount.value = text.length

  // 检查字数限制
  if (props.maxLength && text.length > props.maxLength) {
    ElMessage.warning(`内容超出最大字数限制 ${props.maxLength}`)
    return
  }

  emit('update:modelValue', html)
  emit('change', html)
}

// 处理粘贴
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()

  // 获取纯文本内容
  const text = e.clipboardData?.getData('text/plain') || ''

  // 插入纯文本
  document.execCommand('insertText', false, text)
}

// 处理失焦
const handleBlur = () => {
  emit('blur')
}

// 插入链接
const handleInsertLink = () => {
  const selection = window.getSelection()
  if (selection && selection.toString()) {
    linkForm.value.text = selection.toString()
  }
  linkDialogVisible.value = true
}

const confirmInsertLink = () => {
  if (!linkForm.value.url) {
    ElMessage.warning('请输入链接地址')
    return
  }

  const html = `<a href="${linkForm.value.url}" target="${linkForm.value.target}">${linkForm.value.text || linkForm.value.url}</a>`
  execCommand('insertHTML', html)

  linkDialogVisible.value = false
  linkForm.value = { text: '', url: '', target: '_blank' }
}

// 插入图片
const handleInsertImage = () => {
  imageDialogVisible.value = true
}

const confirmInsertImage = () => {
  if (!imageUrl.value) {
    ElMessage.warning('请输入图片URL或上传图片')
    return
  }

  const html = `<img src="${imageUrl.value}" style="max-width: 100%; height: auto;" />`
  execCommand('insertHTML', html)

  imageDialogVisible.value = false
  imageUrl.value = ''
}

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const handleImageUploadSuccess = (response: any) => {
  const url = response.data?.url || response.url
  if (url) {
    imageUrl.value = url
    ElMessage.success('图片上传成功')
  }
}

// 插入视频
const handleInsertVideo = () => {
  videoDialogVisible.value = true
}

const confirmInsertVideo = () => {
  if (!videoUrl.value) {
    ElMessage.warning('请输入视频URL或嵌入代码')
    return
  }

  let html = ''
  if (videoUrl.value.includes('<iframe') || videoUrl.value.includes('<video')) {
    // 嵌入代码
    html = videoUrl.value
  } else {
    // 视频URL
    html = `<video src="${videoUrl.value}" controls style="max-width: 100%; height: auto;"></video>`
  }

  execCommand('insertHTML', html)

  videoDialogVisible.value = false
  videoUrl.value = ''
}

// 清空内容
const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    if (editorRef.value) {
      editorRef.value.innerHTML = ''
      handleInput()
    }
  } catch {
    // 用户取消
  }
}

// 设置内容
const setContent = (html: string) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = html
    wordCount.value = editorRef.value.innerText.length
  }
}

// 获取内容
const getContent = () => {
  return editorRef.value?.innerHTML || ''
}

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorRef.value && newVal !== editorRef.value.innerHTML) {
      setContent(newVal)
    }
  }
)

// 监听禁用状态
watch(
  () => props.disabled,
  (newVal) => {
    if (editorRef.value) {
      editorRef.value.contentEditable = String(!newVal)
    }
  }
)

onMounted(() => {
  nextTick(() => {
    if (editorRef.value) {
      // 设置初始内容
      if (props.modelValue) {
        setContent(props.modelValue)
      }

      // 设置占位符
      if (!props.modelValue && props.placeholder) {
        editorRef.value.setAttribute('data-placeholder', props.placeholder)
      }

      // 设置禁用状态
      editorRef.value.contentEditable = String(!props.disabled)
    }
  })
})

// 暴露方法供父组件调用
defineExpose({
  setContent,
  getContent,
  clear: handleClear,
})
</script>

<script lang="ts">
export default {
  name: 'RichTextEditor',
}
</script>

<style scoped lang="scss">
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;

    .word-count {
      margin-left: auto;
      font-size: 12px;
      color: #909399;
    }
  }

  .editor-content {
    padding: 16px;
    overflow-y: auto;
    outline: none;
    line-height: 1.8;
    font-size: 14px;
    color: #303133;

    &:empty::before {
      content: attr(data-placeholder);
      color: #c0c4cc;
    }

    :deep(h1) {
      font-size: 28px;
      font-weight: 600;
      margin: 16px 0;
    }

    :deep(h2) {
      font-size: 24px;
      font-weight: 600;
      margin: 14px 0;
    }

    :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin: 12px 0;
    }

    :deep(h4) {
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
    }

    :deep(p) {
      margin: 8px 0;
    }

    :deep(ul),
    :deep(ol) {
      margin: 8px 0;
      padding-left: 24px;
    }

    :deep(li) {
      margin: 4px 0;
    }

    :deep(a) {
      color: #409eff;
      text-decoration: underline;

      &:hover {
        color: #66b1ff;
      }
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 8px 0;
      border-radius: 4px;
    }

    :deep(video) {
      max-width: 100%;
      height: auto;
      margin: 8px 0;
      border-radius: 4px;
    }

    :deep(blockquote) {
      margin: 8px 0;
      padding: 8px 16px;
      border-left: 4px solid #dcdfe6;
      background-color: #f5f7fa;
      color: #606266;
    }

    :deep(code) {
      padding: 2px 6px;
      background-color: #f5f7fa;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }

    :deep(pre) {
      margin: 8px 0;
      padding: 12px;
      background-color: #f5f7fa;
      border-radius: 4px;
      overflow-x: auto;

      code {
        padding: 0;
        background-color: transparent;
      }
    }
  }

  .upload-icon {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 16px;
  }

  .upload-text {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
