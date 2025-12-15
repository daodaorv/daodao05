# CLAUDE.md

叨叨房车租赁管理平台 - 全栈房车租赁解决方案

---

## 项目概述

一个基于 Node.js 后端 + Vue 3 前端 + uni-app 移动端的全栈房车租赁管理平台：
- **backend**: Node.js + Express + TypeScript RESTful API (端口 3001)
- **admin-console**: Vue 3 + Element Plus PC 管理后台 (端口 5173)
- **miniprogram**: uni-app 3 微信小程序用户端 (HBuilderX)
- **mobile-admin**: uni-app 3 移动管理端 (HBuilderX)

**技术栈**: Node.js 18.18.0 | Express 4.18.2 | Vue 3.4.0 | TypeScript 5.1.6 | Sequelize 6.32.1 | MySQL 8.0.35 | Redis 7.2.3

---

## 重要：前端独立开发模式

**本项目采用前端独立开发，后端逐一对接的开发模式**

### 当前阶段：前端独立开发

三个前端项目独立开发，互不依赖后端：

1. **admin-console** (PC管理端)
   - 使用 Mock 数据完成所有页面
   - 不启动 backend 服务
   - 查看进度：[admin-console/docs/实施计划.md](./admin-console/docs/实施计划.md)

2. **miniprogram** (微信小程序)
   - 使用 Mock 数据完成所有页面
   - 不启动 backend 服务
   - 查看进度：miniprogram/docs/实施计划.md (待创建)

3. **mobile-admin** (移动管理端)
   - 使用 Mock 数据完成所有页面
   - 不启动 backend 服务
   - 查看进度：[mobile-admin/docs/实施计划.md](./mobile-admin/docs/实施计划.md)

### API 状态标识

在各前端的 API 文档中使用统一的状态标识：
- **未开发** - 前端尚未开发
- **已开发** - 前端完成，使用 Mock 数据
- **待后端开发** - 前端完成，等待后端 API
- **待联调** - 后端 API 完成，准备联调
- **联调完成** - 前后端联调成功

---

## 核心工作流程

**每个任务必须遵循此流程**

### 1. 研究阶段 (RESEARCH)
- 检查现有代码库中的类似实现
- 使用 Glob/Grep 搜索相关代码
- 理解项目架构和依赖关系
- **不确定时：联网搜索最新文档和最佳实践**

### 2. 计划阶段 (PLAN)
- 列出要修改/创建的文件清单
- 说明实现方案和关键步骤
- 识别潜在风险和边缘情况
- **重要：获得用户确认后再开始编码**

### 3. 实现阶段 (IMPLEMENT)
- 遵循项目现有代码风格
- 完整的错误处理（绝不跳过）
- 编写时同步添加测试
- 运行 linter/formatter/type-checker

**复杂架构问题：先深度思考再提出方案**

---

## 质量红线（绝不违反）

### 提交前强制检查
- **必须通过** Linter（零警告零错误）
- **必须通过** 所有测试
- **必须完成** 代码格式化
- **必须通过** 类型检查（TypeScript）

### 绝对禁止的行为
- 绝不提交未通过测试的代码
- 绝不使用 TODO/占位符/Mock 作为最终代码
- 绝不跳过错误处理
- 绝不硬编码密钥/凭证
- 绝不使用 `any` 类型（TypeScript 必须用 `unknown`）
- 绝不说"这是简化版"、"生产环境需要..."

---

## 通用编码标准

### Clean Code 原则（强制遵循）

**有意义的命名:**
- ✅ `getUserById(id)` ❌ `getData(x)`
- ✅ `MAX_RETRY_COUNT = 3` ❌ `num = 3`
- **函数名应该是动词**，变量名应该是名词

**单一职责原则（SRP）:**
- 一个函数只做一件事
- 一个类只有一个修改理由
- **重要：函数超过 30 行需要拆分**

**DRY 原则（Don't Repeat Yourself）:**
- **绝不** 复制粘贴代码
- 重复 3 次以上必须提取为函数
- 相似逻辑必须抽象为通用函数

### 错误处理（强制）

**TypeScript/JavaScript:**
```typescript
// 必须使用 unknown，不能用 any
try {
  await operation();
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error('操作失败', { message: error.message });
  }
  throw error; // 重新抛出，不要吞掉错误
}
```

**空值处理（重要）：**
```typescript
// ✅ 正确：使用可选链和空值合并
const userName = user?.profile?.name ?? 'Guest';

// ✅ 正确：函数参数验证
function processUser(user: User | null) {
  if (!user) {
    throw new Error('User is required');
  }
  // 继续处理
}

// ❌ 错误：未检查空值
const name = user.profile.name; // 可能导致运行时错误
```

**边界条件检查：**
```typescript
// 必须检查边界条件
function getItem(arr: any[], index: number) {
  if (index < 0 || index >= arr.length) {
    throw new Error('Index out of bounds');
  }
  return arr[index];
}
```

### 命名规范

遵循项目现有风格，常见约定：
- 文件: `kebab-case.ts`, `PascalCase.tsx`（组件）
- 变量/函数: `camelCase`
- 类/组件: `PascalCase`
- 常量: `SCREAMING_SNAKE_CASE`
- 数据库表: `snake_case`

**重要：优先遵循项目现有命名风格**

---

## 安全标准（强制）

### 输入验证
- **必须** 验证所有用户输入
- **必须** 使用验证库（Zod、Joi、Pydantic）
- **绝不** 信任客户端数据

### 数据库安全
- **必须** 使用参数化查询
- **必须** 防止 SQL 注入
- **推荐** 使用 ORM/查询构建器

### 认证授权
- 短期访问令牌（15分钟）+ 长期刷新令牌（7天）
- **绝不** 在代码中硬编码密钥
- **必须** 使用环境变量存储敏感信息

---

## 前端开发规范

### 组件设计原则
- **组件拆分粒度**：单个组件代码不超过 200 行
- **组件命名**：`PascalCase`，见名知意（如 `UserProfileCard`）
- **Props 设计**：必须定义类型（TypeScript/PropTypes）
- **状态管理**：遵循项目选择的方案，保持一致性

### React Hooks 规范（如使用 React）

**useState 规范：**
```typescript
// ✅ 正确：相关状态合并
const [user, setUser] = useState({ firstName: '', lastName: '' });

// ❌ 错误：分散的相关状态
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
```

**useEffect 规范（重要）：**
```typescript
// ✅ 正确：总是声明依赖数组
useEffect(() => {
  fetchData(id);
}, [id]);

// ❌ 错误：缺少依赖会导致 bug
useEffect(() => {
  fetchData(id); // id 未声明在依赖中
}, []);
```

**性能优化：**
```typescript
// ✅ 使用 key 优化列表渲染
{items.map(item => <Item key={item.id} data={item} />)}

// ❌ 错误：使用索引作为 key
{items.map((item, index) => <Item key={index} />)}
```

### UI 组件库使用原则
- **遵循项目选择**：使用项目已选择的 UI 库
- **按需引入**：避免全量引入增大打包体积
- **保持一致性**：禁止在同一项目混用多个 UI 库
- **查阅文档**：不确定时联网搜索该 UI 库的最佳实践

### 样式规范
- **遵循项目规范**：使用项目已选择的样式方案
- **避免行内样式**：除非需要动态计算
- **避免全局样式污染**：使用模块化样式方案
- **保持一致性**：整个项目使用统一的样式方案

---

## 后端开发规范

### API 设计原则（重要）

**路由命名：**
- **必须使用名词**，不用动词：`/api/users` ✅ `/api/getUsers` ❌
- **复数形式**：`/users` 而不是 `/user`
- **RESTful 标准**：
  ```
  GET    /api/users          # 列表
  GET    /api/users/:id      # 详情
  POST   /api/users          # 创建
  PUT    /api/users/:id      # 完整更新
  PATCH  /api/users/:id      # 部分更新
  DELETE /api/users/:id      # 删除
  ```

**版本控制：**
- URL 版本：`/api/v1/users`（推荐）
- Header 版本：`Accept: application/vnd.api+json; version=1`

### 响应格式标准
```json
// 成功
{"data": {...}, "meta": {"timestamp": "2025-11-20T10:00:00Z"}}

// 错误（必须包含 code 和 message）
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "验证失败",
    "details": [{"field": "email", "message": "邮箱格式错误"}]
  }
}
```

### HTTP 状态码（严格遵循）
- 200: 成功 | 201: 创建成功 | 204: 删除成功（无返回）
- 400: 请求错误 | 401: 未认证 | 403: 无权限 | 404: 不存在
- 422: 验证失败 | 429: 请求过多 | 500: 服务器错误

---

## 测试规范

### 测试覆盖率要求
- 业务逻辑: **80% 以上**
- 关键路径: **100%**
- API 端点: **必须有集成测试**
- **重要：所有测试必须通过才能提交代码**

### 测试文件管理（重要）

**测试文件位置：**
- 单元测试：与源文件同目录（`user.service.ts` → `user.service.test.ts`）
- 集成测试：`tests/integration/` 目录
- E2E 测试：`tests/e2e/` 目录

**测试文件命名：**
- `*.test.ts` 或 `*.spec.ts`（保持项目一致）
- 描述性命名：`user-authentication.test.ts`

**测试数据管理：**
- **测试完成后必须清理**：删除测试数据、关闭连接、清理临时文件
- 使用 `beforeEach/afterEach` 钩子自动清理
- **绝不** 在测试中修改生产数据
- 使用独立的测试数据库

---

## Git 规范

### 分支命名
- `feature/功能描述`
- `bugfix/问题描述`
- `hotfix/紧急修复`

### Commit 消息（Conventional Commits）

**格式**: `<type>(<scope>): <subject> [<ai-tool>]`

**示例**:
```bash
feat(backend): 激活用户管理 API 路由 [claude-code]
fix(miniprogram): 修复订单列表加载失败 [claude-code]
refactor(admin): 优化车辆管理页面性能 [claude-code]
chore(infra): 更新 Docker Compose 配置 [human]
```

**Type 类型**:
- `feat` - 新功能
- `fix` - 修复 bug
- `docs` - 文档更新
- `refactor` - 代码重构
- `test` - 测试相关
- `chore` - 构建/工具相关
- `perf` - 性能优化

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

---

## 性能优化原则

### 数据库
- 避免 N+1 查询（使用 eager loading）
- 合理使用索引
- 适当缓存查询结果

### 前端
- 代码分割和懒加载
- 图片优化（WebP、压缩、CDN）
- 避免不必要的重渲染

### 后端
- 异步处理耗时操作
- 使用连接池
- Redis 缓存热点数据

**不确定优化方案时：联网搜索该技术栈的性能最佳实践**

---

## 项目适配

### 识别技术栈
每个新项目：
1. 检查 `package.json` / `requirements.txt` / `go.mod`
2. 理解使用的框架和工具
3. **遵循项目现有代码风格**（这点最重要）
4. 不确定时联网搜索该技术栈最佳实践

### 技术栈适配原则
**重要：不要假设技术栈，遵循项目实际使用的技术**

遇到任何技术时，联网查找最新文档和最佳实践：
- 前端框架（React、Vue、Angular、Svelte 等）
- 后端框架（Express、FastAPI、Django、Spring Boot 等）
- 数据库（PostgreSQL、MySQL、MongoDB、Redis 等）
- 移动端（React Native、Flutter、Kotlin、Swift 等）
- UI 库（根据项目选择）
- 状态管理（根据项目选择）
- 样式方案（根据项目选择）

---

## 问题解决流程

### 遇到不确定的情况

**重要：按此顺序执行**

1. **停止** - 不要猜测或假设
2. **研究** - 检查现有代码库类似实现
3. **搜索** - 联网查找官方文档和最佳实践
4. **提问** - 向用户确认需求和方案
5. **计划** - 制定详细实施方案
6. **实现** - 执行并验证

### 应该联网搜索的场景
- 新技术/框架的最佳实践
- 特定库的最新 API 文档
- 错误消息的解决方案
- 性能优化技巧
- 安全漏洞修复方法
- 行业标准和规范

---

## 禁止模式

### 禁止的表述
- "这是简化版..."
- "生产环境需要..."
- "TODO: 稍后实现"
- "我觉得可能..."
- "您说得对"

### 禁止的代码
- 超过 50 行的函数
- 嵌套超过 3 层的条件
- 魔法数字（必须使用常量）
- 注释掉的代码
- 重复代码（DRY 原则）

---

## 完成标准

**代码达到生产就绪：**
- ✅ Linter 零警告
- ✅ 所有测试通过
- ✅ 格式化完成
- ✅ 类型检查通过
- ✅ 功能端到端验证
- ✅ 文档已更新
- ✅ 无 TODO 注释
- ✅ Code Review 通过

---

## 快速启动

### 基础设施
```bash
# 启动数据库服务（MySQL + Redis）
docker compose up -d mysql redis

# 查看服务状态
docker compose ps
```

### 后端开发
```bash
cd backend
npm run dev          # 端口 3001
npm run lint         # ESLint 检查
npm test             # 运行测试
```

### PC 管理端开发
```bash
cd admin-console
npm run dev          # 端口 5173
npm run lint         # ESLint + Prettier
npm run type-check   # TypeScript 类型检查
```

### 小程序/移动管理端开发
```bash
# miniprogram 和 mobile-admin 使用 HBuilderX 开发
# 1. 使用 HBuilderX 打开对应目录
# 2. 点击"运行" → "运行到微信开发者工具"（小程序）
# 3. 或"运行到浏览器"/"运行到手机模拟器"（移动管理端）
```

---

## 环境变量配置

### backend/.env
```bash
PORT=3001
DATABASE_URL=mysql://daodao_dev:daodao_dev_2024@localhost:3306/daodao
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 相关文档

### 各端详细文档
- **后端模块**: [backend/CLAUDE.md](./backend/CLAUDE.md)
- **PC 管理端**: [admin-console/CLAUDE.md](./admin-console/CLAUDE.md)
- **小程序端**: [miniprogram/CLAUDE.md](./miniprogram/CLAUDE.md)
- **移动管理端**: [mobile-admin/CLAUDE.md](./mobile-admin/CLAUDE.md)

### 实施计划（项目进度）
- **PC 管理端进度**: [admin-console/docs/实施计划.md](./admin-console/docs/实施计划.md)
- **移动管理端进度**: [mobile-admin/docs/实施计划.md](./mobile-admin/docs/实施计划.md)
- **小程序端进度**: miniprogram/docs/实施计划.md (待创建)

### 设计文档
- **数据库设计**: [shared/docs/database/](./shared/docs/database/)
- **API 文档**: [shared/docs/api/](./shared/docs/api/)
- **产品需求**: 各端 docs/ 目录下的产品需求文档

---

## 快速参考

### 常用命令
```bash
# 开发
npm run dev / pnpm dev / yarn dev

# 测试
npm test / npm run test:watch

# 构建
npm run build

# 质量检查
npm run lint
npm run format
npm run type-check

# Git
git status
git add .
git commit -m "feat(scope): 功能描述 [claude-code]"
git push -u origin branch-name
```

### 关键原则
1. **先研究、后计划、再实现**
2. **不确定时联网搜索**
3. **严格遵循项目现有风格**
4. **测试必须100%通过**
5. **绝不提交失败的代码**

---

**版本**: v7.0 | **最后更新**: 2025-12-03 | **更新内容**: 精简文档，整合核心工作流程和质量标准，移除冗余项目状态信息，改为引用各端实施计划文档
