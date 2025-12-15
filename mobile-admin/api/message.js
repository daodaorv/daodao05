/**
 * 消息通知相关 API
 */
import request from '@/utils/request'
import mockData from './mock/message'

// 是否使用 Mock 数据
const USE_MOCK = true

/**
 * 获取消息列表
 * @param {Object} params - 查询参数
 * @param {String} params.type - 消息类型 system/order/ticket
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页数量
 * @returns {Promise}
 */
export function getMessageList(params = {}) {
  if (USE_MOCK) {
    return mockData.getMessageList(params)
  }

  return request({
    url: '/api/v1/messages',
    method: 'GET',
    params
  })
}

/**
 * 获取消息详情
 * @param {String} id - 消息ID
 * @returns {Promise}
 */
export function getMessageDetail(id) {
  if (USE_MOCK) {
    return mockData.getMessageDetail(id)
  }

  return request({
    url: `/api/v1/messages/${id}`,
    method: 'GET'
  })
}

/**
 * 标记消息已读
 * @param {String} id - 消息ID
 * @returns {Promise}
 */
export function markMessageRead(id) {
  if (USE_MOCK) {
    return mockData.markMessageRead(id)
  }

  return request({
    url: `/api/v1/messages/${id}/read`,
    method: 'PUT'
  })
}

/**
 * 批量标记消息已读
 * @param {Array} ids - 消息ID数组
 * @returns {Promise}
 */
export function markMessagesRead(ids) {
  if (USE_MOCK) {
    return mockData.markMessagesRead(ids)
  }

  return request({
    url: '/api/v1/messages/read',
    method: 'PUT',
    data: { ids }
  })
}

/**
 * 删除消息
 * @param {String} id - 消息ID
 * @returns {Promise}
 */
export function deleteMessage(id) {
  if (USE_MOCK) {
    return mockData.deleteMessage(id)
  }

  return request({
    url: `/api/v1/messages/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise}
 */
export function getUnreadCount() {
  if (USE_MOCK) {
    return mockData.getUnreadCount()
  }

  return request({
    url: '/api/v1/messages/unread-count',
    method: 'GET'
  })
}

export default {
  getMessageList,
  getMessageDetail,
  markMessageRead,
  markMessagesRead,
  deleteMessage,
  getUnreadCount
}
