/**
 * Mock配置文件
 * 定义Mock数据的通用配置和工具函数
 */

// Mock延迟配置（模拟网络请求延迟）
export const MOCK_DELAY = 300; // 毫秒

// Mock分页配置
export const MOCK_PAGE_SIZE = 10;

/**
 * 模拟异步请求延迟
 */
export function mockDelay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成Mock ID
 */
export function generateMockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 分页数据处理
 */
export function paginateData<T>(data: T[], page: number = 1, pageSize: number = MOCK_PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    list: data.slice(start, end),
    total: data.length,
    page,
    pageSize,
    hasMore: end < data.length
  };
}
