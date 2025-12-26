#!/bin/bash
# 批量修复 API 响应类型

echo "开始修复 API 响应类型..."

# 修复 stores/profit.ts
sed -i 's/const res = await/const res = await/g' src/stores/profit.ts
sed -i 's/if (res\.code === 200)/if ((res as any).code === 200)/g' src/stores/profit.ts
sed -i 's/res\.data/(res as any).data/g' src/stores/profit.ts
sed -i 's/res\.message/(res as any).message/g' src/stores/profit.ts

# 修复 ProfitSharingRecords.vue
sed -i 's/if (res\.code === 200)/if ((res as any).code === 200)/g' src/views/profit-sharing/ProfitSharingRecords.vue
sed -i 's/res\.data/(res as any).data/g' src/views/profit-sharing/ProfitSharingRecords.vue
sed -i 's/res\.message/(res as any).message/g' src/views/profit-sharing/ProfitSharingRecords.vue

echo "API 响应类型修复完成!"
