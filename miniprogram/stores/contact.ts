/**
 * 联系人状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getContacts, createContact, updateContact, deleteContact } from '@/api/contact';

export const useContactStore = defineStore('contact', () => {
    // 状态
    const contactList = ref<any[]>([]);
    const currentContact = ref<any>(null);

    // 获取联系人列表
    const fetchContacts = async () => {
        try {
            const res = await getContacts();
            if (res.code === 0) {
                contactList.value = res.data;
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取联系人列表失败:', error);
            return null;
        }
    };

    // 添加联系人
    const addContact = async (data: any) => {
        try {
            const res = await createContact(data);
            if (res.code === 0) {
                await fetchContacts(); // 刷新列表
                return true;
            }
            return false;
        } catch (error) {
            console.error('添加联系人失败:', error);
            return false;
        }
    };

    // 编辑联系人
    const editContact = async (id: string, data: any) => {
        try {
            const res = await updateContact(id, data);
            if (res.code === 0) {
                await fetchContacts(); // 刷新列表
                return true;
            }
            return false;
        } catch (error) {
            console.error('编辑联系人失败:', error);
            return false;
        }
    };

    // 删除联系人
    const removeContact = async (id: string) => {
        try {
            const res = await deleteContact(id);
            if (res.code === 0) {
                await fetchContacts(); // 刷新列表
                return true;
            }
            return false;
        } catch (error) {
            console.error('删除联系人失败:', error);
            return false;
        }
    };

    return {
        // 状态
        contactList,
        currentContact,
        // 方法
        fetchContacts,
        addContact,
        editContact,
        removeContact
    };
});
