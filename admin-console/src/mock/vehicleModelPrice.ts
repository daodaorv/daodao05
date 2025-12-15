// @ts-nocheck
/**
 * 车型价格管理 Mock 数据
 */

import type {
  VehicleModelPriceGroup,
  VehicleModelPriceHistory,
  VehicleModelPriceGroupListParams,
  VehicleModelPriceGroupListResponse,
  VehicleModelPriceHistoryListParams,
  VehicleModelPriceHistoryListResponse,
  UpdateModelPriceRequest,
  UpdateModelPriceResponse,
  BatchUpdatePriceRequest,
  BatchUpdatePriceResponse,
  CreatePriceGroupRequest,
  CreatePriceGroupResponse,
  JoinPriceGroupRequest,
  JoinPriceGroupResponse,
  UpdateGroupPriceRequest,
  UpdateGroupPriceResponse,
  LeaveGroupRequest,
  LeaveGroupResponse,
} from '../types/vehicleModel'

// 车型价格分组 Mock 数据
export const mockVehicleModelPriceGroups: VehicleModelPriceGroup[] = [
  {
    id: 1,
    groupName: '经济型',
    groupCode: 'ECONOMY',
    basePrice: 500,
    vehicleTypes: ['trailer'],
    description: '经济实惠的拖挂房车，适合预算有限的用户',
    vehicleCount: 1,
    status: 'active',
    createdBy: '系统管理员',
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-11-20 14:30:00',
  },
  {
    id: 2,
    groupName: '标准型',
    groupCode: 'STANDARD',
    basePrice: 600,
    vehicleTypes: ['b_type'],
    description: 'B型房车标准配置，灵活便捷',
    vehicleCount: 2,
    status: 'active',
    createdBy: '系统管理员',
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-11-20 14:30:00',
  },
  {
    id: 3,
    groupName: '豪华型',
    groupCode: 'LUXURY',
    basePrice: 800,
    vehicleTypes: ['c_type'],
    description: 'C型房车豪华配置，空间宽敞舒适',
    vehicleCount: 2,
    status: 'active',
    createdBy: '系统管理员',
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-11-20 14:30:00',
  },
  {
    id: 4,
    groupName: '顶级豪华型',
    groupCode: 'PREMIUM',
    basePrice: 1200,
    vehicleTypes: ['b_type', 'c_type'],
    description: '顶级豪华配置，高端体验',
    vehicleCount: 1,
    status: 'active',
    createdBy: '系统管理员',
    createdAt: '2024-01-10 10:00:00',
    updatedAt: '2024-11-20 14:30:00',
  },
]

// 车型价格变更历史 Mock 数据
export const mockVehicleModelPriceHistory: VehicleModelPriceHistory[] = [
  {
    id: 1,
    modelId: 1,
    modelName: 'RV80 C型房车',
    oldPrice: 750,
    newPrice: 800,
    changeType: 'manual',
    changeReason: '市场需求增加，调整价格',
    remark: '旺季价格调整',
    changedBy: '张三',
    changedAt: '2024-11-20 14:30:00',
  },
  {
    id: 2,
    modelId: 2,
    modelName: '全顺B型房车',
    oldPrice: 550,
    newPrice: 600,
    changeType: 'group_sync',
    changeReason: '加入标准型价格分组',
    remark: '自动同步分组价格',
    changedBy: '系统',
    changedAt: '2024-11-18 09:15:00',
  },
  {
    id: 3,
    modelId: 3,
    modelName: '欧胜拖挂房车',
    oldPrice: 480,
    newPrice: 500,
    changeType: 'group_sync',
    changeReason: '加入经济型价格分组',
    remark: '自动同步分组价格',
    changedBy: '系统',
    changedAt: '2024-11-15 16:45:00',
  },
  {
    id: 4,
    modelId: 4,
    modelName: 'Sprinter 豪华B型',
    oldPrice: 1150,
    newPrice: 1200,
    changeType: 'manual',
    changeReason: '配置升级，价格调整',
    remark: '增加了新的豪华配置',
    changedBy: '李四',
    changedAt: '2024-11-25 10:00:00',
  },
  {
    id: 5,
    modelId: 5,
    modelName: '特顺C型房车',
    oldPrice: 620,
    newPrice: 650,
    changeType: 'batch',
    changeReason: '批量调价：成本上涨',
    remark: '与其他C型房车一起调整',
    changedBy: '王五',
    changedAt: '2024-11-22 13:20:00',
  },
  {
    id: 6,
    modelId: 1,
    modelName: 'RV80 C型房车',
    oldPrice: 800,
    newPrice: 750,
    changeType: 'manual',
    changeReason: '淡季促销',
    remark: '冬季淡季价格调整',
    changedBy: '张三',
    changedAt: '2024-12-01 10:00:00',
  },
]

/**
 * 获取价格分组列表
 */
export const mockGetPriceGroups = (params: VehicleModelPriceGroupListParams) => {
  const { page = 1, pageSize = 10, status, vehicleType, keyword } = params

  // 过滤数据
  let filteredData = [...mockVehicleModelPriceGroups]

  if (status) {
    filteredData = filteredData.filter(item => item.status === status)
  }

  if (vehicleType) {
    filteredData = filteredData.filter(item => item.vehicleTypes.includes(vehicleType))
  }

  if (keyword) {
    filteredData = filteredData.filter(
      item =>
        item.groupName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.groupCode.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  })
}

/**
 * 获取价格分组详情
 */
export const mockGetPriceGroupDetail = (id: number) => {
  const group = mockVehicleModelPriceGroups.find(item => item.id === id)

  if (!group) {
    return Promise.reject({
      code: 404,
      message: '价格分组不存在',
    })
  }

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: group,
  })
}

/**
 * 创建价格分组
 */
export const mockCreatePriceGroup = (data: CreatePriceGroupRequest): Promise<CreatePriceGroupResponse> => {
  const newGroup: VehicleModelPriceGroup = {
    id: mockVehicleModelPriceGroups.length + 1,
    groupName: data.groupName,
    groupCode: data.groupCode,
    basePrice: data.basePrice,
    vehicleTypes: data.vehicleTypes,
    description: data.description || '',
    vehicleCount: 0,
    status: 'active',
    createdBy: '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockVehicleModelPriceGroups.unshift(newGroup)

  return Promise.resolve({
    success: true,
    data: newGroup,
    message: '创建成功',
  })
}

/**
 * 更新价格分组
 */
export const mockUpdatePriceGroup = (id: number, data: Partial<VehicleModelPriceGroup>) => {
  const index = mockVehicleModelPriceGroups.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '价格分组不存在',
    })
  }

  const updatedGroup = {
    ...mockVehicleModelPriceGroups[index],
    ...data,
    updatedAt: new Date().toLocaleString('zh-CN'),
  }

  mockVehicleModelPriceGroups[index] = updatedGroup

  return Promise.resolve({
    code: 200,
    message: '更新成功',
    data: updatedGroup,
  })
}

/**
 * 删除价格分组
 */
export const mockDeletePriceGroup = (id: number) => {
  const index = mockVehicleModelPriceGroups.findIndex(item => item.id === id)

  if (index === -1) {
    return Promise.reject({
      code: 404,
      message: '价格分组不存在',
    })
  }

  // 检查是否有关联车型
  if (mockVehicleModelPriceGroups[index].vehicleCount > 0) {
    return Promise.reject({
      code: 400,
      message: '该分组下还有车型，无法删除',
    })
  }

  mockVehicleModelPriceGroups.splice(index, 1)

  return Promise.resolve({
    code: 200,
    message: '删除成功',
  })
}

/**
 * 获取价格历史记录列表
 */
export const mockGetPriceHistory = (params: VehicleModelPriceHistoryListParams) => {
  const { page = 1, pageSize = 10, modelId, startDate, endDate, changeType, keyword } = params

  // 过滤数据
  let filteredData = [...mockVehicleModelPriceHistory]

  if (modelId) {
    filteredData = filteredData.filter(item => item.modelId === modelId)
  }

  if (startDate) {
    filteredData = filteredData.filter(item => item.changedAt >= startDate)
  }

  if (endDate) {
    filteredData = filteredData.filter(item => item.changedAt <= endDate)
  }

  if (changeType) {
    filteredData = filteredData.filter(item => item.changeType === changeType)
  }

  if (keyword) {
    filteredData = filteredData.filter(
      item =>
        item.modelName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.changeReason.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  // 分页
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return Promise.resolve({
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize,
    },
  })
}

/**
 * 更新车型价格
 */
export const mockUpdateModelPrice = (data: UpdateModelPriceRequest): Promise<UpdateModelPriceResponse> => {
  // 这里需要导入 mockVehicleModels，但为了避免循环依赖，暂时返回模拟数据
  const newHistory: VehicleModelPriceHistory = {
    id: mockVehicleModelPriceHistory.length + 1,
    modelId: data.modelId,
    modelName: '车型名称', // 实际应从 mockVehicleModels 获取
    oldPrice: 800, // 实际应从 mockVehicleModels 获取
    newPrice: data.newPrice,
    changeType: 'manual',
    changeReason: data.changeReason,
    remark: data.remark,
    changedBy: '当前用户',
    changedAt: new Date().toLocaleString('zh-CN'),
  }

  mockVehicleModelPriceHistory.unshift(newHistory)

  return Promise.resolve({
    success: true,
    data: {
      model: {} as any, // 实际应返回更新后的车型数据
      priceHistory: newHistory,
    },
    message: '价格更新成功',
  })
}

/**
 * 批量更新车型价格
 */
export const mockBatchUpdatePrice = (data: BatchUpdatePriceRequest): Promise<BatchUpdatePriceResponse> => {
  const successModels: any[] = []
  const failureModels: Array<{ modelId: number; modelName: string; reason: string }> = []
  const priceHistories: VehicleModelPriceHistory[] = []

  data.modelIds.forEach(modelId => {
    // 模拟成功
    const newHistory: VehicleModelPriceHistory = {
      id: mockVehicleModelPriceHistory.length + priceHistories.length + 1,
      modelId,
      modelName: `车型${modelId}`,
      oldPrice: 800,
      newPrice: data.adjustType === 'unified' ? data.adjustValue : 800 + data.adjustValue,
      changeType: 'batch',
      changeReason: data.changeReason,
      remark: data.remark,
      changedBy: '当前用户',
      changedAt: new Date().toLocaleString('zh-CN'),
    }

    priceHistories.push(newHistory)
    successModels.push({ id: modelId })
  })

  // 将历史记录添加到 mock 数据
  mockVehicleModelPriceHistory.unshift(...priceHistories)

  return Promise.resolve({
    success: true,
    data: {
      successCount: successModels.length,
      failureCount: failureModels.length,
      successModels,
      failureModels,
      priceHistories,
    },
    message: `批量调价完成，成功${successModels.length}个`,
  })
}

/**
 * 车型加入分组
 */
export const mockJoinPriceGroup = (data: JoinPriceGroupRequest): Promise<JoinPriceGroupResponse> => {
  const group = mockVehicleModelPriceGroups.find(g => g.id === data.groupId)

  if (!group) {
    return Promise.reject({
      code: 404,
      message: '价格分组不存在',
    })
  }

  const priceHistories: VehicleModelPriceHistory[] = []

  data.modelIds.forEach(modelId => {
    const newHistory: VehicleModelPriceHistory = {
      id: mockVehicleModelPriceHistory.length + priceHistories.length + 1,
      modelId,
      modelName: `车型${modelId}`,
      oldPrice: 800,
      newPrice: group.basePrice,
      changeType: 'group_sync',
      changeReason: `加入价格分组【${group.groupName}】`,
      remark: '自动同步分组价格',
      changedBy: '系统',
      changedAt: new Date().toLocaleString('zh-CN'),
    }

    priceHistories.push(newHistory)
  })

  // 更新分组车型数量
  group.vehicleCount += data.modelIds.length
  group.updatedAt = new Date().toLocaleString('zh-CN')

  // 将历史记录添加到 mock 数据
  mockVehicleModelPriceHistory.unshift(...priceHistories)

  return Promise.resolve({
    success: true,
    data: {
      successCount: data.modelIds.length,
      skippedCount: 0,
      updatedModels: [],
      priceHistories,
      group,
    },
    message: `${data.modelIds.length}个车型已加入分组`,
  })
}

/**
 * 更新分组价格
 */
export const mockUpdateGroupPrice = (data: UpdateGroupPriceRequest): Promise<UpdateGroupPriceResponse> => {
  const group = mockVehicleModelPriceGroups.find(g => g.id === data.groupId)

  if (!group) {
    return Promise.reject({
      code: 404,
      message: '价格分组不存在',
    })
  }

  const oldPrice = group.basePrice
  group.basePrice = data.newPrice
  group.updatedAt = new Date().toLocaleString('zh-CN')

  // 模拟更新关联车型的价格历史
  const priceHistories: VehicleModelPriceHistory[] = []
  const affectedCount = group.vehicleCount

  // 这里应该查询所有 isCustomPrice=false 的关联车型，暂时模拟
  for (let i = 0; i < affectedCount; i++) {
    const newHistory: VehicleModelPriceHistory = {
      id: mockVehicleModelPriceHistory.length + priceHistories.length + 1,
      modelId: i + 1,
      modelName: `车型${i + 1}`,
      oldPrice,
      newPrice: data.newPrice,
      changeType: 'group_sync',
      changeReason: `分组【${group.groupName}】价格调整`,
      remark: data.remark,
      changedBy: '当前用户',
      changedAt: new Date().toLocaleString('zh-CN'),
    }

    priceHistories.push(newHistory)
  }

  mockVehicleModelPriceHistory.unshift(...priceHistories)

  return Promise.resolve({
    success: true,
    data: {
      group,
      affectedCount,
      updatedModels: [],
      priceHistories,
    },
    message: `分组价格已更新，${affectedCount}个车型价格已同步`,
  })
}

/**
 * 车型脱离分组
 */
export const mockLeaveGroup = (data: LeaveGroupRequest): Promise<LeaveGroupResponse> => {
  // 模拟脱离分组
  const newHistory: VehicleModelPriceHistory = {
    id: mockVehicleModelPriceHistory.length + 1,
    modelId: data.modelId,
    modelName: `车型${data.modelId}`,
    oldPrice: 800,
    newPrice: 800, // 保持当前价格
    changeType: 'manual',
    changeReason: '脱离价格分组',
    remark: '使用独立价格',
    changedBy: '当前用户',
    changedAt: new Date().toLocaleString('zh-CN'),
  }

  mockVehicleModelPriceHistory.unshift(newHistory)

  return Promise.resolve({
    success: true,
    data: {
      model: {} as any,
      priceHistory: newHistory,
      group: {} as any,
    },
    message: '车型已脱离分组',
  })
}
