# 叨叨房车 - 独立开发架构项目

全面的房车租赁管理平台，采用"3个前端1个后端"独立开发架构，连接客户、车主和管理员。

## 🏗️ 项目架构

### 独立开发模式
本项目采用**独立开发架构**，将原有的混合开发模式重构为"3个前端1个后端"的独立开发模式：

- **后端服务** (`backend/`) - 独立的RESTful API服务
- **小程序端** (`miniprogram/`) - 独立的uni-app开发
- **PC管理后台** (`admin-console/`) - 独立的Vue3开发
- **移动管理端** (`mobile-admin/`) - 独立的移动端开发

### 共享资源层
```
shared/
├── docs/                    # L1全局文档（API、数据库、架构）
├── tools/                   # 共享工具（Docker、Mock、脚本）
├── assets/                  # 共享静态资源
└── scripts/                 # 自动化脚本
```

## 📊 项目状态

**当前版本**: v2.0.0 - 独立开发架构版本
**最后更新**: 2025-11-24
**开发进度**:
- 后端API: 90% (基础架构、认证、核心业务完成)
- 小程序端: 70% (33个页面、基础功能完成)
- PC管理后台: 60% (29个组件、DIY编辑器完成)
- 移动管理端: 30% (基础结构完成)

## 🚀 快速开始

### 环境要求
- **Node.js**: 18.18.0 LTS
- **Docker**: 20.10+ (用于数据库服务)
- **HBuilderX**: 3.8+ (小程序和移动端开发)
- **VS Code**: 1.80+ (PC后台开发)
- **微信开发者工具**: 最新版本

### 🎯 选择你的开发端

#### 🔧 后端开发者
```bash
# 1. 进入后端目录
cd backend

# 2. 复制环境配置
cp .env.example .env

# 3. 一键启动开发环境
./scripts/start-dev.sh    # Linux/Mac
scripts\start-dev.bat     # Windows

# 4. 访问服务
# API文档: http://localhost:3000/api-docs
# 数据库管理: http://localhost:8080
```

#### 📱 小程序开发者
```bash
# 1. 进入小程序目录
cd miniprogram

# 2. 阅读开发文档
cat docs/development/README.md

# 3. 安装依赖
npm install

# 4. 启动HBuilderX并运行到微信开发者工具
npm run dev:mp-weixin
```

#### 🖥️ PC管理后台开发者
```bash
# 1. 进入PC管理后台目录
cd admin-console

# 2. 阅读开发文档
cat docs/development/README.md

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
# 访问: http://localhost:5173
```

#### 📲 移动管理端开发者
```bash
# 1. 进入移动管理端目录
cd mobile-admin

# 2. 阅读开发文档
cat docs/development/README.md

# 3. 安装依赖
npm install

# 4. 启动HBuilderX并运行
npm run dev:mp-weixin
```

### 🛠️ 快速启动所有服务

如需同时启动所有服务：

```bash
# 启动共享服务（数据库、Mock）
cd shared/tools/docker
docker-compose up -d

cd ../mock-data
npm install && npm start &

# 然后分别启动各端服务（见上文）
```

## 📁 项目结构

```
daodao/
├── shared/                          # 共享资源层
│   ├── docs/                        # L1全局文档
│   │   ├── api/                     # API接口文档
│   │   ├── database/                # 数据库文档
│   │   ├── architecture/            # 系统架构
│   │   └── deployment/              # 部署文档
│   ├── tools/                       # 共享工具
│   │   ├── docker/                  # Docker配置
│   │   ├── mock-data/               # Mock数据服务
│   │   └── scripts/                 # 自动化脚本
│   └── assets/                      # 共享静态资源
├── backend/                         # 后端服务
│   ├── src/                         # 源代码
│   ├── docs/                        # L2后端专属文档
│   ├── docker-compose.yml           # 后端Docker配置
│   └── scripts/                     # 后端启动脚本
├── miniprogram/                     # 小程序端
│   ├── pages/                       # 页面文件（33个页面）
│   ├── components/                  # 组件
│   ├── docs/                        # L2小程序专属文档
│   └── static/                      # 静态资源
├── admin-console/                   # PC管理后台
│   ├── src/                         # 源代码
│   │   ├── components/              # 组件（29个Vue组件）
│   │   ├── views/                   # 页面
│   │   └── stores/                  # 状态管理
│   ├── docs/                        # L2PC端专属文档
│   └── vite.config.ts               # Vite配置
├── mobile-admin/                    # 移动管理端
│   ├── pages/                       # 页面
│   ├── src/                         # 源代码
│   └── docs/                        # L2移动端专属文档
└── README.md                        # 项目说明文档
```

## 📖 文档体系

### 🗂️ 文档分层结构

**L1 全局文档** (`shared/docs/`):
- [API接口文档](shared/docs/api/README.md) - 完整的RESTful API文档
- [数据库设计](shared/docs/database/) - 数据库结构和关系
- [系统架构](shared/docs/architecture/) - 技术架构和设计决策
- [部署指南](shared/docs/deployment/) - 生产环境部署文档

**L2 端专属文档** (`{端}/docs/`):
- **后端文档** ([backend/docs/](backend/docs/)) - API实现、测试、部署
- **小程序文档** ([miniprogram/docs/](miniprogram/docs/)) - 组件、页面、开发规范
- **PC后台文档** ([admin-console/docs/](admin-console/docs/)) - 组件库、状态管理
- **移动端文档** ([mobile-admin/docs/](mobile-admin/docs/)) - 移动端特有功能

### 🔧 开发环境配置

各端独立的开发环境配置：

1. **后端**: 独立Docker Compose + Mock服务
2. **小程序**: HBuilderX + 微信开发者工具
3. **PC后台**: Vite + Element Plus + TypeScript
4. **移动端**: uni-app + 真机调试

## 🛠️ 开发工作流

### 独立开发流程
1. **选择开发端** - 根据你的职责选择对应目录
2. **阅读文档** - 首先阅读该端的开发环境搭建文档
3. **搭建环境** - 按照文档指引搭建独立开发环境
4. **并行开发** - 各端可以独立并行开发，互不阻塞
5. **API对接** - 使用Mock服务或真实后端API进行对接

### API接口对接

**开发环境**:
- Mock服务: `http://localhost:3001` (自动启动)
- 真实API: `http://localhost:3000` (后端服务)

**生产环境**:
- 正式API: `https://api.daodao.com`

### 协作规范

1. **代码提交**: 遵循Conventional Commits规范
2. **分支管理**: feature/功能名, bugfix/问题描述
3. **文档同步**: 重要变更需同步更新相关文档
4. **测试**: 提交前必须通过本地测试

## 🏆 技术栈

### 后端技术栈
- **运行时**: Node.js 18.18.0 LTS
- **框架**: Express.js 4.18.2 + TypeScript 5.1.6
- **数据库**: MySQL 8.0.35 + Redis 7.2.3
- **ORM**: Sequelize 6.32.1
- **认证**: JWT (jsonwebtoken 9.0.2)

### 前端技术栈
- **小程序**: uni-app 3.0 + Vue 3.5 + TypeScript 5.1
- **PC端**: Vue 3.5 + Vite 4.4 + Element Plus 2.11 + TypeScript 5.1
- **移动端**: uni-app + Vue 3 + TypeScript
- **状态管理**: Vue 3 Composition API + Pinia

## 📊 服务访问地址

### 开发环境
| 服务 | 地址 | 说明 |
|------|------|------|
| 后端API | http://localhost:3000 | RESTful API服务 |
| API文档 | http://localhost:3000/api-docs | Swagger UI |
| Mock服务 | http://localhost:3001 | Mock数据服务 |
| PC管理后台 | http://localhost:5173 | Vue管理后台 |
| 数据库管理 | http://localhost:8080 | Adminer |
| 邮件管理 | http://localhost:8025 | MailHog |

### 数据库连接
```bash
# MySQL
Host: localhost:3306
Database: daodao
Username: daodao_dev
Password: daodao_dev_2024

# Redis
Host: localhost:6379
```

## 🎯 快速参考

### 常用命令

**后端**:
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run test         # 运行测试
npm run lint         # 代码检查
```

**小程序**:
```bash
npm run dev:mp-weixin     # 微信小程序开发
npm run build:mp-weixin   # 微信小程序构建
```

**PC后台**:
```bash
npm run dev          # Vite开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建结果
```

### 测试账号
| 用户类型 | 手机号 | 说明 |
|----------|--------|------|
| 管理员 | 13800138000 | PC管理端登录 |
| 普通用户 | 13900139000 | 小程序端登录 |

## 🔄 更新日志

### v2.0.0 (2025-11-24) - 独立开发架构版本
- ✅ 完成独立开发架构重构
- ✅ 建立分层文档管理体系
- ✅ 配置各端独立开发环境
- ✅ 创建共享工具和Mock服务
- ✅ 编写完整的API接口文档

### v1.0.0 (2025-11-18) - 基础版本
- ✅ 基础框架搭建
- ✅ 数据库设计
- ✅ 用户认证系统
- ✅ 基础API结构

## ❓ 常见问题

**Q: 如何选择要开发的部分？**
A: 根据你的职责进入对应目录，详细阅读该端的开发文档。

**Q: 各端之间如何协作？**
A: 通过统一的API接口进行数据交互，使用Mock服务可以在没有真实后端的情况下进行开发。

**Q: 遇到问题如何获取帮助？**
A: 1) 查看对应端的文档 2) 查看项目根目录的CLAUDE.md 3) 联系项目维护者

## 📞 支持与联系

- **技术文档**: 查看对应端的 `docs/` 目录
- **问题反馈**: 提交Issue到项目仓库
- **开发交流**: 项目内部沟通群组

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**🎉 欢迎来到叨叨房车独立开发架构！选择你的开发端，开始愉快的编码吧！**