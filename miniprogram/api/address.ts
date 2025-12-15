/**
 * 地址管理 API
 */

import { get, post, put, del } from '@/utils/request'

export interface AddressPayload {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  tag?: string
  isDefault?: boolean
}

export const getAddresses = () => {
  return get('/addresses')
}

export const getAddressDetail = (id: string) => {
  return get(`/addresses/${id}`)
}

export const createAddress = (data: AddressPayload) => {
  return post('/addresses', data)
}

export const updateAddress = (id: string, data: Partial<AddressPayload>) => {
  return put(`/addresses/${id}`, data)
}

export const deleteAddress = (id: string) => {
  return del(`/addresses/${id}`)
}

export default {
  getAddresses,
  getAddressDetail,
  createAddress,
  updateAddress,
  deleteAddress
}
