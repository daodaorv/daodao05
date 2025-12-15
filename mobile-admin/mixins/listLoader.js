/**
 * 列表加载通用 Mixin
 * 用于订单列表、车辆列表等页面的通用加载逻辑
 *
 * 使用方法：
 * 1. 在组件中引入：import listLoaderMixin from '@/mixins/listLoader'
 * 2. 在 mixins 中使用：mixins: [listLoaderMixin]
 * 3. 在组件中配置：
 *    - listConfig.apiMethod: API 方法
 *    - listConfig.listKey: 数据列表的 key（如 'orderList', 'vehicleList'）
 *    - listConfig.errorMessage: 错误提示信息
 */

export default {
  data() {
    return {
      // 搜索关键词
      searchKeyword: '',
      // 当前状态
      currentStatus: 'all',
      // 当前状态索引
      currentStatusIndex: 0,
      // 加载状态
      loading: false,
      // 列表配置（需要在组件中覆盖）
      listConfig: {
        apiMethod: null,        // API 方法
        listKey: 'list',        // 数据列表的 key
        errorMessage: '加载失败' // 错误提示信息
      }
    }
  },

  methods: {
    /**
     * 通用列表加载方法
     * @returns {Promise<void>}
     */
    async loadList() {
      // 空值检查：确保 API 方法已配置
      if (!this.listConfig.apiMethod) {
        console.error('listConfig.apiMethod is not configured')
        return
      }

      this.loading = true
      try {
        // 构建请求参数
        const params = this.buildRequestParams()

        // 调用 API 方法
        const data = await this.listConfig.apiMethod(params)

        // 边界检查：确保返回的数据是数组
        const list = Array.isArray(data?.list) ? data.list : []

        // 更新列表数据
        this[this.listConfig.listKey] = list

        // 更新状态计数
        if (this.updateStatusCount) {
          this.updateStatusCount()
        }
      } catch (error) {
        this.handleLoadError(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * 构建请求参数
     * @returns {Object} 请求参数对象
     */
    buildRequestParams() {
      const params = {}

      // 添加状态筛选
      if (this.currentStatus !== 'all') {
        params.status = this.currentStatus
      }

      // 添加搜索关键词
      if (this.searchKeyword) {
        params.keyword = this.searchKeyword
      }

      return params
    },

    /**
     * 处理加载错误
     * @param {unknown} error - 错误对象
     */
    handleLoadError(error) {
      // 类型安全的错误处理
      if (error instanceof Error) {
        console.error(`${this.listConfig.errorMessage}:`, error.message)
      } else {
        console.error(`${this.listConfig.errorMessage}:`, String(error))
      }

      uni.showToast({
        title: `${this.listConfig.errorMessage}，请重试`,
        icon: 'none'
      })
    },

    /**
     * 切换状态标签
     * @param {Object|number} e - 事件对象或索引
     */
    changeStatus(e) {
      const index = e.index !== undefined ? e.index : e

      // 边界检查：确保索引有效
      if (index < 0 || index >= this.statusTabs.length) {
        console.error('Invalid tab index:', index)
        return
      }

      this.currentStatusIndex = index
      this.currentStatus = this.statusTabs[index].value
      this.loadList()
    },

    /**
     * 处理搜索
     */
    handleSearch() {
      this.loadList()
    },

    /**
     * 清除搜索
     */
    handleClear() {
      this.searchKeyword = ''
      this.loadList()
    }
  },

  /**
   * 页面加载时自动加载列表
   */
  onLoad() {
    this.loadList()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadList().then(() => {
      uni.stopPullDownRefresh()
    })
  }
}
