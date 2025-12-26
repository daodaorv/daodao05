/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 */
export function successResponse<T>(data: T, message = 'success') {
  return {
    code: 0,
    message,
    data,
  };
}

/**
 * 错误响应
 */
export function errorResponse(message: string, code = 500, details?: unknown) {
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
) {
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
