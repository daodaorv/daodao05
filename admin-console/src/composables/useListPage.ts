import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 列表页面通用逻辑 Composable
 *
 * @description 统一管理列表页面的搜索、分页、加载等逻辑，减少代码重复
 *
 * @example
 * ```ts
 * const {
 *   searchForm,
 *   list,
 *   loading,
 *   pagination,
 *   handleSearch,
 *   handleReset,
 *   handleSizeChange,
 *   handleCurrentChange,
 *   fetchList
 * } = useListPage(userApi.getUserList, {
 *   username: '',
 *   phone: '',
 *   status: ''
 * })
 * ```
 */
export function useListPage<T = any>(
  fetchFn: (params: any) => Promise<any>,
  initialSearchForm: Record<string, any> = {},
  options: {
    pageSize?: number
    immediate?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
  } = {}
) {
  const {
    pageSize = 10,
    immediate = true,
    onSuccess,
    onError
  } = options

  // 搜索表单状态
  const searchForm = reactive({ ...initialSearchForm })

  // 列表数据
  const list = ref<T[]>([])

  // 加载状态
  const loading = ref(false)

  // 分页状态
  const pagination = reactive({
    page: 1,
    pageSize,
    total: 0
  })

  // 是否有数据
  const hasData = computed(() => list.value.length > 0)

  // 是否为空
  const isEmpty = computed(() => !loading.value && list.value.length === 0)

  /**
   * 获取列表数据
   */
  const fetchList = async () => {
    loading.value = true
    try {
      const params = {
        ...searchForm,
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      const response = await fetchFn(params)

      // 处理响应数据
      if (response.code === 200) {
        list.value = response.data.list || response.data.items || response.data || []
        pagination.total = response.data.total || response.data.count || 0

        // 成功回调
        onSuccess?.(response.data)
      } else if (response.code === 401) {
        // 处理未授权
        ElMessage.error('登录已过期，请重新登录')
        // 可以在这里触发跳转到登录页
      } else {
        // 处理业务错误
        ElMessage.error(response.message || '获取列表失败')
        list.value = []
        pagination.total = 0
      }
    } catch (error: any) {
      // 处理网络错误
      console.error('获取列表失败:', error)

      if (error.message?.includes('timeout')) {
        ElMessage.error('请求超时，请重试')
      } else if (error.message?.includes('Network')) {
        ElMessage.error('网络连接失败，请检查网络')
      } else {
        ElMessage.error(error.message || '获取列表失败')
      }

      list.value = []
      pagination.total = 0

      // 错误回调
      onError?.(error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 搜索处理
   */
  const handleSearch = () => {
    pagination.page = 1
    fetchList()
  }

  /**
   * 重置处理
   */
  const handleReset = () => {
    // 重置搜索表单
    Object.keys(searchForm).forEach(key => {
      const value = initialSearchForm[key]
      if (Array.isArray(value)) {
        searchForm[key] = []
      } else if (typeof value === 'number') {
        searchForm[key] = 0
      } else if (typeof value === 'boolean') {
        searchForm[key] = false
      } else {
        searchForm[key] = ''
      }
    })

    // 重置分页
    pagination.page = 1

    // 重新获取数据
    fetchList()
  }

  /**
   * 每页条数变化处理
   */
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.page = 1
    fetchList()
  }

  /**
   * 当前页变化处理
   */
  const handleCurrentChange = (page: number) => {
    pagination.page = page
    fetchList()
  }

  /**
   * 刷新当前页
   */
  const refresh = () => {
    fetchList()
  }

  /**
   * 刷新并回到第一页
   */
  const refreshToFirst = () => {
    pagination.page = 1
    fetchList()
  }

  // 立即加载
  if (immediate) {
    fetchList()
  }

  return {
    // 状态
    searchForm,
    list,
    loading,
    pagination,
    hasData,
    isEmpty,

    // 方法
    fetchList,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    refresh,
    refreshToFirst
  }
}
