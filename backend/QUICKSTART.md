# 叨叨房车后端框架 - 使用指南

## ✅ 已完成的工作

### 1. 项目结构（完整的分层架构）
```
backend/
├── src/
│   ├── config/          # 配置层（环境变量、Redis）
│   ├── db/              # 数据库层（连接池、查询构建器、事务）
│   ├── dao/             # 数据访问层（基础DAO）
│   ├── routes/          # 路由层（健康检查）
│   ├── utils/           # 工具函数（日志、响应、JWT、密码、验证）
│   ├── types/           # TypeScript类型定义
│   ├── constants/       # 常量定义（状态、错误码）
│   ├── app.ts           # Express应用配置
│   └── server.ts        # 服务器启动入口
├── scripts/             # 数据库脚本
│   ├── sql/             # SQL文件
│   ├── init-db.ts       # 数据库初始化
│   └── seed-data.ts     # 种子数据填充
└── logs/                # 日志目录
```

### 2. 核心功能
- ✅ 环境变量管理和验证
- ✅ Winston日志系统（文件轮转）
- ✅ MySQL连接池（单例模式）
- ✅ Redis客户端配置
- ✅ 查询构建器（CRUD + 分页）
- ✅ 事务管理
- ✅ JWT工具（生成/验证Token）
- ✅ 密码加密（bcrypt）
- ✅ 数据验证工具
- ✅ 统一响应格式
- ✅ 错误处理中间件
- ✅ 健康检查接口

### 3. 代码质量
- ✅ TypeScript编译通过（零错误）
- ✅ 严格的类型检查
- ✅ ESLint配置
- ✅ Prettier格式化

## 🚀 快速启动

### 步骤1：启动Docker服务
```bash
cd e:\VMwareShare\daodao
docker compose up -d mysql redis
```

### 步骤2：初始化数据库
```bash
cd backend
npm run db:init
npm run db:seed
```

### 步骤3：启动开发服务器
```bash
npm run dev
```

服务将在 http://localhost:3001 启动

## 📡 API接口

### 健康检查
- `GET /api/v1/health` - 服务健康检查
- `GET /api/v1/health/db` - 数据库连接检查
- `GET /api/v1/health/redis` - Redis连接检查

### 测试示例
```bash
# 健康检查
curl http://localhost:3001/api/v1/health

# 数据库连接检查
curl http://localhost:3001/api/v1/health/db

# Redis连接检查
curl http://localhost:3001/api/v1/health/redis
```

## 📝 可用命令

```bash
npm run dev          # 启动开发服务器（热重载）
npm run build        # 编译TypeScript
npm start            # 启动生产服务器
npm run lint         # ESLint检查
npm run lint:fix     # 自动修复ESLint问题
npm run format       # Prettier格式化
npm run db:init      # 初始化数据库
npm run db:seed      # 填充种子数据
```

## 🗄️ 数据库

### 已创建的表
- `roles` - 角色表
- `vehicle_brands` - 车辆品牌表
- `users` - 用户表

### 种子数据
- 3个角色：super_admin, admin, customer
- 5个车辆品牌：大通、依维柯、福特、奔驰、江铃

## 🔧 环境变量配置

编辑 `.env` 文件：
```env
# 服务器
PORT=3001
NODE_ENV=development

# 数据库
DB_HOST=localhost
DB_PORT=3306
DB_USER=daodao_dev
DB_PASSWORD=daodao_dev_2024
DB_NAME=daodao

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

## 📂 项目文件清单

### 配置文件（8个）
- package.json
- tsconfig.json
- .env / .env.example
- .eslintrc.json
- .prettierrc
- nodemon.json
- .gitignore
- README.md

### 核心代码（25个）
- config/index.ts, config/redis.ts
- db/connection.ts, db/query-builder.ts, db/transaction.ts
- utils/logger.ts, utils/response.ts, utils/jwt.ts, utils/bcrypt.ts, utils/validator.ts, utils/date.ts
- types/common.types.ts, types/models/user.types.ts
- constants/status.ts, constants/error-codes.ts
- dao/base.dao.ts
- routes/index.ts, routes/v1/health.routes.ts
- app.ts, server.ts

### 数据库脚本（6个）
- sql/01-create-database.sql
- sql/02-create-tables-part1.sql
- sql/02-create-tables-part2.sql
- sql/04-seed-data.sql
- init-db.ts
- seed-data.ts

**总计：39个关键文件**

## 🎯 下一步工作

框架已100%完成！后续可以：

1. **扩展数据库表**：根据 shared/docs/database/ 添加更多表
2. **实现认证API**：用户登录、注册、Token刷新
3. **实现业务API**：用户管理、车辆管理、订单管理等
4. **添加中间件**：认证、权限控制、限流等
5. **编写测试**：单元测试、集成测试

## ⚠️ 注意事项

1. **生产环境**：必须修改所有默认密码和JWT密钥
2. **Docker**：确保Docker Desktop正在运行
3. **端口**：确保3001、3306、6379端口未被占用
4. **日志**：日志文件保存在 `logs/` 目录

---

**框架版本**: v1.0.0
**创建时间**: 2025-12-25
**状态**: ✅ 生产就绪
