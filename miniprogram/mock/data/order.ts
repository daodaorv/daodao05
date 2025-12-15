/**
 * 订单相关Mock数据
 */

export const orderData = {
    /**
     * 计算订单价格
     */
    calculatePrice(data: any) {
        const days = 2; // 简化计算,实际应根据日期计算
        const vehicleFee = 580 * days;
        const insuranceFee = data.insuranceType === 'comprehensive' ? 120 : 80;
        const serviceFee = 100;
        const discount = 100;

        return {
            code: 0,
            message: 'success',
            data: {
                vehicleFee,
                insuranceFee,
                serviceFee,
                discount,
                totalAmount: vehicleFee + insuranceFee + serviceFee - discount,
                breakdown: [
                    {
                        name: '基础租金',
                        amount: vehicleFee,
                        description: `${days}天 x 580元/天`
                    },
                    {
                        name: '保险费用',
                        amount: insuranceFee,
                        description: data.insuranceType === 'comprehensive' ? '全险' : '标准险'
                    },
                    {
                        name: '服务费',
                        amount: serviceFee,
                        description: '附加服务费'
                    },
                    {
                        name: '优惠折扣',
                        amount: -discount,
                        description: '新用户优惠'
                    }
                ]
            }
        };
    },

    /**
     * 创建订单
     */
    create(data: any) {
        return {
            code: 0,
            message: '订单创建成功',
            data: {
                orderId: 'order_' + Date.now(),
                orderNo: 'DD' + Date.now(),
                status: 'PENDING_PAYMENT',
                amount: {
                    vehicleFee: 1160,
                    insuranceFee: 160,
                    serviceFee: 100,
                    discount: 100,
                    totalAmount: 1320
                },
                expireTime: new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }
        };
    },

    /**
     * 获取订单列表
     */
    getList(params: any) {
        const mockOrders = [
            {
                orderId: 'order_001',
                orderNo: 'DD202511260001',
                status: 'PENDING_PAYMENT',
                vehicle: {
                    id: 'vehicle_001',
                    name: '奔驰Sprinter豪华房车',
                    image: 'https://via.placeholder.com/200x150'
                },
                pickupInfo: {
                    storeName: '北京朝阳门店',
                    date: '2025-12-01T10:00:00+08:00'
                },
                returnInfo: {
                    storeName: '北京朝阳门店',
                    date: '2025-12-03T18:00:00+08:00'
                },
                totalAmount: 1320,
                createdAt: '2025-11-26T10:00:00+08:00'
            }
        ];

        return {
            code: 0,
            message: 'success',
            data: {
                list: mockOrders,
                pagination: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    total: mockOrders.length,
                    totalPages: 1
                }
            }
        };
    },

    /**
     * 获取订单详情
     */
    getDetail(orderId: string) {
        return {
            code: 0,
            message: 'success',
            data: {
                orderId,
                orderNo: 'DD202511260001',
                status: 'PENDING_PAYMENT',
                vehicle: {
                    id: 'vehicle_001',
                    name: '奔驰Sprinter豪华房车',
                    image: 'https://via.placeholder.com/400x300'
                },
                pickupInfo: {
                    storeName: '北京朝阳门店',
                    address: '北京市朝阳区建国路88号',
                    date: '2025-12-01T10:00:00+08:00'
                },
                returnInfo: {
                    storeName: '北京朝阳门店',
                    address: '北京市朝阳区建国路88号',
                    date: '2025-12-03T18:00:00+08:00'
                },
                amount: {
                    vehicleFee: 1160,
                    insuranceFee: 160,
                    serviceFee: 100,
                    discount: 100,
                    totalAmount: 1320
                },
                contactInfo: {
                    name: '张三',
                    phone: '138****0001'
                },
                createdAt: '2025-11-26T10:00:00+08:00'
            }
        };
    }
};
