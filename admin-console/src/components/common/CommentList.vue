<template>
  <div class="comment-list">
    <!-- 评论输入框 -->
    <div v-if="showInput" class="comment-input">
      <el-avatar :size="40" :src="currentUser?.avatar">
        {{ currentUser?.name?.charAt(0) || 'U' }}
      </el-avatar>
      <div class="input-wrapper">
        <el-input
          v-model="newComment"
          type="textarea"
          :rows="3"
          :placeholder="placeholder"
          :maxlength="maxLength"
          show-word-limit
        />
        <div class="input-actions">
          <el-button
            type="primary"
            size="small"
            :loading="submitting"
            :disabled="!newComment.trim()"
            @click="handleSubmit"
          >
            {{ submitText }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-loading="loading" class="comments-wrapper">
      <!-- 排序和筛选 -->
      <div v-if="showSort || showFilter" class="list-header">
        <div class="header-left">
          <span class="total-count">共 {{ total }} 条评论</span>
        </div>
        <div class="header-right">
          <el-radio-group
            v-if="showSort"
            v-model="currentSort"
            size="small"
            @change="(val: any) => handleSortChange(String(val))"
          >
            <el-radio-button label="time">最新</el-radio-button>
            <el-radio-button label="hot">最热</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!loading && comments.length === 0"
        :description="emptyText"
        :image-size="120"
      />

      <!-- 评论项 -->
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <!-- 头像 -->
        <el-avatar
          class="comment-avatar"
          :size="avatarSize"
          :src="comment.user.avatar"
        >
          {{ comment.user.name.charAt(0) }}
        </el-avatar>

        <!-- 内容区 -->
        <div class="comment-content">
          <!-- 用户信息 -->
          <div class="comment-header">
            <span class="user-name">{{ comment.user.name }}</span>
            <el-tag
              v-if="comment.user.badge"
              :type="comment.user.badgeType || 'info'"
              size="small"
              effect="plain"
            >
              {{ comment.user.badge }}
            </el-tag>
            <span class="comment-time">{{ formatTime(comment.time) }}</span>
          </div>

          <!-- 评论文本 -->
          <div class="comment-text">
            <span v-if="comment.replyTo" class="reply-to">
              回复 @{{ comment.replyTo.name }}:
            </span>
            {{ comment.content }}
          </div>

          <!-- 图片附件 -->
          <div v-if="comment.images && comment.images.length > 0" class="comment-images">
            <el-image
              v-for="(image, index) in comment.images"
              :key="index"
              :src="image"
              :preview-src-list="comment.images"
              :initial-index="index"
              fit="cover"
              class="comment-image"
            />
          </div>

          <!-- 操作栏 -->
          <div class="comment-actions">
            <el-button
              :icon="comment.liked ? StarFilled : Star"
              :type="comment.liked ? 'primary' : 'default'"
              text
              size="small"
              @click="handleLike(comment)"
            >
              {{ comment.likeCount > 0 ? comment.likeCount : '点赞' }}
            </el-button>
            <el-button
              v-if="showReply"
              :icon="ChatDotRound"
              text
              size="small"
              @click="handleReply(comment)"
            >
              回复
            </el-button>
            <el-dropdown
              v-if="canOperate(comment)"
              trigger="click"
              @command="(command) => handleAction(command, comment)"
            >
              <el-button :icon="MoreFilled" text size="small" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="canEdit(comment)"
                    command="edit"
                    :icon="Edit"
                  >
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="canDelete(comment)"
                    command="delete"
                    :icon="Delete"
                    divided
                  >
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="canReport(comment)"
                    command="report"
                    :icon="WarningFilled"
                  >
                    举报
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo === comment.id" class="reply-input">
            <el-input
              v-model="replyContent"
              type="textarea"
              :rows="2"
              :placeholder="`回复 @${comment.user.name}`"
              :maxlength="maxLength"
              show-word-limit
            />
            <div class="reply-actions">
              <el-button size="small" @click="cancelReply">取消</el-button>
              <el-button
                type="primary"
                size="small"
                :loading="submitting"
                :disabled="!replyContent.trim()"
                @click="submitReply(comment)"
              >
                回复
              </el-button>
            </div>
          </div>

          <!-- 子评论 -->
          <div
            v-if="comment.replies && comment.replies.length > 0"
            class="comment-replies"
          >
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="reply-item"
            >
              <el-avatar
                class="reply-avatar"
                :size="32"
                :src="reply.user.avatar"
              >
                {{ reply.user.name.charAt(0) }}
              </el-avatar>
              <div class="reply-content">
                <div class="reply-header">
                  <span class="user-name">{{ reply.user.name }}</span>
                  <span class="reply-time">{{ formatTime(reply.time) }}</span>
                </div>
                <div class="reply-text">
                  <span v-if="reply.replyTo" class="reply-to">
                    回复 @{{ reply.replyTo.name }}:
                  </span>
                  {{ reply.content }}
                </div>
                <div class="reply-actions">
                  <el-button
                    :icon="reply.liked ? StarFilled : Star"
                    :type="reply.liked ? 'primary' : 'default'"
                    text
                    size="small"
                    @click="handleLike(reply)"
                  >
                    {{ reply.likeCount > 0 ? reply.likeCount : '' }}
                  </el-button>
                  <el-button
                    text
                    size="small"
                    @click="handleReply(reply, comment)"
                  >
                    回复
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 展开更多回复 -->
            <div
              v-if="comment.replyCount ?? 0 > comment.replies.length"
              class="load-more-replies"
              @click="loadMoreReplies(comment)"
            >
              展开更多回复（{{ comment.replyCount ?? 0 - comment.replies.length }}条）
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && !loading" class="load-more" @click="handleLoadMore">
        <el-button text>加载更多评论</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star,
  StarFilled,
  ChatDotRound,
  MoreFilled,
  Edit,
  Delete,
  WarningFilled,
} from '@element-plus/icons-vue'

// 用户接口
export interface CommentUser {
  id: string | number           // 用户 ID
  name: string                  // 用户名
  avatar?: string               // 头像
  badge?: string                // 徽章文本
  badgeType?: 'success' | 'warning' | 'danger' | 'info'
}

// 评论接口
export interface Comment {
  id: string | number           // 评论 ID
  user: CommentUser             // 评论用户
  content: string               // 评论内容
  time: string | Date           // 评论时间
  likeCount: number             // 点赞数
  liked: boolean                // 是否已点赞
  images?: string[]             // 图片附件
  replyTo?: CommentUser         // 回复的用户
  replies?: Comment[]           // 子评论
  replyCount?: number           // 回复总数
}

// Props 定义
interface Props {
  comments?: Comment[]          // 评论列表
  currentUser?: CommentUser     // 当前用户
  total?: number                // 评论总数
  loading?: boolean             // 加载状态
  hasMore?: boolean             // 是否有更多
  showInput?: boolean           // 是否显示输入框
  showReply?: boolean           // 是否显示回复按钮
  showSort?: boolean            // 是否显示排序
  showFilter?: boolean          // 是否显示筛选
  placeholder?: string          // 输入框占位符
  submitText?: string           // 提交按钮文本
  emptyText?: string            // 空状态文本
  maxLength?: number            // 最大字数
  avatarSize?: number           // 头像大小
  allowEdit?: boolean           // 是否允许编辑
  allowDelete?: boolean         // 是否允许删除
  allowReport?: boolean         // 是否允许举报
}

const props = withDefaults(defineProps<Props>(), {
  comments: () => [],
  total: 0,
  loading: false,
  hasMore: false,
  showInput: true,
  showReply: true,
  showSort: true,
  showFilter: false,
  placeholder: '写下你的评论...',
  submitText: '发表',
  emptyText: '暂无评论',
  maxLength: 500,
  avatarSize: 40,
  allowEdit: true,
  allowDelete: true,
  allowReport: true,
})

// Emits 定义
const emit = defineEmits<{
  'submit': [content: string, images?: string[]]
  'reply': [comment: Comment, content: string, parentComment?: Comment]
  'like': [comment: Comment]
  'edit': [comment: Comment]
  'delete': [comment: Comment]
  'report': [comment: Comment]
  'load-more': []
  'load-more-replies': [comment: Comment]
  'sort-change': [sort: string]
}>()

// 响应式数据
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref<string | number | null>(null)
const replyingParent = ref<Comment | null>(null)
const submitting = ref(false)
const currentSort = ref('time')

// 格式化时间
const formatTime = (time: string | Date): string => {
  const date = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 判断是否可以操作
const canOperate = (comment: Comment): boolean => {
  return canEdit(comment) || canDelete(comment) || canReport(comment)
}

// 判断是否可以编辑
const canEdit = (comment: Comment): boolean => {
  return props.allowEdit && comment.user.id === props.currentUser?.id
}

// 判断是否可以删除
const canDelete = (comment: Comment): boolean => {
  return props.allowDelete && comment.user.id === props.currentUser?.id
}

// 判断是否可以举报
const canReport = (comment: Comment): boolean => {
  return props.allowReport && comment.user.id !== props.currentUser?.id
}

// 提交评论
const handleSubmit = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    emit('submit', newComment.value.trim())
    newComment.value = ''
    ElMessage.success('评论发表成功')
  } finally {
    submitting.value = false
  }
}

// 回复评论
const handleReply = (comment: Comment, parentComment?: Comment) => {
  replyingTo.value = comment.id
  replyingParent.value = parentComment || null
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyingParent.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async (comment: Comment) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }

  submitting.value = true
  try {
    emit('reply', comment, replyContent.value.trim(), replyingParent.value || undefined)
    cancelReply()
    ElMessage.success('回复成功')
  } finally {
    submitting.value = false
  }
}

// 点赞
const handleLike = (comment: Comment) => {
  emit('like', comment)
}

// 操作处理
const handleAction = async (command: string, comment: Comment) => {
  switch (command) {
    case 'edit':
      emit('edit', comment)
      break
    case 'delete':
      try {
        await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        emit('delete', comment)
      } catch {
        // 用户取消
      }
      break
    case 'report':
      emit('report', comment)
      break
  }
}

// 加载更多评论
const handleLoadMore = () => {
  emit('load-more')
}

// 加载更多回复
const loadMoreReplies = (comment: Comment) => {
  emit('load-more-replies', comment)
}

// 排序变化
const handleSortChange = (sort: string) => {
  emit('sort-change', sort)
}
</script>

<script lang="ts">
export default {
  name: 'CommentList',
}
</script>

<style scoped lang="scss">
.comment-list {
  .comment-input {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;

    .input-wrapper {
      flex: 1;

      .input-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }
    }
  }

  .comments-wrapper {
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;

      .header-left {
        .total-count {
          font-size: 14px;
          color: #606266;
          font-weight: 600;
        }
      }
    }

    .comment-item {
      display: flex;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .comment-avatar {
        flex-shrink: 0;
      }

      .comment-content {
        flex: 1;
        min-width: 0;

        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
          }

          .comment-time {
            font-size: 12px;
            color: #909399;
            margin-left: auto;
          }
        }

        .comment-text {
          font-size: 14px;
          color: #606266;
          line-height: 1.6;
          margin-bottom: 8px;
          word-break: break-word;

          .reply-to {
            color: #409eff;
            margin-right: 4px;
          }
        }

        .comment-images {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;

          .comment-image {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        .comment-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }

        .reply-input {
          margin-top: 12px;
          padding: 12px;
          background-color: #f5f7fa;
          border-radius: 4px;

          .reply-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
          }
        }

        .comment-replies {
          margin-top: 12px;
          padding-left: 12px;
          border-left: 2px solid #ebeef5;

          .reply-item {
            display: flex;
            gap: 8px;
            padding: 12px 0;

            .reply-avatar {
              flex-shrink: 0;
            }

            .reply-content {
              flex: 1;
              min-width: 0;

              .reply-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;

                .user-name {
                  font-size: 13px;
                  font-weight: 600;
                  color: #303133;
                }

                .reply-time {
                  font-size: 12px;
                  color: #909399;
                }
              }

              .reply-text {
                font-size: 13px;
                color: #606266;
                line-height: 1.5;
                margin-bottom: 4px;
                word-break: break-word;

                .reply-to {
                  color: #409eff;
                  margin-right: 4px;
                }
              }

              .reply-actions {
                display: flex;
                gap: 12px;
              }
            }
          }

          .load-more-replies {
            padding: 8px 0;
            font-size: 13px;
            color: #409eff;
            cursor: pointer;

            &:hover {
              color: #66b1ff;
            }
          }
        }
      }
    }

    .load-more {
      text-align: center;
      padding: 16px 0;
    }
  }
}
</style>
