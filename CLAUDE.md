# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 项目概述

叨叨房车是一个全面的房车租赁管理平台，连接客户、车主和管理员，支持多个平台。

**当前状态**: ✅ 项目初始化完成，所有四端均已创建并可正常运行

## 系统架构

### 多平台结构
- **C端微信小程序** (`miniprogram/`): 面向客户的租赁平台
- **B端PC管理后台** (`admin-console/`): 行政管理系统
- **B端移动管理** (`mobile-admin/`): 现场移动管理应用
- **后端API服务** (`backend/`): 服务所有平台的统一RESTful API

### 技术栈

#### 前端技术栈
- **小程序和移动管理**: uni-app 3.0.0 + Vue 3.5.0 + TypeScript 5.1.6
- **PC管理后台**: Vue 3.5.0 + Vite 4.4.9 + Element Plus 2.11.7 + TypeScript 5.1.6
- **状态管理**: Vue 3 Composition API + Pinia
- **开发工具**: HBuilderX (uni-app), VS Code (PC后台)

#### 后端技术栈
- **运行时**: Node.js 18.18.0 LTS
- **框架**: Express.js 4.18.2 + TypeScript 5.1.6
- **数据库**: MySQL 8.0.35 (Docker) + Redis 7.2.3 (Docker)
- **ORM**: Sequelize 6.32.1
- **身份认证**: JWT (jsonwebtoken 9.0.2)

## 开发环境配置

### 环境要求
- Node.js 18.18.0 LTS
- HBuilderX 3.8+ (用于uni-app开发)
- VS Code 1.80+ (用于PC后台开发)
- Docker 20.10+ (用于数据库服务)
- 微信开发者工具 (用于小程序测试)

### 数据库服务
```bash
# 启动MySQL和Redis服务
docker compose up -d mysql redis

# 服务访问地址:
# MySQL: localhost:3306
# Redis: localhost:6379
# Adminer (数据库管理): localhost:8080
```

### 开发服务器
- **后端API**: 端口 3000
- **PC管理后台**: 端口 5173 (Vite开发服务器)

## 常用开发命令

### 环境准备
```bash
# 启动数据库服务 (开发前必需)
docker compose up -d mysql redis

# 验证数据库连接
mysql -h localhost -P 3306 -u daodao_dev -p daodao_dev_2024
```

由于这是一个规划/文档阶段的项目，实际实现命令将是：

#### 后端 (待实现)
```bash
cd backend
npm install
npm run dev          # 开发服务器 (localhost:3000)
npm run build        # 生产构建
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run db:migrate   # 数据库迁移
npm run db:seed      # 数据库种子数据
```

#### PC管理后台 (待实现)
```bash
cd admin-console
npm install
npm run dev          # Vite开发服务器 (localhost:5173)
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run test         # 运行测试
npm run lint         # 代码检查
npm run type-check   # TypeScript类型检查
```

#### 小程序 (HBuilderX)
- 将项目目录导入HBuilderX
- 运行 → 运行到小程序模拟器 → 微信开发者工具
- 或使用命令行 (如果配置了uni-app CLI):
```bash
cd miniprogram
npm install
npm run dev:mp-weixin     # 微信小程序开发
npm run build:mp-weixin   # 微信小程序构建
```

#### 移动管理端 (待实现)
```bash
cd mobile-admin
npm install
npm run dev:app          # App开发
npm run build:app        # App构建
```

## API设计标准

### 基础配置
- **基础URL**: `https://api.daodaorv.com/api/v1/`
- **身份认证**: Bearer Token (JWT)
- **响应格式**: 统一JSON结构
- **错误码**: 标准化业务错误码 (100000-699999)

### API响应结构
```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "meta": {
    "requestId": "abc-123",
    "timestamp": "2025-11-12T10:00:00+08:00"
  }
}
```

### 主要API模块
- `/auth/*` - 身份认证与授权
- `/users/*` - 用户管理
- `/vehicles/*` - 车辆库存
- `/orders/*` - 租赁订单
- `/payments/*` - 支付处理
- `/stores/*` - 门店/位置管理

## 代码规范

### TypeScript/Vue模式
- 使用Vue 3 Composition API与`<script setup>`
- 实现严格的TypeScript类型检查
- 遵循BEM CSS方法论与SCSS
- 使用Pinia进行状态管理
- 应用ESLint + Prettier进行代码格式化

### 命名规范
- **组件**: PascalCase (例如: `VehicleCard.vue`)
- **文件**: camelCase (例如: `vehicleAPI.ts`)
- **变量/函数**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **CSS类名**: BEM命名法 (例如: `.vehicle-card__title`)

### Git提交格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 数据库架构

### 数据库管理
```bash
# 启动数据库服务
docker compose up -d mysql

# 连接数据库 (开发环境)
mysql -h localhost -P 3306 -u daodao_dev -p daodao_dev_2024

# 数据库管理界面
# 浏览器访问: http://localhost:8080
# 服务器: localhost:3306
# 用户名: daodao_dev
# 密码: daodao_dev_2024
# 数据库: daodao

# 重置数据库 (谨慎使用)
docker compose down -v mysql  # 删除数据卷
docker compose up -d mysql    # 重新启动
```

### 关键数据表
- **用户管理**: `users`, `user_profiles`, `roles`, `permissions`
- **车辆管理**: `vehicles`, `vehicle_brands`, `vehicle_models`
- **订单处理**: `orders`, `order_status_logs`, `payments`
- **位置管理**: `stores`, `regions`
- **营销功能**: `coupons`, `promotions`

### 数据库配置
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **时区**: +08:00

## 核心业务功能

### 租赁流程
1. 车辆浏览与筛选搜索
2. 租赁预订与可用性检查
3. 客户身份验证 (身份证、驾驶证)
4. 押金支付 (取车门店二维码支付)
5. 电子合同签署
6. 车辆取还与拍照记录
7. 自动计费与分润结算
8. 评价与评论系统

### 订单状态流转
```
待支付 → 待确认 → 管理端确认 → 待取车 → 使用中 → 待还车 → 已完成
         ↓           ↓              ↓
      已取消    已取消（取车前）  已取消（取车前）
```

## 开发工作流程

### 标准任务流程 (3-5天)
1. **需求确认** (0.5天)
2. **API接口设计** (0.5天)
3. **并行开发** (2-3天):
   - 后端: API实现 + 单元测试
   - 前端: 模拟数据 + UI开发
4. **集成测试** (0.5-1天)
5. **验收与部署** (0.5天)

### 质量保证
- 所有代码更改都需要代码审查
- 核心功能需要单元测试
- 启用TypeScript严格模式
- 强制执行ESLint规则
- API响应时间 < 1秒, 页面加载 < 3秒

## 安全考虑

- 基于JWT的身份认证与基于角色的权限控制
- 按用户类型和门店/区域进行数据访问控制
- 输入验证和数据清理
- XSS/CSRF防护
- 敏感数据加密
- API端点速率限制

## 项目阶段

**第一阶段 (第1-2周)**: 框架搭建 + 身份认证
**第二阶段 (第3-8周)**: 核心业务功能
**第三阶段 (第9-12周)**: 营销 + 增值功能
**第四阶段 (第13-14周)**: 测试 + 优化

## 多平台开发注意事项

### 开发工具分工
- **HBuilderX**: 用于 `miniprogram/` 和 `mobile-admin/` (uni-app项目)
- **VS Code**: 用于 `admin-console/` 和 `backend/` (Vue + Node.js项目)

### 平台特定配置
- **微信小程序**: 需要配置微信开发者工具，申请小程序AppID
- **移动端App**: 需要配置原生打包环境 (Android Studio / Xcode)
- **PC后台**: 现代浏览器支持，响应式设计

### 共享代码策略
- API类型定义可在各平台间共享
- 通用工具函数建议提取为独立包
- 业务状态管理逻辑需要平台适配

### 调试与测试
- **小程序**: 微信开发者工具模拟器 + 真机调试
- **移动端**: HBuilderX真机运行 + 各品牌设备测试
- **PC端**: Chrome DevTools + 多浏览器兼容性测试

## 重要注意事项

- 项目当前拥有全面的文档但实际代码实现较少
- 所有技术规范已确定并准备好实现
- 数据库架构已完全设计，包含30+张表
- API规范已文档化，包含详细错误码
- 开发环境配置需要Docker数据库服务
- 多平台开发需要不同的IDE (HBuilderX vs VS Code)

## 文档位置

所有技术规范和开发计划位于`Docs/`目录:
- `技术栈与架构设计.md` - 技术架构
- `数据库设计.md` - 数据库架构
- `API设计规范.md` - API标准
- `代码规范.md` - 代码标准
- `前后端协作流程规范.md` - 开发工作流程
- `开发执行方案总览.md` - 开发计划概览