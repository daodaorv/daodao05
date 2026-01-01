<template>
  <div class="miniprogram-preview">
    <el-card class="preview-card" shadow="never">
      <template #header>
        <div class="preview-header">
          <span class="preview-title">小程序页面预览</span>
          <el-button-group>
            <el-button
              :type="previewPage === 'home' ? 'primary' : ''"
              size="small"
              @click="previewPage = 'home'"
            >
              首页
            </el-button>
            <el-button
              :type="previewPage === 'hosting' ? 'primary' : ''"
              size="small"
              @click="previewPage = 'hosting'"
            >
              托管页
            </el-button>
          </el-button-group>
        </div>
      </template>

      <!-- 手机模拟器外壳 -->
      <div class="phone-simulator">
        <!-- 手机顶部状态栏 -->
        <div class="phone-status-bar">
          <span class="status-time">9:41</span>
          <div class="status-icons">
            <el-icon><Connection /></el-icon>
            <span class="battery-icon">100%</span>
          </div>
        </div>

        <!-- 小程序内容区域 -->
        <div class="phone-content">
          <!-- 首页预览 -->
          <div v-if="previewPage === 'home'" class="page-home">
            <!-- 轮播图 -->
            <div class="banner-section">
              <el-carousel
                v-if="homeBanners.length > 0"
                height="160px"
                :interval="3000"
                indicator-position="outside"
              >
                <el-carousel-item v-for="banner in homeBanners" :key="banner.id">
                  <img :src="banner.image" class="banner-image" />
                </el-carousel-item>
              </el-carousel>
              <div v-else class="empty-banner">
                <el-icon :size="40"><Picture /></el-icon>
                <p>暂无轮播图</p>
              </div>
            </div>

            <!-- 公告栏 -->
            <div v-if="notices.length > 0" class="notice-section">
              <el-icon class="notice-icon"><Bell /></el-icon>
              <div class="notice-content">
                <el-carousel
                  direction="vertical"
                  height="20px"
                  :interval="3000"
                  :show-arrow="false"
                  indicator-position="none"
                >
                  <el-carousel-item v-for="notice in notices" :key="notice.id">
                    <span class="notice-text">{{ notice.content }}</span>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>

            <!-- 服务菜单 -->
            <div class="service-menu">
              <div
                v-for="menu in serviceMenus"
                :key="menu.id"
                class="menu-item"
              >
                <div class="menu-icon">
                  <el-icon :size="32">
                    <component :is="getMenuIcon(menu.icon)" />
                  </el-icon>
                </div>
                <span class="menu-name">{{ menu.name }}</span>
              </div>
            </div>

            <!-- 推广卡片 -->
            <div v-if="promoCards.length > 0" class="promo-section">
              <div
                v-for="card in promoCards"
                :key="card.id"
                class="promo-card"
              >
                <img :src="card.image" class="promo-image" />
                <div class="promo-info">
                  <div class="promo-title">{{ card.title }}</div>
                  <div class="promo-subtitle">{{ card.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 托管页预览 -->
          <div v-if="previewPage === 'hosting'" class="page-hosting">
            <!-- 托管轮播图 -->
            <div class="banner-section">
              <el-carousel
                v-if="hostingBanners.length > 0"
                height="160px"
                :interval="3000"
                indicator-position="outside"
              >
                <el-carousel-item v-for="banner in hostingBanners" :key="banner.id">
                  <img :src="banner.image" class="banner-image" />
                </el-carousel-item>
              </el-carousel>
              <div v-else class="empty-banner">
                <el-icon :size="40"><Picture /></el-icon>
                <p>暂无轮播图</p>
              </div>
            </div>

            <!-- 托管服务介绍 -->
            <div class="hosting-intro">
              <h3>车辆托管服务</h3>
              <p>将您的房车托管给我们，轻松获得收益</p>
            </div>
          </div>
        </div>

        <!-- 手机底部导航栏 -->
        <div class="phone-tabbar">
          <div class="tabbar-item active">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </div>
          <div class="tabbar-item">
            <el-icon><List /></el-icon>
            <span>订单</span>
          </div>
          <div class="tabbar-item">
            <el-icon><User /></el-icon>
            <span>我的</span>
          </div>
        </div>
      </div>

      <!-- 预览说明 -->
      <div class="preview-tips">
        <el-alert
          title="预览说明"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>此预览展示当前已启用的资源配置效果</li>
              <li>轮播图、公告等会自动轮播展示</li>
              <li>修改配置后需要刷新预览查看最新效果</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Connection,
  Picture,
  Bell,
  HomeFilled,
  List,
  User,
  Van,
  Discount,
  Location,
  MapLocation,
} from '@element-plus/icons-vue'
import {
  getBanners,
  getNotices,
  getPromoCards,
  getServiceMenu,
} from '@/api/miniprogramResources'
import type {
  Banner,
  Notice,
  PromoCard,
  ServiceMenuItem,
} from '@/types/miniprogramResources'

// 数据
const previewPage = ref<'home' | 'hosting'>('home')
const homeBanners = ref<Banner[]>([])
const hostingBanners = ref<Banner[]>([])
const notices = ref<Notice[]>([])
const promoCards = ref<PromoCard[]>([])
const serviceMenus = ref<ServiceMenuItem[]>([])

// 图标映射
const iconMap: Record<string, any> = {
  car: Van,
  discount: Discount,
  location: Location,
  map: MapLocation,
}

// 获取菜单图标
const getMenuIcon = (iconName: string) => {
  return iconMap[iconName] || Van
}

// 加载预览数据
const loadPreviewData = async () => {
  try {
    // 加载首页轮播图
    const homeBannersRes = await getBanners('home')
    homeBanners.value = (homeBannersRes.data || []).filter(
      (b: Banner) => b.isEnabled
    )

    // 加载托管轮播图
    const hostingBannersRes = await getBanners('hosting')
    hostingBanners.value = (hostingBannersRes.data || []).filter(
      (b: Banner) => b.isEnabled
    )

    // 加载公告
    const noticesRes = await getNotices()
    notices.value = (noticesRes.data || []).filter((n: Notice) => n.isEnabled)

    // 加载推广卡片
    const promoCardsRes = await getPromoCards()
    promoCards.value = (promoCardsRes.data || []).filter(
      (c: PromoCard) => c.isEnabled
    )

    // 加载服务菜单
    const serviceMenuRes = await getServiceMenu()
    serviceMenus.value = (serviceMenuRes.data || [])
      .filter((m: ServiceMenuItem) => m.isEnabled)
      .sort((a: ServiceMenuItem, b: ServiceMenuItem) => b.sortOrder - a.sortOrder)
      .slice(0, 8) // 只显示前8个
  } catch (error) {
    console.error('加载预览数据失败', error)
  }
}

// 暴露刷新方法供父组件调用
defineExpose({
  refresh: loadPreviewData,
})

onMounted(() => {
  loadPreviewData()
})
</script>

<style scoped lang="scss">
.miniprogram-preview {
  .preview-card {
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .preview-title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .phone-simulator {
    width: 375px;
    height: 667px;
    margin: 0 auto;
    background: #fff;
    border-radius: 30px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .phone-status-bar {
      height: 44px;
      background: #f8f8f8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      font-size: 12px;

      .status-time {
        font-weight: 600;
      }

      .status-icons {
        display: flex;
        gap: 6px;
        align-items: center;

        .battery-icon {
          font-size: 11px;
          font-weight: 600;
        }
      }
    }

    .phone-content {
      flex: 1;
      overflow-y: auto;
      background: #f5f5f5;

      .page-home,
      .page-hosting {
        min-height: 100%;
      }

      .banner-section {
        background: #fff;

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-banner {
          height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #909399;
          background: #f5f5f5;

          p {
            margin-top: 8px;
            font-size: 14px;
          }
        }
      }

      .notice-section {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #fff5e6;
        margin-bottom: 8px;

        .notice-icon {
          color: #ff9800;
          font-size: 16px;
        }

        .notice-content {
          flex: 1;
          overflow: hidden;

          .notice-text {
            font-size: 13px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .service-menu {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        padding: 16px;
        background: #fff;
        margin-bottom: 8px;

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .menu-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
          }

          .menu-name {
            font-size: 12px;
            color: #333;
          }
        }
      }

      .promo-section {
        padding: 0 16px 16px;

        .promo-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;

          .promo-image {
            width: 100%;
            height: 100px;
            object-fit: cover;
          }

          .promo-info {
            padding: 12px;

            .promo-title {
              font-size: 15px;
              font-weight: 600;
              color: #333;
              margin-bottom: 4px;
            }

            .promo-subtitle {
              font-size: 13px;
              color: #666;
            }
          }
        }
      }

      .hosting-intro {
        padding: 24px 16px;
        background: #fff;
        text-align: center;

        h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .phone-tabbar {
      height: 50px;
      background: #fff;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .tabbar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #999;

        &.active {
          color: #409eff;
        }
      }
    }
  }

  .preview-tips {
    margin-top: 16px;

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        font-size: 13px;
        line-height: 1.8;
      }
    }
  }
}
</style>
