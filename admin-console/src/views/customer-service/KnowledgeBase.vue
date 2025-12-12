<!-- @ts-nocheck -->
<template>
  <div class="knowledge-base-container">
    <PageHeader title="知识库管理" description="管理客服知识库，提升服务效率" />

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <StatsCard
          title="总文章数"
          :value="stats.totalArticles"
          icon="Document"
          color="#409EFF"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="已发布"
          :value="stats.publishedArticles"
          icon="CircleCheck"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="总浏览量"
          :value="stats.totalViews"
          icon="View"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="6">
        <StatsCard
          title="总点赞数"
          :value="stats.totalLikes"
          icon="Star"
          color="#F7BA2A"
        />
      </el-col>
    </el-row>

    <!-- 搜索和操作 -->
    <div class="toolbar">
      <SearchForm
        v-model="searchForm"
        :fields="searchFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增文章
      </el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="articleList"
      :columns="tableColumns"
      :loading="loading"
      :actions="tableActions"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <!-- 分类 -->
      <template #category="{ row }">
        <el-tag :type="getCategoryTagType(row.category)" size="small">
          {{ getCategoryLabel(row.category) }}
        </el-tag>
      </template>

      <!-- 标签 -->
      <template #tags="{ row }">
        <el-tag
          v-for="(tag, index) in row.tags.slice(0, 3)"
          :key="index"
          size="small"
          style="margin-right: 4px"
        >
          {{ tag }}
        </el-tag>
        <span v-if="row.tags.length > 3" class="more-tags">+{{ row.tags.length - 3 }}</span>
      </template>

      <!-- 发布状态 -->
      <template #isPublished="{ row }">
        <el-tag :type="row.isPublished ? 'success' : 'info'" size="small">
          {{ row.isPublished ? '已发布' : '草稿' }}
        </el-tag>
      </template>

      <!-- 统计 -->
      <template #stats="{ row }">
        <div class="article-stats">
          <span><el-icon><View /></el-icon> {{ row.viewCount }}</span>
          <span><el-icon><Star /></el-icon> {{ row.likeCount }}</span>
        </div>
      </template>
    </DataTable>

    <!-- 文章编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="900px"
      @close="handleEditDialogClose"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="文章分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option label="常见问题" value="faq" />
            <el-option label="使用指南" value="guide" />
            <el-option label="政策说明" value="policy" />
            <el-option label="技术文档" value="technical" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="文章标签" prop="tags">
          <el-tag
            v-for="(tag, index) in editForm.tags"
            :key="index"
            closable
            @close="handleRemoveTag(index)"
            style="margin-right: 8px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="showTagInput"
            v-model="newTag"
            size="small"
            style="width: 120px"
            @keyup.enter="handleAddTag"
            @blur="handleAddTag"
          />
          <el-button v-else size="small" @click="showTagInput = true">+ 添加标签</el-button>
        </el-form-item>

        <el-form-item label="文章内容" prop="content">
          <RichTextEditor v-model="editForm.content" :height="400" />
        </el-form-item>

        <el-form-item label="发布状态" prop="isPublished">
          <el-switch
            v-model="editForm.isPublished"
            active-text="发布"
            inactive-text="草稿"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 文章预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="文章预览"
      width="800px"
      @close="handlePreviewDialogClose"
    >
      <div v-if="currentArticle" class="article-preview">
        <h2 class="article-title">{{ currentArticle.title }}</h2>
        <div class="article-meta">
          <el-tag :type="getCategoryTagType(currentArticle.category)" size="small">
            {{ getCategoryLabel(currentArticle.category) }}
          </el-tag>
          <el-tag
            v-for="(tag, index) in currentArticle.tags"
            :key="index"
            size="small"
            style="margin-left: 8px"
          >
            {{ tag }}
          </el-tag>
          <span class="article-author">作者: {{ currentArticle.authorName }}</span>
          <span class="article-date">{{ currentArticle.updatedAt }}</span>
        </div>
        <div class="article-stats-bar">
          <span><el-icon><View /></el-icon> {{ currentArticle.viewCount }} 浏览</span>
          <span><el-icon><Star /></el-icon> {{ currentArticle.likeCount }} 点赞</span>
        </div>
        <div class="article-content" v-html="currentArticle.content"></div>
      </div>

      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEditFromPreview">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, View, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import {
  getKnowledgeArticles,
  getKnowledgeStats,
  createKnowledgeArticle,
  updateKnowledgeArticle,
  deleteKnowledgeArticle,
  type KnowledgeArticle,
  type KnowledgeStats,
  type KnowledgeCategory
} from '@/api/customerService'

// 统计数据
const stats = ref<KnowledgeStats>({
  totalArticles: 0,
  publishedArticles: 0,
  totalViews: 0,
  totalLikes: 0,
  avgViewsPerArticle: 0,
  topArticles: []
})

// 搜索表单
const searchForm = ref({
  category: '',
  isPublished: '',
  keyword: ''
})

// 搜索字段配置
const searchFields = [
  {
    type: 'select',
    prop: 'category',
    label: '文章分类',
    placeholder: '请选择分类',
    options: [
      { label: '常见问题', value: 'faq' },
      { label: '使用指南', value: 'guide' },
      { label: '政策说明', value: 'policy' },
      { label: '技术文档', value: 'technical' },
      { label: '其他', value: 'other' }
    ]
  },
  {
    type: 'select',
    prop: 'isPublished',
    label: '发布状态',
    placeholder: '请选择状态',
    options: [
      { label: '已发布', value: 'true' },
      { label: '草稿', value: 'false' }
    ]
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入标题或内容'
  }
]

// 表格数据
const articleList = ref<KnowledgeArticle[]>([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 表格列配置
const tableColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'title', label: '标题', minWidth: 250 },
  { prop: 'category', label: '分类', width: 120, slot: 'category' },
  { prop: 'tags', label: '标签', width: 200, slot: 'tags' },
  { prop: 'authorName', label: '作者', width: 120 },
  { prop: 'isPublished', label: '状态', width: 100, slot: 'isPublished' },
  { prop: 'stats', label: '统计', width: 150, slot: 'stats' },
  { prop: 'updatedAt', label: '更新时间', width: 160 }
]

// 表格操作
const tableActions = [
  {
    label: '预览',
    type: 'primary',
    link: true,
    onClick: (row: KnowledgeArticle) => handlePreview(row)
  },
  {
    label: '编辑',
    type: 'success',
    link: true,
    onClick: (row: KnowledgeArticle) => handleEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    link: true,
    onClick: (row: KnowledgeArticle) => handleDelete(row)
  }
]

// 编辑对话框
const editDialogVisible = ref(false)
const editDialogTitle = ref('新增文章')
const editForm = reactive({
  id: 0,
  title: '',
  content: '',
  category: 'faq' as KnowledgeCategory,
  tags: [] as string[],
  isPublished: false
})
const editFormRef = ref()
const editRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}
const submitting = ref(false)

// 标签管理
const showTagInput = ref(false)
const newTag = ref('')

// 预览对话框
const previewDialogVisible = ref(false)
const currentArticle = ref<KnowledgeArticle | null>(null)

// 获取统计数据
const fetchStats = async () => {
  try {
    stats.value = await getKnowledgeStats()
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 获取文章列表
const fetchArticleList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      category: searchForm.value.category as KnowledgeCategory | undefined,
      isPublished: searchForm.value.isPublished ? searchForm.value.isPublished === 'true' : undefined,
      keyword: searchForm.value.keyword
    }
    const { list, total } = await getKnowledgeArticles(params)
    articleList.value = list
    pagination.total = total
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchArticleList()
}

// 重置
const handleReset = () => {
  searchForm.value = {
    category: '',
    isPublished: '',
    keyword: ''
  }
  handleSearch()
}

// 分页变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchArticleList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchArticleList()
}

// 新增文章
const handleAdd = () => {
  editForm.id = 0
  editForm.title = ''
  editForm.content = ''
  editForm.category = 'faq'
  editForm.tags = []
  editForm.isPublished = false
  editDialogTitle.value = '新增文章'
  editDialogVisible.value = true
}

// 编辑文章
const handleEdit = (row: KnowledgeArticle) => {
  editForm.id = row.id
  editForm.title = row.title
  editForm.content = row.content
  editForm.category = row.category
  editForm.tags = [...row.tags]
  editForm.isPublished = row.isPublished
  editDialogTitle.value = '编辑文章'
  editDialogVisible.value = true
}

// 删除文章
const handleDelete = async (row: KnowledgeArticle) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteKnowledgeArticle(row.id)
    ElMessage.success('删除成功')
    fetchArticleList()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除文章失败')
    }
  }
}

// 预览文章
const handlePreview = (row: KnowledgeArticle) => {
  currentArticle.value = row
  previewDialogVisible.value = true
}

// 从预览页编辑
const handleEditFromPreview = () => {
  previewDialogVisible.value = false
  if (currentArticle.value) {
    handleEdit(currentArticle.value)
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    submitting.value = true
    try {
      if (editForm.id) {
        await updateKnowledgeArticle(editForm.id, editForm)
        ElMessage.success('更新成功')
      } else {
        await createKnowledgeArticle(editForm)
        ElMessage.success('创建成功')
      }
      editDialogVisible.value = false
      fetchArticleList()
      fetchStats()
    } catch (error) {
      console.error('保存文章失败:', error)
      ElMessage.error('保存文章失败')
    } finally {
      submitting.value = false
    }
  })
}

// 添加标签
const handleAddTag = () => {
  if (newTag.value && !editForm.tags.includes(newTag.value)) {
    editForm.tags.push(newTag.value)
  }
  newTag.value = ''
  showTagInput.value = false
}

// 删除标签
const handleRemoveTag = (index: number) => {
  editForm.tags.splice(index, 1)
}

// 关闭编辑对话框
const handleEditDialogClose = () => {
  editFormRef.value?.resetFields()
}

// 关闭预览对话框
const handlePreviewDialogClose = () => {
  currentArticle.value = null
}

// 获取分类标签类型
const getCategoryTagType = (category: KnowledgeCategory) => {
  const categoryMap: Record<KnowledgeCategory, any> = {
    faq: '',
    guide: 'success',
    policy: 'warning',
    technical: 'danger',
    other: 'info'
  }
  return categoryMap[category] || 'info'
}

// 获取分类标签
const getCategoryLabel = (category: KnowledgeCategory) => {
  const categoryMap: Record<KnowledgeCategory, string> = {
    faq: '常见问题',
    guide: '使用指南',
    policy: '政策说明',
    technical: '技术文档',
    other: '其他'
  }
  return categoryMap[category] || category
}

// 初始化
onMounted(() => {
  fetchStats()
  fetchArticleList()
})
</script>

<style scoped lang="scss">
.knowledge-base-container {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.article-stats {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #606266;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.more-tags {
  color: #909399;
  font-size: 12px;
}

.article-preview {
  .article-title {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #ebeef5;

    .article-author,
    .article-date {
      margin-left: auto;
      font-size: 13px;
      color: #909399;
    }
  }

  .article-stats-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #606266;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .article-content {
    line-height: 1.8;
    color: #606266;

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      margin: 16px 0 8px 0;
      font-weight: 600;
      color: #303133;
    }

    :deep(p) {
      margin: 8px 0;
    }

    :deep(ul),
    :deep(ol) {
      margin: 8px 0;
      padding-left: 24px;
    }

    :deep(code) {
      padding: 2px 6px;
      background: #f5f7fa;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    :deep(pre) {
      padding: 12px;
      background: #f5f7fa;
      border-radius: 4px;
      overflow-x: auto;

      code {
        padding: 0;
        background: none;
      }
    }
  }
}
</style>
