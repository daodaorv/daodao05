/**
 * 定位工具类
 * 提供完整的微信小程序定位功能，包括权限检查、授权引导、定位获取等
 */

import { logger } from './logger'

// 定位结果接口
export interface LocationResult {
	latitude: number;
	longitude: number;
	speed: number;
	accuracy: number;
	altitude?: number;
	verticalAccuracy?: number;
	horizontalAccuracy?: number;
}

// 定位错误类型
export enum LocationErrorType {
	PERMISSION_DENIED = 'PERMISSION_DENIED', // 用户拒绝授权
	PERMISSION_NOT_DETERMINED = 'PERMISSION_NOT_DETERMINED', // 未询问过权限
	LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE', // 定位服务不可用
	TIMEOUT = 'TIMEOUT', // 定位超时
	UNKNOWN = 'UNKNOWN' // 未知错误
}

// 定位错误接口
export interface LocationError {
	type: LocationErrorType;
	message: string;
	code?: number;
}

// Mock 城市坐标数据
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
	'北京': { lat: 39.9042, lng: 116.4074 },
	'上海': { lat: 31.2304, lng: 121.4737 },
	'深圳': { lat: 22.5431, lng: 114.0579 },
	'成都': { lat: 30.5728, lng: 104.0668 },
	'广州': { lat: 23.1291, lng: 113.2644 },
	'杭州': { lat: 30.2741, lng: 120.1551 },
	'重庆': { lat: 29.5630, lng: 106.5516 },
	'西安': { lat: 34.3416, lng: 108.9398 },
	'武汉': { lat: 30.5928, lng: 114.3055 },
	'长沙': { lat: 28.2282, lng: 112.9388 },
	'南京': { lat: 32.0603, lng: 118.7969 },
	'苏州': { lat: 31.2989, lng: 120.5853 },
	'天津': { lat: 39.3434, lng: 117.3616 },
	'青岛': { lat: 36.0671, lng: 120.3826 },
	'厦门': { lat: 24.4798, lng: 118.0894 },
	'昆明': { lat: 25.0406, lng: 102.7123 },
	'三亚': { lat: 18.2528, lng: 109.5117 },
	'海口': { lat: 20.0444, lng: 110.1999 }
};

// Mock 门店坐标数据
const STORE_COORDINATES: Record<string, { lat: number; lng: number }> = {
	// 北京门店
	'101': { lat: 39.9219, lng: 116.4436 }, // 北京朝阳店
	'102': { lat: 39.9590, lng: 116.2987 }, // 北京海淀店
	'103': { lat: 39.7280, lng: 116.3410 }, // 北京大兴店

	// 上海门店
	'201': { lat: 31.1974, lng: 121.3284 }, // 上海虹桥店
	'202': { lat: 31.2231, lng: 121.5397 }, // 上海浦东店
	'203': { lat: 31.2752, lng: 121.1965 }, // 上海嘉定店

	// 成都门店
	'301': { lat: 30.5785, lng: 103.9476 }, // 成都双流店
	'302': { lat: 30.6598, lng: 104.0657 }, // 成都高新店
	'303': { lat: 30.6622, lng: 104.0657 }, // 成都天府店

	// 深圳门店
	'401': { lat: 22.5551, lng: 113.8840 }, // 深圳宝安店
	'402': { lat: 22.5329, lng: 113.9344 }, // 深圳南山店
	'403': { lat: 22.7208, lng: 114.2468 }, // 深圳龙岗店

	// 广州门店
	'501': { lat: 23.1620, lng: 113.2988 }, // 广州白云店
	'502': { lat: 23.1353, lng: 113.3235 }, // 广州天河店
	'503': { lat: 22.9388, lng: 113.3838 }, // 广州番禺店

	// 杭州门店
	'601': { lat: 30.2294, lng: 120.2344 }, // 杭州萧山店
	'602': { lat: 30.2591, lng: 120.1294 }, // 杭州西湖店

	// 重庆门店
	'701': { lat: 29.5750, lng: 106.6047 }, // 重庆江北店
	'702': { lat: 29.6027, lng: 106.5300 }, // 重庆渝北店

	// 西安门店
	'801': { lat: 34.3853, lng: 108.9486 }, // 西安未央店
	'802': { lat: 34.2250, lng: 108.9486 }, // 西安雁塔店

	// 武汉门店
	'901': { lat: 30.5100, lng: 114.4070 }, // 武汉洪山店
	'902': { lat: 30.5844, lng: 114.2734 }, // 武汉江汉店

	// 长沙门店
	'1001': { lat: 28.2353, lng: 112.9388 }, // 长沙岳麓店
	'1002': { lat: 28.1353, lng: 113.0353 }, // 长沙雨花店

	// 南京门店
	'1101': { lat: 31.9522, lng: 118.7969 }, // 南京江宁店
	'1102': { lat: 32.0603, lng: 118.7780 }, // 南京鼓楼店

	// 苏州门店
	'1201': { lat: 31.2625, lng: 120.6197 }, // 苏州吴中店
	'1202': { lat: 31.3167, lng: 120.6853 }, // 苏州工业园店

	// 天津门店
	'1301': { lat: 39.0851, lng: 117.7070 }, // 天津滨海店
	'1302': { lat: 39.1235, lng: 117.1633 }, // 天津南开店

	// 青岛门店
	'1401': { lat: 36.0671, lng: 120.3826 }, // 青岛市南店
	'1402': { lat: 36.1067, lng: 120.4594 }, // 青岛崂山店

	// 厦门门店
	'1501': { lat: 24.4798, lng: 118.0894 }, // 厦门思明店
	'1502': { lat: 24.5127, lng: 118.1279 }, // 厦门湖里店

	// 昆明门店
	'1601': { lat: 25.0406, lng: 102.7123 }, // 昆明官渡店
	'1602': { lat: 25.0858, lng: 102.7123 }, // 昆明盘龙店

	// 三亚门店
	'1701': { lat: 18.2528, lng: 109.5117 }, // 三亚凤凰店
	'1702': { lat: 18.4055, lng: 109.7543 }, // 三亚海棠湾店

	// 海口门店
	'1801': { lat: 20.0444, lng: 110.1999 }, // 海口美兰店
	'1802': { lat: 20.0311, lng: 110.3185 }  // 海口龙华店
};

/**
 * 检查定位权限状态
 * @returns Promise<'authorized' | 'denied' | 'not determined'>
 */
export function checkLocationPermission(): Promise<'authorized' | 'denied' | 'not determined'> {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		uni.getSetting({
			success(res) {
				const authSetting = res.authSetting['scope.userLocation'];
				if (authSetting === true) {
					resolve('authorized');
				} else if (authSetting === false) {
					resolve('denied');
				} else {
					resolve('not determined');
				}
			},
			fail() {
				resolve('not determined');
			}
		});
		// #endif
		// #ifndef MP-WEIXIN
		resolve('authorized');
		// #endif
	});
}

/**
 * 请求定位权限授权
 * @returns Promise<boolean> 是否授权成功
 */
export function requestLocationPermission(): Promise<boolean> {
	return new Promise((resolve) => {
		// #ifdef MP-WEIXIN
		uni.authorize({
			scope: 'scope.userLocation',
			success() {
				logger.debug('用户授权定位成功');
				resolve(true);
			},
			fail(err) {
				logger.debug('用户拒绝授权定位', err);
				resolve(false);
			}
		});
		// #endif
		// #ifndef MP-WEIXIN
		resolve(true);
		// #endif
	});
}

/**
 * 引导用户打开设置页面授权定位
 */
export function guideToSettingPage(): Promise<boolean> {
	return new Promise((resolve) => {
		uni.showModal({
			title: '需要定位权限',
			content: '为了给您提供更好的服务，需要获取您的位置信息。请在设置中开启定位权限。',
			confirmText: '去设置',
			cancelText: '取消',
			success(res) {
				if (res.confirm) {
					// #ifdef MP-WEIXIN
					uni.openSetting({
						success(settingRes) {
							const authSetting = settingRes.authSetting['scope.userLocation'];
							logger.debug('用户设置页面返回，授权状态', { authSetting });
							resolve(authSetting === true);
						},
						fail() {
							resolve(false);
						}
					});
					// #endif
					// #ifndef MP-WEIXIN
					resolve(false);
					// #endif
				} else {
					resolve(false);
				}
			},
			fail() {
				resolve(false);
			}
		});
	});
}

/**
 * 获取用户位置（完整版本）
 * @param options 配置选项
 * @returns Promise<LocationResult>
 */
export async function getUserLocation(options?: {
	type?: 'wgs84' | 'gcj02';
	altitude?: boolean;
	highAccuracyExpireTime?: number;
	timeout?: number;
	showLoading?: boolean;
}): Promise<LocationResult> {
	const {
		type = 'gcj02',
		altitude = false,
		highAccuracyExpireTime = 3000,
		timeout = 10000,
		showLoading = false
	} = options || {};

	// 1. 检查权限状态
	const permissionStatus = await checkLocationPermission();
	logger.debug('定位权限状态', { permissionStatus });

	// 2. 如果已拒绝，引导用户去设置
	if (permissionStatus === 'denied') {
		const authorized = await guideToSettingPage();
		if (!authorized) {
			throw {
				type: LocationErrorType.PERMISSION_DENIED,
				message: '用户未在设置中开启定位权限'
			} as LocationError;
		}
	}

	// 3. 显示加载提示
	if (showLoading) {
		uni.showLoading({
			title: '定位中...',
			mask: true
		});
	}

	// 4. 获取定位（uni.getLocation 会自动触发授权弹窗，无需手动调用 uni.authorize）
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			if (showLoading) {
				uni.hideLoading();
			}
			reject({
				type: LocationErrorType.TIMEOUT,
				message: '定位超时'
			} as LocationError);
		}, timeout);

		uni.getLocation({
			type,
			altitude,
			highAccuracyExpireTime,
			isHighAccuracy: true,
			success(res) {
				clearTimeout(timer);
				if (showLoading) {
					uni.hideLoading();
				}

				logger.debug('获取位置成功', res);

				resolve({
					latitude: res.latitude,
					longitude: res.longitude,
					speed: res.speed,
					accuracy: res.accuracy,
					altitude: res.altitude,
					verticalAccuracy: res.verticalAccuracy,
					horizontalAccuracy: res.horizontalAccuracy
				});
			},
			fail(err) {
				clearTimeout(timer);
				if (showLoading) {
					uni.hideLoading();
				}

				logger.error('获取位置失败', err);

				// 解析错误类型
				let errorType = LocationErrorType.UNKNOWN;
				let errorMessage = '定位失败';

				if (err.errMsg) {
					if (err.errMsg.includes('auth deny') || err.errMsg.includes('authorize')) {
						errorType = LocationErrorType.PERMISSION_DENIED;
						errorMessage = '定位权限被拒绝';
					} else if (err.errMsg.includes('timeout')) {
						errorType = LocationErrorType.TIMEOUT;
						errorMessage = '定位超时';
					} else if (err.errMsg.includes('fail')) {
						errorType = LocationErrorType.LOCATION_UNAVAILABLE;
						errorMessage = '定位服务不可用，请检查手机定位设置';
					}
				}

				reject({
					type: errorType,
					message: errorMessage,
					code: err.errno
				} as LocationError);
			}
		});
	});
}

/**
 * 逆地理编码（根据坐标判断城市）
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
	// Mock：根据坐标范围判断城市
	if (lat >= 39.5 && lat <= 40.5 && lng >= 116 && lng <= 117) {
		return '北京';
	} else if (lat >= 30.9 && lat <= 31.5 && lng >= 121 && lng <= 122) {
		return '上海';
	} else if (lat >= 22 && lat <= 23 && lng >= 113.5 && lng <= 114.5) {
		return '深圳';
	} else if (lat >= 30.3 && lat <= 31 && lng >= 103.5 && lng <= 104.5) {
		return '成都';
	} else if (lat >= 22.8 && lat <= 23.5 && lng >= 113 && lng <= 113.5) {
		return '广州';
	} else if (lat >= 30 && lat <= 30.5 && lng >= 120 && lng <= 120.5) {
		return '杭州';
	} else if (lat >= 29.3 && lat <= 29.8 && lng >= 106.3 && lng <= 106.8) {
		return '重庆';
	} else if (lat >= 34 && lat <= 34.5 && lng >= 108.5 && lng <= 109.2) {
		return '西安';
	} else if (lat >= 30.3 && lat <= 30.8 && lng >= 114 && lng <= 114.5) {
		return '武汉';
	} else if (lat >= 28 && lat <= 28.5 && lng >= 112.5 && lng <= 113.2) {
		return '长沙';
	} else if (lat >= 31.8 && lat <= 32.3 && lng >= 118.5 && lng <= 119) {
		return '南京';
	} else if (lat >= 31 && lat <= 31.5 && lng >= 120.3 && lng <= 120.8) {
		return '苏州';
	} else if (lat >= 39 && lat <= 39.5 && lng >= 117 && lng <= 117.5) {
		return '天津';
	} else if (lat >= 35.8 && lat <= 36.3 && lng >= 120 && lng <= 120.6) {
		return '青岛';
	} else if (lat >= 24.3 && lat <= 24.7 && lng >= 117.8 && lng <= 118.3) {
		return '厦门';
	} else if (lat >= 24.8 && lat <= 25.3 && lng >= 102.5 && lng <= 103) {
		return '昆明';
	} else if (lat >= 18 && lat <= 18.5 && lng >= 109.3 && lng <= 109.8) {
		return '三亚';
	} else if (lat >= 19.8 && lat <= 20.3 && lng >= 110 && lng <= 110.5) {
		return '海口';
	}

	// 默认返回北京
	return '北京';
}

/**
 * 计算两点距离（Haversine 公式）
 * @returns 距离（单位：公里）
 */
export function calculateDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number
): number {
	const R = 6371; // 地球半径（公里）
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLng / 2) * Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	return Math.round(distance * 10) / 10; // 保留一位小数
}

/**
 * 角度转弧度
 */
function toRad(degrees: number): number {
	return degrees * (Math.PI / 180);
}

/**
 * 按距离排序门店
 */
export function sortStoresByDistance(
	stores: any[],
	userLocation: { lat: number; lng: number }
): any[] {
	return stores
		.map(store => {
			const storeCoord = STORE_COORDINATES[store.id];
			if (!storeCoord) return { ...store, distance: 999 };

			const distance = calculateDistance(
				userLocation.lat,
				userLocation.lng,
				storeCoord.lat,
				storeCoord.lng
			);

			return { ...store, distance };
		})
		.sort((a, b) => a.distance - b.distance);
}

/**
 * 按名称排序门店
 */
export function sortStoresByName(stores: any[]): any[] {
	return [...stores].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

/**
 * 查找最近的门店
 */
export function findNearestStore(
	stores: any[],
	userLocation: { lat: number; lng: number }
): any | null {
	const sorted = sortStoresByDistance(stores, userLocation);
	return sorted.length > 0 ? sorted[0] : null;
}
