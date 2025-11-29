# 多 AI 工具协作 - 快速参考卡片

## 🚀 立即开始

### 1. 初始化 (仅需一次)
```bash
# Windows
setup-git-hooks.bat

# Linux/Mac
chmod +x setup-git-hooks.sh
./setup-git-hooks.sh
```

### 2. 日常开发流程

```bash
# 1. 创建分支 (包含 AI 工具标识)
git checkout -b claude-code/feat/your-feature

# 2. 开发代码
# ... 编写代码 ...

# 3. 提交 (必须包含 AI 工具标识)
git add .
git commit -m "feat(backend): Add user API [claude-code]"

# 4. 推送
git push origin claude-code/feat/your-feature
```

## 📋 Commit Message 格式

```
<type>(<scope>): <subject> [<ai-tool>]
```

### Type (必选)
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 构建/工具

### Scope (必选)
- `backend` - 后端 API
- `admin` - PC 管理端
- `miniprogram` - 微信小程序
- `mobile-admin` - 移动管理端
- `shared` - 共享代码
- `infra` - 基础设施

### AI Tool (必选)
- `[claude-code]` - Claude Code
- `[codex]` - Codex
- `[antigravity]` - Antigravity
- `[human]` - 人工

## ✅ 正确示例

```bash
feat(backend): Add user management API [claude-code]
fix(miniprogram): Fix order list loading [codex]
refactor(admin): Optimize vehicle page [antigravity]
docs(shared): Update API documentation [human]
```

## ❌ 错误示例

```bash
# 缺少 AI 工具标识
feat(backend): Add user API

# 缺少 scope
feat: Add user API [claude-code]

# 格式错误
添加用户API [claude-code]
```

## 🔍 常用命令

### 查看提交历史
```bash
# 查看所有提交
git log --oneline

# 查看 Claude Code 的提交
git log --grep="\[claude-code\]" --oneline

# 查看 Codex 的提交
git log --grep="\[codex\]" --oneline
```

### 统计贡献
```bash
# 统计各 AI 工具的提交数
git log --all --pretty=format:"%s" | grep -oE '\[(claude-code|codex|antigravity|human)\]' | sort | uniq -c
```

### 临时禁用 Hooks (紧急情况)
```bash
git commit --no-verify -m "hotfix: Emergency fix"
```

## 🛡️ 提交前检查清单

- [ ] Commit message 包含 AI 工具标识
- [ ] 格式符合规范: `<type>(<scope>): <subject> [<ai-tool>]`
- [ ] 没有提交 `.env` 等敏感文件
- [ ] 没有提交 `node_modules/` 目录
- [ ] 代码已通过 lint 检查
- [ ] 相关测试已通过

## 📖 详细文档

| 文档 | 说明 |
|------|------|
| [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md) | 完整的 Commit 规范 |
| [AI_COLLABORATION_GUIDE.md](.github/AI_COLLABORATION_GUIDE.md) | 协作指南 |
| [MULTI_AI_SETUP_SUMMARY.md](MULTI_AI_SETUP_SUMMARY.md) | 设置总结 |

## 🆘 常见问题

### Q: Commit 被拒绝怎么办?
**A**: 检查 commit message 是否包含 AI 工具标识

### Q: 如何查看某个 AI 工具的所有提交?
**A**: `git log --grep="\[claude-code\]" --oneline`

### Q: 如何临时禁用 hooks?
**A**: `git commit --no-verify -m "message"`

### Q: 如何完全禁用 hooks?
**A**: `git config core.hooksPath .git/hooks`

---

**快速帮助**: 遇到问题查看 [.github/README.md](.github/README.md)
