/**
 * 常用联系人 Mock 数据
 */

export interface MockContact {
    id: string;
    name: string;
    phone: string;
    idCard: string;
    driverLicenseNo: string;
    driverLicenseFront: string;
    driverLicenseBack: string;
    isDefault: boolean;
    createdAt: string;
}

const mockContacts: MockContact[] = [
    {
        id: 'contact_001',
        name: '张三',
        phone: '13800000000',
        idCard: '110101199001017654',
        driverLicenseNo: '110101198806050011',
        driverLicenseFront: 'https://via.placeholder.com/300x200?text=DL+Front',
        driverLicenseBack: 'https://via.placeholder.com/300x200?text=DL+Back',
        isDefault: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'contact_002',
        name: '李四',
        phone: '13900000000',
        idCard: '310101199503041234',
        driverLicenseNo: '310101199003031234',
        driverLicenseFront: 'https://via.placeholder.com/300x200?text=DL+Front',
        driverLicenseBack: 'https://via.placeholder.com/300x200?text=DL+Back',
        isDefault: false,
        createdAt: new Date().toISOString()
    }
];

const applyDefaultFlag = (setDefault: boolean, id: string) => {
    if (!setDefault) return;
    mockContacts.forEach((item) => {
        item.isDefault = item.id === id;
    });
};

export const contactData = {
    getList() {
        return {
            code: 0,
            message: 'success',
            data: mockContacts
        };
    },
    getDetail(id: string) {
        const target = mockContacts.find((item) => item.id === id);
        if (!target) {
            return {
                code: 404,
                message: '联系人不存在',
                data: null
            };
        }
        return {
            code: 0,
            message: 'success',
            data: target
        };
    },
    create(data: Partial<MockContact>) {
        const contact: MockContact = {
            id: `contact_${Date.now()}`,
            name: data.name || '',
            phone: data.phone || '',
            idCard: data.idCard || '',
            driverLicenseNo: data.driverLicenseNo || '',
            driverLicenseFront: data.driverLicenseFront || '',
            driverLicenseBack: data.driverLicenseBack || '',
            isDefault: !!data.isDefault,
            createdAt: new Date().toISOString()
        };
        mockContacts.unshift(contact);
        applyDefaultFlag(contact.isDefault, contact.id);
        return {
            code: 0,
            message: 'success',
            data: contact
        };
    },
    update(id: string, payload: Partial<MockContact>) {
        const target = mockContacts.find((item) => item.id === id);
        if (!target) {
            return {
                code: 404,
                message: '联系人不存在',
                data: null
            };
        }
        Object.assign(target, payload);
        applyDefaultFlag(!!payload.isDefault, id);
        return {
            code: 0,
            message: 'success',
            data: target
        };
    },
    remove(id: string) {
        const index = mockContacts.findIndex((item) => item.id === id);
        if (index === -1) {
            return {
                code: 404,
                message: '联系人不存在',
                data: null
            };
        }
        mockContacts.splice(index, 1);
        if (mockContacts.length && !mockContacts.some((item) => item.isDefault)) {
            mockContacts[0].isDefault = true;
        }
        return {
            code: 0,
            message: 'success',
            data: { success: true }
        };
    }
};
