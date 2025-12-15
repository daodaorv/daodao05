/**
 * 组件类型定义
 */

// 公告通知类型
export interface Notice {
    id: string;
    content: string;
    link?: string;
    type?: 'info' | 'warning' | 'error';
}

// 对话框类型
export type DialogType = 'success' | 'error' | 'warn' | 'info';
export type DialogMode = 'base' | 'input';
