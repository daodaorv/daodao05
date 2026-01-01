/**
 * Mock数据管理中心
 * 统一管理所有Mock数据，支持Mock/真实API无缝切换
 */

// Mock开关配置
export const USE_MOCK = true; // 开发环境使用Mock，生产环境设为false

// 导出所有Mock数据模块
export * from './home';
export * from './vehicle';
export * from './order';
export * from './hosting';
export * from './community';
export * from './user';
export * from './campsite';
export * from './tour';
export * from './config';

/**
 * Mock数据使用说明：
 *
 * 1. 在API层统一判断USE_MOCK开关
 * 2. 如果USE_MOCK=true，返回Mock数据
 * 3. 如果USE_MOCK=false，调用真实API
 *
 * 示例：
 * ```typescript
 * import { USE_MOCK, mockVehicleList } from '@/mock';
 *
 * export async function getVehicleList(params) {
 *   if (USE_MOCK) {
 *     return mockVehicleList;
 *   }
 *   return request.get('/api/vehicles', params);
 * }
 * ```
 */
