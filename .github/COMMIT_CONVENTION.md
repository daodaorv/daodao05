# Git Commit 规范

## Commit Message 格式

```
<type>(<scope>): <subject> [<ai-tool>]

<body>

<footer>
```

### Type 类型
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整(不影响功能)
- `refactor`: 重构(既不是新功能也不是修复)
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具/依赖更新
- `revert`: 回滚提交

### Scope 范围
- `backend`: 后端 API
- `admin`: PC 管理端
- `miniprogram`: 微信小程序
- `mobile-admin`: 移动管理端
- `shared`: 共享代码/文档
- `infra`: 基础设施(Docker/CI/CD)

### AI Tool 标识(必填)
- `[claude-code]`: Claude Code 提交
- `[codex]`: Codex 提交
- `[antigravity]`: Antigravity 提交
- `[human]`: 人工提交

### 示例

```bash
# Claude Code 提交示例
feat(backend): 激活用户管理 API 路由 [claude-code]

- 在 index.ts 中注册 user.routes
- 完善 UserController 业务逻辑
- 添加用户权限验证中间件

Refs: #123

# Codex 提交示例
fix(miniprogram): 修复订单列表加载失败问题 [codex]

订单列表在网络慢时会出现白屏,原因是缺少 loading 状态处理

Closes: #456

# Antigravity 提交示例
refactor(admin): 优化车辆管理页面性能 [antigravity]

- 使用虚拟滚动优化长列表
- 添加图片懒加载
- 减少不必要的 API 请求

# 人工提交示例
chore(infra): 更新 Docker Compose 配置 [human]
```

## 强制规则

1. **必须包含 AI 工具标识**: 所有提交必须在 subject 末尾标注工具来源
2. **一次提交只做一件事**: 避免混合多个功能/修复
3. **Body 必须说明原因**: 不只是描述做了什么,还要说明为什么
4. **关联 Issue**: 使用 `Refs: #123` 或 `Closes: #456`

## 分支命名规范

```
<ai-tool>/<type>/<description>

示例:
- claude-code/feat/user-api-activation
- codex/fix/order-list-loading
- antigravity/refactor/vehicle-page-perf
- human/chore/update-docker-config
```

## 提交前检查清单

- [ ] Commit message 符合格式规范
- [ ] 包含正确的 AI 工具标识
- [ ] 代码已通过 lint 检查
- [ ] 相关测试已通过
- [ ] 文档已同步更新
- [ ] 没有包含敏感信息(.env 等)
