# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

叨叨房车租赁管理平台 - 全栈房车租赁解决方案

---

## ⚠️ 重要：前端独立开发模式

**本项目采用前端独立开发，后端逐一对接的开发模式**

### 开发阶段说明

#### 阶段一：前端独立开发（当前阶段）

**三个前端项目独立开发，互不依赖后端：**

1. **admin-console** (PC管理端)
   - ✅ 使用 Mock 数据完成所有页面
   - ✅ 不启动 backend 服务
   - 📖 阅读 `admin-console/docs/管理端产品需求文档.md`
   - 📝 更新 `admin-console/docs/管理端API.md` 记录 API 状态

2. **miniprogram** (微信小程序)
   - ✅ 使用 Mock 数据完成所有页面
   - ✅ 不启动 backend 服务
   - 📖 阅读 `miniprogram/docs/小程序端产品需求文档.md`
   - 📝 更新 `miniprogram/docs/小程序端API.md` 记录 API 状态

3. **mobile-admin** (移动管理端)
   - ✅ 使用 Mock 数据完成所有页面
   - ✅ 不启动 backend 服务
   - 📖 阅读 `mobile-admin/docs/移动管理端产品需求文档.md`
   - 📝 更新 `mobile-admin/docs/移动管理端API.md` 记录 API 状态

#### 阶段二：后端对接（未来）

当三个前端都开发完成后，再逐一对接后端：
- 🔄 启动后端服务
- 🔄 逐个接口联调测试
- 🔄 切换 Mock 数据为真实 API

### API 状态标识

在各前端的 API 文档中使用统一的状态标识：
- 🔴 **未开发** - 前端尚未开发
- 🟡 **已开发** - 前端完成，使用 Mock 数据
- 🟠 **待后端开发** - 前端完成，等待后端 API
- 🔵 **待联调** - 后端 API 完成，准备联调
- 🟢 **联调完成** - 前后端联调成功

---

## 项目概述

一个基于 Node.js 后端 + Vue 3 前端 + uni-app 移动端的全栈房车租赁管理平台，包含：
- **backend**: Node.js + Express + TypeScript RESTful API (端口 3001)
- **admin-console**: Vue 3 + Element Plus PC 管理后台 (端口 5173)
- **miniprogram**: uni-app 3 微信小程序用户端 (HBuilderX)
- **mobile-admin**: uni-app 3 移动管理端 (HBuilderX)

**技术栈**: Node.js 18.18.0 | Express 4.18.2 | Vue 3.4.0 | TypeScript 5.1.6 | Sequelize 6.32.1 | MySQL 8.0.35 | Redis 7.2.3

## 快速启动

### 基础设施
```bash
# 启动数据库服务（MySQL + Redis）
docker compose up -d mysql redis

# 查看服务状态
docker compose ps

# 停止服务
docker compose down
```

### 后端开发
```bash
cd backend

# 开发服务器（自动重启）
npm run dev          # 端口 3001

# 生产构建
npm run build        # 编译到 dist/
npm start            # 启动生产服务器

# 代码质量
npm run lint         # ESLint 检查
npm run lint:fix     # 自动修复
npm run type-check   # TypeScript 类型检查（未配置）

# 测试
npm test             # 运行 Jest 测试
npm run test:watch   # 监听模式

# 数据库
npm run db:migrate   # 运行 Sequelize 迁移
npm run db:seed      # 填充测试数据
```

### PC 管理端开发
```bash
cd admin-console

# 开发服务器
npm run dev          # 端口 5173，代理 /api → localhost:3000

# 生产构建
npm run build        # vue-tsc + vite build
npm run preview      # 预览构建结果

# 代码质量
npm run lint         # ESLint + Prettier
npm run format       # 格式化代码
npm run type-check   # TypeScript 类型检查
```

### 小程序/移动管理端开发
```bash
# miniprogram 和 mobile-admin 使用 HBuilderX 开发
# 1. 使用 HBuilderX 打开对应目录
# 2. 点击"运行" → "运行到微信开发者工具"（小程序）
# 3. 或"运行到浏览器"/"运行到手机模拟器"（移动管理端）

# 注意：这两个项目没有 npm scripts，依赖 HBuilderX 内置工具链
```

## 核心架构

### 后端架构（backend/src/）

**入口文件**: `src/index.ts` 端口 3001
- 配置 Express 中间件（helmet, cors, compression, rate-limiting）
- 连接 MySQL (Sequelize) 和 Redis
- 注册 API 路由到 `/api/v1/*`
- 错误处理和优雅关闭

**目录结构**:
```
src/
├── index.ts              # 应用入口
├── config/               # 配置文件
│   ├── database.ts       # Sequelize 配置
│   └── redis.ts          # Redis 连接
├── controllers/          # 控制器层（11个）
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── VehicleController.ts
│   ├── order.ts
│   └── ...
├── routes/               # 路由层（14个文件）
│   ├── auth.routes.ts    # ✅ 已激活
│   ├── user.routes.ts    # ❌ 待激活
│   ├── vehicles.ts       # ❌ 待激活
│   ├── orders.ts         # ❌ 待激活
│   ├── payments.ts       # ❌ 待激活
│   ├── coupons.ts        # ❌ 待激活
│   ├── ratings.ts        # ❌ 待激活
│   ├── favorites.ts      # ❌ 待激活
│   ├── help.ts           # ❌ 待激活
│   └── diy.*.routes.ts   # ❌ 待激活（5个文件）
├── models/               # 数据模型（6个）
│   ├── User.ts           # ✅ 用户基础信息
│   ├── UserProfile.ts    # ✅ 用户档案
│   ├── UserLoginLog.ts   # ✅ 登录日志
│   ├── VerificationCode.ts # ✅ 验证码
│   ├── diy.models.ts     # ✅ DIY 相关 6 个模型
│   └── index.ts          # 模型导出
├── middleware/           # 中间件
│   ├── auth.middleware.ts
│   ├── errorHandler.ts
│   └── validation.ts
├── services/             # 业务服务层
├── utils/                # 工具函数
│   └── logger.ts         # Winston 日志
└── types/                # TypeScript 类型定义
```

**TypeScript 路径别名**（tsconfig.json）:
```typescript
"@/*"          → "src/*"
"@/config/*"   → "src/config/*"
"@/controllers/*" → "src/controllers/*"
"@/middleware/*" → "src/middleware/*"
// ... 等
```

**重要**: 使用 `tsconfig-paths/register` 使路径别名在运行时生效（见 package.json `dev` script）

### 前端架构（admin-console/src/）

**构建工具**: Vite 5.0 + vue-tsc
**UI 框架**: Element Plus（自动导入）

**目录结构**:
```
src/
├── main.ts               # 应用入口
├── App.vue
├── views/                # 页面组件（37个）
│   ├── dashboard/
│   ├── user/
│   ├── vehicle/
│   ├── order/
│   └── diy/              # DIY 页面编辑器
├── components/           # 通用组件
│   └── diy/              # DIY 编辑器组件库
├── router/               # Vue Router 配置
├── stores/               # Pinia 状态管理
├── api/                  # API 请求封装
├── utils/                # 工具函数
└── types/                # TypeScript 类型定义
```

**自动导入配置** (vite.config.ts):
- Element Plus 组件自动导入
- Vue 3 API 自动导入（ref, computed 等）
- 路径别名: `@` → `src/`

**开发代理** (vite.config.ts):
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',  // ⚠️ 注意：后端实际运行在 3001
    changeOrigin: true
  }
}
```

### uni-app 架构（miniprogram/ & mobile-admin/）

**构建工具**: HBuilderX 内置编译器（不是 Vite）
**框架**: uni-app 3 + Vue 3 + TypeScript

**重要**: 这两个项目依赖 HBuilderX IDE，不能用标准 `npm run` 命令

**目录结构**:
```
pages/                    # 页面目录（条件编译）
├── index/                # 首页
├── user/                 # 用户相关
└── ...
components/               # 组件库
static/                   # 静态资源
uni_modules/              # uni-app 插件
manifest.json             # 应用配置
pages.json                # 页面路由配置
```

## 数据库架构

**连接信息**:
```
Host: localhost:3306
Database: daodao
User: daodao_dev
Password: daodao_dev_2024
```

**已实现模型**（backend/src/models/）:
- `User`: 用户基础信息（id, username, phone, email, password_hash, user_type, status）
- `UserProfile`: 用户档案（user_id, gender, birthday, address, preferences）
- `UserLoginLog`: 登录日志（user_id, login_time, ip_address, user_agent）
- `VerificationCode`: 验证码（phone, code, type, expires_at, used）
- `diy.models.ts`: DIY 系统 6 个模型
  - DiyPage, DiyComponent, DiyTemplate
  - DiyPagePublication, DiyOperationLog, DiyMediaResource

**待实现模型**（根据 shared/docs/database/ 设计文档）:
- Vehicle, VehicleBrand, VehicleModel（车辆管理）
- Store, StoreStaff（门店管理）
- Order, OrderVehicle, OrderExtra（订单管理）
- Payment, Refund, Deposit（支付管理）
- Coupon, UserCoupon（优惠券）
- Rating, Favorite（评价和收藏）
- HelpCategory, HelpArticle（帮助中心）
- Role, UserRole, Permission（权限管理）
- SystemConfig, OperationLog（系统配置）

## API 路由状态

### 已激活路由（1/14）
```typescript
// backend/src/index.ts
import authRoutes from '@/routes/auth.routes';
app.use('/api/v1/auth', authRoutes);
```

**已实现接口**:
- `POST /api/v1/auth/send-code` - 发送验证码
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 密码登录
- `POST /api/v1/auth/login-with-code` - 验证码登录
- `GET /health` - 健康检查
- `GET /api/v1/test` - API 测试

### 待激活路由（13个文件）
需要在 `backend/src/index.ts` 中 import 并注册：
```typescript
// 用户管理
import userRoutes from '@/routes/user.routes';
app.use('/api/v1/users', userRoutes);

// 车辆管理
import vehicleRoutes from '@/routes/vehicles';
app.use('/api/v1/vehicles', vehicleRoutes);

// 订单管理
import orderRoutes from '@/routes/orders';
app.use('/api/v1/orders', orderRoutes);

// 支付管理
import paymentRoutes from '@/routes/payments';
app.use('/api/v1/payments', paymentRoutes);

// 优惠券
import couponRoutes from '@/routes/coupons';
app.use('/api/v1/coupons', couponRoutes);

// 评价
import ratingRoutes from '@/routes/ratings';
app.use('/api/v1/ratings', ratingRoutes);

// 收藏
import favoriteRoutes from '@/routes/favorites';
app.use('/api/v1/favorites', favoriteRoutes);

// 帮助中心
import helpRoutes from '@/routes/help';
app.use('/api/v1/help', helpRoutes);

// DIY 系统（5个路由文件）
import diyPagesRoutes from '@/routes/diy.pages.routes';
import diyComponentsRoutes from '@/routes/diy.components.routes';
import diyLibraryRoutes from '@/routes/diy.library.routes';
import diySimpleRoutes from '@/routes/diy.pages.simple';
import diyTestRoutes from '@/routes/diy.test';

app.use('/api/v1/diy/pages', diyPagesRoutes);
app.use('/api/v1/diy/components', diyComponentsRoutes);
app.use('/api/v1/diy/library', diyLibraryRoutes);
app.use('/api/v1/diy/simple', diySimpleRoutes);
app.use('/api/v1/diy/test', diyTestRoutes);
```

## 常见开发陷阱

### 1. 端口不一致问题
- **问题**: 后端实际运行在 3001，但 vite.config.ts 代理到 3000
- **解决**: 修改 `admin-console/vite.config.ts` proxy target 为 `http://localhost:3001`

### 2. TypeScript 路径别名
- **问题**: 导入 `@/routes/xxx` 在 IDE 中报错
- **解决**: 确保 `nodemon` 启动时使用 `-r tsconfig-paths/register`
- **检查**: `backend/package.json` 中 `dev` script 配置

### 3. uni-app 项目运行
- **问题**: `cd miniprogram && npm run dev` 失败
- **原因**: uni-app 项目依赖 HBuilderX，没有 npm scripts
- **解决**: 必须使用 HBuilderX 打开并运行

### 4. 数据库连接失败
- **检查清单**:
  1. Docker 服务是否启动: `docker compose ps`
  2. 端口是否占用: `netstat -ano | findstr :3306`
  3. 环境变量配置: `backend/.env` 文件存在且正确
  4. 数据库用户权限是否正确

### 5. CORS 错误
- **问题**: 前端请求被 CORS 拦截
- **检查**: `backend/src/index.ts` 的 `cors` 配置是否包含你的前端端口
- **开发环境**: 已配置 `localhost:5173-5179`，默认应该可用

### 6. Element Plus 组件未注册
- **问题**: 使用 `<el-button>` 报错未注册
- **原因**: 自动导入配置问题
- **解决**: 检查 `admin-console/vite.config.ts` 的 `unplugin-vue-components` 配置

## 开发工作流

### 添加新 API 接口
1. 在 `backend/src/models/` 创建/更新 Sequelize 模型
2. 在 `backend/src/controllers/` 实现控制器逻辑
3. 在 `backend/src/routes/` 定义路由
4. 在 `backend/src/index.ts` 注册路由
5. 编写测试（`backend/tests/`）
6. 更新 API 文档（`shared/docs/api/`）

### 添加新前端页面
1. 在 `admin-console/src/views/` 创建 Vue 组件
2. 在 `admin-console/src/router/` 添加路由
3. 在 `admin-console/src/api/` 封装 API 调用
4. （可选）在 `admin-console/src/stores/` 添加状态管理

### 数据库变更
1. 修改或创建 Sequelize 模型
2. 创建迁移文件: `npx sequelize-cli migration:generate --name xxx`
3. 编写迁移逻辑（up/down）
4. 运行迁移: `npm run db:migrate`
5. 更新数据库设计文档（`shared/docs/database/`）

## 代码规范

### TypeScript
- 启用严格模式（strict: true）
- 不允许隐式 any
- 必须检查 null/undefined（noUncheckedIndexedAccess: true）
- 使用路径别名（@/xxx）避免相对路径

### Git Commit (多 AI 工具协作)

**⚠️ 重要**: 本项目使用多个 AI 工具协同开发,所有提交必须遵循以下规范:

**格式**: `<type>(<scope>): <subject> [<ai-tool>]`

**示例**:
```bash
feat(backend): 激活用户管理 API 路由 [claude-code]
fix(miniprogram): 修复订单列表加载失败 [codex]
refactor(admin): 优化车辆管理页面性能 [antigravity]
chore(infra): 更新 Docker Compose 配置 [human]
```

**Type 类型**:
- `feat: xxx` - 新功能
- `fix: xxx` - 修复 bug
- `docs: xxx` - 文档更新
- `refactor: xxx` - 代码重构
- `test: xxx` - 测试相关
- `chore: xxx` - 构建/工具相关
- `perf: xxx` - 性能优化

**Scope 范围**:
- `backend` - 后端 API
- `admin` - PC 管理端
- `miniprogram` - 微信小程序
- `mobile-admin` - 移动管理端
- `shared` - 共享代码/文档
- `infra` - 基础设施

**AI Tool 标识** (必填):
- `[claude-code]` - Claude Code 提交
- `[codex]` - Codex 提交
- `[antigravity]` - Antigravity 提交
- `[human]` - 人工提交

**详细规范**: 查看 [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)
**协作指南**: 查看 [.github/AI_COLLABORATION_GUIDE.md](.github/AI_COLLABORATION_GUIDE.md)

### 代码提交前检查
- [ ] `npm run lint` 无错误
- [ ] `npm run type-check` 通过(如果配置)
- [ ] `npm test` 全部通过
- [ ] API 文档已更新
- [ ] 代码已格式化(`npm run format`)
- [ ] **Commit message 包含正确的 AI 工具标识**
- [ ] **没有提交敏感文件(.env 等)**

## 项目状态与优先级

### Phase 1: 后端 API 激活（当前重点）
- [x] auth 路由已激活（1/14）
- [ ] 激活其余 13 个路由文件
- [ ] 完善控制器业务逻辑
- [ ] 补充缺失的数据模型
- [ ] API 接口测试

### Phase 2: 前端重构
- [ ] 小程序端重构（32个页面）
- [ ] 移动管理端重构（5个页面）
- [ ] PC 管理端 API 对接

### Phase 3: 联调与完善
- [ ] 前后端联调
- [ ] 权限系统实现
- [ ] 性能优化
- [ ] 测试覆盖

## 环境变量配置

### backend/.env
```bash
# 服务端口
PORT=3001

# 数据库
DATABASE_URL=mysql://daodao_dev:daodao_dev_2024@localhost:3306/daodao

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API 限流
API_RATE_LIMIT=100

# 日志级别
LOG_LEVEL=info

# 运行环境
NODE_ENV=development
```

## 相关文档

- **后端模块**: [backend/CLAUDE.md](./backend/CLAUDE.md)
- **PC 管理端**: [admin-console/CLAUDE.md](./admin-console/CLAUDE.md)
- **小程序端**: [miniprogram/CLAUDE.md](./miniprogram/CLAUDE.md)
- **移动管理端**: [mobile-admin/CLAUDE.md](./mobile-admin/CLAUDE.md)
- **数据库设计**: [shared/docs/database/](./shared/docs/database/)
- **API 文档**: [shared/docs/api/](./shared/docs/api/)

---

**版本**: v6.0 | **最后更新**: 2025-11-29 | **更新内容**: 添加前端独立开发模式说明
