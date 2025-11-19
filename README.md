# 叨叨房车项目

全面的房车租赁管理平台，连接客户、车主和管理员，支持多个平台。

## 📊 项目状态

**当前阶段**: 第一阶段 - 单元1（基础框架 + 用户认证）
**开发进度**: 后端API 100% ✅ | 前端 30% 🔄
**最后更新**: 2025-11-18

### 已完成功能
- ✅ 数据库设计与实现（4张核心表）
- ✅ 用户认证系统（注册、登录、JWT）
- ✅ 验证码系统（发送、验证）
- ✅ 用户管理API（CRUD、权限控制）
- ✅ 完整的API文档和测试指南

### 测试账号
| 用户类型 | 手机号 | 密码 | 说明 |
|----------|--------|------|------|
| 管理员 | 13800138000 | 123456 | PC管理端登录 |
| 普通用户 | 13900139000 | 123456 | 小程序端登录 |

## 项目架构

### 多平台结构
- **C端微信小程序** (`miniprogram/`): 面向客户的租赁平台
- **B端PC管理后台** (`admin-console/`): 行政管理系统
- **B端移动管理** (`mobile-admin/`): 现场移动管理应用
- **后端API服务** (`backend/`): 服务所有平台的统一RESTful API

### 技术栈

#### 后端技术栈
- **运行时**: Node.js 18.18.0 LTS
- **框架**: Express.js 4.18.2 + TypeScript 5.1.6
- **数据库**: MySQL 8.0.35 + Redis 7.2.3
- **ORM**: Sequelize 6.32.1
- **身份认证**: JWT (jsonwebtoken 9.0.2)

#### 前端技术栈
- **小程序和移动管理**: Vue 3.5.0 + TypeScript 5.1.6
- **PC管理后台**: Vue 3.5.0 + Vite 4.4.9 + Element Plus 2.11.7 + TypeScript 5.1.6
- **状态管理**: Vue 3 Composition API + Pinia

## 快速开始

### 环境要求
- Node.js 18.18.0 LTS
- Docker 20.10+ (用于数据库服务)
- HBuilderX (用于uni-app开发)
- VS Code (用于PC后台开发)

### 一键启动
```bash
# Windows用户 - 双击运行
启动所有服务.bat

# Linux/Mac用户
./start.sh

# 或者手动启动
docker compose up -d mysql redis
cd backend && npm run dev &
cd admin-console && npm run dev &
```

### 服务访问地址
- **后端API**: http://localhost:3000
- **PC管理后台**: http://localhost:5173
- **数据库管理**: http://localhost:8080
- **健康检查**: http://localhost:3000/health

## 项目结构

```
daodao/
├── backend/                 # 后端API服务
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── config/          # 配置文件
│   ├── package.json
│   └── tsconfig.json
├── admin-console/           # PC管理后台
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── views/           # 页面
│   │   ├── stores/          # 状态管理
│   │   ├── api/             # API接口
│   │   └── utils/           # 工具函数
│   └── package.json
├── miniprogram/             # 微信小程序
│   ├── pages/               # 页面
│   ├── src/                 # 源码
│   └── static/              # 静态资源
├── mobile-admin/            # 移动管理端
│   ├── pages/               # 页面
│   └── src/                 # 源码
└── docker-compose.yml       # 数据库服务配置
```

## 开发指南

### 后端开发
```bash
cd backend
npm install
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run test         # 运行测试
npm run lint         # 代码检查
```

### PC管理后台开发
```bash
cd admin-console
npm install
npm run dev          # Vite开发服务器
npm run build        # 生产构建
npm run preview      # 预览生产构建
```

### 小程序开发
1. 使用HBuilderX打开 `miniprogram/` 目录
2. 配置微信开发者工具
3. 运行到小程序模拟器

### 移动管理端开发
1. 使用HBuilderX打开 `mobile-admin/` 目录
2. 运行到App或小程序模拟器

## 数据库配置

### 连接信息
- **主机**: localhost:3306
- **数据库**: daodao
- **用户名**: daodao_dev
- **密码**: daodao_dev_2024

### 管理界面
- **Adminer**: http://localhost:8080
- **Redis**: localhost:6379

## API接口

### 基础配置
- **基础URL**: `http://localhost:3000/api/v1/`
- **响应格式**: 统一JSON结构
- **错误码**: 标准化业务错误码

### 主要接口
- `GET /health` - 健康检查
- `GET /api/v1/test` - API测试

## 当前状态

✅ **已完成**:
- [x] Docker数据库环境配置
- [x] 后端API服务框架搭建
- [x] PC管理后台初始化
- [x] 微信小程序基础结构
- [x] 移动管理端基础结构
- [x] 数据库连接配置
- [x] 各端编译和运行测试

🚧 **进行中**:
- [ ] 小程序依赖安装和调试

⏳ **待开发**:
- [ ] 用户认证系统
- [ ] 车辆管理功能
- [ ] 订单管理系统
- [ ] 支付集成
- [ ] 实际业务功能

## 贡献

请参考 `Docs/` 目录下的技术规范和开发文档。

## 许可证

MIT License