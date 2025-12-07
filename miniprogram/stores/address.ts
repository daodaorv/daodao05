/**
 * 地址管理 Store
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAddresses, createAddress, updateAddress, deleteAddress } from '@/api/address'

export const useAddressStore = defineStore('address', () => {
  const addressList = ref<any[]>([])

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses()
      if (res.code === 0) {
        addressList.value = res.data
        return res.data
      }
      return null
    } catch (error) {
      console.error('获取地址列表失败:', error)
      return null
    }
  }

  const addAddress = async (data: any) => {
    try {
      const res = await createAddress(data)
      if (res.code === 0) {
        await fetchAddresses()
        return true
      }
      return false
    } catch (error) {
      console.error('新增地址失败:', error)
      return false
    }
  }

  const editAddress = async (id: string, data: any) => {
    try {
      const res = await updateAddress(id, data)
      if (res.code === 0) {
        await fetchAddresses()
        return true
      }
      return false
    } catch (error) {
      console.error('更新地址失败:', error)
      return false
    }
  }

  const removeAddress = async (id: string) => {
    try {
      const res = await deleteAddress(id)
      if (res.code === 0) {
        await fetchAddresses()
        return true
      }
      return false
    } catch (error) {
      console.error('删除地址失败:', error)
      return false
    }
  }

  return {
    addressList,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress
  }
})
