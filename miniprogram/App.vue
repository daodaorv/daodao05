<script>
import { useUserStore } from '@/stores/user';
import { checkAndUpdateLoginStatus } from '@/utils/auth';

	export default {
		async onLaunch() {
			const userStore = useUserStore();
			userStore.init();
			checkAndUpdateLoginStatus();

			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')

			// 添加字体加载检查
			console.log('🔍 ========== uView Plus 字体配置检查 ==========');
			uni.getSystemInfo({
				success: (res) => {
					console.log('🔍 当前平台:', res.platform);
					console.log('🔍 微信版本:', res.version);
					console.log('🔍 基础库版本:', res.SDKVersion);
				}
			});

			// 检查字体文件是否存在
			console.log('🔍 字体文件路径: /static/uicon-iconfont.ttf');
			console.log('🔍 ========================================');
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 按照 uview-plus 官方文档要求，第一行导入 uview-plus 样式 */
	@import "uview-plus/index.scss";

	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	/* 强制加载 uView Plus 本地字体 - 使用相对路径 */
	@font-face {
		font-family: 'uicon-iconfont';
		src: url('~@/static/uicon-iconfont.ttf') format('truetype');
	}
	/* #endif */

	// 设置整个项目的背景色
	page {
		background-color: #F5F7FA;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
	}

	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
