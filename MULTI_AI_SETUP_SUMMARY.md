# 多 AI 工具协作开发体系 - 设置完成总结

## ✅ 已完成的配置

### 1. Git Commit 规范文档
- **文件**: `.github/COMMIT_CONVENTION.md`
- **内容**: 详细的 commit message 格式规范
- **要求**: 所有提交必须包含 AI 工具标识 `[claude-code]`, `[codex]`, `[antigravity]`, `[human]`

### 2. AI 协作指南
- **文件**: `.github/AI_COLLABORATION_GUIDE.md`
- **内容**:
  - 工作流程说明
  - 冲突解决策略
  - 分支管理规范
  - 代码审查标准
  - 最佳实践

### 3. Git Hooks 自动验证
- **文件**:
  - `.husky/commit-msg` - 验证 commit message 格式
  - `.husky/pre-commit` - 检查敏感文件和代码质量
- **功能**:
  - 自动检查 AI 工具标识
  - 阻止提交敏感文件
  - 警告大文件提交
  - 运行代码 lint 检查

### 4. 快速设置脚本
- **Windows**: `setup-git-hooks.bat`
- **Linux/Mac**: `setup-git-hooks.sh`
- **功能**: 一键初始化 Git Hooks

### 5. 项目主文档更新
- **文件**: `CLAUDE.md`
- **更新**: 添加多 AI 工具协作的 Git 规范说明

### 6. .gitignore 增强
- **文件**: `.gitignore`
- **新增**:
  - 敏感信息过滤规则
  - AI 工具临时文件过滤
  - 备份文件过滤

### 7. 快速参考文档
- **文件**: `.github/README.md`
- **内容**: 快速开始指南和常见问题解答

## 🚀 立即开始使用

### Step 1: 初始化 Git Hooks

**在 Windows 上**:
```bash
setup-git-hooks.bat
```

**在 Linux/Mac 上**:
```bash
chmod +x setup-git-hooks.sh
./setup-git-hooks.sh
```

### Step 2: 测试配置

```bash
# 测试正确的 commit message
git commit --allow-empty -m "feat(backend): 测试提交 [claude-code]"
# ✅ 应该成功

# 测试错误的 commit message (缺少 AI 工具标识)
git commit --allow-empty -m "feat(backend): 测试提交"
# ❌ 应该被拒绝
```

### Step 3: 开始开发

```bash
# 1. 创建特性分支 (包含 AI 工具标识)
git checkout -b claude-code/feat/your-feature-name

# 2. 进行开发
# ... 编写代码 ...

# 3. 提交代码 (必须包含 AI 工具标识)
git add .
git commit -m "feat(backend): 实现新功能 [claude-code]

- 添加了 XXX 功能
- 修复了 YYY 问题

Refs: #123"

# 4. 推送到远程
git push origin claude-code/feat/your-feature-name

# 5. 在 GitHub 上创建 Pull Request
```

## 📋 Commit Message 格式速查

### 基本格式
```
<type>(<scope>): <subject> [<ai-tool>]

<body>

<footer>
```

### Type 类型
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试相关
- `chore` - 构建/工具相关

### Scope 范围
- `backend` - 后端 API
- `admin` - PC 管理端
- `miniprogram` - 微信小程序
- `mobile-admin` - 移动管理端
- `shared` - 共享代码/文档
- `infra` - 基础设施

### AI Tool 标识 (必填)
- `[claude-code]` - Claude Code
- `[codex]` - Codex
- `[antigravity]` - Antigravity
- `[human]` - 人工

### 示例

```bash
# Claude Code 提交
feat(backend): 激活用户管理 API 路由 [claude-code]

- 在 index.ts 中注册 user.routes
- 完善 UserController 业务逻辑
- 添加用户权限验证中间件

Refs: #123

# Codex 提交
fix(miniprogram): 修复订单列表加载失败问题 [codex]

订单列表在网络慢时会出现白屏,原因是缺少 loading 状态处理

Closes: #456

# Antigravity 提交
refactor(admin): 优化车辆管理页面性能 [antigravity]

- 使用虚拟滚动优化长列表
- 添加图片懒加载
- 减少不必要的 API 请求

# 人工提交
chore(infra): 更新 Docker Compose 配置 [human]
```

## 🔍 常见场景处理

### 场景 1: 多个 AI 工具同时开发不同功能

**解决方案**: 使用独立的特性分支

```bash
# Claude Code 开发用户管理
git checkout -b claude-code/feat/user-management

# Codex 开发订单列表
git checkout -b codex/feat/order-list

# Antigravity 优化性能
git checkout -b antigravity/perf/vehicle-page
```

### 场景 2: 发现其他 AI 工具的代码有问题

**解决方案**: 创建修复分支并说明原因

```bash
git checkout -b claude-code/fix/codex-order-list-issue

git commit -m "fix(miniprogram): 修复 Codex 实现的订单列表问题 [claude-code]

原 Codex 实现缺少错误处理,导致网络异常时崩溃

Refs: #789"
```

### 场景 3: 需要回滚某个 AI 工具的提交

**解决方案**: 使用 git revert

```bash
# 1. 找到需要回滚的 commit
git log --grep="\[codex\]" --oneline

# 2. 回滚该 commit
git revert <commit-hash>

# 3. 提交回滚
git commit -m "revert: 回滚 Codex 的订单列表实现 [claude-code]

原因: 该实现导致性能问题,需要重新设计

This reverts commit <commit-hash>"
```

### 场景 4: 合并冲突

**解决方案**: 后提交者负责解决

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 解决冲突 (手动编辑文件)
# ... 编辑冲突文件 ...

# 3. 标记冲突已解决
git add <conflicted-files>

# 4. 完成合并
git commit -m "chore: 解决与 Codex 的代码冲突 [claude-code]

冲突文件: src/api/orders.ts
解决方案: 保留 Codex 的 UI 实现,使用 Claude Code 的 API 调用逻辑"
```

## 📊 监控和统计

### 查看各 AI 工具的贡献

```bash
# 统计各工具的提交数
git log --all --pretty=format:"%s" | grep -oE '\[(claude-code|codex|antigravity|human)\]' | sort | uniq -c

# 输出示例:
#   45 [claude-code]
#   32 [codex]
#   18 [antigravity]
#   12 [human]
```

### 查看某个工具的所有提交

```bash
# Claude Code 的所有提交
git log --all --grep="\[claude-code\]" --oneline

# Codex 的最近 10 次提交
git log --all --grep="\[codex\]" --oneline -10

# Antigravity 在某个时间段的提交
git log --all --grep="\[antigravity\]" --since="2025-01-01" --until="2025-01-31" --oneline
```

### 生成贡献报告

```bash
# 按工具统计代码行数变化
git log --all --pretty=format:"%s" --shortstat | \
  awk '/\[claude-code\]/ {cc++} /\[codex\]/ {cx++} /\[antigravity\]/ {ag++} /\[human\]/ {h++}
       END {print "Claude Code:", cc, "\nCodex:", cx, "\nAntigravity:", ag, "\nHuman:", h}'
```

## 🛡️ 安全检查清单

提交前必须确认:

- [ ] Commit message 包含正确的 AI 工具标识
- [ ] 没有提交 `.env` 文件
- [ ] 没有提交 `credentials.json` 等敏感文件
- [ ] 没有遗留 `console.log` 或 `debugger`
- [ ] 代码通过 lint 检查
- [ ] 相关测试已通过
- [ ] 文档已同步更新

## 🔧 故障排查

### 问题 1: Hook 不生效

**症状**: 提交时没有触发验证

**解决**:
```bash
# 检查 hooks 路径配置
git config core.hooksPath
# 应该输出: .husky

# 如果不是,重新配置
git config core.hooksPath .husky

# 确保 hooks 有执行权限 (Linux/Mac)
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
```

### 问题 2: Commit 被拒绝

**症状**: `❌ Commit 被拒绝: 缺少 AI 工具标识`

**解决**: 在 commit message 末尾添加 AI 工具标识

```bash
# ❌ 错误
git commit -m "feat(backend): 添加新功能"

# ✅ 正确
git commit -m "feat(backend): 添加新功能 [claude-code]"
```

### 问题 3: 需要临时绕过 hooks

**场景**: 紧急修复,来不及遵循规范

**解决**: 使用 `--no-verify` (仅紧急情况)

```bash
git commit --no-verify -m "hotfix: 紧急修复生产环境问题"
```

⚠️ **警告**: 仅在紧急情况下使用,事后必须补充规范的 commit

### 问题 4: 如何禁用 hooks

**场景**: 需要完全禁用 hooks

**解决**:
```bash
# 临时禁用
git config core.hooksPath .git/hooks

# 恢复启用
git config core.hooksPath .husky
```

## 📖 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| Commit 规范 | `.github/COMMIT_CONVENTION.md` | 详细的 commit message 格式 |
| 协作指南 | `.github/AI_COLLABORATION_GUIDE.md` | 完整的协作流程和最佳实践 |
| 快速参考 | `.github/README.md` | 快速开始和常见问题 |
| 项目主文档 | `CLAUDE.md` | 项目整体架构和开发指南 |

## 🎯 下一步行动

1. **立即执行**: 运行 `setup-git-hooks.bat` (Windows) 或 `setup-git-hooks.sh` (Linux/Mac)
2. **测试验证**: 尝试提交一个测试 commit,确保 hooks 正常工作
3. **通知团队**: 将本文档分享给所有使用 AI 工具的开发者
4. **配置工具**: 在 Codex 和 Antigravity 中配置自动添加工具标识
5. **开始开发**: 按照规范进行日常开发

## 💡 最佳实践建议

### DO ✅

1. **频繁提交**: 每完成一个小功能就提交
2. **清晰描述**: 说明"为什么"而不只是"做了什么"
3. **原子提交**: 一次提交只做一件事
4. **定期同步**: 每天开始工作前 `git pull`
5. **及时推送**: 完成功能后立即推送到远程

### DON'T ❌

1. **不要积累**: 不要等到完成很多功能才提交
2. **不要模糊**: 不要使用 "fix bug", "update code" 等模糊描述
3. **不要混合**: 不要在一次提交中混合多个不相关的改动
4. **不要强推**: 不要使用 `git push --force` 除非必要
5. **不要跳过**: 不要使用 `--no-verify` 除非紧急情况

## 🤝 团队协作建议

### 每日工作流

```bash
# 1. 早上开始工作
git checkout main
git pull origin main

# 2. 创建今天的工作分支
git checkout -b claude-code/feat/today-feature

# 3. 开发过程中频繁提交
git add .
git commit -m "feat(backend): 实现 XXX 功能 [claude-code]"

# 4. 下班前推送到远程
git push origin claude-code/feat/today-feature

# 5. 创建 Pull Request 等待审查
```

### 每周回顾

```bash
# 查看本周的提交统计
git log --since="1 week ago" --pretty=format:"%s" | grep "\[claude-code\]" | wc -l

# 查看本周修改的文件
git log --since="1 week ago" --name-only --pretty=format: | sort | uniq

# 生成本周工作报告
git log --since="1 week ago" --grep="\[claude-code\]" --pretty=format:"- %s (%ar)" --reverse
```

## 📞 获取帮助

遇到问题时:

1. **查看文档**: 先查看 `.github/` 目录下的相关文档
2. **搜索历史**: 使用 `git log` 查看类似场景的处理方式
3. **提问讨论**: 在 GitHub Issues 中提问
4. **联系负责人**: 紧急情况联系项目负责人

---

## 🎉 恭喜!

你已经完成了多 AI 工具协作开发体系的设置!

现在你可以:
- ✅ 与其他 AI 工具无冲突地协同开发
- ✅ 清晰追踪每个 AI 工具的贡献
- ✅ 自动验证 commit message 格式
- ✅ 防止提交敏感信息
- ✅ 保持代码库的整洁和可维护性

**开始你的协作开发之旅吧!** 🚀

---

**文档版本**: v1.0
**创建日期**: 2025-11-29
**维护者**: Claude Code
**最后更新**: 2025-11-29
