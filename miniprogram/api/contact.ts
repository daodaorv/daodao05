/**
 * 联系人相关API接口
 */

import { get, post, put, del } from '@/utils/request';

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
export function createContact(data: {
    name: string;
    phone: string;
    idCard: string;
    isDefault?: boolean;
}) {
    return post('/contacts', data);
}

/**
 * 更新联系人
 */
export function updateContact(id: string, data: {
    name?: string;
    phone?: string;
    idCard?: string;
    isDefault?: boolean;
}) {
    return put(`/contacts/${id}`, data);
}

/**
 * 删除联系人
 */
export function deleteContact(id: string) {
    return del(`/contacts/${id}`);
}
