import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  BUSINESS = 'business',
  UNKNOWN = 'unknown'
}

/**
 * 错误处理 Composable
 *
 * @description 统一管理错误处理逻辑，区分不同错误类型并提供友好的错误提示
 *
 * @example
 * ```ts
 * const { handleError, handleApiError } = useErrorHandler()
 *
 * try {
 *   await api.getData()
 * } catch (error) {
 *   handleApiError(error, '获取数据失败')
 * }
 * ```
 */
export function useErrorHandler() {
  /**
   * 获取错误类型
   */
  const getErrorType = (error: any): ErrorType => {
    // 网络错误
    if (error.message?.includes('Network') || error.code === 'ERR_NETWORK') {
      return ErrorType.NETWORK
    }

    // 超时错误
    if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
      return ErrorType.TIMEOUT
    }

    // HTTP 状态码错误
    if (error.response) {
      const status = error.response.status
      if (status === 401) return ErrorType.UNAUTHORIZED
      if (status === 403) return ErrorType.FORBIDDEN
      if (status === 404) return ErrorType.NOT_FOUND
      if (status >= 500) return ErrorType.SERVER
    }

    // 业务错误
    if (error.code && error.code !== 200) {
      return ErrorType.BUSINESS
    }

    return ErrorType.UNKNOWN
  }

  /**
   * 获取错误消息
   */
  const getErrorMessage = (error: any, defaultMessage = '操作失败'): string => {
    const errorType = getErrorType(error)

    switch (errorType) {
      case ErrorType.NETWORK:
        return '网络连接失败，请检查网络设置'
      case ErrorType.TIMEOUT:
        return '请求超时，请稍后重试'
      case ErrorType.UNAUTHORIZED:
        return '登录已过期，请重新登录'
      case ErrorType.FORBIDDEN:
        return '没有权限执行此操作'
      case ErrorType.NOT_FOUND:
        return '请求的资源不存在'
      case ErrorType.SERVER:
        return '服务器错误，请稍后重试'
      case ErrorType.BUSINESS:
        return error.message || error.msg || defaultMessage
      default:
        return error.message || defaultMessage
    }
  }

  /**
   * 处理错误
   * @param error 错误对象
   * @param defaultMessage 默认错误消息
   * @param showMessage 是否显示错误消息
   */
  const handleError = (
    error: any,
    defaultMessage = '操作失败',
    showMessage = true
  ): void => {
    console.error('错误详情:', error)

    const errorType = getErrorType(error)
    const message = getErrorMessage(error, defaultMessage)

    if (showMessage) {
      // 未授权错误，显示确认框
      if (errorType === ErrorType.UNAUTHORIZED) {
        ElMessageBox.confirm(
          '登录已过期，请重新登录',
          '提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 跳转到登录页
          window.location.href = '/login'
        }).catch(() => {
          // 用户取消
        })
      } else {
        // 其他错误，显示消息提示
        ElMessage.error(message)
      }
    }
  }

  /**
   * 处理 API 错误
   * @param error 错误对象
   * @param defaultMessage 默认错误消息
   */
  const handleApiError = (error: any, defaultMessage = '操作失败'): void => {
    handleError(error, defaultMessage, true)
  }

  /**
   * 处理表单验证错误
   * @param error 错误对象
   */
  const handleValidationError = (error: any): void => {
    console.error('表单验证失败:', error)
    ElMessage.warning('请检查表单填写是否正确')
  }

  /**
   * 处理文件上传错误
   * @param error 错误对象
   */
  const handleUploadError = (error: any): void => {
    const message = getErrorMessage(error, '文件上传失败')
    ElMessage.error(message)
  }

  /**
   * 处理批量操作错误
   * @param errors 错误数组
   * @param successCount 成功数量
   * @param totalCount 总数量
   */
  const handleBatchError = (
    errors: any[],
    successCount: number,
    totalCount: number
  ): void => {
    if (errors.length === 0) {
      ElMessage.success(`批量操作成功，共处理 ${totalCount} 条`)
    } else if (successCount === 0) {
      ElMessage.error(`批量操作失败，共 ${totalCount} 条`)
    } else {
      ElMessage.warning(
        `批量操作部分成功，成功 ${successCount} 条，失败 ${errors.length} 条`
      )
    }
  }

  /**
   * 创建错误处理包装器
   * @param fn 异步函数
   * @param defaultMessage 默认错误消息
   */
  const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    defaultMessage = '操作失败'
  ): T => {
    return (async (...args: any[]) => {
      try {
        return await fn(...args)
      } catch (error) {
        handleError(error, defaultMessage)
        throw error
      }
    }) as T
  }

  /**
   * 安全执行异步函数
   * @param fn 异步函数
   * @param defaultMessage 默认错误消息
   * @param showMessage 是否显示错误消息
   */
  const safeExecute = async <T>(
    fn: () => Promise<T>,
    defaultMessage = '操作失败',
    showMessage = true
  ): Promise<T | null> => {
    try {
      return await fn()
    } catch (error) {
      handleError(error, defaultMessage, showMessage)
      return null
    }
  }

  return {
    getErrorType,
    getErrorMessage,
    handleError,
    handleApiError,
    handleValidationError,
    handleUploadError,
    handleBatchError,
    withErrorHandler,
    safeExecute
  }
}
