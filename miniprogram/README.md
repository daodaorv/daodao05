# 叨叨房车 - 微信小程序

## 项目说明

这是叨叨房车的微信小程序端，使用 uni-app 框架开发。

## 技术栈

- **框架**: uni-app 3.0
- **UI框架**: Vue 3 Composition API
- **状态管理**: Pinia
- **图标**: uni-icons

## 项目结构

```
miniprogram/
├── pages/              # 页面文件
│   ├── home/          # 首页
│   ├── vehicles/      # 车辆列表
│   ├── community/     # 社区
│   ├── service/       # 客服
│   ├── profile/       # 我的
│   └── login/         # 登录页
├── api/               # API接口
│   └── auth.js        # 认证相关接口
├── stores/            # Pinia状态管理
│   └── user.js        # 用户状态
├── utils/             # 工具函数
│   └── request.js     # 请求封装
├── static/            # 静态资源
│   └── tabbar/        # TabBar图标
├── App.vue            # 应用入口
├── main.js            # 主入口文件
└── pages.json         # 页面配置
```

## 开发环境

### 必需软件
1. **HBuilderX** - uni-app官方IDE
   - 下载地址：https://www.dcloud.io/hbuilderx.html
   - 推荐版本：3.8+

2. **微信开发者工具**
   - 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 用于预览和调试小程序

### 开发步骤

1. **用HBuilderX打开项目**
   - 文件 -> 打开目录 -> 选择 `miniprogram` 文件夹

2. **运行到微信开发者工具**
   - 运行 -> 运行到小程序模拟器 -> 微信开发者工具
   - 首次运行需要配置微信开发者工具路径

3. **配置后端API地址**
   - 修改 `utils/request.js` 中的 `BASE_URL`
   - 开发环境：`http://localhost:3000/api/v1`
   - 生产环境：替换为实际域名

## 已实现功能

### ✅ 基础框架
- [x] TabBar导航（5个Tab页）
- [x] 页面路由配置
- [x] 全局样式配置

### ✅ 首页
- [x] 自定义导航栏
- [x] 搜索栏
- [x] 快速预订卡片
- [x] 热门车型展示
- [x] 精选路线展示

### ✅ 用户认证
- [x] 登录页面（密码登录 + 验证码登录）
- [x] 用户状态管理（Pinia）
- [x] Token持久化存储
- [x] 自动登录检测

### ✅ 我的页面
- [x] 用户信息展示
- [x] 登录状态判断
- [x] 功能菜单
- [x] 退出登录

### ✅ API集成
- [x] 请求封装（request.js）
- [x] 认证API接口
- [x] Token自动携带
- [x] 错误统一处理

## 待实现功能

### ⏳ 单元1剩余任务
- [ ] TabBar图标资源
- [ ] 默认头像图片
- [ ] 占位图片资源

### ⏳ 后续单元
- [ ] 车辆列表页面
- [ ] 车辆详情页面
- [ ] 社区功能
- [ ] 客服功能
- [ ] 订单功能
- [ ] 支付功能

## API配置

### 后端API地址
```javascript
// utils/request.js
const BASE_URL = 'http://localhost:3000/api/v1';
```

### 测试账号
| 用户类型 | 手机号 | 密码 | 说明 |
|----------|--------|------|------|
| 普通用户 | 13900139000 | 123456 | 小程序端登录 |

## 注意事项

1. **开发环境配置**
   - 微信开发者工具需要关闭"不校验合法域名"选项
   - 本地开发时使用 localhost 地址

2. **图片资源**
   - TabBar图标暂时缺失，需要设计师提供
   - 可以先使用 uni-icons 作为临时方案

3. **状态管理**
   - 使用 Pinia 管理全局状态
   - Token 存储在本地缓存中

4. **API请求**
   - 所有请求统一通过 request.js 封装
   - 自动携带 Token
   - 统一错误处理

## 调试技巧

### 查看日志
```javascript
console.log('调试信息')
```

### 查看存储
```javascript
// 查看Token
console.log(uni.getStorageSync('token'))

// 查看用户信息
console.log(uni.getStorageSync('userInfo'))
```

### 清除缓存
```javascript
uni.clearStorageSync()
```

## 常见问题

### Q: 登录后跳转失败？
A: 检查 pages.json 中的页面路径配置是否正确。

### Q: API请求失败？
A: 
1. 检查后端服务是否启动
2. 检查 BASE_URL 配置是否正确
3. 查看微信开发者工具控制台的网络请求

### Q: TabBar不显示？
A: TabBar图标文件缺失，需要添加对应的图片资源。

## 下一步计划

1. 添加TabBar图标资源
2. 完善车辆列表页面
3. 实现车辆详情页面
4. 集成第三方登录（微信、支付宝等）

## 相关文档

- [uni-app官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3文档](https://cn.vuejs.org/)
- [Pinia文档](https://pinia.vuejs.org/zh/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

