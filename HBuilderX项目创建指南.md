# HBuilderX 项目创建指南

## 📋 目录状态

✅ **miniprogram/** - 微信小程序目录已清空，准备创建新项目
✅ **mobile-admin/** - 移动管理端目录已清空，准备创建新项目

## 🛠️ 使用HBuilderX创建uni-app项目

### 1. 创建微信小程序项目 (miniprogram)

1. **打开HBuilderX**
2. **文件** → **新建** → **项目**
3. **选择项目类型**：
   - 选择 **uni-app**
   - 选择 **Vue3**
   - 模板选择：**默认模板**
4. **项目配置**：
   ```
   项目名称：daodao-miniprogram
   项目目录：选择 miniprogram 文件夹
   包名：com.daodao.miniprogram
   ```
5. **点击创建**

### 2. 创建移动管理端项目 (mobile-admin)

1. **打开HBuilderX**
2. **文件** → **新建** → **项目**
3. **选择项目类型**：
   - 选择 **uni-app**
   - 选择 **Vue3**
   - 模板选择：**默认模板**
4. **项目配置**：
   ```
   项目名称：daodao-mobile-admin
   项目目录：选择 mobile-admin 文件夹
   包名：com.daodao.mobileadmin
   ```
5. **点击创建**

## 📱 项目配置建议

### 微信小程序配置 (miniprogram)

**pages.json 配置建议：**
```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "叨叨房车"
      }
    },
    {
      "path": "pages/vehicles/vehicles",
      "style": {
        "navigationBarTitleText": "车辆列表"
      }
    }
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#409EFF",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/vehicles/vehicles",
        "text": "车辆"
      },
      {
        "pagePath": "pages/orders/orders",
        "text": "订单"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的"
      }
    ]
  }
}
```

### 移动管理端配置 (mobile-admin)

**pages.json 配置建议：**
```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "移动管理"
      }
    }
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#409EFF",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/orders/orders",
        "text": "订单"
      },
      {
        "pagePath": "pages/vehicles/vehicles",
        "text": "车辆"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的"
      }
    ]
  }
}
```

## 🚀 开发和运行

### 微信小程序
1. **HBuilderX** → **运行** → **运行到小程序模拟器** → **微信开发者工具**
2. 需要配置微信开发者工具路径

### App开发
1. **HBuilderX** → **运行** → **运行到手机或模拟器**
2. 支持Android/iOS真机调试

### H5调试
1. **HBuilderX** → **运行** → **运行到内置浏览器**
2. 或运行到外部浏览器

## 📚 开发建议

### 目录结构（创建后）
```
miniprogram/
├── pages/           # 页面文件
│   ├── index/
│   ├── vehicles/
│   └── profile/
├── static/          # 静态资源
├── components/      # 组件
├── api/            # API接口
├── utils/          # 工具函数
├── App.vue         # 应用入口
├── main.js         # 主入口
├── pages.json      # 页面配置
├── manifest.json   # 应用配置
└── uni.scss        # 全局样式
```

### 开发规范
- 使用Vue 3 Composition API
- 遵循uni-app开发规范
- 使用TypeScript增强类型安全
- 响应式设计，适配多种设备

## 🔗 与后端API对接

API基础地址：
```
开发环境：http://localhost:3000/api/v1/
生产环境：https://api.daodaorv.com/api/v1/
```

在项目中创建API工具类：
```javascript
// utils/request.js
const BASE_URL = 'http://localhost:3000/api/v1/'

export const request = (options) => {
  return uni.request({
    url: BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
```

---

**注意**：项目创建完成后，原有的后端API和PC管理后台保持正常运行状态。