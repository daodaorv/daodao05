# 叨叨房车后端 API

基于 Node.js + Express + TypeScript 的 RESTful API 服务

## 技术栈

- **Node.js**: >= 18.0.0
- **Express**: 4.18.2
- **TypeScript**: 5.3.3
- **MySQL**: 8.0.35
- **Redis**: 7.2.3
- **JWT**: 认证授权

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库和 Redis 连接信息
```

### 3. 启动 Docker 服务

```bash
cd ..
docker compose up -d mysql redis
```

### 4. 初始化数据库

```bash
npm run db:init
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务将在 http://localhost:3001 启动

## 可用脚本

- `npm run dev` - 启动开发服务器（热重载）
- `npm run build` - 编译 TypeScript
- `npm start` - 启动生产服务器
- `npm run lint` - 代码检查
- `npm run format` - 代码格式化
- `npm run db:init` - 初始化数据库
- `npm run db:seed` - 填充种子数据
- `npm run db:reset` - 重置数据库

## 项目结构

```
backend/
├── src/
│   ├── config/       # 配置文件
│   ├── db/           # 数据库层
│   ├── dao/          # 数据访问层
│   ├── services/     # 业务逻辑层
│   ├── routes/       # 路由层
│   ├── middlewares/  # 中间件
│   ├── utils/        # 工具函数
│   ├── types/        # TypeScript 类型
│   ├── constants/    # 常量定义
│   ├── app.ts        # Express 应用
│   └── server.ts     # 服务器入口
├── scripts/          # 脚本工具
├── tests/            # 测试目录
└── logs/             # 日志目录
```

## API 文档

健康检查接口：
- GET /api/v1/health - 服务健康检查
- GET /api/v1/health/db - 数据库连接检查
- GET /api/v1/health/redis - Redis 连接检查

## 开发规范

- 严格遵循 TypeScript 类型安全
- 禁止使用 any 类型
- 所有函数必须有返回类型声明
- 代码必须通过 ESLint 检查
- 提交前必须格式化代码

## License

MIT
