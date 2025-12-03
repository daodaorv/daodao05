<template>
  <view class="tour-booking">
    <!-- 线路信息卡片 -->
    <view class="tour-card">
      <view class="tour-header">
        <text class="tour-title">{{ tourInfo.title }}</text>
      </view>
      <view class="tour-meta">
        <view class="meta-item">
          <u-icon name="calendar" size="14" color="#999"></u-icon>
          <text class="meta-text">{{ tourInfo.duration }}天{{ tourInfo.duration - 1 }}晚</text>
        </view>
        <view class="meta-item">
          <u-icon name="flag" size="14" color="#999"></u-icon>
          <text class="meta-text">出发日期：{{ formatDate(batchInfo.departureDate) }}</text>
        </view>
      </view>
    </view>

    <!-- 参团人员信息 -->
    <view class="form-section">
      <view class="section-title">
        <text class="title-text">参团人员</text>
        <text class="title-tip">（至少1人）</text>
      </view>

      <!-- 成人数量 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">成人</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <view class="stepper">
            <button class="stepper-btn" @tap="decreaseAdults" :disabled="bookingForm.adults <= 1">
              <u-icon name="minus" size="16" color="#666"></u-icon>
            </button>
            <text class="stepper-value">{{ bookingForm.adults }}人</text>
            <button class="stepper-btn" @tap="increaseAdults" :disabled="totalPeople >= maxPeople">
              <u-icon name="plus" size="16" color="#666"></u-icon>
            </button>
          </view>
          <text class="price-text">¥{{ tourInfo.pricePerPerson }}/人</text>
        </view>
      </view>

      <!-- 儿童数量 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">儿童</text>
          <text class="label-tip">（12岁以下）</text>
        </view>
        <view class="item-value">
          <view class="stepper">
            <button class="stepper-btn" @tap="decreaseChildren" :disabled="bookingForm.children <= 0">
              <u-icon name="minus" size="16" color="#666"></u-icon>
            </button>
            <text class="stepper-value">{{ bookingForm.children }}人</text>
            <button class="stepper-btn" @tap="increaseChildren" :disabled="totalPeople >= maxPeople">
              <u-icon name="plus" size="16" color="#666"></u-icon>
            </button>
          </view>
          <text class="price-text">¥{{ tourInfo.childPrice }}/人</text>
        </view>
      </view>

      <!-- 人数提示 -->
      <view class="people-tip">
        <text class="tip-text">当前{{ totalPeople }}人，成团需{{ tourInfo.minPeople }}-{{ tourInfo.maxPeople }}人</text>
      </view>
    </view>

    <!-- 联系人信息 -->
    <view class="form-section">
      <view class="section-title">
        <text class="title-text">联系人信息</text>
      </view>

      <!-- 姓名 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">姓名</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <input
            class="input-field"
            v-model="bookingForm.contactName"
            placeholder="请输入联系人姓名"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">手机号</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <input
            class="input-field"
            v-model="bookingForm.contactPhone"
            name="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 身份证号 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">身份证号</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <input
            class="input-field"
            v-model="bookingForm.idCard"
            maxlength="18"
            placeholder="请输入身份证号"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 紧急联系人 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">紧急联系人</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <input
            class="input-field"
            v-model="bookingForm.emergencyContact"
            placeholder="请输入紧急联系人姓名"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 紧急联系电话 -->
      <view class="form-item">
        <view class="item-label">
          <text class="label-text">紧急联系电话</text>
          <text class="required">*</text>
        </view>
        <view class="item-value">
          <input
            class="input-field"
            v-model="bookingForm.emergencyPhone"
            name="number"
            maxlength="11"
            placeholder="请输入紧急联系电话"
            placeholder-class="input-placeholder"
          />
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-item textarea-item">
        <view class="item-label">
          <text class="label-text">备注</text>
        </view>
        <view class="item-value full-width">
          <textarea
            class="textarea-field"
            v-model="bookingForm.remark"
            placeholder="请输入特殊需求或备注信息（选填）"
            placeholder-class="input-placeholder"
            maxlength="200"
          />
          <text class="char-count">{{ bookingForm.remark.length }}/200</text>
        </view>
      </view>
    </view>

    <!-- 预订须知 -->
    <view class="notice-section">
      <view class="section-title">
        <text class="title-text">预订须知</text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in bookingNotices" :key="index">
          <text class="notice-dot">•</text>
          <text class="notice-text">{{ notice }}</text>
        </view>
      </view>
      <view class="agreement-box">
        <checkbox-group @change="onAgreementChange">
          <label class="agreement-label">
            <checkbox value="agree" :checked="agreed" color="#FF9F29" />
            <text class="agreement-text">我已阅读并同意</text>
            <text class="agreement-link" @tap.stop="viewAgreement">《旅游服务协议》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-section">
      <view class="section-title">
        <text class="title-text">价格明细</text>
      </view>
      <view class="price-list">
        <view class="price-item">
          <text class="price-label">成人费用</text>
          <text class="price-value">¥{{ tourInfo.pricePerPerson }} × {{ bookingForm.adults }}人</text>
          <text class="price-amount">¥{{ adultFee }}</text>
        </view>
        <view class="price-item" v-if="bookingForm.children > 0">
          <text class="price-label">儿童费用</text>
          <text class="price-value">¥{{ tourInfo.childPrice }} × {{ bookingForm.children }}人</text>
          <text class="price-amount">¥{{ childFee }}</text>
        </view>
        <view class="price-item">
          <text class="price-label">保险费用</text>
          <text class="price-value">¥{{ insuranceFee }}/人 × {{ totalPeople }}人</text>
          <text class="price-amount">¥{{ totalInsuranceFee }}</text>
        </view>
        <view class="price-item total">
          <text class="price-label">合计</text>
          <text class="price-amount highlight">¥{{ totalPrice }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <text class="bar-label">总计：</text>
        <view class="bar-price">
          <text class="bar-symbol">¥</text>
          <text class="bar-amount">{{ totalPrice }}</text>
        </view>
      </view>
      <button class="submit-btn" @tap="submitBooking" :disabled="!canSubmit">
        提交预订
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// 获取路由参数
const tourId = ref('');
const batchId = ref('');

onLoad((options: any) => {
  tourId.value = options.tourId || '';
  batchId.value = options.batchId || '';
  loadBookingData();
});

// 线路信息
const tourInfo = ref<any>({
  id: '',
  title: '',
  duration: 0,
  minPeople: 0,
  maxPeople: 0,
  pricePerPerson: 0,
  childPrice: 0
});

// 批次信息
const batchInfo = ref<any>({
  id: '',
  departureDate: '',
  currentPeople: 0,
  maxPeople: 0
});

// 预订表单
const bookingForm = ref({
  adults: 1,
  children: 0,
  contactName: '',
  contactPhone: '',
  idCard: '',
  emergencyContact: '',
  emergencyPhone: '',
  remark: ''
});

// 是否同意协议
const agreed = ref(false);

// 保险费用（每人）
const insuranceFee = ref(50);

// 预订须知
const bookingNotices = ref([
  '本线路为成团产品，最少5人成团，出发前7天确认是否成团',
  '高原地区，请提前做好身体准备，有高血压、心脏病等疾病者不宜参加',
  '请携带身份证、驾驶证等有效证件',
  '儿童价格适用于12岁以下，不占床位',
  '行程中如遇天气、路况等不可抗力因素，领队有权调整行程',
  '建议购买高原旅游保险'
]);

// 最大人数限制
const maxPeople = computed(() => {
  return batchInfo.value.maxPeople - batchInfo.value.currentPeople;
});

// 总人数
const totalPeople = computed(() => {
  return bookingForm.value.adults + bookingForm.value.children;
});

// 成人费用
const adultFee = computed(() => {
  return tourInfo.value.pricePerPerson * bookingForm.value.adults;
});

// 儿童费用
const childFee = computed(() => {
  return tourInfo.value.childPrice * bookingForm.value.children;
});

// 总保险费用
const totalInsuranceFee = computed(() => {
  return insuranceFee.value * totalPeople.value;
});

// 总价格
const totalPrice = computed(() => {
  return adultFee.value + childFee.value + totalInsuranceFee.value;
});

// 是否可以提交
const canSubmit = computed(() => {
  return (
    bookingForm.value.adults >= 1 &&
    totalPeople.value <= maxPeople.value &&
    bookingForm.value.contactName.trim() !== '' &&
    /^1[3-9]\d{9}$/.test(bookingForm.value.contactPhone) &&
    /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(bookingForm.value.idCard) &&
    bookingForm.value.emergencyContact.trim() !== '' &&
    /^1[3-9]\d{9}$/.test(bookingForm.value.emergencyPhone) &&
    agreed.value
  );
});

// 加载预订数据
const loadBookingData = async () => {
  try {
    uni.showLoading({ title: '加载中...' });

    // Mock数据
    const mockTour = {
      id: tourId.value,
      title: '川西秘境·稻城亚丁房车深度游',
      duration: 7,
      minPeople: 5,
      maxPeople: 12,
      pricePerPerson: 4980,
      childPrice: 2490
    };

    const mockBatch = {
      id: batchId.value,
      departureDate: '2025-12-15',
      currentPeople: 8,
      maxPeople: 12
    };

    tourInfo.value = mockTour;
    batchInfo.value = mockBatch;

  } catch (error) {
    console.error('加载预订数据失败:', error);
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 增加成人数量
const increaseAdults = () => {
  if (totalPeople.value < maxPeople.value) {
    bookingForm.value.adults++;
  }
};

// 减少成人数量
const decreaseAdults = () => {
  if (bookingForm.value.adults > 1) {
    bookingForm.value.adults--;
  }
};

// 增加儿童数量
const increaseChildren = () => {
  if (totalPeople.value < maxPeople.value) {
    bookingForm.value.children++;
  }
};

// 减少儿童数量
const decreaseChildren = () => {
  if (bookingForm.value.children > 0) {
    bookingForm.value.children--;
  }
};

// 协议变化
const onAgreementChange = (e: any) => {
  agreed.value = e.detail.value.includes('agree');
};

// 查看协议
const viewAgreement = () => {
  uni.showModal({
    title: '旅游服务协议',
    content: '这里是旅游服务协议的详细内容...',
    showCancel: false
  });
};

// 提交预订
const submitBooking = async () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请完善预订信息',
      icon: 'none'
    });
    return;
  }

  try {
    uni.showLoading({ title: '提交中...' });

    // Mock提交
    await new Promise(resolve => setTimeout(resolve, 1000));

    uni.hideLoading();
    uni.showModal({
      title: '预订成功',
      content: `您已成功预订${bookingForm.value.adults + bookingForm.value.children}个名额，请前往订单页面查看详情并完成支付`,
      showCancel: false,
      success: () => {
        uni.navigateBack({ delta: 2 });
      }
    });

  } catch (error) {
    console.error('提交预订失败:', error);
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};
</script>

<style scoped lang="scss">
.tour-booking {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 140rpx;
}

// 线路信息卡片
.tour-card {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .tour-header {
    margin-bottom: 16rpx;

    .tour-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }
  }

  .tour-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8rpx;

      .meta-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

// 表单区域
.form-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .section-title {
    display: flex;
    align-items: baseline;
    margin-bottom: 24rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .title-tip {
      font-size: 24rpx;
      color: #999;
      margin-left: 12rpx;
    }
  }

  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 2rpx solid #F0F0F0;

    &:last-child {
      border-bottom: none;
    }

    &.textarea-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .item-label {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .label-text {
        font-size: 28rpx;
        color: #333;
      }

      .label-tip {
        font-size: 22rpx;
        color: #999;
      }

      .required {
        color: #F44336;
        font-size: 28rpx;
      }
    }

    .item-value {
      display: flex;
      align-items: center;
      gap: 16rpx;

      &.full-width {
        width: 100%;
        margin-top: 16rpx;
        flex-direction: column;
        align-items: flex-end;
      }

      .input-field {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        text-align: right;
        min-width: 200rpx;
      }

      .input-placeholder {
        color: #999;
      }

      .textarea-field {
        width: 100%;
        min-height: 160rpx;
        font-size: 28rpx;
        color: #333;
        padding: 16rpx;
        background-color: #F8F8F8;
        border-radius: 8rpx;
      }

      .char-count {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }

      .stepper {
        display: flex;
        align-items: center;
        gap: 24rpx;

        .stepper-btn {
          width: 56rpx;
          height: 56rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F8F8F8;
          border-radius: 8rpx;
          border: none;
          padding: 0;

          &::after {
            border: none;
          }

          &:disabled {
            opacity: 0.5;
          }
        }

        .stepper-value {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
          min-width: 80rpx;
          text-align: center;
        }
      }

      .price-text {
        font-size: 24rpx;
        color: #FF9F29;
      }
    }
  }

  .people-tip {
    padding: 16rpx;
    background-color: rgba(255, 159, 41, 0.1);
    border-radius: 8rpx;
    margin-top: 16rpx;

    .tip-text {
      font-size: 24rpx;
      color: #FF9F29;
    }
  }
}

// 预订须知
.notice-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .section-title {
    margin-bottom: 24rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .notice-list {
    margin-bottom: 24rpx;

    .notice-item {
      display: flex;
      gap: 12rpx;
      margin-bottom: 16rpx;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .notice-dot {
        font-size: 26rpx;
        color: #FF9F29;
        flex-shrink: 0;
      }

      .notice-text {
        flex: 1;
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .agreement-box {
    padding-top: 24rpx;
    border-top: 2rpx solid #F0F0F0;

    .agreement-label {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .agreement-text {
        font-size: 26rpx;
        color: #666;
      }

      .agreement-link {
        font-size: 26rpx;
        color: #FF9F29;
      }
    }
  }
}

// 价格明细
.price-section {
  background-color: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;

  .section-title {
    margin-bottom: 24rpx;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .price-list {
    .price-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #F0F0F0;

      &:last-child {
        border-bottom: none;
      }

      &.total {
        padding-top: 24rpx;
        margin-top: 8rpx;
        border-top: 2rpx solid #E0E0E0;

        .price-label {
          font-size: 30rpx;
          font-weight: 600;
        }

        .price-amount {
          font-size: 36rpx;
        }
      }

      .price-label {
        font-size: 28rpx;
        color: #333;
        min-width: 120rpx;
      }

      .price-value {
        flex: 1;
        font-size: 24rpx;
        color: #999;
        text-align: center;
      }

      .price-amount {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;

        &.highlight {
          color: #F44336;
          font-weight: 700;
        }
      }
    }
  }
}

// 底部操作栏
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #FFFFFF;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;

  .bar-left {
    display: flex;
    align-items: baseline;
    gap: 8rpx;

    .bar-label {
      font-size: 26rpx;
      color: #666;
    }

    .bar-price {
      display: flex;
      align-items: baseline;

      .bar-symbol {
        font-size: 24rpx;
        color: #F44336;
        font-weight: 600;
      }

      .bar-amount {
        font-size: 40rpx;
        color: #F44336;
        font-weight: 700;
        margin-left: 4rpx;
      }
    }
  }

  .submit-btn {
    padding: 20rpx 64rpx;
    background: linear-gradient(135deg, #FF9F29 0%, #FFB84D 100%);
    color: #FFFFFF;
    border-radius: 44rpx;
    font-size: 28rpx;
    font-weight: 600;
    border: none;

    &::after {
      border: none;
    }

    &:disabled {
      background: #E0E0E0;
      color: #999;
    }
  }
}
</style>
