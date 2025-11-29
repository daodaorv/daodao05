#!/bin/bash

echo "🚀 开始设置 Git Hooks for 多 AI 工具协作..."

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
  echo "❌ 错误: 当前目录不是 Git 仓库"
  exit 1
fi

# 创建 .husky 目录
echo "📁 创建 .husky 目录..."
mkdir -p .husky

# 设置 Git hooks 路径
echo "⚙️  配置 Git hooks 路径..."
git config core.hooksPath .husky

# 设置 hooks 执行权限
echo "🔐 设置 hooks 执行权限..."
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit

# 创建 .husky/_/husky.sh (兼容性文件)
mkdir -p .husky/_
cat > .husky/_/husky.sh << 'EOF'
#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  if [ $exitCode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi
EOF

chmod +x .husky/_/husky.sh

# 测试 commit-msg hook
echo ""
echo "🧪 测试 commit-msg hook..."
echo "feat(backend): 测试提交 [claude-code]" | .husky/commit-msg /dev/stdin 2>&1

if [ $? -eq 0 ]; then
  echo "✅ commit-msg hook 测试通过"
else
  echo "⚠️  commit-msg hook 测试失败，但已安装"
fi

echo ""
echo "✅ Git Hooks 设置完成！"
echo ""
echo "📋 使用说明:"
echo "  1. 所有 commit 必须包含 AI 工具标识: [claude-code], [codex], [antigravity], [human]"
echo "  2. 格式: <type>(<scope>): <subject> [<ai-tool>]"
echo "  3. 示例: feat(backend): 激活用户 API [claude-code]"
echo ""
echo "📖 详细文档:"
echo "  - Commit 规范: .github/COMMIT_CONVENTION.md"
echo "  - 协作指南: .github/AI_COLLABORATION_GUIDE.md"
echo ""
echo "🔧 如需禁用 hooks，运行: git config core.hooksPath .git/hooks"
