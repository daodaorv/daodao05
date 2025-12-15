/**
 * 联系人相关API接口
 */

import { get, post, put, del } from '@/utils/request';

export interface ContactPayload {
    name: string;
    phone: string;
    idCard: string;
    driverLicenseNo: string;
    driverLicenseFront: string;
    driverLicenseBack: string;
    isDefault?: boolean;
}

/**
 * 获取联系人列表
 */
export function getContacts() {
    return get('/contacts');
}

/**
 * 获取联系人详情
 */
export function getContactDetail(id: string) {
    return get(`/contacts/${id}`);
}

/**
 * 创建联系人
 */
export function createContact(data: ContactPayload) {
    return post('/contacts', data);
}

/**
 * 更新联系人
 */
export function updateContact(id: string, data: Partial<ContactPayload>) {
    return put(`/contacts/${id}`, data);
}

/**
 * 删除联系人
 */
export function deleteContact(id: string) {
    return del(`/contacts/${id}`);
}
