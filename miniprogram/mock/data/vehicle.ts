/**
 * 车辆相关Mock数据
 */

// Mock车辆列表数据
const mockVehicles = [
    {
        id: 'vehicle_001',
        name: '奔驰Sprinter豪华房车',
        brand: '奔驰',
        model: 'Sprinter',
        year: 2023,
        seats: 4,
        images: ['https://via.placeholder.com/400x300'],
        basePrice: 580,
        store: {
            id: 'store_001',
            name: '北京朝阳门店',
            address: '北京市朝阳区建国路88号',
            distance: 5.2
        },
        features: ['自动挡', '导航系统', '倒车影像', '蓝牙音响'],
        available: true
    },
    {
        id: 'vehicle_002',
        name: '大通RV80舒适房车',
        brand: '大通',
        model: 'RV80',
        year: 2023,
        seats: 6,
        images: ['https://via.placeholder.com/400x300'],
        basePrice: 480,
        store: {
            id: 'store_001',
            name: '北京朝阳门店',
            address: '北京市朝阳区建国路88号',
            distance: 5.2
        },
        features: ['自动挡', '导航系统', '冰箱', '微波炉'],
        available: true
    }
];

export const vehicleData = {
    /**
     * 获取车辆列表
     */
    getList(params: any) {
        return {
            code: 0,
            message: 'success',
            data: {
                list: mockVehicles,
                pagination: {
                    page: params?.page || 1,
                    limit: params?.limit || 20,
                    total: mockVehicles.length,
                    totalPages: 1
                }
            }
        };
    },

    /**
     * 获取车辆详情
     */
    getDetail(id: string) {
        const vehicle = mockVehicles.find(v => v.id === id) || mockVehicles[0];
        return {
            code: 0,
            message: 'success',
            data: {
                ...vehicle,
                description: '这是一辆配置齐全的豪华房车,适合家庭出游。',
                sleepCapacity: 4,
                gallery: [
                    'https://via.placeholder.com/800x600',
                    'https://via.placeholder.com/800x600',
                    'https://via.placeholder.com/800x600'
                ],
                weeklyDiscount: 0.8,
                monthlyDiscount: 0.7,
                specifications: {
                    length: '7.5米',
                    width: '2.3米',
                    height: '3.2米',
                    fuelType: '汽油',
                    transmission: '自动挡',
                    mileage: 10000
                },
                equipment: ['床铺', '厨房', '卫生间', '空调', '冰箱', '微波炉'],
                insurance: {
                    basic: 50,
                    standard: 80,
                    comprehensive: 120
                },
                services: [
                    {
                        id: 'service_001',
                        name: '接送服务',
                        price: 50,
                        description: '提供机场/车站接送服务'
                    }
                ],
                rating: {
                    average: 4.8,
                    count: 156
                },
                reviews: [
                    {
                        id: 'review_001',
                        userId: 'user_002',
                        userName: '旅行达人',
                        avatar: 'https://via.placeholder.com/50',
                        rating: 5,
                        content: '车况很好,服务也很棒!',
                        images: [],
                        createdAt: '2025-11-20T10:00:00+08:00'
                    }
                ]
            }
        };
    },

    /**
     * 收藏/取消收藏
     */
    toggleFavorite(data: any) {
        return {
            code: 0,
            message: '操作成功',
            data: {
                favorited: true
            }
        };
    },

    /**
     * 获取收藏列表
     */
    getFavorites() {
        return {
            code: 0,
            message: 'success',
            data: {
                list: mockVehicles.slice(0, 1),
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 1,
                    totalPages: 1
                }
            }
        };
    }
};
