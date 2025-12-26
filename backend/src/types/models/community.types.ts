import { RowDataPacket } from 'mysql2';

/**
 * 社区帖子
 */
export interface CommunityPost extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  content: string;
  images?: string;
  location?: string;
  tags?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_top: boolean;
  status: 'published' | 'hidden' | 'deleted';
  created_at: Date;
  updated_at: Date;
}

/**
 * 帖子评论
 */
export interface PostComment extends RowDataPacket {
  id: number;
  post_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  like_count: number;
  created_at: Date;
}

/**
 * 帖子点赞
 */
export interface PostLike extends RowDataPacket {
  id: number;
  post_id: number;
  user_id: number;
  created_at: Date;
}
