# AI 工具协作开发指南

## 概述

本项目使用多个 AI 工具协同开发,为保证代码质量和提交历史的可追溯性,所有 AI 工具必须遵循本指南。

## 支持的 AI 工具

| 工具 | 标识 | 主要职责 | 推荐使用场景 |
|------|------|----------|--------------|
| Claude Code | `[claude-code]` | 后端 API、架构设计 | 复杂业务逻辑、API 开发 |
| Codex | `[codex]` | 前端开发、UI 实现 | 小程序、管理端页面 |
| Antigravity | `[antigravity]` | 性能优化、重构 | 代码优化、架构改进 |
| 人工 | `[human]` | Code Review、决策 | 关键决策、最终审核 |

## 工作流程

### 1. 开始新任务前

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建特性分支(包含 AI 工具标识)
git checkout -b <ai-tool>/<type>/<description>

# 示例:
git checkout -b claude-code/feat/user-api-activation
git checkout -b codex/fix/order-list-loading
```

### 2. 开发过程中

- **频繁提交**: 每完成一个小功能就提交,不要积累太多改动
- **原子提交**: 一次提交只做一件事,便于回滚和 Code Review
- **清晰描述**: Commit message 必须说明"为什么"而不只是"做了什么"

### 3. 提交代码

```bash
# 1. 查看改动
git status
git diff

# 2. 暂存文件
git add <files>

# 3. 提交(会自动触发 commit-msg hook 验证)
git commit -m "feat(backend): 激活用户管理 API 路由 [claude-code]

- 在 index.ts 中注册 user.routes
- 完善 UserController 业务逻辑
- 添加用户权限验证中间件

Refs: #123"

# 4. 推送到远程
git push origin <branch-name>
```

### 4. 创建 Pull Request

在 GitHub 上创建 PR 时:

1. **标题格式**: `[AI工具] Type(Scope): Description`
   ```
   [claude-code] feat(backend): 激活用户管理 API 路由
   [codex] fix(miniprogram): 修复订单列表加载失败
   ```

2. **PR 描述模板**:
   ```markdown
   ## 变更类型
   - [ ] 新功能
   - [ ] Bug 修复
   - [ ] 重构
   - [ ] 文档更新
   - [ ] 其他

   ## AI 工具
   - 开发工具: Claude Code / Codex / Antigravity
   - 人工审核: 是 / 否

   ## 变更说明
   简要描述本次变更的内容和原因

   ## 测试情况
   - [ ] 单元测试通过
   - [ ] 集成测试通过
   - [ ] 手动测试通过

   ## 关联 Issue
   Closes #123
   Refs #456

   ## 截图(如适用)
   ```

## 冲突解决策略

### 场景 1: 多个 AI 工具修改同一文件

**原则**: 后提交者负责解决冲突

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 解决冲突
# 手动编辑冲突文件,保留正确的代码

# 3. 标记冲突已解决
git add <conflicted-files>

# 4. 完成合并
git commit -m "chore: 解决与 <other-ai-tool> 的代码冲突 [<your-ai-tool>]"
```

### 场景 2: 功能重复开发

**预防措施**:
1. 在 GitHub Issues 中认领任务
2. 创建分支前检查是否有相同功能的分支
3. 定期同步 main 分支

**发现重复后**:
1. 比较两个实现的优劣
2. 在 Issue 中讨论保留哪个
3. 废弃的分支添加 `[deprecated]` 标签

## 代码审查规范

### AI 工具自查清单

提交前必须确认:

- [ ] 代码符合项目规范(ESLint/Prettier)
- [ ] 没有遗留 console.log/debugger
- [ ] 没有提交敏感信息(.env 文件等)
- [ ] Commit message 格式正确
- [ ] 包含正确的 AI 工具标识
- [ ] 相关文档已更新

### 人工审查要点

- **功能正确性**: 是否实现了需求
- **代码质量**: 是否有明显的 bug 或性能问题
- **安全性**: 是否有安全漏洞(SQL 注入、XSS 等)
- **可维护性**: 代码是否易于理解和修改

## 分支管理策略

### 主分支

- `main`: 生产环境代码,受保护,只能通过 PR 合并
- `develop`: 开发环境代码,集成测试分支

### 特性分支

命名格式: `<ai-tool>/<type>/<description>`

```
claude-code/feat/user-api-activation
codex/fix/order-list-loading
antigravity/refactor/vehicle-page-perf
human/chore/update-docker-config
```

### 分支生命周期

1. **创建**: 从 `main` 或 `develop` 创建
2. **开发**: 频繁提交,定期 rebase main
3. **完成**: 创建 PR,等待审查
4. **合并**: 合并后删除分支
5. **清理**: 定期清理已合并的远程分支

```bash
# 清理已合并的本地分支
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# 清理已删除的远程分支引用
git fetch --prune
```

## 紧急情况处理

### 回滚错误提交

```bash
# 1. 找到错误的 commit
git log --oneline

# 2. 创建回滚提交
git revert <commit-hash>

# 3. 提交回滚
git commit -m "revert: 回滚 <原commit描述> [<ai-tool>]

原因: <说明为什么回滚>

This reverts commit <commit-hash>"
```

### 修复已推送的错误

**禁止使用 `git push --force`** 除非:
1. 分支只有你一个人在用
2. 获得团队负责人批准

推荐做法:
```bash
# 使用 revert 而不是 reset
git revert <bad-commit>
git push origin <branch>
```

## 最佳实践

### DO ✅

- 提交前运行 `git diff` 检查改动
- 使用有意义的 commit message
- 频繁提交,保持提交粒度小
- 定期同步 main 分支
- 在 PR 中详细说明变更原因

### DON'T ❌

- 不要提交未测试的代码
- 不要在 commit message 中使用模糊描述("fix bug", "update code")
- 不要一次提交过多文件(>20 个文件需要拆分)
- 不要直接推送到 main 分支
- 不要使用 `git push --force` 除非必要

## 工具配置

### Claude Code 配置

在 `.claude/CLAUDE.md` 中已配置:
- 自动添加 `[claude-code]` 标识
- 遵循项目 commit 规范
- 提交前自动运行 lint

### Codex 配置

建议在 Codex 设置中:
- 设置默认 commit 后缀: `[codex]`
- 启用 pre-commit hooks
- 配置自动格式化

### Antigravity 配置

建议在 Antigravity 设置中:
- 设置默认 commit 后缀: `[antigravity]`
- 启用代码质量检查
- 配置性能分析工具

## 监控和统计

### 查看各 AI 工具的贡献

```bash
# 统计各工具的提交数
git log --all --pretty=format:"%s" | grep -oE '\[(claude-code|codex|antigravity|human)\]' | sort | uniq -c

# 查看某个工具的所有提交
git log --all --grep="\[claude-code\]" --oneline

# 查看某个工具在某个时间段的提交
git log --all --grep="\[codex\]" --since="2025-01-01" --until="2025-01-31" --oneline
```

### 生成贡献报告

```bash
# 按工具统计代码行数变化
git log --all --pretty=format:"%s" --shortstat | \
  awk '/\[claude-code\]/ {cc++} /\[codex\]/ {cx++} /\[antigravity\]/ {ag++} /\[human\]/ {h++}
       END {print "Claude Code:", cc, "\nCodex:", cx, "\nAntigravity:", ag, "\nHuman:", h}'
```

## 问题排查

### Hook 不生效

```bash
# 确保 hooks 有执行权限
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit

# 重新安装 husky
rm -rf .husky
git config core.hooksPath .husky
```

### Commit 被拒绝

检查:
1. Commit message 是否包含 AI 工具标识
2. 格式是否符合规范
3. 是否有敏感文件被暂存

### 合并冲突

```bash
# 查看冲突文件
git status

# 使用可视化工具解决冲突
git mergetool

# 或手动编辑冲突文件,然后:
git add <resolved-files>
git commit
```

## 联系方式

遇到问题时:
1. 查看本文档的"问题排查"部分
2. 查看 [.github/COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md)
3. 在 GitHub Issues 中提问
4. 联系项目负责人

---

**版本**: v1.0
**最后更新**: 2025-11-29
**维护者**: 项目团队
