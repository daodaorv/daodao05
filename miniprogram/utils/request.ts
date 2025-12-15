/**
 * 统一请求封装
 * 支持Mock数据和真实API切换
 */

// 是否使用Mock数据
const USE_MOCK = true;

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
		// 如果使用Mock数据
		if (USE_MOCK) {
			mockRequest(options)
				.then(resolve)
				.catch(reject);
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
				const response = res.data as ResponseData<T>;

				if (response.code === 0) {
					resolve(response);
				} else {
					// 业务错误
					uni.showToast({
						title: response.message || '请求失败',
						icon: 'none'
					});
					reject(response);
				}
			},
			fail: (error: unknown) => {
				// 网络错误
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
				reject(error);
			}
		});
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
