<!-- 社区内容管理页面 -->
<template>
  <div class="community-content-container">
    <PageHeader title="内容管理" description="管理社区已发布的帖子、评论等内容" />

    <!-- 统计卡片 -->
    <StatsCard :stats="statsCards" />

    <!-- 搜索表单 -->
    <SearchForm v-model="searchParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 数据表格 -->
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      :actions-width="200"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #contentType="{ row }">
        <el-tag :type="getContentTypeTag(row.contentType)" size="small">
          {{ getContentTypeLabel(row.contentType) }}
        </el-tag>
      </template>

      <template #user="{ row }">
        <div class="user-info">
          <el-avatar :src="row.userAvatar" :size="32" />
          <span class="user-name">{{ row.userName }}</span>
        </div>
      </template>

      <template #content="{ row }">
        <div class="content-preview">
          <div v-if="row.title" class="content-title">{{ row.title }}</div>
          <div class="content-text">{{ row.content }}</div>
          <div v-if="row.images.length > 0" class="content-images">
            <el-image
              v-for="(img, index) in row.images.slice(0, 3)"
              :key="index"
              :src="img"
              :preview-src-list="row.images"
              fit="cover"
              class="preview-image"
            />
            <span v-if="row.images.length > 3" class="more-images">
              +{{ row.images.length - 3 }}
            </span>
          </div>
        </div>
      </template>

      <template #status="{ row }">
        <el-tag :type="getStatusTag(row.status)" size="small">
          {{ getStatusLabel(row.status) }}
        </el-tag>
      </template>

      <template #isTop="{ row }">
        <el-tag v-if="row.isTop" type="danger" size="small">置顶</el-tag>
        <el-tag v-else type="info" size="small">普通</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
        <el-button link type="warning" size="small" @click="handleToggleTop(row)">
          {{ row.isTop ? '取消置顶' : '置顶' }}
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </DataTable>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="内容详情"
      width="800px"
      @close="handleDetailDialogClose"
    >
      <div v-if="currentContent" class="content-detail">
        <!-- 用户信息 -->
        <div class="detail-section">
          <h3>用户信息</h3>
          <div class="user-detail">
            <el-avatar :src="currentContent.userAvatar" :size="48" />
            <div class="user-detail-info">
              <div class="user-name">{{ currentContent.userName }}</div>
              <div class="user-id">用户ID: {{ currentContent.userId }}</div>
            </div>
          </div>
        </div>

        <!-- 内容信息 -->
        <div class="detail-section">
          <h3>内容信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="内容ID">
              {{ currentContent.id }}
            </el-descriptions-item>
            <el-descriptions-item label="内容类型">
              <el-tag :type="getContentTypeTag(currentContent.contentType)" size="small">
                {{ getContentTypeLabel(currentContent.contentType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="所属版块">
              {{ currentContent.sectionName }}
            </el-descriptions-item>
            <el-descriptions-item label="发布时间">
              {{ currentContent.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item label="浏览量">
              {{ currentContent.viewCount }}
            </el-descriptions-item>
            <el-descriptions-item label="点赞数">
              {{ currentContent.likeCount }}
            </el-descriptions-item>
            <el-descriptions-item label="评论数">
              {{ currentContent.commentCount }}
            </el-descriptions-item>
            <el-descriptions-item label="收藏数">
              {{ currentContent.favoriteCount }}
            </el-descriptions-item>
          </el-descriptions>

          <div v-if="currentContent.title" class="detail-title">
            <strong>标题：</strong>{{ currentContent.title }}
          </div>
          <div class="detail-content">
            <strong>内容：</strong>{{ currentContent.content }}
          </div>

          <!-- 图片 -->
          <div v-if="currentContent.images.length > 0" class="detail-images">
            <strong>图片：</strong>
            <div class="image-grid">
              <el-image
                v-for="(img, index) in currentContent.images"
                :key="index"
                :src="img"
                :preview-src-list="currentContent.images"
                fit="cover"
                class="detail-image"
              />
            </div>
          </div>

          <!-- 视频 -->
          <div v-if="currentContent.videos.length > 0" class="detail-videos">
            <strong>视频：</strong>
            <div class="video-list">
              <div v-for="(video, index) in currentContent.videos" :key="index" class="video-item">
                <el-link :href="video" target="_blank" type="primary">
                  视频{{ index + 1 }}
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, ChatDotRound, TrendCharts, Star } from '@element-plus/icons-vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import SearchForm from '@/components/common/SearchForm.vue'
import DataTable from '@/components/common/DataTable.vue'
import type { SearchField } from '@/components/common/SearchForm.vue'
import type { TableColumn } from '@/components/common/DataTable.vue'

// 内容类型
type ContentType = 'post' | 'comment' | 'reply' | 'image' | 'video'

// 内容状态
type ContentStatus = 'published' | 'hidden' | 'deleted'

// 社区内容接口
interface CommunityContent {
  id: number
  contentType: ContentType
  userId: number
  userName: string
  userAvatar: string
  title: string
  content: string
  images: string[]
  videos: string[]
  sectionId: number
  sectionName: string
  status: ContentStatus
  isTop: boolean
  viewCount: number
  likeCount: number
  commentCount: number
  favoriteCount: number
  createdAt: string
  updatedAt: string
}

// 统计数据
interface ContentStats {
  totalPosts: number
  totalComments: number
  todayPosts: number
  topPosts: number
}

const stats = ref<ContentStats>({
  totalPosts: 0,
  totalComments: 0,
  todayPosts: 0,
  topPosts: 0,
})

// 统计卡片数据
const statsCards = computed(() => [
  {
    label: '总帖子数',
    value: stats.value.totalPosts,
    icon: Document,
    color: '#409eff',
    format: 'number' as const,
  },
  {
    label: '总评论数',
    value: stats.value.totalComments,
    icon: ChatDotRound,
    color: '#67c23a',
    format: 'number' as const,
  },
  {
    label: '今日发布',
    value: stats.value.todayPosts,
    icon: TrendCharts,
    color: '#e6a23c',
    format: 'number' as const,
  },
  {
    label: '置顶内容',
    value: stats.value.topPosts,
    icon: Star,
    color: '#f56c6c',
    format: 'number' as const,
  },
])

const searchFields: SearchField[] = [
  {
    type: 'select',
    prop: 'contentType',
    label: '内容类型',
    placeholder: '请选择内容类型',
    options: [
      { label: '帖子', value: 'post' },
      { label: '评论', value: 'comment' },
      { label: '回复', value: 'reply' },
    ],
  },
  {
    type: 'select',
    prop: 'sectionId',
    label: '所属版块',
    placeholder: '请选择版块',
    options: [
      { label: '旅游攻略', value: 1 },
      { label: '装备交流', value: 2 },
      { label: '问题求助', value: 3 },
      { label: '经验分享', value: 4 },
    ],
  },
  {
    type: 'select',
    prop: 'status',
    label: '内容状态',
    placeholder: '请选择状态',
    options: [
      { label: '已发布', value: 'published' },
      { label: '已隐藏', value: 'hidden' },
    ],
  },
  {
    type: 'input',
    prop: 'keyword',
    label: '关键词',
    placeholder: '请输入标题、内容或用户名',
  },
]

const tableColumns: TableColumn[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'contentType', label: '类型', width: 100, slot: 'contentType' },
  { prop: 'user', label: '用户', width: 150, slot: 'user' },
  { prop: 'content', label: '内容', minWidth: 300, slot: 'content' },
  { prop: 'sectionName', label: '版块', width: 120 },
  { prop: 'viewCount', label: '浏览', width: 80 },
  { prop: 'likeCount', label: '点赞', width: 80 },
  { prop: 'commentCount', label: '评论', width: 80 },
  { prop: 'isTop', label: '置顶', width: 100, slot: 'isTop' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'createdAt', label: '发布时间', width: 160 },
  { prop: 'actions', label: '操作', width: 200, slot: 'actions', fixed: 'right' as const },
]

const tableData = ref<CommunityContent[]>([])
const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const searchParams = reactive({
  contentType: '',
  sectionId: undefined as number | undefined,
  status: '',
  keyword: '',
})

// 详情对话框
const detailDialogVisible = ref(false)
const currentContent = ref<CommunityContent | null>(null)

// Mock数据
const mockContents: CommunityContent[] = [
  {
    id: 1,
    contentType: 'post',
    userId: 101,
    userName: '房车爱好者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    title: '川藏线房车自驾游攻略分享',
    content: '刚从川藏线回来，分享一下这次房车自驾的经验和注意事项。路况整体不错，但有几个地方需要特别注意...',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
    ],
    videos: [],
    sectionId: 1,
    sectionName: '旅游攻略',
    status: 'published',
    isTop: true,
    viewCount: 1250,
    likeCount: 89,
    commentCount: 34,
    favoriteCount: 56,
    createdAt: '2025-12-01 10:30:00',
    updatedAt: '2025-12-01 10:30:00',
  },
  {
    id: 2,
    contentType: 'post',
    userId: 102,
    userName: '自驾达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    title: '房车露营装备清单',
    content: '整理了一份详细的房车露营装备清单，包括必备装备和可选装备，希望对大家有帮助...',
    images: ['https://picsum.photos/400/300?random=4'],
    videos: [],
    sectionId: 2,
    sectionName: '装备交流',
    status: 'published',
    isTop: false,
    viewCount: 856,
    likeCount: 67,
    commentCount: 23,
    favoriteCount: 45,
    createdAt: '2025-12-02 14:20:00',
    updatedAt: '2025-12-02 14:20:00',
  },
  {
    id: 3,
    contentType: 'post',
    userId: 103,
    userName: '新手上路',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    title: '第一次租房车需要注意什么？',
    content: '准备第一次租房车去旅行，有点紧张，想问问大家有什么需要注意的地方？',
    images: [],
    videos: [],
    sectionId: 3,
    sectionName: '问题求助',
    status: 'published',
    isTop: false,
    viewCount: 432,
    likeCount: 28,
    commentCount: 15,
    favoriteCount: 12,
    createdAt: '2025-12-03 09:15:00',
    updatedAt: '2025-12-03 09:15:00',
  },
  {
    id: 4,
    contentType: 'comment',
    userId: 104,
    userName: '老司机',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    title: '',
    content: '楼主说得很详细，我补充几点：1. 高原地区要注意高反；2. 提前规划好加油站位置；3. 带好常用药品。',
    images: [],
    videos: [],
    sectionId: 1,
    sectionName: '旅游攻略',
    status: 'published',
    isTop: false,
    viewCount: 0,
    likeCount: 12,
    commentCount: 0,
    favoriteCount: 0,
    createdAt: '2025-12-01 11:45:00',
    updatedAt: '2025-12-01 11:45:00',
  },
  {
    id: 5,
    contentType: 'post',
    userId: 105,
    userName: '摄影师',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    title: '房车旅行摄影技巧分享',
    content: '作为一名摄影师，分享一些房车旅行中的摄影技巧和经验，希望能帮助大家拍出更美的照片...',
    images: [
      'https://picsum.photos/400/300?random=5',
      'https://picsum.photos/400/300?random=6',
    ],
    videos: ['https://example.com/video1.mp4'],
    sectionId: 4,
    sectionName: '经验分享',
    status: 'published',
    isTop: true,
    viewCount: 2100,
    likeCount: 156,
    commentCount: 67,
    favoriteCount: 89,
    createdAt: '2025-11-30 16:00:00',
    updatedAt: '2025-11-30 16:00:00',
  },
]

const fetchStats = async () => {
  try {
    // Mock统计数据
    stats.value = {
      totalPosts: mockContents.filter((c) => c.contentType === 'post').length,
      totalComments: mockContents.filter((c) => c.contentType === 'comment').length,
      todayPosts: mockContents.filter(
        (c) => c.contentType === 'post' && c.createdAt.startsWith('2025-12-03')
      ).length,
      topPosts: mockContents.filter((c) => c.isTop).length,
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    // Mock数据过滤
    let filteredData = [...mockContents]

    if (searchParams.contentType) {
      filteredData = filteredData.filter((item) => item.contentType === searchParams.contentType)
    }

    if (searchParams.sectionId) {
      filteredData = filteredData.filter((item) => item.sectionId === searchParams.sectionId)
    }

    if (searchParams.status) {
      filteredData = filteredData.filter((item) => item.status === searchParams.status)
    }

    if (searchParams.keyword) {
      filteredData = filteredData.filter(
        (item) =>
          item.title.includes(searchParams.keyword) ||
          item.content.includes(searchParams.keyword) ||
          item.userName.includes(searchParams.keyword)
      )
    }

    // 分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    tableData.value = filteredData.slice(start, end)
    pagination.total = filteredData.length
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchList()
}

const handleReset = () => {
  Object.assign(searchParams, {
    contentType: '',
    sectionId: undefined,
    status: '',
    keyword: '',
  })
  pagination.page = 1
  fetchList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchList()
}

const handleView = (row: CommunityContent) => {
  currentContent.value = row
  detailDialogVisible.value = true
}

const handleToggleTop = async (row: CommunityContent) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.isTop ? '取消置顶' : '置顶'}该内容吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // Mock操作
    row.isTop = !row.isTop
    ElMessage.success(`${row.isTop ? '置顶' : '取消置顶'}成功`)
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row: CommunityContent) => {
  try {
    await ElMessageBox.confirm('确定要删除该内容吗？删除后无法恢复！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // Mock操作
    const index = mockContents.findIndex((item) => item.id === row.id)
    if (index > -1) {
      mockContents.splice(index, 1)
    }
    ElMessage.success('删除成功')
    fetchList()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleDetailDialogClose = () => {
  currentContent.value = null
}

const getContentTypeTag = (type: ContentType) => {
  const typeMap: Record<ContentType, any> = {
    post: '',
    comment: 'success',
    reply: 'info',
    image: 'warning',
    video: 'danger',
  }
  return typeMap[type] || 'info'
}

const getContentTypeLabel = (type: ContentType) => {
  const typeMap: Record<ContentType, string> = {
    post: '帖子',
    comment: '评论',
    reply: '回复',
    image: '图片',
    video: '视频',
  }
  return typeMap[type] || type
}

const getStatusTag = (status: ContentStatus) => {
  const statusMap: Record<ContentStatus, any> = {
    published: 'success',
    hidden: 'warning',
    deleted: 'danger',
  }
  return statusMap[status] || 'info'
}

const getStatusLabel = (status: ContentStatus) => {
  const statusMap: Record<ContentStatus, string> = {
    published: '已发布',
    hidden: '已隐藏',
    deleted: '已删除',
  }
  return statusMap[status] || status
}

onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped lang="scss">
.community-content-container {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .user-name {
    font-size: 14px;
  }
}

.content-preview {
  .content-title {
    font-weight: bold;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .content-text {
    color: #606266;
    font-size: 13px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .content-images {
    display: flex;
    gap: 4px;
    margin-top: 8px;

    .preview-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      cursor: pointer;
    }

    .more-images {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #f5f7fa;
      border-radius: 4px;
      color: #909399;
      font-size: 12px;
    }
  }
}

.content-detail {
  .detail-section {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .user-detail {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-detail-info {
      .user-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .user-id {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .detail-title,
  .detail-content {
    margin-top: 16px;
    line-height: 1.8;

    strong {
      color: #606266;
    }
  }

  .detail-images {
    margin-top: 16px;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #606266;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px;

      .detail-image {
        width: 100%;
        height: 120px;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }

  .detail-videos {
    margin-top: 16px;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #606266;
    }

    .video-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
