/**
 * Mock数据处理器
 * 根据请求URL和方法返回对应的Mock数据
 */

import { vehicleData } from '../data/vehicle';
import { authData } from '../data/auth';
import { orderData } from '../data/order';
import { contactData } from '../data/contact';
import { addressData } from '../data/address';
import { ruleData } from '../data/rules';
import {
  mockShareRecords,
  mockShareStats,
  mockInviteRecords,
  mockInviteStats,
  mockShareAchievements,
  generateMockShareRecords,
  generateMockInviteRecords
} from '../data/share';

interface RequestOptions {
    url: string;
    method?: string;
    data?: any;
}

/**
 * Mock请求处理
 */
export function mockRequest(options: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            const { url, method = 'GET', data } = options;

            try {
                // 路由匹配
                const result = routeMatch(url, method, data);
                resolve(result);
            } catch (error) {
                reject({
                    code: -1,
                    message: 'Mock数据处理失败',
                    data: null
                });
            }
        }, 300); // 300ms延迟模拟网络请求
    });
}

/**
 * 路由匹配
 */
function routeMatch(url: string, method: string, data: any) {
    // 认证相关
    if (url.includes('/auth/send-code')) {
        return authData.sendCode(data);
    }
    if (url.includes('/auth/register')) {
        return authData.register(data);
    }
    if (url.includes('/auth/login')) {
        return authData.login(data);
    }
    if (url.includes('/users/profile')) {
        return authData.getProfile();
    }

    // 车辆相关
    if (url.includes('/vehicles') && method === 'GET') {
        if (url.includes('/favorites')) {
            return vehicleData.getFavorites();
        }
        // 匹配 /vehicles/{id}
        const idMatch = url.match(/\/vehicles\/([^\/]+)$/);
        if (idMatch) {
            return vehicleData.getDetail(idMatch[1]);
        }
        return vehicleData.getList(data);
    }
    if (url.includes('/vehicles') && url.includes('/favorite') && method === 'POST') {
        return vehicleData.toggleFavorite(data);
    }

    // 联系人相关
    if (url.includes('/contacts')) {
        if (method === 'GET') {
            const idMatch = url.match(/\/contacts\/([^\/]+)$/);
            if (idMatch) {
                return contactData.getDetail(idMatch[1]);
            }
            return contactData.getList();
        }
        if (method === 'POST') {
            return contactData.create(data);
        }
        if (method === 'PUT') {
            const idMatch = url.match(/\/contacts\/([^\/]+)$/);
            if (idMatch) {
                return contactData.update(idMatch[1], data);
            }
        }
        if (method === 'DELETE') {
            const idMatch = url.match(/\/contacts\/([^\/]+)$/);
            if (idMatch) {
                return contactData.remove(idMatch[1]);
            }
        }
    }

    // 地址相关
    if (url.includes('/addresses')) {
        if (method === 'GET') {
            const idMatch = url.match(/\/addresses\/([^\/]+)$/);
            if (idMatch) {
                return addressData.getDetail(idMatch[1]);
            }
            return addressData.getList();
        }
        if (method === 'POST') {
            return addressData.create(data);
        }
        if (method === 'PUT') {
            const idMatch = url.match(/\/addresses\/([^\/]+)$/);
            if (idMatch) {
                return addressData.update(idMatch[1], data);
            }
        }
        if (method === 'DELETE') {
            const idMatch = url.match(/\/addresses\/([^\/]+)$/);
            if (idMatch) {
                return addressData.remove(idMatch[1]);
            }
        }
    }

    // 规则管理
    if (url.includes('/rules/rental')) {
        return ruleData.getRentalRules(data);
    }

    // 订单相关
    if (url.includes('/orders/calculate-price')) {
        return orderData.calculatePrice(data);
    }
    if (url.includes('/orders') && method === 'POST') {
        return orderData.create(data);
    }
    if (url.includes('/orders') && method === 'GET') {
        const idMatch = url.match(/\/orders\/([^\/]+)$/);
        if (idMatch) {
            return orderData.getDetail(idMatch[1]);
        }
        return orderData.getList(data);
    }

    // 分享相关
    if (url.includes('/share/record') && method === 'POST') {
        // 记录分享行为
        return {
            code: 0,
            message: '分享记录成功',
            data: {
                id: `share_${Date.now()}`,
                ...data,
                viewCount: 0,
                conversionCount: 0
            }
        };
    }
    if (url.includes('/share/view') && method === 'POST') {
        // 记录分享访问
        return {
            code: 0,
            message: '访问记录成功',
            data: {
                id: `view_${Date.now()}`,
                ...data
            }
        };
    }
    if (url.includes('/share/stats') && method === 'GET') {
        // 获取分享统计
        return {
            code: 0,
            message: '获取成功',
            data: mockShareStats
        };
    }
    if (url.includes('/share/history') && method === 'GET') {
        // 获取分享历史
        const page = data?.page || 1;
        const pageSize = data?.pageSize || 10;
        const allRecords = generateMockShareRecords(50);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            code: 0,
            message: '获取成功',
            data: {
                list: allRecords.slice(start, end),
                total: allRecords.length,
                page,
                pageSize,
                hasMore: end < allRecords.length
            }
        };
    }
    if (url.includes('/share/achievements') && method === 'GET') {
        // 获取分享成就
        return {
            code: 0,
            message: '获取成功',
            data: mockShareAchievements
        };
    }
    if (url.includes('/share/mini-program-code') && method === 'POST') {
        // 生成小程序码（使用二维码占位图）
        return {
            code: 0,
            message: '生成成功',
            data: {
                // 使用二维码生成服务作为占位
                url: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('https://daodao.com/invite?code=' + (data?.scene || 'DEMO'))
            }
        };
    }
    if (url.includes('/share/verify') && method === 'POST') {
        // 验证分享行为（防作弊）
        return {
            code: 0,
            message: '验证通过',
            data: {
                valid: true
            }
        };
    }
    if (url.includes('/share/report-abnormal') && method === 'POST') {
        // 上报异常分享
        return {
            code: 0,
            message: '上报成功',
            data: null
        };
    }

    // 邀请相关
    if (url.includes('/invite/records') && method === 'GET') {
        // 获取邀请记录
        const page = data?.page || 1;
        const pageSize = data?.pageSize || 10;
        const allRecords = generateMockInviteRecords(30);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            code: 0,
            message: '获取成功',
            data: {
                list: allRecords.slice(start, end),
                total: allRecords.length,
                page,
                pageSize,
                hasMore: end < allRecords.length
            }
        };
    }
    if (url.includes('/invite/stats') && method === 'GET') {
        // 获取邀请统计
        return {
            code: 0,
            message: '获取成功',
            data: mockInviteStats
        };
    }
    if (url.includes('/invite/bind') && method === 'POST') {
        // 绑定邀请关系
        return {
            code: 0,
            message: '绑定成功',
            data: {
                inviteCode: data.inviteCode,
                reward: {
                    type: 'coupon',
                    amount: 20,
                    description: '新人专享券'
                }
            }
        };
    }

    // 默认返回404
    return {
        code: 404,
        message: 'Mock接口未找到',
        data: null
    };
}
