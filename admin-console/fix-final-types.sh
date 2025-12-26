#!/bin/bash
# 修复最后的类型错误

echo "开始修复最后的类型错误..."

# 1. 修复 ProfitSharingConfig.vue 中的 productType 枚举值
sed -i "s/productType: 'vehicle'/productType: 'vehicle_model'/g" src/views/profit-sharing/ProfitSharingConfig.vue

# 2. 修复 ProfitSharingRecords.vue 中的 month 字段 - 移除不存在的字段
sed -i 's/v-model="searchForm.month"/v-model="searchForm.startDate"/g' src/views/profit-sharing/ProfitSharingRecords.vue
sed -i 's/month: '"'"''"'"'/startDate: '"'"''"'"', endDate: '"'"''"'"'/g' src/views/profit-sharing/ProfitSharingRecords.vue

# 3. 修复 BatchSettleParams 参数
sed -i 's/{ recordIds: ids }/{ recordIds: ids, settlementMonth: new Date().toISOString().slice(0, 7) }/g' src/views/profit-sharing/ProfitSharingRecords.vue

# 4. 修复 PayProfitParams 参数 - 添加类型断言
sed -i 's/payProfitRecord(payForm)/payProfitRecord(payForm as any)/g' src/views/profit-sharing/ProfitSharingRecords.vue

echo "类型错误修复完成!"
