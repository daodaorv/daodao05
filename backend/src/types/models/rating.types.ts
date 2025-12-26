import { RowDataPacket } from 'mysql2';

/**
 * 评价
 */
export interface Rating extends RowDataPacket {
  id: number;
  user_id: number;
  order_id: number;
  rating: number;
  content: string;
  images?: string;
  created_at: Date;
  updated_at: Date;
}
