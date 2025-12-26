#!/bin/bash
# 批量修复类型错误

echo "开始修复类型错误..."

# 1. 修复 mock/profit.ts 中的枚举值
sed -i "s/orderType: 'hosting'/orderType: OrderType.HOSTING/g" src/mock/profit.ts
sed -i "s/profitType: 'hosting'/profitType: ProfitType.HOSTING/g" src/mock/profit.ts
sed -i "s/profitType: 'promotion'/profitType: ProfitType.PROMOTION/g" src/mock/profit.ts
sed -i "s/beneficiaryType: 'owner'/beneficiaryType: BeneficiaryType.OWNER/g" src/mock/profit.ts
sed -i "s/beneficiaryType: 'promoter'/beneficiaryType: BeneficiaryType.PROMOTER/g" src/mock/profit.ts
sed -i "s/hostingType: 'old_car'/hostingType: HostingType.OLD_CAR/g" src/mock/profit.ts
sed -i "s/settlementStatus: 'pending'/settlementStatus: SettlementStatus.PENDING/g" src/mock/profit.ts
sed -i "s/settlementStatus: 'settled'/settlementStatus: SettlementStatus.SETTLED/g" src/mock/profit.ts
sed -i "s/settlementStatus: 'paid'/settlementStatus: SettlementStatus.PAID/g" src/mock/profit.ts

echo "类型修复完成!"
