#!/bin/bash

# 叨叨房车项目启动脚本

echo "=== 叨叨房车项目启动脚本 ==="
echo ""

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

echo "✅ Docker已运行"

# 启动数据库服务
echo "🚀 启动数据库服务..."
docker compose up -d mysql redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 检查数据库连接
if docker exec daodao-mysql-1 mysql -u daodao_dev -pdaodao_dev_2024 -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ 数据库连接正常"
else
    echo "❌ 数据库连接失败"
    exit 1
fi

# 启动后端服务
echo "🚀 启动后端API服务..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi
npm run dev &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 8

# 检查后端API
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 后端API服务正常"
else
    echo "❌ 后端API服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 启动PC管理后台
echo "🚀 启动PC管理后台..."
cd admin-console
if [ ! -d "node_modules" ]; then
    echo "📦 安装PC管理后台依赖..."
    npm install
fi
npm run dev &
ADMIN_PID=$!
cd ..

# 等待PC管理后台启动
echo "⏳ 等待PC管理后台启动..."
sleep 8

# 检查PC管理后台
if curl -s -I http://localhost:5173 | grep -q "200 OK"; then
    echo "✅ PC管理后台正常"
else
    echo "❌ PC管理后台启动失败"
    kill $ADMIN_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 叨叨房车项目启动成功！"
echo ""
echo "📋 服务访问地址："
echo "   - 后端API: http://localhost:3000"
echo "   - PC管理后台: http://localhost:5173"
echo "   - 数据库管理: http://localhost:8080"
echo ""
echo "📚 开发工具："
echo "   - 微信小程序: 请使用HBuilderX打开 miniprogram 目录"
echo "   - 移动管理端: 请使用HBuilderX打开 mobile-admin 目录"
echo ""
echo "🛑 停止所有服务: Ctrl+C 或运行 ./stop.sh"
echo ""

# 等待用户中断
trap 'echo ""; echo "🛑 正在停止服务..."; kill $BACKEND_PID $ADMIN_PID 2>/dev/null; docker compose down; echo "✅ 所有服务已停止"; exit 0' INT

echo "按 Ctrl+C 停止所有服务..."
while true; do
    sleep 1
done