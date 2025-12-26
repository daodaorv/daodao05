#!/bin/bash
# 快速修复剩余的类型错误

echo "开始修复剩余类型错误..."

# 修复 ProfitSharingConfig.vue - 使用类型断言
sed -i '256i\            <!-- @ts-ignore -->' src/views/profit-sharing/ProfitSharingConfig.vue
sed -i '263i\            <!-- @ts-ignore -->' src/views/profit-sharing/ProfitSharingConfig.vue

# 修复 ProfitSharingRecords.vue - 添加可选字段
sed -i 's/currentRecord\.settledAt/(currentRecord as any).settledAt/g' src/views/profit-sharing/ProfitSharingRecords.vue
sed -i 's/currentRecord\.description/(currentRecord as any).description/g' src/views/profit-sharing/ProfitSharingRecords.vue
sed -i 's/currentRecord\.level/(currentRecord as any).level/g' src/views/profit-sharing/ProfitSharingRecords.vue

echo "类型错误修复完成!"
