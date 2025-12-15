/**
 * 帮助中心API
 * 提供帮助文章和客服相关的接口服务
 */

import { request } from '@/utils/request'

/**
 * 帮助分类
 */
export interface HelpCategory {
  id: string
  name: string
  icon: string
  articleCount: number
  order: number
}

/**
 * 帮助文章
 */
export interface HelpArticle {
  id: string
  categoryId: string
  categoryName: string
  title: string
  summary: string
  content: string
  views: number
  helpful: number
  isHot: boolean
  createdAt: string
  updatedAt?: string
}

/**
 * 帮助文章列表查询参数
 */
export interface HelpArticleListParams {
  categoryId?: string
  keyword?: string
  page?: number
  pageSize?: number
}

/**
 * 帮助文章列表响应
 */
export interface HelpArticleListResponse {
  list: HelpArticle[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 获取帮助分类列表
 */
export const getHelpCategories = () => {
  return request<HelpCategory[]>({
    url: '/api/v1/help/categories',
    method: 'GET'
  })
}

/**
 * 获取帮助文章列表
 */
export const getHelpArticles = (params: HelpArticleListParams) => {
  return request<HelpArticleListResponse>({
    url: '/api/v1/help/articles',
    method: 'GET',
    data: params
  })
}

/**
 * 获取帮助文章详情
 */
export const getHelpArticleDetail = (id: string) => {
  return request<HelpArticle>({
    url: `/api/v1/help/articles/${id}`,
    method: 'GET'
  })
}

/**
 * 搜索帮助文章
 */
export const searchHelpArticles = (keyword: string) => {
  return request<HelpArticle[]>({
    url: '/api/v1/help/search',
    method: 'GET',
    data: { keyword }
  })
}

/**
 * 获取热门问题
 */
export const getHotArticles = () => {
  return request<HelpArticle[]>({
    url: '/api/v1/help/hot',
    method: 'GET'
  })
}

/**
 * 标记文章有帮助
 */
export const markArticleHelpful = (id: string) => {
  return request({
    url: `/api/v1/help/articles/${id}/helpful`,
    method: 'POST'
  })
}

// ==================== Mock 数据 ====================

/**
 * Mock: 获取帮助分类列表
 */
export const mockGetHelpCategories = (): Promise<HelpCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'cat_001',
          name: '租车相关',
          icon: 'car',
          articleCount: 12,
          order: 1
        },
        {
          id: 'cat_002',
          name: '营地预订',
          icon: 'home',
          articleCount: 8,
          order: 2
        },
        {
          id: 'cat_003',
          name: '房车旅游',
          icon: 'map',
          articleCount: 10,
          order: 3
        },
        {
          id: 'cat_004',
          name: '支付问题',
          icon: 'rmb',
          articleCount: 6,
          order: 4
        },
        {
          id: 'cat_005',
          name: '会员服务',
          icon: 'level',
          articleCount: 5,
          order: 5
        },
        {
          id: 'cat_006',
          name: '其他问题',
          icon: 'question-circle',
          articleCount: 8,
          order: 6
        }
      ])
    }, 300)
  })
}

/**
 * Mock: 获取帮助文章列表
 */
export const mockGetHelpArticles = (params: HelpArticleListParams): Promise<HelpArticleListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockArticles: HelpArticle[] = [
        {
          id: 'article_001',
          categoryId: 'cat_001',
          categoryName: '租车相关',
          title: '如何预订房车？',
          summary: '详细介绍房车预订的完整流程和注意事项',
          content: `# 如何预订房车？

## 预订流程

1. **选择取还车信息**
   - 在首页选择取车城市和门店
   - 选择取车和还车时间
   - 支持异地还车（部分城市）

2. **浏览房车列表**
   - 查看可用房车
   - 对比不同车型
   - 查看详细配置和价格

3. **确认订单**
   - 选择保险方案
   - 添加附加服务
   - 填写联系人信息

4. **完成支付**
   - 选择支付方式
   - 完成订单支付
   - 获得预订凭证

## 注意事项

- 请提前预订，特别是节假日期间
- 取车时需携带驾驶证和身份证
- 建议购买全险以获得更好的保障`,
          views: 1250,
          helpful: 89,
          isHot: true,
          createdAt: '2025-11-01T10:00:00+08:00'
        },
        {
          id: 'article_002',
          categoryId: 'cat_001',
          categoryName: '租车相关',
          title: '取车时需要准备什么证件？',
          summary: '取车所需证件和材料清单',
          content: `# 取车时需要准备什么证件？

## 必备证件

1. **驾驶证**
   - 必须是有效的C1及以上驾照
   - 驾龄要求1年以上
   - 需在有效期内

2. **身份证**
   - 本人有效身份证原件
   - 需与预订信息一致

3. **信用卡或储蓄卡**
   - 用于支付押金
   - 建议额度充足

## 其他材料

- 预订确认单（电子版或纸质版）
- 联系人信息
- 紧急联系人电话`,
          views: 980,
          helpful: 76,
          isHot: true,
          createdAt: '2025-11-02T14:30:00+08:00'
        },
        {
          id: 'article_003',
          categoryId: 'cat_001',
          categoryName: '租车相关',
          title: '房车保险如何选择？',
          summary: '详细对比三种保险方案的区别和适用场景',
          content: `# 房车保险如何选择？

## 保险方案对比

### 基础险（50元/天）
- 第三者责任险
- 适合经验丰富的驾驶员

### 标准险（80元/天）
- 基础险内容
- 车辆损失险（80%赔付）
- 推荐大多数用户选择

### 全险（120元/天）
- 标准险内容
- 车辆损失险（100%赔付）
- 驾乘意外险
- 最全面的保障

## 选择建议

- 新手建议选择全险
- 长途旅行建议选择全险
- 短途市内可选择标准险`,
          views: 856,
          helpful: 65,
          isHot: false,
          createdAt: '2025-11-03T09:15:00+08:00'
        },
        {
          id: 'article_004',
          categoryId: 'cat_002',
          categoryName: '营地预订',
          title: '如何预订营地？',
          summary: '营地预订流程和注意事项说明',
          content: `# 如何预订营地？

## 预订流程

1. 浏览营地列表
2. 查看营地详情
3. 选择营位类型
4. 选择入住日期
5. 填写入住信息
6. 完成支付

## 营位类型

- 标准营位：适合小型房车
- 豪华营位A：配备水电桩
- 豪华营位B：湖景位置

## 注意事项

- 入住时间：14:00后
- 退房时间：12:00前
- 提前3天以上取消可全额退款`,
          views: 645,
          helpful: 52,
          isHot: false,
          createdAt: '2025-11-05T16:20:00+08:00'
        },
        {
          id: 'article_005',
          categoryId: 'cat_004',
          categoryName: '支付问题',
          title: '支持哪些支付方式？',
          summary: '平台支持的支付方式和使用说明',
          content: `# 支持哪些支付方式？

## 支付方式

1. **微信支付**
   - 支持信用卡、借记卡、零钱
   - 即时到账

2. **支付宝**
   - 支持余额、花呗、银行卡
   - 即时到账

3. **余额支付**
   - 使用账户余额直接支付
   - 优先抵扣

## 组合支付

- 最多支持2种支付方式组合
- 优先使用余额，不足部分使用其他方式

## 支付限额

- 单笔支付限额：50,000元
- 日累计支付限额：200,000元`,
          views: 723,
          helpful: 58,
          isHot: true,
          createdAt: '2025-11-06T11:45:00+08:00'
        }
      ]

      // 根据参数筛选
      let filteredArticles = mockArticles
      if (params.categoryId) {
        filteredArticles = filteredArticles.filter(a => a.categoryId === params.categoryId)
      }
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        filteredArticles = filteredArticles.filter(a =>
          a.title.toLowerCase().includes(keyword) ||
          a.summary.toLowerCase().includes(keyword)
        )
      }

      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredArticles.slice(start, end)

      resolve({
        list,
        total: filteredArticles.length,
        page,
        pageSize,
        hasMore: end < filteredArticles.length
      })
    }, 500)
  })
}

/**
 * Mock: 获取帮助文章详情
 */
export const mockGetHelpArticleDetail = (id: string): Promise<HelpArticle> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        categoryId: 'cat_001',
        categoryName: '租车相关',
        title: '如何预订房车？',
        summary: '详细介绍房车预订的完整流程和注意事项',
        content: `# 如何预订房车？

## 预订流程

1. **选择取还车信息**
   - 在首页选择取车城市和门店
   - 选择取车和还车时间
   - 支持异地还车（部分城市）

2. **浏览房车列表**
   - 查看可用房车
   - 对比不同车型
   - 查看详细配置和价格

3. **确认订单**
   - 选择保险方案
   - 添加附加服务
   - 填写联系人信息

4. **完成支付**
   - 选择支付方式
   - 完成订单支付
   - 获得预订凭证

## 注意事项

- 请提前预订，特别是节假日期间
- 取车时需携带驾驶证和身份证
- 建议购买全险以获得更好的保障

## 常见问题

**Q: 可以提前多久预订？**
A: 建议至少提前3天预订，节假日建议提前7-15天。

**Q: 预订后可以取消吗？**
A: 取车前24小时以上可免费取消，24小时内取消需扣除10%手续费。

**Q: 异地还车需要额外费用吗？**
A: 是的，异地还车会产生额外费用，具体金额根据距离计算。`,
        views: 1250,
        helpful: 89,
        isHot: true,
        createdAt: '2025-11-01T10:00:00+08:00'
      })
    }, 500)
  })
}

/**
 * Mock: 获取热门问题
 */
export const mockGetHotArticles = (): Promise<HelpArticle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'article_001',
          categoryId: 'cat_001',
          categoryName: '租车相关',
          title: '如何预订房车？',
          summary: '详细介绍房车预订的完整流程和注意事项',
          content: '',
          views: 1250,
          helpful: 89,
          isHot: true,
          createdAt: '2025-11-01T10:00:00+08:00'
        },
        {
          id: 'article_002',
          categoryId: 'cat_001',
          categoryName: '租车相关',
          title: '取车时需要准备什么证件？',
          summary: '取车所需证件和材料清单',
          content: '',
          views: 980,
          helpful: 76,
          isHot: true,
          createdAt: '2025-11-02T14:30:00+08:00'
        },
        {
          id: 'article_005',
          categoryId: 'cat_004',
          categoryName: '支付问题',
          title: '支持哪些支付方式？',
          summary: '平台支持的支付方式和使用说明',
          content: '',
          views: 723,
          helpful: 58,
          isHot: true,
          createdAt: '2025-11-06T11:45:00+08:00'
        }
      ])
    }, 300)
  })
}
