# 多 AI 工具协作开发规范

本目录包含多 AI 工具协同开发的规范文档和配置文件。

## 📚 文档索引

| 文档 | 说明 | 适用对象 |
|------|------|----------|
| [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) | Git Commit 规范 | 所有开发者 |
| [AI_COLLABORATION_GUIDE.md](AI_COLLABORATION_GUIDE.md) | AI 工具协作指南 | 所有 AI 工具 |

## 🚀 快速开始

### 1. 初始化 Git Hooks

**Windows**:
```bash
setup-git-hooks.bat
```

**Linux/Mac**:
```bash
chmod +x setup-git-hooks.sh
./setup-git-hooks.sh
```

### 2. 验证配置

```bash
# 测试 commit message 格式
git commit --allow-empty -m "feat(backend): 测试提交 [claude-code]"

# 应该成功通过
```

### 3. 开始开发

```bash
# 创建特性分支
git checkout -b claude-code/feat/your-feature

# 开发并提交
git add .
git commit -m "feat(backend): 实现新功能 [claude-code]"

# 推送到远程
git push origin claude-code/feat/your-feature
```

## 🤖 AI 工具标识

| 工具 | 标识 | 使用场景 |
|------|------|----------|
| Claude Code | `[claude-code]` | 后端 API、架构设计 |
| Codex | `[codex]` | 前端开发、UI 实现 |
| Antigravity | `[antigravity]` | 性能优化、重构 |
| 人工 | `[human]` | Code Review、决策 |

## ✅ Commit Message 格式

```
<type>(<scope>): <subject> [<ai-tool>]

<body>

<footer>
```

### 示例

```bash
# 新功能
feat(backend): 激活用户管理 API 路由 [claude-code]

# Bug 修复
fix(miniprogram): 修复订单列表加载失败问题 [codex]

# 重构
refactor(admin): 优化车辆管理页面性能 [antigravity]

# 文档更新
docs(shared): 更新 API 文档 [human]
```

## 🔍 常见问题

### Q: Commit 被拒绝怎么办?

**A**: 检查 commit message 是否包含 AI 工具标识:

```bash
# ❌ 错误示例
git commit -m "feat(backend): 添加新功能"

# ✅ 正确示例
git commit -m "feat(backend): 添加新功能 [claude-code]"
```

### Q: 如何临时禁用 hooks?

**A**: 使用 `--no-verify` 参数:

```bash
git commit --no-verify -m "临时提交"
```

⚠️ **注意**: 仅在紧急情况下使用,正常开发必须遵循规范。

### Q: 如何查看某个 AI 工具的所有提交?

**A**: 使用 git log 过滤:

```bash
# 查看 Claude Code 的所有提交
git log --all --grep="\[claude-code\]" --oneline

# 查看 Codex 的所有提交
git log --all --grep="\[codex\]" --oneline
```

### Q: 多个 AI 工具修改同一文件怎么办?

**A**: 遵循"后提交者负责解决冲突"原则:

1. 拉取最新代码: `git pull origin main`
2. 解决冲突
3. 提交: `git commit -m "chore: 解决与 <other-ai-tool> 的代码冲突 [<your-ai-tool>]"`

## 📊 统计命令

```bash
# 统计各 AI 工具的提交数
git log --all --pretty=format:"%s" | grep -oE '\[(claude-code|codex|antigravity|human)\]' | sort | uniq -c

# 查看最近 10 次提交
git log --oneline -10

# 查看某个时间段的提交
git log --since="2025-01-01" --until="2025-01-31" --oneline
```

## 🛠️ 工具配置

### Claude Code

在项目根目录的 `CLAUDE.md` 中已配置:
- 自动添加 `[claude-code]` 标识
- 遵循项目 commit 规范

### Codex

建议配置:
```json
{
  "git.commitMessageSuffix": " [codex]",
  "git.enablePreCommitHook": true
}
```

### Antigravity

建议配置:
```yaml
git:
  commit_suffix: " [antigravity]"
  enable_hooks: true
```

## 📖 相关资源

- [项目主文档](../CLAUDE.md)
- [后端开发指南](../backend/CLAUDE.md)
- [前端开发指南](../admin-console/CLAUDE.md)
- [Git 官方文档](https://git-scm.com/doc)

## 🆘 获取帮助

遇到问题时:
1. 查看本文档的"常见问题"部分
2. 阅读详细的协作指南
3. 在 GitHub Issues 中提问
4. 联系项目负责人

---

**维护者**: 项目团队
**最后更新**: 2025-11-29
**版本**: v1.0
