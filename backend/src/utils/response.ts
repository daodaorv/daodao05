/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 */
export function successResponse<T>(data: T, message = 'success'): {
  code: number;
  message: string;
  data: T;
} {
  return {
    code: 0,
    message,
    data,
  };
}

/**
 * 错误响应
 */
export function errorResponse(message: string, code = 500, details?: unknown): {
  code: number;
  message: string;
  data: unknown;
} {
  return {
    code,
    message,
    data: details || null,
  };
}

/**
 * 分页响应
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
} {
  return {
    code: 0,
    message: 'success',
    data: {
      list: data,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    },
  };
}
