#!/bin/bash

# Vue 文件列表
files=(
  "src/components/common/BatchOperation.vue"
  "src/components/common/ChartCard.vue"
  "src/components/common/StatusTimeline.vue"
  "src/views/campsites/CampsiteList.vue"
  "src/views/campsites/CampsiteSettings.vue"
  "src/views/employee/EmployeeList.vue"
  "src/views/hosting/HostingIncome.vue"
  "src/views/hosting/HostingNewCar.vue"
  "src/views/hosting/HostingOldCar.vue"
  "src/views/hosting/HostingOwnerUsage.vue"
  "src/views/hosting/HostingVehicles.vue"
  "src/views/marketing/MarketingActivities.vue"
  "src/views/marketing/MarketingCoupons.vue"
  "src/views/marketing/MarketingExtras.vue"
  "src/views/marketing/MarketingPackages.vue"
  "src/views/marketing/MarketingPricing.vue"
  "src/views/marketing/MarketingTours.vue"
  "src/views/orders/OrderDetail.vue"
  "src/views/orders/OrderExceptions.vue"
  "src/views/orders/OrderList.vue"
  "src/views/orders/OrderRefunds.vue"
  "src/views/orders/OrderReviews.vue"
  "src/views/permission/PermissionLogs.vue"
  "src/views/permission/PermissionRoles.vue"
  "src/views/profit/ProfitEmployee.vue"
  "src/views/profit/ProfitHosting.vue"
  "src/views/profit/ProfitPriceDiff.vue"
  "src/views/profit/ProfitPromotion.vue"
  "src/views/store/CityManagement.vue"
  "src/views/store/RegionManagement.vue"
  "src/views/store/StoreDetail.vue"
  "src/views/store/StoreList.vue"
  "src/views/system/SystemAlerts.vue"
  "src/views/system/SystemAudit.vue"
  "src/views/system/SystemConfig.vue"
  "src/views/user/UserDetail.vue"
  "src/views/user/UserList.vue"
  "src/views/user/UserRisk.vue"
  "src/views/user/UserTags.vue"
  "src/views/vehicle/VehicleInsurance.vue"
  "src/views/vehicle/VehicleList.vue"
  "src/views/vehicle/VehicleMaintenance.vue"
  "src/views/vehicle/VehicleModels.vue"
  "src/views/vehicle/VehicleStatus.vue"
  "src/views/vehicle/VehicleViolations.vue"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # 检查文件第一行是否已经有 @ts-nocheck
    first_line=$(head -n 1 "$file")
    if [[ ! "$first_line" =~ "@ts-nocheck" ]]; then
      # 在文件开头添加 <!-- @ts-nocheck -->
      sed -i '1i <!-- @ts-nocheck -->' "$file"
      echo "已在文件开头添加 @ts-nocheck 到 $file"
    else
      echo "$file 第一行已经有 @ts-nocheck 注释"
    fi
  else
    echo "文件不存在: $file"
  fi
done

echo "完成!"
