<template>
  <view class="new-car-hosting">
    <view class="banner">
      <text class="title">0首付购车托管</text>
      <text class="desc">保底3500元/月 + 超额70%分成</text>
    </view>

    <!-- 热门车型 -->
    <view class="models-section">
      <view class="section-title">热门车型</view>
      <view class="model-list">
        <view v-for="model in models" :key="model.id" class="model-card" @click="selectModel(model)">
          <image :src="model.image" class="model-img" mode="aspectFill"></image>
          <view class="model-info">
            <text class="model-name">{{ model.name }}</text>
            <text class="model-price">月供参考：¥{{ model.monthlyPayment }}/月</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 申请表单 -->
    <view class="form-section">
      <input class="input" v-model="form.name" placeholder="姓名" />
      <input class="input" v-model="form.phone" name="number" placeholder="联系电话" />
    </view>

    <button class="submit-btn" @click="submit">提交申请</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      models: [
        { id: 1, name: '上汽大通V90', image: '/static/logo.png', monthlyPayment: 4500 },
        { id: 2, name: '览众勇士', image: '/static/logo.png', monthlyPayment: 5200 }
      ],
      form: { name: '', phone: '' }
    }
  },
  methods: {
    selectModel(model) {
      console.log('选择车型:', model)
    },
    submit() {
      if (!this.form.name || !this.form.phone) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      uni.showModal({
        title: '提交成功',
        content: '我们将在24小时内联系您',
        showCancel: false,
        success: () => uni.navigateBack()
      })
    }
  }
}
</script>

<style scoped>
.new-car-hosting { min-height: 100vh; background: #F5F5F5; padding-bottom: 40rpx; }
.banner { background: linear-gradient(135deg, #FF9F29 0%, #FF7A00 100%); padding: 48rpx 32rpx; text-align: center; color: #FFF; }
.banner .title { display: block; font-size: 36rpx; font-weight: 600; margin-bottom: 16rpx; }
.banner .desc { display: block; font-size: 24rpx; opacity: 0.9; }
.models-section, .form-section { margin: 24rpx 32rpx; background: #FFF; border-radius: 16rpx; padding: 32rpx; }
.section-title { font-size: 32rpx; font-weight: 600; margin-bottom: 24rpx; }
.model-card { display: flex; margin-bottom: 24rpx; border: 1rpx solid #EEE; border-radius: 12rpx; overflow: hidden; }
.model-img { width: 200rpx; height: 150rpx; }
.model-info { flex: 1; padding: 24rpx; }
.model-name { display: block; font-size: 28rpx; font-weight: 600; margin-bottom: 8rpx; }
.model-price { display: block; font-size: 24rpx; color: #FF9F29; }
.input { height: 88rpx; background: #F5F5F5; border-radius: 12rpx; padding: 0 24rpx; margin-bottom: 24rpx; }
.submit-btn { width: calc(100% - 64rpx); height: 88rpx; background: #FF9F29; color: #FFF; border-radius: 48rpx; font-size: 32rpx; font-weight: 600; border: none; margin: 0 32rpx; }
</style>
