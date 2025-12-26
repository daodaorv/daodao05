import { RowDataPacket } from 'mysql2';

/**
 * 帮助文章
 */
export interface HelpArticle extends RowDataPacket {
  id: number;
  category_id: number;
  title: string;
  content: string;
  view_count: number;
  helpful_count: number;
  sort_order: number;
  status: 'published' | 'draft';
  created_at: Date;
  updated_at: Date;
}

/**
 * 帮助分类
 */
export interface HelpCategory extends RowDataPacket {
  id: number;
  name: string;
  icon?: string;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
