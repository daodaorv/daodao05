import { RowDataPacket } from 'mysql2';

/**
 * 操作日志状态
 */
export enum OperationStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

/**
 * 操作日志接口
 */
export interface OperationLog extends RowDataPacket {
  id: number;
  user_id: number;
  operator: string;
  operator_avatar?: string;
  module: string;
  action: string;
  description?: string;
  ip?: string;
  user_agent?: string;
  status: OperationStatus;
  duration?: number;
  request_params?: string;
  response_data?: string;
  error_message?: string;
  created_at: Date;
}
