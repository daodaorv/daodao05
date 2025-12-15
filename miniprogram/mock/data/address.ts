/**
 * 地址管理 Mock 数据
 */

interface MockAddress {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  tag: string
  isDefault: boolean
  createdAt: string
}

const mockAddresses: MockAddress[] = [
  {
    id: 'addr_001',
    name: '王晓明',
    phone: '13812345678',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号 Soho现代城5号楼2102',
    tag: '家',
    isDefault: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'addr_002',
    name: '王晓明',
    phone: '13812345678',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '世纪大道2000号 陆家嘴金融中心35F',
    tag: '公司',
    isDefault: false,
    createdAt: new Date().toISOString()
  }
]

const updateDefault = (isDefault: boolean, id: string) => {
  if (!isDefault) return
  mockAddresses.forEach((addr) => {
    addr.isDefault = addr.id === id
  })
}

export const addressData = {
  getList() {
    return {
      code: 0,
      message: 'success',
      data: mockAddresses
    }
  },
  getDetail(id: string) {
    const target = mockAddresses.find((item) => item.id === id)
    if (!target) {
      return {
        code: 404,
        message: '地址不存在',
        data: null
      }
    }
    return {
      code: 0,
      message: 'success',
      data: target
    }
  },
  create(data: Partial<MockAddress>) {
    const address: MockAddress = {
      id: `addr_${Date.now()}`,
      name: data.name || '',
      phone: data.phone || '',
      province: data.province || '',
      city: data.city || '',
      district: data.district || '',
      detail: data.detail || '',
      tag: data.tag || '',
      isDefault: !!data.isDefault,
      createdAt: new Date().toISOString()
    }
    mockAddresses.unshift(address)
    updateDefault(address.isDefault, address.id)
    return {
      code: 0,
      message: 'success',
      data: address
    }
  },
  update(id: string, payload: Partial<MockAddress>) {
    const target = mockAddresses.find((item) => item.id === id)
    if (!target) {
      return {
        code: 404,
        message: '地址不存在',
        data: null
      }
    }
    Object.assign(target, payload)
    updateDefault(!!payload.isDefault, id)
    return {
      code: 0,
      message: 'success',
      data: target
    }
  },
  remove(id: string) {
    const index = mockAddresses.findIndex((item) => item.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '地址不存在',
        data: null
      }
    }
    mockAddresses.splice(index, 1)
    if (mockAddresses.length && !mockAddresses.some((item) => item.isDefault)) {
      mockAddresses[0].isDefault = true
    }
    return {
      code: 0,
      message: 'success',
      data: { success: true }
    }
  }
}
