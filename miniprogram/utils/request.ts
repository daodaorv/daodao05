/**
 * 统一请求封装
 * 支持Mock数据和真实API切换
 */

import { logger } from './logger'

// 是否使用Mock数据
// 当前小程序端正在与后端联调，使用真实API
const USE_MOCK = false;

// API基础URL
const BASE_URL = USE_MOCK ? '' : 'http://localhost:3001/api/v1';

// Mock数据处理器
import { mockRequest } from '@/mock/handlers/index';

// 定义请求数据类型
type RequestData = Record<string, unknown> | unknown[];

// 定义请求头类型
interface RequestHeader {
	[key: string]: string;
}

interface RequestOptions {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	data?: RequestData;
	header?: RequestHeader;
}

export interface ResponseData<T = unknown> {
	code: number;
	message: string;
	data: T;
}

// uni.request 的响应类型
interface UniRequestResponse {
	data: unknown;
	statusCode: number;
	header: Record<string, string>;
	cookies?: string[];
}

/**
 * 统一请求方法
 */
export function request<T = unknown>(options: RequestOptions): Promise<ResponseData<T>> {
	return new Promise((resolve, reject) => {
		// 记录请求日志
		logger.logRequest(options.method || 'GET', options.url, options.data);

		// 如果使用Mock数据
		if (USE_MOCK) {
			mockRequest(options)
				.then((response) => {
					logger.logResponse(options.method || 'GET', options.url, 200, response);
					resolve(response);
				})
				.catch((error) => {
					logger.error('Mock请求失败', error);
					reject(error);
				});
			return;
		}

		// 真实API请求
		const { url, method = 'GET', data, header = {} } = options;

		// 获取token
		const token = uni.getStorageSync('token');
		if (token && typeof token === 'string') {
			header['Authorization'] = `Bearer ${token}`;
		}

		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: {
				'Content-Type': 'application/json',
				...header
			},
			success: (res: UniRequestResponse) => {
				// 验证响应数据结构
				const rawData = res.data
				if (!rawData || typeof rawData !== 'object') {
					logger.error('响应数据格式错误', { statusCode: res.statusCode, data: rawData })
					reject(new Error('响应数据格式错误'))
					return
				}

				const response = rawData as ResponseData<T>

				// 记录响应日志
				logger.logResponse(method, url, res.statusCode, response)

				if (response.code === 0) {
					resolve(response)
				} else {
					// 业务错误处理
					handleBusinessError(response)
					reject(response)
				}
			},
			fail: (error: unknown) => {
				// 网络错误处理
				logger.error('网络请求失败', error)
				handleNetworkError(error)
				reject(error instanceof Error ? error : new Error('网络请求失败'))
			}
		});
	});
}

/**
 * 处理业务错误
 */
function handleBusinessError(response: ResponseData<unknown>): void {
	const { code, message } = response;

	// 特殊错误码处理
	switch (code) {
		case 401:
			// 未登录或登录过期
			uni.showToast({
				title: '登录已过期，请重新登录',
				icon: 'none'
			});
			// 清除token并跳转到登录页
			uni.removeStorageSync('token');
			setTimeout(() => {
				uni.reLaunch({ url: '/pages/auth/login' });
			}, 1500);
			break;
		case 403:
			// 无权限
			uni.showToast({
				title: '没有权限访问',
				icon: 'none'
			});
			break;
		case 404:
			// 资源不存在
			uni.showToast({
				title: '请求的资源不存在',
				icon: 'none'
			});
			break;
		case 500:
			// 服务器错误
			uni.showToast({
				title: '服务器错误，请稍后重试',
				icon: 'none'
			});
			break;
		default:
			// 其他业务错误
			uni.showToast({
				title: message || '请求失败',
				icon: 'none'
			});
	}

	// 记录错误日志
	logger.error(`业务错误 [${code}]`, { code, message });
}

/**
 * 处理网络错误
 */
function handleNetworkError(error: unknown): void {
	uni.showToast({
		title: '网络请求失败，请检查网络连接',
		icon: 'none'
	});
}

/**
 * GET请求
 */
export function get<T = unknown>(url: string, data?: RequestData): Promise<ResponseData<T>> {
	return request<T>({ url, method: 'GET', data });
}

/**
 * POST请求
 */
export function post<T = unknown>(url: string, data?: RequestData): Promise<ResponseData<T>> {
	return request<T>({ url, method: 'POST', data });
}

/**
 * PUT请求
 */
export function put<T = unknown>(url: string, data?: RequestData): Promise<ResponseData<T>> {
	return request<T>({ url, method: 'PUT', data });
}

/**
 * DELETE请求
 */
export function del<T = unknown>(url: string, data?: RequestData): Promise<ResponseData<T>> {
	return request<T>({ url, method: 'DELETE', data });
}
