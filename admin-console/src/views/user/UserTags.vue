<template>
  <div class="user-tags-container">
    <div class="tags-layout">
      <!-- 左侧：标签列表 -->
      <el-card class="tags-sidebar" shadow="never">
        <template #header>
          <div class="sidebar-header">
            <span>标签分类</span>
            <el-button type="primary" size="small" :icon="Plus" @click="handleCreateTag">
              新增
            </el-button>
          </div>
        </template>

        <div class="tag-list">
          <div
            v-for="tag in tagList"
            :key="tag.id"
            class="tag-item"
            :class="{ active: currentTag?.id === tag.id }"
            @click="handleSelectTag(tag)"
          >
            <div class="tag-info">
              <el-tag :type="getTagType(tag.color)" size="large">
                {{ tag.name }}
              </el-tag>
              <span class="tag-count">{{ tag.userCount }}人</span>
            </div>
            <el-dropdown @command="(cmd) => handleTagAction(tag, cmd)" trigger="click">
              <el-icon class="more-icon" @click.stop><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>

      <!-- 右侧：用户列表 -->
      <div class="users-content">
        <!-- 搜索栏 -->
        <el-card class="search-card" shadow="never">
          <el-form :model="searchForm" inline>
            <el-form-item label="用户搜索">
              <el-input
                v-model="searchForm.keyword"
                placeholder="手机号/用户名"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">
                搜索
              </el-button>
              <el-button :icon="Refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 操作栏 -->
        <el-card class="toolbar-card" shadow="never">
          <el-button
            type="primary"
            :icon="Plus"
            :disabled="!currentTag"
            @click="handleBatchAddTag"
          >
            批量添加用户
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedUsers.length === 0"
            @click="handleBatchRemoveTag"
          >
            批量移除标签
          </el-button>
          <span v-if="currentTag" class="current-tag-info">
            当前标签：
            <el-tag :type="getTagType(currentTag.color)">
              {{ currentTag.name }}
            </el-tag>
          </span>
        </el-card>

        <!-- 用户列表 -->
        <el-card class="table-card" shadow="never">
          <el-table
            v-loading="loading"
            :data="userList"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="用户信息" width="250">
              <template #default="{ row }">
                <div class="user-info">
                  <el-avatar :src="row.avatarUrl" :size="40">
                    {{ row.username?.charAt(0) || 'U' }}
                  </el-avatar>
                  <div class="user-detail">
                    <div>{{ row.username }}</div>
                    <div class="phone">{{ row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户标签" min-width="300">
              <template #default="{ row }">
                <el-tag
                  v-for="tag in row.tags"
                  :key="tag.id"
                  :type="getTagType(tag.color)"
                  size="small"
                  closable
                  style="margin-right: 8px"
                  @close="handleRemoveUserTag(row, tag)"
                >
                  {{ tag.name }}
                </el-tag>
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Plus"
                  @click="handleAddUserTag(row)"
                >
                  添加标签
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleViewUser(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.page"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑标签对话框 -->
    <el-dialog
      v-model="tagDialogVisible"
      :title="tagDialogTitle"
      width="500px"
      @close="handleTagDialogClose"
    >
      <el-form
        ref="tagFormRef"
        :model="tagForm"
        :rules="tagFormRules"
        label-width="100px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <el-radio-group v-model="tagForm.color">
            <el-radio label="primary">蓝色</el-radio>
            <el-radio label="success">绿色</el-radio>
            <el-radio label="warning">橙色</el-radio>
            <el-radio label="danger">红色</el-radio>
            <el-radio label="info">灰色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="tagForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tagDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleTagSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 为用户添加标签对话框 -->
    <el-dialog
      v-model="addTagDialogVisible"
      title="为用户添加标签"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="用户">
          <div>{{ currentUser?.username }} ({{ currentUser?.phone }})</div>
        </el-form-item>
        <el-form-item label="选择标签">
          <el-select
            v-model="selectedTagIds"
            multiple
            placeholder="请选择标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            >
              <el-tag :type="getTagType(tag.color)" size="small">
                {{ tag.name }}
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addTagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTagSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量添加用户对话框 -->
    <el-dialog
      v-model="batchAddDialogVisible"
      title="批量添加用户到标签"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="当前标签">
          <el-tag :type="getTagType(currentTag?.color)" size="large">
            {{ currentTag?.name }}
          </el-tag>
        </el-form-item>
        <el-form-item label="选择用户">
          <el-select
            v-model="batchSelectedUserIds"
            multiple
            filterable
            placeholder="请选择用户"
            style="width: 100%"
          >
            <el-option
              v-for="user in allUserList"
              :key="user.id"
              :label="`${user.username} (${user.phone})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchAddSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Delete,
  MoreFilled,
} from '@element-plus/icons-vue'

const router = useRouter()

// 标签数据类型
interface Tag {
  id: number
  name: string
  color: string
  description: string
  userCount: number
  createdAt: string
}

// 用户数据类型
interface User {
  id: number
  username: string
  phone: string
  avatarUrl: string
  tags: Tag[]
  createdAt: string
}

// 标签列表
const tagList = ref<Tag[]>([
  {
    id: 1,
    name: 'VIP用户',
    color: 'warning',
    description: '高价值用户',
    userCount: 15,
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    name: '活跃用户',
    color: 'success',
    description: '近30天有订单',
    userCount: 48,
    createdAt: '2024-02-10T08:00:00.000Z',
  },
  {
    id: 3,
    name: '新用户',
    color: 'primary',
    description: '注册少于30天',
    userCount: 23,
    createdAt: '2024-03-05T08:00:00.000Z',
  },
])

// 当前选中的标签
const currentTag = ref<Tag | null>(null)

// 用户列表
const userList = ref<User[]>([])
const allUserList = ref<User[]>([
  {
    id: 1,
    username: '张三',
    phone: '13800138000',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [],
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 2,
    username: '李四',
    phone: '13800138001',
    avatarUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: [],
    createdAt: '2024-02-10T08:00:00.000Z',
  },
])

const loading = ref(false)
const selectedUsers = ref<User[]>([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// 标签对话框
const tagDialogVisible = ref(false)
const tagDialogTitle = ref('新增标签')
const isEditTag = ref(false)
const submitLoading = ref(false)
const tagFormRef = ref<FormInstance>()

const tagForm = reactive({
  id: 0,
  name: '',
  color: 'primary',
  description: '',
})

const tagFormRules: FormRules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 2, max: 20, message: '标签名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  color: [
    { required: true, message: '请选择标签颜色', trigger: 'change' },
  ],
}

// 添加标签对话框
const addTagDialogVisible = ref(false)
const currentUser = ref<User | null>(null)
const selectedTagIds = ref<number[]>([])

// 批量添加对话框
const batchAddDialogVisible = ref(false)
const batchSelectedUserIds = ref<number[]>([])

// 可用标签（排除用户已有的标签）
const availableTags = computed(() => {
  if (!currentUser.value) return tagList.value
  const userTagIds = currentUser.value.tags.map(t => t.id)
  return tagList.value.filter(t => !userTagIds.includes(t.id))
})

// 选择标签
const handleSelectTag = (tag: Tag) => {
  currentTag.value = tag
  loadTagUsers(tag.id)
}

// 加载标签下的用户
const loadTagUsers = (tagId: number) => {
  loading.value = true
  // TODO: 调用API加载该标签下的用户
  setTimeout(() => {
    // Mock数据
    userList.value = allUserList.value.map(user => ({
      ...user,
      tags: tagId === 1 ? [tagList.value[0]] : [],
    }))
    pagination.total = userList.value.length
    loading.value = false
  }, 300)
}

// 新增标签
const handleCreateTag = () => {
  tagDialogTitle.value = '新增标签'
  isEditTag.value = false
  tagDialogVisible.value = true
}

// 标签操作
const handleTagAction = (tag: Tag, command: string) => {
  if (command === 'edit') {
    handleEditTag(tag)
  } else if (command === 'delete') {
    handleDeleteTag(tag)
  }
}

// 编辑标签
const handleEditTag = (tag: Tag) => {
  tagDialogTitle.value = '编辑标签'
  isEditTag.value = true
  tagForm.id = tag.id
  tagForm.name = tag.name
  tagForm.color = tag.color
  tagForm.description = tag.description
  tagDialogVisible.value = true
}

// 删除标签
const handleDeleteTag = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${tag.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('删除成功')
    const index = tagList.value.findIndex(t => t.id === tag.id)
    if (index > -1) {
      tagList.value.splice(index, 1)
    }
    if (currentTag.value?.id === tag.id) {
      currentTag.value = null
      userList.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交标签表单
const handleTagSubmit = async () => {
  if (!tagFormRef.value) return

  await tagFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (isEditTag.value) {
        const index = tagList.value.findIndex(t => t.id === tagForm.id)
        if (index > -1) {
          tagList.value[index] = {
            ...tagList.value[index],
            name: tagForm.name,
            color: tagForm.color,
            description: tagForm.description,
          }
        }
        ElMessage.success('更新成功')
      } else {
        const newTag: Tag = {
          id: tagList.value.length + 1,
          name: tagForm.name,
          color: tagForm.color,
          description: tagForm.description,
          userCount: 0,
          createdAt: new Date().toISOString(),
        }
        tagList.value.push(newTag)
        ElMessage.success('创建成功')
      }
      tagDialogVisible.value = false
    } catch (error) {
      ElMessage.error(isEditTag.value ? '更新失败' : '创建失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 标签对话框关闭
const handleTagDialogClose = () => {
  tagFormRef.value?.resetFields()
  tagForm.id = 0
  tagForm.name = ''
  tagForm.color = 'primary'
  tagForm.description = ''
}

// 为用户添加标签
const handleAddUserTag = (user: User) => {
  currentUser.value = user
  selectedTagIds.value = []
  addTagDialogVisible.value = true
}

// 提交添加标签
const handleAddTagSubmit = () => {
  if (selectedTagIds.value.length === 0) {
    ElMessage.warning('请选择至少一个标签')
    return
  }

  const selectedTags = tagList.value.filter(t => selectedTagIds.value.includes(t.id))
  if (currentUser.value) {
    currentUser.value.tags.push(...selectedTags)
  }
  ElMessage.success('添加成功')
  addTagDialogVisible.value = false
}

// 移除用户标签
const handleRemoveUserTag = async (user: User, tag: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除用户 "${user.username}" 的标签 "${tag.name}" 吗？`,
      '移除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const index = user.tags.findIndex(t => t.id === tag.id)
    if (index > -1) {
      user.tags.splice(index, 1)
    }
    ElMessage.success('移除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('移除失败')
    }
  }
}

// 批量添加用户
const handleBatchAddTag = () => {
  batchSelectedUserIds.value = []
  batchAddDialogVisible.value = true
}

// 提交批量添加
const handleBatchAddSubmit = () => {
  if (batchSelectedUserIds.value.length === 0) {
    ElMessage.warning('请选择至少一个用户')
    return
  }

  ElMessage.success(`成功为 ${batchSelectedUserIds.value.length} 个用户添加标签`)
  batchAddDialogVisible.value = false
  if (currentTag.value) {
    loadTagUsers(currentTag.value.id)
  }
}

// 批量移除标签
const handleBatchRemoveTag = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要为选中的 ${selectedUsers.value.length} 个用户移除当前标签吗？`,
      '批量移除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success('批量移除成功')
    selectedUsers.value = []
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量移除失败')
    }
  }
}

// 查看用户详情
const handleViewUser = (user: User) => {
  router.push(`/users/detail/${user.id}`)
}

// 选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  ElMessage.success('搜索功能开发中...')
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
}

// 获取标签类型
const getTagType = (color: string) => {
  return color as any
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 页面加载
onMounted(() => {
  // 默认选中第一个标签
  if (tagList.value.length > 0) {
    handleSelectTag(tagList.value[0])
  }
})
</script>

<style scoped lang="scss">
.user-tags-container {
  padding: 20px;

  .tags-layout {
    display: flex;
    gap: 20px;
    height: calc(100vh - 120px);

    .tags-sidebar {
      width: 280px;
      flex-shrink: 0;

      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }

      .tag-list {
        .tag-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: #f5f7fa;
          }

          &.active {
            background: #ecf5ff;
            border-left: 3px solid #409eff;
          }

          .tag-info {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;

            .tag-count {
              color: #909399;
              font-size: 13px;
            }
          }

          .more-icon {
            cursor: pointer;
            color: #909399;
            font-size: 16px;

            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }

    .users-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow: hidden;

      .search-card,
      .toolbar-card {
        flex-shrink: 0;
      }

      .toolbar-card {
        display: flex;
        align-items: center;
        gap: 12px;

        .current-tag-info {
          margin-left: auto;
          color: #606266;
          font-size: 14px;
        }
      }

      .table-card {
        flex: 1;
        overflow: auto;

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .user-detail {
            .phone {
              font-size: 12px;
              color: #909399;
              margin-top: 4px;
            }
          }
        }

        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
