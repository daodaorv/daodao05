/**
 * 通用上传接口
 * 目前用于上传驾驶证照片等用户资料
 */

type DriverLicenseSide = 'front' | 'back';

const UPLOAD_ENDPOINT = 'http://localhost:3001/api/v1/upload/driver-license';
const USE_UPLOAD_MOCK = true;

export function uploadDriverLicenseImage(filePath: string, side: DriverLicenseSide): Promise<string> {
	if (!filePath) {
		return Promise.reject(new Error('未选择图片'));
	}

	if (USE_UPLOAD_MOCK) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(`https://cdn.daodao-rv.com/mock/license/${side}-${Date.now()}.jpg`);
			}, 400);
		});
	}

	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: UPLOAD_ENDPOINT,
			filePath,
			name: 'file',
			formData: { side },
			success: (res) => {
				try {
					const data = JSON.parse(res.data || '{}');
					if (data.code === 0 && data.data?.url) {
						resolve(data.data.url);
					} else {
						reject(new Error(data.message || '上传失败'));
					}
				} catch (error) {
					reject(error instanceof Error ? error : new Error(String(error)));
				}
			},
			fail: reject
		});
	});
}

