#!/bin/bash

# 批量修复 backend 中的 any 类型问题

echo "开始修复 backend 的类型问题..."

# 1. 修复 DAO 层：将 any[] 替换为 unknown[]
find src/dao -name "*.ts" -type f -exec sed -i 's/: any\[\]/: unknown[]/g' {} \;

# 2. 修复 DAO 层：将 params: any 替换为 params: unknown
find src/dao -name "*.ts" -type f -exec sed -i 's/params: any/params: unknown/g' {} \;

# 3. 修复 routes 层：将 any 替换为 unknown
find src/routes -name "*.ts" -type f -exec sed -i 's/: any\[\]/: unknown[]/g' {} \;
find src/routes -name "*.ts" -type f -exec sed -i 's/: any)/: unknown)/g' {} \;

# 4. 修复 types 层
find src/types -name "*.ts" -type f -exec sed -i 's/: any;/: unknown;/g' {} \;

echo "修复完成！"
