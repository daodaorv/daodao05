# 共享静态资源

此目录包含项目中各端可以共享使用的静态资源。

## 目录结构

```
shared/assets/
├── images/          # 通用图片
│   ├── default-vehicle.png     # 默认车辆图片
│   ├── default-avatar.png      # 默认用户头像
│   ├── default-store.png       # 默认门店图片
│   ├── default-article.png     # 默认文章图片
│   ├── empty-coupon.png        # 空优惠券状态图
│   ├── empty-favorite.png      # 空收藏状态图
│   ├── wechat.png              # 微信支付图标
│   ├── alipay.png              # 支付宝支付图标
│   ├── apple.png               # Apple Pay图标
│   └── default.png             # 默认支付图标
├── icons/            # 通用图标
└── fonts/            # 共享字体文件
```

## 使用指南

### 小程序端
```vue
<!-- 使用相对路径引用 -->
<image src="/shared/assets/images/default-vehicle.png" />

<!-- 或使用绝对路径 -->
<image src="@/static/shared/default-vehicle.png" />
```

### PC管理后台
```vue
<!-- 在Vue组件中使用 -->
<img :src="require('@/shared/assets/images/default-vehicle.png')" />
```

### 移动管理端
```vue
<!-- uni-app中统一使用upx单位 -->
<image src="/shared/assets/images/default-avatar.png" mode="aspectFill" />
```

## 资源规范

### 图片规范
- **格式**: 优先使用PNG，照片使用JPG
- **大小**: 单个图片不超过200KB
- **尺寸**: 根据实际使用场景选择合适尺寸
- **命名**: 使用kebab-case命名，语义化

### 图标规范
- **格式**: SVG矢量图标优先，PNG备选
- **尺寸**: 提供多尺寸版本（16x16, 32x32, 64x64）
- **颜色**: 提供��颜色版本（单色、彩色）

### 字体规范
- **格式**: WOFF2格式优先
- **大小**: 压缩后单个字体文件不超过2MB
- **兼容性**: 支持现代浏览器

## 维护原则

1. **只共享真正通用的资源**
2. **保持文件大小合理**
3. **使用规范的命名**
4. **及时更新文档**
5. **定期清理无用资源**

## 添加新资源

1. 将资源文件放入对应目录
2. 遵循命名规范
3. 压缩优化文件大小
4. 更新此文档
5. 通知各端开发者

## 版权说明

所有资源仅限叨叨房车项目内部使用，请勿外传或用于其他项目。