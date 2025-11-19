#!/bin/bash

echo "🚀 叨叨房车项目 GitHub 部署脚本"
echo "================================="
echo ""
echo "📋 请按以下步骤操作："
echo ""
echo "1️⃣ 创建GitHub仓库："
echo "   - 访问: https://github.com/new"
echo "   - 仓库名: daodao05"
echo "   - 描述: 叨叨房车租赁管理平台 - 全方位房车租赁解决方案"
echo "   - 选择 Public"
echo "   - 不要勾选任何初始化选项"
echo ""
echo "2️⃣ 仓库创建后，按回车继续..."
read -p ""
echo ""
echo "3️⃣ 正在推送代码到GitHub..."
echo ""
# 切换到SSH连接
git remote set-url origin git@github.com:daodaorv/daodao05.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功！代码已推送到GitHub！"
    echo "🔗 访问仓库: https://github.com/daodaorv/daodao05"
else
    echo ""
    echo "❌ 推送失败，请检查SSH密钥是否正确添加到GitHub"
fi