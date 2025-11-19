<script>
	export default {
		onLaunch: function() {
			console.log('App Launch - 叨叨房车')

			// 检查登录状态
			const token = uni.getStorageSync('token')
			if (token) {
				console.log('User is logged in')
			} else {
				console.log('User is not logged in')
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f5f5f5;
	}

	/* 重置按钮样式 */
	button {
		border: none;
		outline: none;
	}

	button::after {
		border: none;
	}

	/* 统一字体 */
	view, text, button, input {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
	}
</style>
