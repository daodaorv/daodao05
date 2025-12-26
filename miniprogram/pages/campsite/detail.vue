<template>
  <view class="campsite-detail">
    <!-- 图片轮播 -->
    <view class="swiper-wrapper">
        <u-swiper
            :list="campsiteDetail.images"
            height="500"
            indicator
            indicatorMode="line"
            circular
            radius="0"
        ></u-swiper>
    </view>

    <!-- 营地基本信息 -->
    <view class="campsite-info-section">
      <view class="name-header">
        <text class="campsite-name">{{ campsiteDetail.name }}</text>
        <view v-if="campsiteDetail.isHot" class="hot-badge-wrapper">
          <u-tag text="热门" type="error" shape="checkmark-circle" size="mini" icon="star-fill"></u-tag>
        </view>
      </view>

      <!-- 评分信息 -->
      <view class="rating-section">
        <view class="rating-main">
          <u-rate :count="5" v-model="campsiteDetail.rating" readonly allowHalf activeColor="#FF9F29" size="18"></u-rate>
          <text class="rating-score">{{ campsiteDetail.rating }}</text>
          <text class="rating-count">({{ campsiteDetail.reviewCount }}条评价)</text>
        </view>
      </view>

      <!-- 位置信息 -->
      <view class="location-section" @tap="openLocation">
        <u-icon name="map-fill" size="16" color="#FF9F29"></u-icon>
        <text class="location-text">{{ campsiteDetail.address }}</text>
        <text class="distance-text">距离{{ campsiteDetail.distance }}km</text>
        <u-icon name="arrow-right" size="12" color="#999"></u-icon>
      </view>

      <!-- 价格信息 -->
      <view class="price-section">
        <view class="price-main">
          <text class="price-symbol">¥</text>
          <text class="price-amount">{{ campsiteDetail.minPrice }}</text>
          <text class="price-unit">/晚起</text>
        </view>
      </view>
    </view>

    <!-- 公告栏 -->
    <AnnouncementBar :content="campsiteDetail.announcement" />

    <!-- 营地特色标签 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地特色</text>
      </view>
      <view class="feature-tags">
        <u-tag 
            v-for="feature in (campsiteDetail.features || [])" 
            :key="feature" 
            :text="feature" 
            plain 
            type="success" 
            shape="checkmark-circle" 
            size="mini" 
            icon="checkmark-circle"
            style="margin-right: 16rpx; margin-bottom: 16rpx;"
        ></u-tag>
      </view>
    </view>

    <!-- 营地设施 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地设施</text>
      </view>
      <view class="facility-grid">
        <view class="facility-item" v-for="facility in (campsiteDetail.facilities || [])" :key="facility.name">
          <u-icon :name="facility.icon" size="24" color="#FF9F29"></u-icon>
          <text class="facility-name">{{ facility.name }}</text>
        </view>
      </view>
    </view>

    <!-- 营位类型 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营位类型</text>
      </view>
      <view class="site-types">
        <view
          class="site-type-card"
          v-for="siteType in (campsiteDetail.siteTypes || [])"
          :key="siteType.id"
          :class="{
            selected: selectedSiteTypeId === siteType.id,
            disabled: siteType.available === 0
          }"
          @click="selectSiteType(siteType)"
        >
          <view class="site-type-header">
            <text class="site-type-name">{{ siteType.name }}</text>
            <u-tag 
                :text="siteType.available > 0 ? `剩余${siteType.available}个` : '已满'" 
                :type="siteType.available > 0 ? 'success' : 'info'" 
                plain 
                size="mini"
            ></u-tag>
          </view>
          <text class="site-type-desc">{{ siteType.description }}</text>
          <view class="site-type-specs">
            <text class="spec-item">面积：{{ siteType.area }}㎡</text>
            <text class="spec-item">容纳：{{ siteType.capacity }}人</text>
          </view>
          <view class="site-type-footer">
            <view class="site-price">
              <text class="price-amount">¥{{ siteType.price }}</text>
              <text class="price-unit">/晚</text>
            </view>
            <u-button 
                :type="siteType.available > 0 ? 'primary' : 'info'" 
                shape="checkmark-circle" 
                size="small" 
                :text="siteType.available > 0 ? (selectedSiteTypeId === siteType.id ? '已选中' : '选择营位') : '已满'"
                :disabled="siteType.available === 0"
                @click.stop="selectSiteType(siteType)"
                customStyle="width: 160rpx; height: 60rpx;"
            ></u-button>
          </view>
        </view>
      </view>
    </view>

    <!-- 营地介绍 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地介绍</text>
      </view>
      <u-read-more :toggle="true" show-height="200">
          <!-- 使用 rich-text 组件支持富文本内容 -->
          <rich-text
            class="description-text"
            :nodes="campsiteDetail.descriptionHtml || campsiteDetail.description"
          ></rich-text>
      </u-read-more>
    </view>

    <!-- 营地政策 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">营地政策</text>
      </view>
      <TextExpandable
        :content="campsitePolicyText"
        title="营地政策"
      >
        <template #collapsed>
          <view class="policy-content-collapsed">
            <!-- 入住须知 -->
            <view class="policy-section">
              <text class="policy-section-title">入住须知</text>
              <view class="notice-item" v-for="(notice, index) in (campsiteDetail.checkInNotices || [])" :key="index">
                <text class="notice-number">{{ index + 1 }}.</text>
                <text class="notice-text">{{ notice }}</text>
              </view>
            </view>

            <!-- 取消政策 -->
            <view class="policy-section">
              <text class="policy-section-title">取消政策</text>
              <view class="policy-item" v-for="policy in (campsiteDetail.cancellationPolicy || [])" :key="policy.condition">
                <view class="policy-condition">
                  <u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
                  <text class="condition-text">{{ policy.condition }}</text>
                </view>
                <text class="policy-result">{{ policy.result }}</text>
              </view>
            </view>
          </view>
        </template>
        <template #full>
          <view class="policy-content-full">
            <!-- 入住须知 -->
            <view class="policy-section">
              <text class="policy-section-title">入住须知</text>
              <view class="notice-item" v-for="(notice, index) in (campsiteDetail.checkInNotices || [])" :key="index">
                <text class="notice-number">{{ index + 1 }}.</text>
                <text class="notice-text">{{ notice }}</text>
              </view>
            </view>

            <!-- 取消政策 -->
            <view class="policy-section">
              <text class="policy-section-title">取消政策</text>
              <view class="policy-item" v-for="policy in (campsiteDetail.cancellationPolicy || [])" :key="policy.condition">
                <view class="policy-condition">
                  <u-icon name="info-circle-fill" size="16" color="#FF9F29"></u-icon>
                  <text class="condition-text">{{ policy.condition }}</text>
                </view>
                <text class="policy-result">{{ policy.result }}</text>
              </view>
            </view>
          </view>
        </template>
      </TextExpandable>
    </view>

    <!-- 用户评价 -->
    <view class="section-card">
      <view class="section-title">
        <text class="title-text">用户评价</text>
        <text class="title-count">({{ campsiteDetail.reviewCount }}条)</text>
      </view>
      <view class="review-list">
        <view class="review-item" v-for="review in (campsiteDetail.reviews || [])" :key="review.id">
          <view class="review-header">
            <u-avatar :src="review.userAvatar" size="32"></u-avatar>
            <view class="user-info">
              <text class="user-name">{{ review.userName }}</text>
              <view class="review-rating">
                <u-rate :count="5" v-model="review.rating" readonly activeColor="#FF9F29" size="12"></u-rate>
              </view>
            </view>
            <text class="review-date">{{ formatDate(review.createdAt) }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <view v-if="review.images && review.images.length > 0" class="review-images">
             <u-album :urls="review.images" multipleSize="60"></u-album>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-left">
        <view class="bar-price">
          <text class="bar-symbol">¥</text>
          <text class="bar-amount">{{ campsiteDetail.minPrice }}</text>
        </view>
        <text class="bar-tip">/晚起</text>
      </view>
      <view class="bar-actions">
        <view class="action-btn-wrapper">
            <u-button shape="circle" plain type="warning" icon="share-fill" @click="handleShare"></u-button>
        </view>
        <view class="action-btn-wrapper">
            <u-button shape="circle" plain type="warning" icon="chat" text="咨询" @click="contactService"></u-button>
        </view>
        <view class="action-btn-wrapper">
            <u-button shape="circle" type="primary" text="立即预订" @click="bookNow"></u-button>
        </view>
      </view>
    </view>

    <!-- 分享面板 -->
    <ShareSheet
      v-model:show="showShareSheet"
      @select="handleShareSelect"
    />

    <!-- 海报预览 -->
    <PosterPreview
      v-model:show="showPosterPopup"
      :poster-image="posterImage"
      @save="savePoster"
    />
  </view>
</template>

<script setup lang="ts">
import { logger } from '@/utils/logger';
import { ref, computed } from 'vue';
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import { useShare } from '@/composables/useShare';
import { ShareScene } from '@/types/share';
import { getCampsiteDetail } from '@/api/campsite';
import ShareSheet from '@/components/share/ShareSheet.vue';
import PosterPreview from '@/components/share/PosterPreview.vue';
import AnnouncementBar from '@/components/common/AnnouncementBar.vue';
import TextExpandable from '@/components/common/TextExpandable.vue';

// 获取路由参数
const campsiteId = ref('');

// 营地详情数据
const campsiteDetail = ref<any>({
  id: '',
  name: '加载中...',
  images: [],
  rating: 0,
  reviewCount: 0,
  address: '',
  distance: 0,
  minPrice: 0,
  isHot: false,
  announcement: '',
  features: [],
  facilities: [],
  siteTypes: [],
  description: '',
  checkInNotices: [],
  cancellationPolicy: [],
  reviews: []
});

// 分享功能
const {
  showShareSheet,
  showPosterPopup,
  posterImage,
  openShareSheet,
  handleShareSelect,
  savePoster,
  getShareContent
} = useShare({
  title: `【叨叨房车】${campsiteDetail.value.name}`,
  desc: `${campsiteDetail.value.address} | ¥${campsiteDetail.value.minPrice}/晚 | ${campsiteDetail.value.rating}分`,
  imageUrl: campsiteDetail.value.images[0] || 'https://picsum.photos/750/500?random=1',
  path: '/pages/campsite/detail',
  scene: ShareScene.CAMPSITE,
  businessId: campsiteId.value || 'demo_campsite',
  query: {
    id: campsiteId.value || 'demo_campsite'
  }
});

onLoad((options: any) => {
  campsiteId.value = options.id || '';
  loadCampsiteDetail();

  // 处理分享来源
  if (options.share_from) {
    logger.info('来自分享', {
      scene: options.share_scene,
      from: options.share_from,
      businessId: options.share_id
    });
  }
});

// 配置微信分享
onShareAppMessage(() => {
  return getShareContent();
});

// 打开分享面板
const handleShare = () => {
  openShareSheet();
};

// 加载营地详情
const loadCampsiteDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' });

    // 尝试从后端 API 获取数据
    try {
      const response = await getCampsiteDetail(campsiteId.value);

      if (response.code === 200 && response.data) {
        logger.info('成功从后端获取营地详情', { campsiteId: campsiteId.value });
        campsiteDetail.value = response.data;

        // 自动选择第一个可用的营位类型
        const firstAvailable = response.data.siteTypes.find((t: any) => t.available > 0);
        selectedSiteTypeId.value = firstAvailable ? firstAvailable.id : '';

        uni.hideLoading();
        return;
      }
    } catch (apiError) {
      // API 调用失败，记录错误并使用 Mock 数据降级
      logger.warn('后端 API 调用失败，使用 Mock 数据', {
        error: apiError,
        campsiteId: campsiteId.value
      });
    }

    // Mock数据（降级方案：当后端 API 不可用时使用）
    // 注意：announcement、checkInNotices、cancellationPolicy 应从后端 API 获取
    logger.info('使用 Mock 数据加载营地详情', { campsiteId: campsiteId.value });
    const mockDetail = {
      id: campsiteId.value,
      name: '千岛湖房车营地',
      images: [
        // 使用占位图片，实际项目中应替换为真实的营地图片
        'https://picsum.photos/750/500?random=1',
        'https://picsum.photos/750/500?random=2',
        'https://picsum.photos/750/500?random=3',
        'https://picsum.photos/750/500?random=4'
      ],
      rating: 4.8,
      reviewCount: 156,
      address: '浙江省杭州市淳安县千岛湖镇环湖路88号',
      distance: 5.2,
      minPrice: 280,
      isHot: true,
      announcement: '【营地公告】周末及节假日营位紧张，建议提前3天预订。本周末（12月21-22日）将举办篝火晚会活动，欢迎参加。营地内禁止燃放烟花爆竹，请遵守营地管理规定。宠物需牵绳并清理粪便。',
      features: ['湖景', '烧烤区', 'WiFi覆盖', '24小时热水', '儿童乐园', '宠物友好'],
      facilities: [
        { name: '淋浴间', icon: 'star-fill' },
        { name: '卫生间', icon: 'home' },
        { name: '洗衣房', icon: 'setting' },
        { name: '充电桩', icon: 'plus-circle-fill' },
        { name: '烧烤区', icon: 'star-fill' },
        { name: '停车场', icon: 'map' },
        { name: '便利店', icon: 'bag' },
        { name: 'WiFi', icon: 'wifi' }
      ],
      siteTypes: [
        {
          id: '1',
          name: '标准营位',
          description: '适合小型房车或帐篷，配备基础设施',
          area: 50,
          capacity: 4,
          price: 280,
          available: 8
        },
        {
          id: '2',
          name: '豪华营位A',
          description: '湖景位置，配备独立水电，适合中大型房车',
          area: 80,
          capacity: 6,
          price: 380,
          available: 3
        },
        {
          id: '3',
          name: '豪华营位B',
          description: '一线湖景，配备独立卫浴，超大空间',
          area: 120,
          capacity: 8,
          price: 580,
          available: 0
        }
      ],
      description: '千岛湖房车营地位于风景秀丽的千岛湖畔，占地面积约50亩，是华东地区首屈一指的高端房车营地。营地依山傍水，环境优美，设施完善，为房车爱好者提供了一个理想的休闲度假场所。\n\n营地配备了现代化的水电设施、24小时热水淋浴、独立卫生间、洗衣房等基础设施。同时还设有烧烤区、儿童游乐场、湖边观景台等休闲娱乐设施。营地全区域覆盖WiFi，让您在享受大自然的同时也能保持与外界的联系。',
      // 富文本内容（支持HTML标签）
      descriptionHtml: `
        <div style="line-height: 1.8; color: #666;">
          <p style="margin-bottom: 16px;">
            <strong style="color: #333; font-size: 16px;">千岛湖房车营地</strong>位于风景秀丽的千岛湖畔，占地面积约<span style="color: #FF9F29;">50亩</span>，是华东地区首屈一指的高端房车营地。
          </p>

          <p style="margin-bottom: 16px;">
            营地<strong>依山傍水</strong>，环境优美，设施完善，为房车爱好者提供了一个理想的休闲度假场所。
          </p>

          <h3 style="color: #333; font-size: 15px; margin: 20px 0 12px 0;">🏕️ 基础设施</h3>
          <ul style="padding-left: 20px; margin-bottom: 16px;">
            <li style="margin-bottom: 8px;">现代化水电设施，满足各类房车需求</li>
            <li style="margin-bottom: 8px;">24小时热水淋浴，舒适便捷</li>
            <li style="margin-bottom: 8px;">独立卫生间，干净卫生</li>
            <li style="margin-bottom: 8px;">洗衣房配备，长途旅行无忧</li>
          </ul>

          <h3 style="color: #333; font-size: 15px; margin: 20px 0 12px 0;">🎉 休闲娱乐</h3>
          <ul style="padding-left: 20px; margin-bottom: 16px;">
            <li style="margin-bottom: 8px;">烧烤区：与家人朋友享受户外烧烤乐趣</li>
            <li style="margin-bottom: 8px;">儿童游乐场：孩子们的欢乐天地</li>
            <li style="margin-bottom: 8px;">湖边观景台：欣赏千岛湖美景的最佳位置</li>
            <li style="margin-bottom: 8px;">全区域WiFi覆盖：保持与外界的联系</li>
          </ul>

          <p style="margin-top: 20px; padding: 12px; background-color: #FFF7E6; border-left: 3px solid #FF9F29; border-radius: 4px;">
            <strong style="color: #FF9F29;">温馨提示：</strong>营地周末及节假日营位紧张，建议提前3-5天预订，以确保您的出行计划顺利进行。
          </p>
        </div>
      `,
      checkInNotices: [
        '入住时间：14:00后，退房时间：12:00前',
        '请携带有效身份证件办理入住手续',
        '营地内禁止明火，烧烤请在指定区域进行',
        '请保持营地环境卫生，垃圾分类投放',
        '夜间22:00后请保持安静，避免影响他人休息',
        '宠物需牵绳，并清理宠物粪便',
        '车辆限速5km/h，注意行人安全'
      ],
      cancellationPolicy: [
        { condition: '入住前3天以上取消', result: '全额退款' },
        { condition: '入住前1-3天取消', result: '退款50%' },
        { condition: '入住当天取消', result: '不予退款' }
      ],
      reviews: [
        {
          id: '1',
          userName: '房车旅行家',
          userAvatar: 'https://picsum.photos/100/100?random=10',
          rating: 5,
          content: '营地环境非常好，设施齐全，工作人员服务态度很好。湖景位置视野开阔，晚上可以看星星。强烈推荐！',
          images: [
            'https://picsum.photos/200/150?random=11',
            'https://picsum.photos/200/150?random=12'
          ],
          createdAt: '2025-11-25'
        },
        {
          id: '2',
          userName: '自驾游爱好者',
          userAvatar: 'https://picsum.photos/100/100?random=13',
          rating: 4,
          content: '整体不错，就是周末人比较多。建议工作日来会更安静一些。',
          images: [],
          createdAt: '2025-11-20'
        }
      ]
    };

    campsiteDetail.value = mockDetail;
    const firstAvailable = mockDetail.siteTypes.find((t: any) => t.available > 0);
    selectedSiteTypeId.value = firstAvailable ? firstAvailable.id : '';

  } catch (error) {
    logger.error('加载营地详情失败:', error);
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
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

// 联系客服
const contactService = () => {
  uni.makePhoneCall({
    phoneNumber: '400-123-4567'
  });
};

// 预订营位
const selectedSiteTypeId = ref('');
const selectedSiteType = computed(() => {
  return (campsiteDetail.value.siteTypes || []).find((t: any) => t.id === selectedSiteTypeId.value);
});

// 营地政策文本（合并入住须知和取消政策）
const campsitePolicyText = computed(() => {
  const notices = (campsiteDetail.value.checkInNotices || [])
    .map((notice: string, index: number) => `${index + 1}. ${notice}`)
    .join('\n');

  const policies = (campsiteDetail.value.cancellationPolicy || [])
    .map((policy: any) => `${policy.condition}\n${policy.result}`)
    .join('\n\n');

  return `入住须知\n${notices}\n\n取消政策\n${policies}`;
});

const selectSiteType = (siteType: any) => {
  if (siteType.available === 0) {
    uni.showToast({
      title: '该营位已满',
      icon: 'none'
    });
    return;
  }
  selectedSiteTypeId.value = siteType.id;
};

const bookNow = () => {
  if (!selectedSiteType.value) {
    uni.showToast({
      title: '请选择营位类型',
      icon: 'none'
    });
    return;
  }
  if (selectedSiteType.value.available === 0) {
    uni.showToast({
      title: '该营位已满',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: `/pages/campsite/booking?campsiteId=${campsiteId.value}&siteTypeId=${selectedSiteType.value.id}`
  });
};
</script>

<style scoped lang="scss">
.campsite-detail {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding-bottom: 120rpx;
}

// 图片轮播
.swiper-wrapper {
  width: 100%;
  height: 500rpx;
}

// 营地基本信息
.campsite-info-section {
  background-color: $uni-bg-color-card;
  padding: $uni-spacing-xl;
  margin-bottom: $uni-spacing-lg;

  .name-header {
    display: flex;
    align-items: center;
    gap: $uni-spacing-lg;
    margin-bottom: $uni-spacing-lg;

    .campsite-name {
      font-size: 36rpx;
      font-weight: 700;
      color: $uni-text-color;
    }

    .hot-badge-wrapper {
      margin-left: $uni-spacing-lg;
    }
  }

  .rating-section {
    margin-bottom: $uni-spacing-lg;

    .rating-main {
      display: flex;
      align-items: center;
      gap: $uni-spacing-sm;

      .rating-score {
        font-size: $uni-font-size-lg;
        font-weight: 600;
        color: $uni-text-color;
      }

      .rating-count {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-placeholder;
      }
    }
  }

  .location-section {
    display: flex;
    align-items: center;
    gap: $uni-spacing-sm;
    margin-bottom: $uni-spacing-xl;
    transition: all 0.2s ease;

    &:active {
      opacity: 0.7;
    }

    .location-text {
      flex: 1;
      font-size: $uni-font-size-base;
      color: $uni-text-color-secondary;
    }

    .distance-text {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-placeholder;
    }
  }

  .price-section {
    .price-main {
      display: flex;
      align-items: baseline;

      .price-symbol {
        font-size: $uni-font-size-lg;
        color: $uni-color-error;
        font-weight: 600;
      }

      .price-amount {
        font-size: 56rpx;
        color: $uni-color-error;
        font-weight: 700;
        margin: 0 $uni-spacing-sm;
        font-family: 'DIN Alternate', sans-serif;
      }

      .price-unit {
        font-size: $uni-font-size-lg;
        color: $uni-text-color-placeholder;
      }
    }
  }
}

// 通用卡片样式
.section-card {
  background-color: $uni-bg-color-card;
  padding: $uni-spacing-xl;
  margin-bottom: $uni-spacing-lg;
  box-shadow: $uni-shadow-card;

  .section-title {
    display: flex;
    align-items: baseline;
    margin-bottom: $uni-spacing-xl;

    .title-text {
      font-size: $uni-font-size-lg;
      font-weight: 600;
      color: $uni-text-color;
    }

    .title-count {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-placeholder;
      margin-left: $uni-spacing-md;
    }
  }
}

// 特色标签
.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $uni-spacing-lg;

  .feature-tag {
    display: flex;
    align-items: center;
    gap: $uni-spacing-sm;
    background-color: rgba($uni-color-success, 0.1);
    padding: $uni-spacing-md $uni-spacing-lg;
    border-radius: $uni-radius-md;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }

    .feature-text {
      font-size: $uni-font-size-base;
      color: $uni-color-success;
      font-weight: 500;
    }
  }
}

// 设施网格
.facility-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $uni-spacing-xl;

  .facility-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $uni-spacing-md;
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.95);
    }

    .facility-name {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-secondary;
      text-align: center;
    }
  }
}

// 营位类型
.site-types {
  .site-type-card {
    background-color: $uni-bg-color-grey;
    border-radius: $uni-radius-lg;
    padding: $uni-spacing-xl;
    margin-bottom: $uni-spacing-lg;
    border: 2rpx solid transparent;
    transition: all 0.2s ease;

    &.selected {
      border-color: $uni-color-primary;
      background-color: rgba($uni-color-primary, 0.08);
    }

    &.disabled {
      opacity: 0.6;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &:active:not(.disabled) {
      transform: scale(0.99);
    }

    .site-type-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $uni-spacing-md;

      .site-type-name {
        font-size: $uni-font-size-lg;
        font-weight: 600;
        color: $uni-text-color;
      }

      .site-type-badge {
        background-color: rgba($uni-color-success, 0.1);
        color: $uni-color-success;
        font-size: $uni-font-size-xs;
        padding: $uni-spacing-xs $uni-spacing-md;
        border-radius: $uni-radius-md;

        &.unavailable {
          background-color: $uni-bg-color-grey;
          color: $uni-text-color-placeholder;
        }
      }
    }

    .site-type-desc {
      font-size: $uni-font-size-base;
      color: $uni-text-color-secondary;
      margin-bottom: $uni-spacing-lg;
      display: block;
    }

    .site-type-specs {
      display: flex;
      gap: $uni-spacing-xl;
      margin-bottom: $uni-spacing-lg;

      .spec-item {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-placeholder;
      }
    }

    .site-type-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .site-price {
        display: flex;
        align-items: baseline;

        .price-amount {
          font-size: 36rpx;
          font-weight: 700;
          color: $uni-color-error;
          font-family: 'DIN Alternate', sans-serif;
        }

        .price-unit {
          font-size: $uni-font-size-sm;
          color: $uni-text-color-placeholder;
          margin-left: 4rpx;
        }
      }

      .book-btn {
        padding: $uni-spacing-lg $uni-spacing-xl;
        background: $uni-color-primary-gradient;
        color: $uni-text-color-inverse;
        border-radius: $uni-radius-btn;
        font-size: $uni-font-size-base;
        border: none;
        transition: all 0.2s ease;

        &::after {
          border: none;
        }

        &:active {
          transform: scale(0.98);
          opacity: 0.9;
        }

        &.disabled {
          background: $uni-bg-color-grey;
          color: $uni-text-color-placeholder;
        }
      }
    }
  }
}

// 营地介绍
.description-text {
  font-size: $uni-font-size-lg;
  color: $uni-text-color-secondary;
  line-height: 1.8;
  white-space: pre-line;

  // 富文本样式支持
  :deep(p) {
    margin-bottom: 16rpx;
  }

  :deep(strong) {
    font-weight: 600;
    color: $uni-text-color;
  }

  :deep(ul) {
    padding-left: 40rpx;
    margin-bottom: 16rpx;
  }

  :deep(li) {
    margin-bottom: 8rpx;
  }

  :deep(h3) {
    color: $uni-text-color;
    font-size: $uni-font-size-lg;
    font-weight: 600;
    margin: 20rpx 0 12rpx 0;
  }
}

// 营地政策（合并入住须知和取消政策）
.policy-content-collapsed,
.policy-content-full {
  .policy-section {
    margin-bottom: $uni-spacing-xl;

    &:last-child {
      margin-bottom: 0;
    }

    .policy-section-title {
      display: block;
      font-size: $uni-font-size-lg;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: $uni-spacing-lg;
    }

    // 入住须知样式
    .notice-item {
      display: flex;
      gap: $uni-spacing-md;
      margin-bottom: $uni-spacing-lg;
      line-height: 1.6;
      width: 100%;

      &:last-child {
        margin-bottom: 0;
      }

      .notice-number {
        font-size: $uni-font-size-base;
        color: $uni-color-primary;
        font-weight: 600;
        flex-shrink: 0;
      }

      .notice-text {
        flex: 1;
        font-size: $uni-font-size-base;
        color: $uni-text-color-secondary;
        word-wrap: break-word;
        word-break: break-word;
        min-width: 0;
      }
    }

    // 取消政策样式
    .policy-item {
      padding: $uni-spacing-lg;
      background-color: $uni-bg-color-grey;
      border-radius: $uni-radius-lg;
      margin-bottom: $uni-spacing-lg;
      width: 100%;
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 0;
      }

      .policy-condition {
        display: flex;
        align-items: center;
        gap: $uni-spacing-sm;
        margin-bottom: $uni-spacing-md;
        width: 100%;

        .condition-text {
          flex: 1;
          font-size: $uni-font-size-lg;
          color: $uni-text-color;
          font-weight: 500;
          word-wrap: break-word;
          word-break: break-word;
          min-width: 0;
        }
      }

      .policy-result {
        font-size: $uni-font-size-base;
        color: $uni-text-color-secondary;
        padding-left: 26rpx;
        word-wrap: break-word;
        word-break: break-word;
        display: block;
      }
    }
  }
}

// 用户评价
.review-list {
  .review-item {
    padding-bottom: $uni-spacing-xl;
    margin-bottom: $uni-spacing-xl;
    border-bottom: 2rpx solid $uni-border-color-light;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: $uni-spacing-lg;
      margin-bottom: $uni-spacing-lg;

      .user-info {
        flex: 1;

        .user-name {
          display: block;
          font-size: $uni-font-size-lg;
          font-weight: 500;
          color: $uni-text-color;
          margin-bottom: $uni-spacing-sm;
        }

        .review-rating {
          display: flex;
          gap: 4rpx;
        }
      }

      .review-date {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-placeholder;
      }
    }

    .review-content {
      font-size: $uni-font-size-lg;
      color: $uni-text-color-secondary;
      line-height: 1.6;
      margin-bottom: $uni-spacing-lg;
      display: block;
    }

    .review-images {
      display: flex;
      gap: $uni-spacing-md;

      .review-image {
        width: 160rpx;
        height: 120rpx;
        border-radius: $uni-radius-md;
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
  background-color: $uni-bg-color-card;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $uni-spacing-lg $uni-spacing-xl;
  padding-bottom: calc(#{$uni-spacing-lg} + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 100;

  .bar-left {
    display: flex;
    align-items: baseline;

    .bar-price {
      display: flex;
      align-items: baseline;

      .bar-symbol {
        font-size: $uni-font-size-lg;
        color: $uni-color-error;
        font-weight: 600;
      }

      .bar-amount {
        font-size: 44rpx;
        color: $uni-color-error;
        font-weight: 700;
        margin: 0 4rpx;
        font-family: 'DIN Alternate', sans-serif;
      }
    }

    .bar-tip {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-placeholder;
      margin-left: 4rpx;
    }
  }

  .bar-actions {
    display: flex;
    align-items: center;
    gap: $uni-spacing-md;

    .contact-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: none;
      padding: 0 $uni-spacing-lg;
      line-height: 1.2;
      transition: all 0.2s ease;

      &::after { border: none; }

      &:active {
        opacity: 0.7;
      }

      text {
        font-size: $uni-font-size-xs;
        color: $uni-text-color-secondary;
        margin-top: 4rpx;
      }
    }

    .book-btn {
      background: $uni-color-primary-gradient;
      color: $uni-text-color-inverse;
      font-size: $uni-font-size-base;
      font-weight: 600;
      padding: 0 40rpx;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: $uni-radius-btn;
      margin: 0;
      box-shadow: $uni-shadow-glow;
      transition: all 0.2s ease;

      &::after { border: none; }

      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    }
  }
}
</style>
