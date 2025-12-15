<!-- @ts-nocheck -->
<template>
  <div class="community-settings-container">
    <PageHeader title="社区配置" description="管理社区版块和系统配置" />

    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 版块管理 -->
      <el-tab-pane label="版块管理" name="sections">
        <div class="section-management">
          <!-- 搜索和操作 -->
          <div class="toolbar">
            <el-input
              v-model="sectionKeyword"
              placeholder="搜索版块名称或描述"
              style="width: 300px"
              clearable
              @clear="handleSectionSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddSection">
              <el-icon><Plus /></el-icon>
              新增版块
            </el-button>
          </div>

          <!-- 版块列表 -->
          <el-table :data="sectionList" :loading="sectionLoading" border stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="图标" width="80">
              <template #default="{ row }">
                <el-icon :size="24">
                  <component :is="row.icon" />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="版块名称" width="150" />
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getSectionStatusType(row.status)" size="small">
                  {{ getSectionStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="统计" width="150">
              <template #default="{ row }">
                <div class="section-stats">
                  <span>帖子: {{ row.postCount }}</span>
                  <span>成员: {{ row.memberCount }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="版主" width="150">
              <template #default="{ row }">
                <el-tag
                  v-for="(name, index) in row.moderatorNames"
                  :key="index"
                  size="small"
                  style="margin-right: 4px"
                >
                  {{ name }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="配置" width="200">
              <template #default="{ row }">
                <div class="section-config">
                  <el-tag v-if="row.allowPost" type="success" size="small">允许发帖</el-tag>
                  <el-tag v-if="row.allowComment" type="success" size="small">允许评论</el-tag>
                  <el-tag v-if="row.requireReview" type="warning" size="small">需要审核</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditSection(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteSection(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="config">
        <div class="system-config">
          <el-form
            :model="configForm"
            :rules="configRules"
            ref="configFormRef"
            label-width="150px"
          >
            <el-card header="审核配置" class="config-card">
              <el-form-item label="启用AI审核" prop="enableAiReview">
                <el-switch v-model="configForm.enableAiReview" />
                <span class="form-tip">开启后，内容将先经过AI审核</span>
              </el-form-item>

              <el-form-item label="AI审核阈值" prop="aiThreshold">
                <el-slider
                  v-model="configForm.aiThreshold"
                  :min="0"
                  :max="100"
                  :marks="{ 0: '0', 50: '50', 100: '100' }"
                  show-input
                />
                <span class="form-tip">AI分数低于此值将被标记为疑似违规</span>
              </el-form-item>

              <el-form-item label="自动发布分数" prop="autoPublishScore">
                <el-slider
                  v-model="configForm.autoPublishScore"
                  :min="0"
                  :max="100"
                  :marks="{ 0: '0', 50: '50', 100: '100' }"
                  show-input
                />
                <span class="form-tip">AI分数高于此值将自动发布，无需人工审核</span>
              </el-form-item>

              <el-form-item label="启用人工审核" prop="enableManualReview">
                <el-switch v-model="configForm.enableManualReview" />
                <span class="form-tip">开启后，AI审核不通过的内容将进入人工审核</span>
              </el-form-item>
            </el-card>

            <el-card header="内容限制" class="config-card">
              <el-form-item label="最大帖子长度" prop="maxPostLength">
                <el-input-number
                  v-model="configForm.maxPostLength"
                  :min="100"
                  :max="50000"
                  :step="100"
                />
                <span class="form-tip">字符数</span>
              </el-form-item>

              <el-form-item label="最大图片数量" prop="maxImageCount">
                <el-input-number v-model="configForm.maxImageCount" :min="1" :max="20" />
                <span class="form-tip">张</span>
              </el-form-item>

              <el-form-item label="最大视频数量" prop="maxVideoCount">
                <el-input-number v-model="configForm.maxVideoCount" :min="1" :max="10" />
                <span class="form-tip">个</span>
              </el-form-item>

              <el-form-item label="允许匿名发帖" prop="allowAnonymous">
                <el-switch v-model="configForm.allowAnonymous" />
              </el-form-item>
            </el-card>

            <el-card header="敏感词管理" class="config-card">
              <el-form-item label="敏感词列表" prop="sensitiveWords">
                <el-tag
                  v-for="(word, index) in configForm.sensitiveWords"
                  :key="index"
                  closable
                  @close="handleRemoveSensitiveWord(index)"
                  style="margin-right: 8px; margin-bottom: 8px"
                >
                  {{ word }}
                </el-tag>
                <el-input
                  v-if="showSensitiveWordInput"
                  v-model="newSensitiveWord"
                  size="small"
                  style="width: 120px"
                  @keyup.enter="handleAddSensitiveWord"
                  @blur="handleAddSensitiveWord"
                />
                <el-button
                  v-else
                  size="small"
                  @click="showSensitiveWordInput = true"
                >
                  + 添加敏感词
                </el-button>
              </el-form-item>
            </el-card>

            <el-form-item>
              <el-button type="primary" @click="handleSaveConfig" :loading="configSaving">
                保存配置
              </el-button>
              <el-button @click="handleResetConfig">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 版块编辑对话框 -->
    <el-dialog
      v-model="sectionDialogVisible"
      :title="sectionDialogTitle"
      width="600px"
      @close="handleSectionDialogClose"
    >
      <el-form
        :model="sectionForm"
        :rules="sectionRules"
        ref="sectionFormRef"
        label-width="120px"
      >
        <el-form-item label="版块名称" prop="name">
          <el-input v-model="sectionForm.name" placeholder="请输入版块名称" />
        </el-form-item>

        <el-form-item label="版块描述" prop="description">
          <el-input
            v-model="sectionForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入版块描述"
          />
        </el-form-item>

        <el-form-item label="版块图标" prop="icon">
          <el-select v-model="sectionForm.icon" placeholder="请选择图标">
            <el-option label="地图" value="Map" />
            <el-option label="盒子" value="Box" />
            <el-option label="位置" value="Place" />
            <el-option label="问题" value="QuestionFilled" />
            <el-option label="工具" value="Tools" />
            <el-option label="文档" value="Document" />
            <el-option label="图片" value="Picture" />
            <el-option label="视频" value="VideoCamera" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="sectionForm.sort" :min="1" :max="999" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="sectionForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
            <el-radio value="archived">归档</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="允许发帖" prop="allowPost">
          <el-switch v-model="sectionForm.allowPost" />
        </el-form-item>

        <el-form-item label="允许评论" prop="allowComment">
          <el-switch v-model="sectionForm.allowComment" />
        </el-form-item>

        <el-form-item label="需要审核" prop="requireReview">
          <el-switch v-model="sectionForm.requireReview" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="sectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSectionSubmit" :loading="sectionSaving">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import {
  getCommunitySections,
  createCommunitySection,
  updateCommunitySection,
  deleteCommunitySection,
  getCommunityConfig,
  updateCommunityConfig,
  type CommunitySection,
  type SectionStatus,
  type CommunityConfig
} from '@/api/community'

// 当前标签页
const activeTab = ref('sections')

// 版块管理
const sectionList = ref<CommunitySection[]>([])
const sectionLoading = ref(false)
const sectionKeyword = ref('')

// 版块对话框
const sectionDialogVisible = ref(false)
const sectionDialogTitle = ref('新增版块')
const sectionForm = reactive({
  id: 0,
  name: '',
  description: '',
  icon: 'Document',
  sort: 1,
  status: 'active' as SectionStatus,
  allowPost: true,
  allowComment: true,
  requireReview: false
})
const sectionFormRef = ref()
const sectionRules = {
  name: [{ required: true, message: '请输入版块名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入版块描述', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}
const sectionSaving = ref(false)

// 系统配置
const configForm = reactive<CommunityConfig>({
  id: 1,
  enableAiReview: true,
  aiThreshold: 60,
  enableManualReview: true,
  autoPublishScore: 90,
  sensitiveWords: [],
  maxPostLength: 5000,
  maxImageCount: 9,
  maxVideoCount: 3,
  allowAnonymous: false,
  updatedAt: ''
})
const configFormRef = ref()
const configRules = {
  aiThreshold: [
    { required: true, message: '请设置AI审核阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '阈值范围为0-100', trigger: 'blur' }
  ],
  autoPublishScore: [
    { required: true, message: '请设置自动发布分数', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '分数范围为0-100', trigger: 'blur' }
  ],
  maxPostLength: [
    { required: true, message: '请设置最大帖子长度', trigger: 'blur' },
    { type: 'number', min: 100, max: 50000, message: '长度范围为100-50000', trigger: 'blur' }
  ],
  maxImageCount: [
    { required: true, message: '请设置最大图片数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 20, message: '数量范围为1-20', trigger: 'blur' }
  ],
  maxVideoCount: [
    { required: true, message: '请设置最大视频数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 10, message: '数量范围为1-10', trigger: 'blur' }
  ]
}
const configSaving = ref(false)

// 敏感词管理
const showSensitiveWordInput = ref(false)
const newSensitiveWord = ref('')

// 获取版块列表
const fetchSectionList = async () => {
  sectionLoading.value = true
  try {
    const params = sectionKeyword.value ? { keyword: sectionKeyword.value } : undefined
    sectionList.value = await getCommunitySections(params)
  } catch (error) {
    console.error('获取版块列表失败:', error)
    ElMessage.error('获取版块列表失败')
  } finally {
    sectionLoading.value = false
  }
}

// 搜索版块
const handleSectionSearch = () => {
  fetchSectionList()
}

// 新增版块
const handleAddSection = () => {
  sectionForm.id = 0
  sectionForm.name = ''
  sectionForm.description = ''
  sectionForm.icon = 'Document'
  sectionForm.sort = sectionList.value.length + 1
  sectionForm.status = 'active'
  sectionForm.allowPost = true
  sectionForm.allowComment = true
  sectionForm.requireReview = false
  sectionDialogTitle.value = '新增版块'
  sectionDialogVisible.value = true
}

// 编辑版块
const handleEditSection = (row: CommunitySection) => {
  sectionForm.id = row.id
  sectionForm.name = row.name
  sectionForm.description = row.description
  sectionForm.icon = row.icon
  sectionForm.sort = row.sort
  sectionForm.status = row.status
  sectionForm.allowPost = row.allowPost
  sectionForm.allowComment = row.allowComment
  sectionForm.requireReview = row.requireReview
  sectionDialogTitle.value = '编辑版块'
  sectionDialogVisible.value = true
}

// 删除版块
const handleDeleteSection = async (row: CommunitySection) => {
  try {
    await ElMessageBox.confirm(`确定要删除版块"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteCommunitySection(row.id)
    ElMessage.success('删除成功')
    fetchSectionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除版块失败:', error)
      ElMessage.error('删除版块失败')
    }
  }
}

// 提交版块
const handleSectionSubmit = async () => {
  if (!sectionFormRef.value) return

  await sectionFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    sectionSaving.value = true
    try {
      if (sectionForm.id) {
        await updateCommunitySection(sectionForm.id, sectionForm)
        ElMessage.success('更新成功')
      } else {
        await createCommunitySection(sectionForm)
        ElMessage.success('创建成功')
      }
      sectionDialogVisible.value = false
      fetchSectionList()
    } catch (error) {
      console.error('保存版块失败:', error)
      ElMessage.error('保存版块失败')
    } finally {
      sectionSaving.value = false
    }
  })
}

// 关闭版块对话框
const handleSectionDialogClose = () => {
  sectionFormRef.value?.resetFields()
}

// 获取版块状态类型
const getSectionStatusType = (status: SectionStatus) => {
  const statusMap: Record<SectionStatus, any> = {
    active: 'success',
    inactive: 'info',
    archived: 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取版块状态标签
const getSectionStatusLabel = (status: SectionStatus) => {
  const statusMap: Record<SectionStatus, string> = {
    active: '启用',
    inactive: '禁用',
    archived: '归档'
  }
  return statusMap[status] || status
}

// 获取系统配置
const fetchConfig = async () => {
  try {
    const config = await getCommunityConfig()
    Object.assign(configForm, config)
  } catch (error) {
    console.error('获取系统配置失败:', error)
    ElMessage.error('获取系统配置失败')
  }
}

// 保存配置
const handleSaveConfig = async () => {
  if (!configFormRef.value) return

  await configFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    configSaving.value = true
    try {
      await updateCommunityConfig(configForm)
      ElMessage.success('保存成功')
      fetchConfig()
    } catch (error) {
      console.error('保存配置失败:', error)
      ElMessage.error('保存配置失败')
    } finally {
      configSaving.value = false
    }
  })
}

// 重置配置
const handleResetConfig = () => {
  fetchConfig()
}

// 添加敏感词
const handleAddSensitiveWord = () => {
  if (newSensitiveWord.value && !configForm.sensitiveWords.includes(newSensitiveWord.value)) {
    configForm.sensitiveWords.push(newSensitiveWord.value)
  }
  newSensitiveWord.value = ''
  showSensitiveWordInput.value = false
}

// 删除敏感词
const handleRemoveSensitiveWord = (index: number) => {
  configForm.sensitiveWords.splice(index, 1)
}

// 初始化
onMounted(() => {
  fetchSectionList()
  fetchConfig()
})
</script>

<style scoped lang="scss">
.community-settings-container {
  padding: 20px;
}

.settings-tabs {
  margin-top: 20px;
}

.section-management {
  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .section-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #606266;
  }

  .section-config {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.system-config {
  .config-card {
    margin-bottom: 20px;

    .form-tip {
      margin-left: 12px;
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
