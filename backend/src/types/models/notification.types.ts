import { RowDataPacket } from 'mysql2';

/**
 * 通知类型
 */
export interface Notification extends RowDataPacket {
  id: number;
  user_id: number;
  type: 'system' | 'order' | 'payment' | 'promotion' | 'activity';
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}
