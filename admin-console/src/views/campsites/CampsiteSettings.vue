<!-- @ts-nocheck -->
<template>
  <div class="campsite-settings-container">
    

    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑营地' : '新建营地' }}</span>
          <div>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleSave">
              {{ isEditMode ? '保存修改' : '创建营地' }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="settings-form"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="营地名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入营地名称" />
        </el-form-item>

        <el-form-item label="营地类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择营地类型">
            <el-option label="景区营地" value="scenic" />
            <el-option label="森林营地" value="forest" />
            <el-option label="湖畔营地" value="lakeside" />
            <el-option label="山地营地" value="mountain" />
            <el-option label="沙漠营地" value="desert" />
            <el-option label="草原营地" value="grassland" />
          </el-select>
        </el-form-item>

        <el-form-item label="运营状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="active">运营中</el-radio>
            <el-radio value="inactive">已停业</el-radio>
            <el-radio value="maintenance">维护中</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-divider content-position="left">位置信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省份" prop="province">
              <el-input v-model="form.province" placeholder="请输入省份" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-input v-model="form.city" placeholder="请输入城市" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县" prop="district">
              <el-input v-model="form.district" placeholder="请输入区县" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度" prop="longitude">
              <el-input-number
                v-model="form.longitude"
                :precision="6"
                :step="0.000001"
                :min="-180"
                :max="180"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" prop="latitude">
              <el-input-number
                v-model="form.latitude"
                :precision="6"
                :step="0.000001"
                :min="-90"
                :max="90"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">容量与价格</el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="营地面积" prop="area">
              <el-input-number
                v-model="form.area"
                :min="0"
                :step="100"
                style="width: 100%"
              />
              <span style="margin-left: 10px">平方米</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总车位数" prop="capacity">
              <el-input-number
                v-model="form.capacity"
                :min="1"
                :step="1"
                style="width: 100%"
              />
              <span style="margin-left: 10px">个</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可用车位" prop="availableSpots">
              <el-input-number
                v-model="form.availableSpots"
                :min="0"
                :max="form.capacity"
                :step="1"
                style="width: 100%"
              />
              <span style="margin-left: 10px">个</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="平日价格" prop="pricePerNight">
              <el-input-number
                v-model="form.pricePerNight"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周末价格" prop="weekendPrice">
              <el-input-number
                v-model="form.weekendPrice"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="假日价格" prop="holidayPrice">
              <el-input-number
                v-model="form.holidayPrice"
                :min="0"
                :step="10"
                :precision="0"
                style="width: 100%"
              />
              <span style="margin-left: 10px">元/晚</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">营业时间</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="营业时间" prop="openTime">
              <el-input v-model="form.openTime" placeholder="例如：全年开放 或 3月-11月" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关闭时间" prop="closeTime">
              <el-input v-model="form.closeTime" placeholder="例如：12月-2月（可选）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入住时间" prop="checkInTime">
              <el-time-picker
                v-model="form.checkInTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择入住时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退房时间" prop="checkOutTime">
              <el-time-picker
                v-model="form.checkOutTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择退房时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">联系方式</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">营地设施</el-divider>

        <el-form-item label="设施配置">
          <div class="facilities-section">
            <div class="facilities-grid">
              <div
                v-for="facility in availableFacilities"
                :key="facility.id"
                class="facility-item"
              >
                <el-checkbox v-model="facility.available" :label="facility.name" />
                <el-button
                  v-if="facility.isCustom"
                  type="danger"
                  size="small"
                  text
                  :icon="Delete"
                  @click="removeFacility(facility.id)"
                  title="删除自定义设施"
                />
              </div>
            </div>
            <div class="add-facility-section">
              <el-input
                v-model="newFacilityName"
                placeholder="输入自定义设施名称"
                style="width: 200px; margin-right: 8px"
                @keyup.enter="addCustomFacility"
              />
              <el-button type="primary" :icon="Plus" @click="addCustomFacility">
                添加自定义设施
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-divider content-position="left">营地介绍</el-divider>

        <el-form-item label="营地描述" prop="description">
          <div class="rich-text-editor">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertFormat('**', '**')" title="粗体">
                  <strong>B</strong>
                </el-button>
                <el-button size="small" @click="insertFormat('*', '*')" title="斜体">
                  <em>I</em>
                </el-button>
                <el-button size="small" @click="insertFormat('~~', '~~')" title="删除线">
                  <s>S</s>
                </el-button>
              </el-button-group>
              <el-button-group style="margin-left: 8px">
                <el-button size="small" @click="insertList('- ')" title="无序列表">
                  列表
                </el-button>
                <el-button size="small" @click="insertList('1. ')" title="有序列表">
                  编号
                </el-button>
              </el-button-group>
              <el-button-group style="margin-left: 8px">
                <el-button size="small" @click="showImageDialog = true" title="插入图片">
                  <el-icon><Picture /></el-icon>
                </el-button>
                <el-button size="small" @click="showVideoDialog = true" title="插入视频">
                  <el-icon><VideoCamera /></el-icon>
                </el-button>
                <el-button size="small" @click="showLinkDialog = true" title="插入链接">
                  <el-icon><Link /></el-icon>
                </el-button>
              </el-button-group>
              <el-button size="small" style="margin-left: 8px" @click="showPreview = !showPreview">
                {{ showPreview ? '编辑' : '预览' }}
              </el-button>
            </div>
            <el-input
              v-if="!showPreview"
              ref="descriptionInput"
              v-model="form.description"
              type="textarea"
              :rows="12"
              placeholder="请输入营地描述，支持Markdown格式：&#10;**粗体** *斜体* ~~删除线~~&#10;- 列表项&#10;1. 编号列表&#10;![图片描述](图片URL)&#10;[链接文字](链接URL)"
            />
            <div v-else class="preview-content" v-html="renderMarkdown(form.description)"></div>
          </div>
        </el-form-item>

        <el-form-item label="营地规则" prop="rules">
          <el-input
            v-model="form.rules"
            type="textarea"
            :rows="6"
            placeholder="请输入营地规则，每行一条"
          />
        </el-form-item>

        <el-divider content-position="left">营地图片</el-divider>

        <el-form-item label="图片管理">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemoveImage"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="imagePreviewVisible" title="图片预览" width="800px">
      <img :src="previewImageUrl" alt="预览图片" style="width: 100%" />
    </el-dialog>

    <!-- 插入图片对话框 -->
    <el-dialog v-model="showImageDialog" title="插入图片" width="500px">
      <el-form label-width="80px">
        <el-form-item label="图片上传">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleEditorImageUpload"
          >
            <el-button type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="insertImageUrl" placeholder="或输入图片URL" />
        </el-form-item>
        <el-form-item label="图片描述">
          <el-input v-model="insertImageAlt" placeholder="图片描述（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showImageDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertImage">插入</el-button>
      </template>
    </el-dialog>

    <!-- 插入视频对话框 -->
    <el-dialog v-model="showVideoDialog" title="插入视频" width="500px">
      <el-form label-width="80px">
        <el-form-item label="视频类型">
          <el-radio-group v-model="videoType">
            <el-radio value="url">视频URL</el-radio>
            <el-radio value="embed">嵌入代码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="videoType === 'url'" label="视频URL">
          <el-input
            v-model="insertVideoUrl"
            type="textarea"
            :rows="3"
            placeholder="输入视频URL（支持腾讯视频、优酷、B站等）"
          />
        </el-form-item>
        <el-form-item v-else label="嵌入代码">
          <el-input
            v-model="insertVideoEmbed"
            type="textarea"
            :rows="5"
            placeholder="粘贴视频平台提供的嵌入代码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showVideoDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertVideo">插入</el-button>
      </template>
    </el-dialog>

    <!-- 插入链接对话框 -->
    <el-dialog v-model="showLinkDialog" title="插入链接" width="500px">
      <el-form label-width="80px">
        <el-form-item label="链接文字">
          <el-input v-model="insertLinkText" placeholder="显示的文字" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="insertLinkUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="链接类型">
          <el-radio-group v-model="linkType">
            <el-radio value="normal">普通链接</el-radio>
            <el-radio value="wechat">微信公众号文章</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLinkDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmInsertLink">插入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck

// 营地设施类型
interface CampsiteFacility {
  id: string
  name: string
  icon: string
  available: boolean
  isCustom?: boolean  // 是否为自定义设施
}
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete, Picture, VideoCamera, Link } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps, UploadUserFile, UploadFile } from 'element-plus'
import { useErrorHandler } from '@/composables'
import {
  getCampsiteDetail,
  createCampsite,
  updateCampsite
} from '@/api/campsite'

// Composables
const route = useRoute()
const router = useRouter()
const { handleApiError } = useErrorHandler()

// 判断是否为编辑模式
const isEditMode = computed(() => {
  return route.name === 'CampsiteEdit' && !!route.params.id
})

// 营地ID（编辑模式下使用）
const campsiteId = computed(() => {
  return isEditMode.value ? Number(route.params.id) : null
})

// 保存状态
const saving = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  name: '',
  type: 'scenic',
  status: 'active',
  province: '',
  city: '',
  district: '',
  address: '',
  longitude: 0,
  latitude: 0,
  area: 0,
  capacity: 0,
  availableSpots: 0,
  pricePerNight: 0,
  weekendPrice: 0,
  holidayPrice: 0,
  openTime: '',
  closeTime: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  contactPerson: '',
  contactPhone: '',
  description: '',
  rules: '',
  images: [] as string[]
})

// 可用设施列表
const availableFacilities = ref<CampsiteFacility[]>([
  { id: 'power', name: '电源接口', icon: 'electric', available: false, isCustom: false },
  { id: 'water', name: '供水设施', icon: 'water', available: false, isCustom: false },
  { id: 'toilet', name: '卫生间', icon: 'toilet', available: false, isCustom: false },
  { id: 'shower', name: '淋浴间', icon: 'shower', available: false, isCustom: false },
  { id: 'wifi', name: 'WiFi', icon: 'wifi', available: false, isCustom: false },
  { id: 'bbq', name: '烧烤区', icon: 'bbq', available: false, isCustom: false },
  { id: 'parking', name: '停车场', icon: 'parking', available: false, isCustom: false },
  { id: 'store', name: '便利店', icon: 'store', available: false, isCustom: false },
  { id: 'restaurant', name: '餐厅', icon: 'restaurant', available: false, isCustom: false },
  { id: 'playground', name: '儿童游乐场', icon: 'playground', available: false, isCustom: false },
  { id: 'laundry', name: '洗衣房', icon: 'laundry', available: false, isCustom: false },
  { id: 'security', name: '24小时安保', icon: 'security', available: false, isCustom: false }
])

// 自定义设施相关
const newFacilityName = ref('')

// 添加自定义设施
const addCustomFacility = () => {
  if (!newFacilityName.value.trim()) {
    ElMessage.warning('请输入设施名称')
    return
  }

  // 检查是否已存在
  const exists = availableFacilities.value.some(
    f => f.name === newFacilityName.value.trim()
  )
  if (exists) {
    ElMessage.warning('该设施已存在')
    return
  }

  // 添加自定义设施
  const customId = `custom_${Date.now()}`
  availableFacilities.value.push({
    id: customId,
    name: newFacilityName.value.trim(),
    icon: 'custom',
    available: true,
    isCustom: true
  })

  ElMessage.success('添加成功')
  newFacilityName.value = ''
}

// 删除自定义设施
const removeFacility = (id: string) => {
  const index = availableFacilities.value.findIndex(f => f.id === id)
  if (index !== -1) {
    availableFacilities.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

// 图片上传相关
const fileList = ref<UploadUserFile[]>([])
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')

// 富文本编辑器相关
const descriptionInput = ref<any>(null)
const showPreview = ref(false)

// 富文本编辑器插入对话框
const showImageDialog = ref(false)
const showVideoDialog = ref(false)
const showLinkDialog = ref(false)

// 插入图片相关
const insertImageUrl = ref('')
const insertImageAlt = ref('')

// 插入视频相关
const videoType = ref('url')
const insertVideoUrl = ref('')
const insertVideoEmbed = ref('')

// 插入链接相关
const linkType = ref('normal')
const insertLinkText = ref('')
const insertLinkUrl = ref('')

// 插入格式
const insertFormat = (before: string, after: string) => {
  const textarea = descriptionInput.value?.textarea
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.description
  const selectedText = text.substring(start, end) || '文本'

  form.description = text.substring(0, start) + before + selectedText + after + text.substring(end)

  // 恢复光标位置
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  }, 0)
}

// 插入列表
const insertList = (prefix: string) => {
  const textarea = descriptionInput.value?.textarea
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.description
  const beforeText = text.substring(0, start)
  const afterText = text.substring(end)

  // 在新行插入列表项
  const newLine = beforeText.endsWith('\n') || beforeText === '' ? '' : '\n'
  form.description = beforeText + newLine + prefix + '列表项' + afterText

  setTimeout(() => {
    textarea.focus()
    const newPos = start + newLine.length + prefix.length
    textarea.setSelectionRange(newPos, newPos + 3)
  }, 0)
}

// 渲染Markdown（增强实现）
const renderMarkdown = (text: string) => {
  if (!text) return ''

  let html = text
    // 转义HTML（但保留已有的HTML标签用于视频嵌入）
    .replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;')

  // 图片 ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 10px 0;" />')

  // 链接 [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #409eff; text-decoration: none;">$1</a>')

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 删除线
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')

  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // 换行
  html = html.replace(/\n/g, '<br>')

  // 包裹列表
  html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')

  return html
}

// 处理编辑器图片上传
const handleEditorImageUpload = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result as string
    insertImageUrl.value = base64
  }
  reader.readAsDataURL(uploadFile.raw)
}

// 确认插入图片
const confirmInsertImage = () => {
  if (!insertImageUrl.value) {
    ElMessage.warning('请上传图片或输入图片URL')
    return
  }

  const alt = insertImageAlt.value || '图片'
  const markdown = `![${alt}](${insertImageUrl.value})`

  insertToEditor(markdown)

  // 重置并关闭对话框
  insertImageUrl.value = ''
  insertImageAlt.value = ''
  showImageDialog.value = false
}

// 确认插入视频
const confirmInsertVideo = () => {
  let videoContent = ''

  if (videoType.value === 'url') {
    if (!insertVideoUrl.value) {
      ElMessage.warning('请输入视频URL')
      return
    }
    // 将视频URL转换为嵌入代码的提示
    videoContent = `\n<!-- 视频链接: ${insertVideoUrl.value} -->\n[点击观看视频](${insertVideoUrl.value})\n`
  } else {
    if (!insertVideoEmbed.value) {
      ElMessage.warning('请输入嵌入代码')
      return
    }
    // 直接插入嵌入代码
    videoContent = `\n${insertVideoEmbed.value}\n`
  }

  insertToEditor(videoContent)

  // 重置并关闭对话框
  insertVideoUrl.value = ''
  insertVideoEmbed.value = ''
  showVideoDialog.value = false
}

// 确认插入链接
const confirmInsertLink = () => {
  if (!insertLinkText.value || !insertLinkUrl.value) {
    ElMessage.warning('请输入链接文字和地址')
    return
  }

  let markdown = ''
  if (linkType.value === 'wechat') {
    // 微信公众号文章特殊标记
    markdown = `[📱 ${insertLinkText.value}](${insertLinkUrl.value})`
  } else {
    markdown = `[${insertLinkText.value}](${insertLinkUrl.value})`
  }

  insertToEditor(markdown)

  // 重置并关闭对话框
  insertLinkText.value = ''
  insertLinkUrl.value = ''
  showLinkDialog.value = false
}

// 插入内容到编辑器
const insertToEditor = (content: string) => {
  const textarea = descriptionInput.value?.textarea
  if (!textarea) {
    // 如果编辑器不可用，直接追加到末尾
    form.description += content
    return
  }

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.description

  form.description = text.substring(0, start) + content + text.substring(end)

  // 恢复光标位置
  setTimeout(() => {
    textarea.focus()
    const newPos = start + content.length
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入营地名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择营地类型', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择运营状态', trigger: 'change' }
  ],
  province: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  district: [
    { required: true, message: '请输入区县', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '请输入经度', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '请输入纬度', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入营地面积', trigger: 'blur' },
    { type: 'number', min: 1, message: '面积必须大于0', trigger: 'blur' }
  ],
  capacity: [
    { required: true, message: '请输入总车位数', trigger: 'blur' },
    { type: 'number', min: 1, message: '车位数必须大于0', trigger: 'blur' }
  ],
  availableSpots: [
    { required: true, message: '请输入可用车位数', trigger: 'blur' },
    { type: 'number', min: 0, message: '可用车位数不能小于0', trigger: 'blur' }
  ],
  pricePerNight: [
    { required: true, message: '请输入平日价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  weekendPrice: [
    { required: true, message: '请输入周末价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  holidayPrice: [
    { required: true, message: '请输入假日价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  openTime: [
    { required: true, message: '请输入营业时间', trigger: 'blur' }
  ],
  checkInTime: [
    { required: true, message: '请选择入住时间', trigger: 'change' }
  ],
  checkOutTime: [
    { required: true, message: '请选择退房时间', trigger: 'change' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入营地描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' }
  ],
  rules: [
    { required: true, message: '请输入营地规则', trigger: 'blur' }
  ]
}

// 图片预览
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewImageUrl.value = uploadFile.url!
  imagePreviewVisible.value = true
}

// 图片变化处理
const handleImageChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  // 将上传的文件转换为base64或URL
  if (uploadFile.raw) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      // 更新form.images数组
      const index = uploadFiles.findIndex(f => f.uid === uploadFile.uid)
      if (index !== -1) {
        if (index >= form.images.length) {
          form.images.push(base64)
        } else {
          form.images[index] = base64
        }
      }
    }
    reader.readAsDataURL(uploadFile.raw)
  }
}

// 删除图片
const handleRemoveImage: UploadProps['onRemove'] = (uploadFile) => {
  const index = fileList.value.findIndex(f => f.uid === uploadFile.uid)
  if (index !== -1) {
    form.images.splice(index, 1)
  }
  return true
}

// 保存设置
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    // 验证可用车位不能超过总车位
    if (form.availableSpots > form.capacity) {
      ElMessage.error('可用车位数不能超过总车位数')
      return
    }

    saving.value = true
    try {
      // 准备提交数据
      const submitData = {
        ...form,
        facilities: availableFacilities.value.filter(f => f.available)
      }

      if (isEditMode.value && campsiteId.value) {
        // 编辑模式：调用更新API
        await updateCampsite(campsiteId.value, submitData)
        ElMessage.success('营地信息更新成功')
      } else {
        // 新建模式：调用创建API
        await createCampsite(submitData)
        ElMessage.success('营地创建成功')
      }

      // 保存成功后返回列表页
      router.push('/campsites/list')
    } catch (error) {
      handleApiError(error, isEditMode.value ? '保存营地信息失败' : '创建营地失败')
    } finally {
      saving.value = false
    }
  })
}

// 取消操作
const handleCancel = () => {
  router.push('/campsites/list')
}

// 加载营地数据（编辑模式）
const loadCampsiteData = async () => {
  if (!isEditMode.value || !campsiteId.value) {
    // 新建模式，使用默认值
    return
  }

  try {
    const res = await getCampsiteDetail(campsiteId.value) as any
    const data = res.data

    // 填充表单数据
    Object.assign(form, {
      name: data.name,
      type: data.type,
      status: data.status,
      province: data.province,
      city: data.city,
      district: data.district,
      address: data.address,
      longitude: data.longitude,
      latitude: data.latitude,
      area: data.area,
      capacity: data.capacity,
      availableSpots: data.availableSpots,
      pricePerNight: data.pricePerNight,
      weekendPrice: data.weekendPrice,
      holidayPrice: data.holidayPrice,
      openTime: data.openTime,
      closeTime: data.closeTime,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      description: data.description,
      rules: data.rules,
      images: data.images || []
    })

    // 设置设施状态
    if (data.facilities && data.facilities.length > 0) {
      availableFacilities.value.forEach(facility => {
        const found = data.facilities.find((f: any) => f.id === facility.id)
        if (found) {
          facility.available = found.available
        }
      })
    }

    // 设置图片列表
    if (data.images && data.images.length > 0) {
      fileList.value = data.images.map((url: string, index: number) => ({
        uid: Date.now() + index,
        name: `image-${index + 1}.jpg`,
        url: url,
        status: 'success'
      }))
    }
  } catch (error) {
    handleApiError(error, '加载营地数据失败')
    // 加载失败返回列表页
    router.push('/campsites/list')
  }
}

// 页面加载
onMounted(() => {
  loadCampsiteData()
})
</script>

<style scoped lang="scss">
.campsite-settings-container {
  padding: 20px;
}

.settings-card {
  margin-top: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      gap: 12px;
    }
  }
}

.settings-form {
  max-width: 1200px;
}

.facilities-section {
  width: 100%;

  .facilities-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .facility-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-button {
        padding: 4px;
        margin-left: auto;
      }
    }
  }

  .add-facility-section {
    display: flex;
    align-items: center;
    padding-top: 12px;
    border-top: 1px dashed #dcdfe6;
  }
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
}

.rich-text-editor {
  width: 100%;

  .editor-toolbar {
    margin-bottom: 8px;
    padding: 8px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
  }

  .preview-content {
    min-height: 200px;
    padding: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 0 0 4px 4px;
    background-color: #fff;
    line-height: 1.8;

    :deep(strong) {
      font-weight: bold;
      color: #303133;
    }

    :deep(em) {
      font-style: italic;
      color: #606266;
    }

    :deep(del) {
      text-decoration: line-through;
      color: #909399;
    }

    :deep(ul) {
      margin: 8px 0;
      padding-left: 24px;
      list-style: disc;
    }

    :deep(li) {
      margin: 4px 0;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      margin: 10px 0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :deep(a) {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(iframe) {
      max-width: 100%;
      margin: 10px 0;
      border-radius: 4px;
    }
  }
}
</style>
