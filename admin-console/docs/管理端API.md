# 管理端API文档

**文档版本**: v1.0.0 | **更新时间**: 2025-11-29 | **适用范围**: 管理端前后端开发

---

## 📋 文档说明

本文档记录管理端所有API接口的开发状态和详细信息。

### API状态标识

- 🔴 **未开发** - 前端尚未开发
- 🟡 **已开发** - 前端完成，使用 Mock 数据
- 🟠 **待后端开发** - 前端完成，等待后端 API
- 🔵 **待联调** - 后端 API 完成，准备联调
- 🟢 **联调完成** - 前后端联调成功

---

## 1. 认证管理模块

### 1.1 用户登录
- **接口**: `POST /api/v1/auth/login`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "phone": "string",
    "password": "string"
  }
  ```
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "string",
      "user": {
        "id": "number",
        "username": "string",
        "role": "string",
        "permissions": ["string"]
      }
    }
  }
  ```

### 1.2 用户登出
- **接口**: `POST /api/v1/auth/logout`
- **状态**: 🟢 联调完成（已切换真实API）

### 1.3 刷新Token
- **接口**: `POST /api/v1/auth/refresh`
- **状态**: 🟢 联调完成（已切换真实API）

### 1.4 获取用户信息
- **接口**: `GET /api/v1/auth/me`
- **状态**: 🟢 联调完成（已切换真实API）

### 1.5 修改密码
- **接口**: `POST /api/v1/auth/change-password`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```

---

## 2. 用户管理模块

### 2.1 用户列表
- **接口**: `GET /api/v1/users`
- **状态**: 🟢 联调完成（已切换真实API）
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `phone`: 手机号搜索
  - `username`: 用户名搜索
  - `userType`: 用户类型 (customer/mobile_admin/pc_admin)
  - `status`: 用户状态 (active/inactive/banned)
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [UserInfo],
      "total": 8,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

### 2.2 用户详情
- **接口**: `GET /api/v1/users/:id`
- **状态**: 🟢 联调完成（已切换真实API）

### 2.3 创建用户
- **接口**: `POST /api/v1/users`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "username": "string",
    "phone": "string",
    "password": "string",
    "email": "string",
    "realName": "string",
    "userType": "customer|mobile_admin|pc_admin"
  }
  ```

### 2.4 更新用户
- **接口**: `PUT /api/v1/users/:id`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "username": "string",
    "email": "string",
    "realName": "string",
    "userType": "customer|mobile_admin|pc_admin",
    "status": "active|inactive|banned"
  }
  ```

### 2.5 删除用户
- **接口**: `DELETE /api/v1/users/:id`
- **状态**: 🟢 联调完成（已切换真实API）

### 2.6 更改用户状态
- **接口**: `PUT /api/v1/users/:id/status`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "status": "active|inactive|banned"
  }
  ```

### 2.7 用户标签管理

#### 2.7.1 获取所有标签
- **接口**: `GET /api/v1/tags`
- **状态**: 🟢 联调完成（已切换真实API）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "name": "VIP用户",
        "color": "warning",
        "description": "高价值用户",
        "userCount": 15,
        "createdAt": "2024-01-15T08:00:00.000Z"
      }
    ]
  }
  ```

#### 2.7.2 创建标签
- **接口**: `POST /api/v1/tags`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "name": "string",
    "color": "primary|success|warning|danger|info",
    "description": "string"
  }
  ```

#### 2.7.3 更新标签
- **接口**: `PUT /api/v1/tags/:id`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "name": "string",
    "color": "primary|success|warning|danger|info",
    "description": "string"
  }
  ```

#### 2.7.4 删除标签
- **接口**: `DELETE /api/v1/tags/:id`
- **状态**: 🟢 联调完成（已切换真实API）

#### 2.7.5 获取标签下的用户
- **接口**: `GET /api/v1/user-tags/:id/users`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `keyword`: 搜索关键词（手机号/用户名）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "username": "张三",
          "phone": "13800138000",
          "avatarUrl": "string",
          "tags": [Tag],
          "createdAt": "2024-01-15T08:00:00.000Z"
        }
      ],
      "total": 10,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 2.7.6 为用户添加标签
- **接口**: `POST /api/v1/users/:id/tags`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "tagIds": [1, 2, 3]
  }
  ```

#### 2.7.7 移除用户标签
- **接口**: `DELETE /api/v1/users/:userId/tags/:tagId`
- **状态**: 🟢 联调完成（已切换真实API）

#### 2.7.8 批量添加用户到标签
- **接口**: `POST /api/v1/user-tags/:id/users/batch`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "userIds": [1, 2, 3]
  }
  ```

#### 2.7.9 批量移除标签
- **接口**: `DELETE /api/v1/user-tags/:id/users/batch`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "userIds": [1, 2, 3]
  }
  ```

### 2.8 风控管理

#### 2.8.1 获取风险用户列表
- **接口**: `GET /api/v1/users/risk`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `keyword`: 搜索关键词（手机号/用户名）
  - `riskLevel`: 风险等级（high/medium/low）
  - `riskType`: 风险类型（login/behavior/payment/credit）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "username": "张三",
          "phone": "13800138000",
          "avatarUrl": "string",
          "riskLevel": "high",
          "riskType": "login",
          "riskScore": 85,
          "riskReason": "短时间内多次登录失败，疑似账号被盗",
          "detectedAt": "2024-11-29T10:30:00.000Z",
          "status": "pending"
        }
      ],
      "total": 25,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 2.8.2 获取风险统计
- **接口**: `GET /api/v1/users/risk/stats`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "highRisk": 5,
      "mediumRisk": 12,
      "lowRisk": 8,
      "total": 25
    }
  }
  ```

#### 2.8.3 处理风险用户
- **接口**: `POST /api/v1/users/:id/risk/process`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "action": "ignore|warning|restrict|blacklist",
    "remark": "string"
  }
  ```

#### 2.8.4 加入黑名单
- **接口**: `POST /api/v1/users/:id/blacklist`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "reason": "fraud|complaint|violation|other",
    "description": "string"
  }
  ```

### 2.9 黑名单管理

#### 2.9.1 获取黑名单列表
- **接口**: `GET /api/v1/users/blacklist`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `keyword`: 搜索关键词（手机号/用户名）
  - `reason`: 加入原因（fraud/complaint/violation/other）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "username": "周八",
          "phone": "13800138005",
          "avatarUrl": "string",
          "reason": "fraud",
          "description": "多次使用虚假信息进行欺诈，造成平台损失",
          "addedBy": "管理员",
          "addedAt": "2024-11-25T10:00:00.000Z",
          "isActive": true,
          "removedAt": null,
          "removeReason": null
        }
      ],
      "total": 3,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 2.9.2 添加黑名单
- **接口**: `POST /api/v1/users/blacklist`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "userId": 1,
    "reason": "fraud|complaint|violation|other",
    "description": "string"
  }
  ```

#### 2.9.3 解除黑名单
- **接口**: `DELETE /api/v1/users/blacklist/:id`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "removeReason": "string"
  }
  ```

#### 2.9.4 重新加入黑名单
- **接口**: `PUT /api/v1/users/blacklist/:id/reactivate`
- **状态**: 🟡 已开发

---

## 3. 车辆管理模块

### 3.1 车型库管理

#### 3.1.1 获取车型列表
- **接口**: `GET /api/v1/vehicles/models`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `brandId`: 品牌ID
  - `keyword`: 车型名称搜索
  - `vehicleType`: 车辆类型（c_type/b_type/trailer）
  - `status`: 状态（active/inactive）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "brandId": 1,
          "brandName": "大通",
          "modelName": "RV80 C型房车",
          "vehicleType": "c_type",
          "seats": 6,
          "beds": 4,
          "length": 5.9,
          "width": 2.3,
          "height": 3.2,
          "fuelCapacity": 80,
          "dailyPrice": 800,
          "vehicleCount": 15,
          "image": "string",
          "description": "string",
          "features": ["空调", "冰箱"],
          "status": "active",
          "createdAt": "2024-01-15 10:00:00",
          "updatedAt": "2024-11-20 14:30:00"
        }
      ],
      "total": 6,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.1.2 获取车型详情
- **接口**: `GET /api/v1/vehicles/models/:id`
- **状态**: 🟡 已开发

#### 3.1.3 创建车型
- **接口**: `POST /api/v1/vehicles/models`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "brandId": 1,
    "modelName": "string",
    "vehicleType": "c_type",
    "seats": 6,
    "beds": 4,
    "length": 5.9,
    "width": 2.3,
    "height": 3.2,
    "fuelCapacity": 80,
    "dailyPrice": 800,
    "image": "string",
    "description": "string",
    "features": ["空调", "冰箱"]
  }
  ```

#### 3.1.4 更新车型
- **接口**: `PUT /api/v1/vehicles/models/:id`
- **状态**: 🟡 已开发

#### 3.1.5 删除车型
- **接口**: `DELETE /api/v1/vehicles/models/:id`
- **状态**: 🟡 已开发

#### 3.1.6 更改车型状态
- **接口**: `PUT /api/v1/vehicles/models/:id/status`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "status": "active|inactive"
  }
  ```

#### 3.1.7 获取品牌列表
- **接口**: `GET /api/v1/vehicles/brands`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "name": "大通",
        "logo": "",
        "status": "active"
      }
    ]
  }
  ```

### 3.2 车辆管理

#### 3.2.1 获取车辆列表
- **接口**: `GET /api/v1/vehicles`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `vehicleNumber`: 车牌号搜索
  - `modelId`: 车型ID
  - `storeId`: 门店ID
  - `status`: 车辆状态（available/rented/maintenance/repair/retired）
  - `ownershipType`: 所有权类型（crowdfunding/cooperative）
  - `crowdfundingProjectId`: 众筹项目ID
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "vehicleNumber": "京A12345",
          "modelId": 1,
          "modelName": "RV80 C型房车",
          "brandName": "大通",
          "vehicleType": "c_type",
          "ownershipType": "crowdfunding",
          "crowdfundingProjectId": 1,
          "crowdfundingProjectName": "大通RV80众筹项目一期",
          "storeId": 1,
          "storeName": "北京朝阳店",
          "status": "available",
          "purchaseDate": "2024-01-15",
          "purchasePrice": 450000,
          "currentMileage": 15000,
          "lastMaintenanceDate": "2024-11-01",
          "nextMaintenanceDate": "2024-12-01",
          "insuranceCompany": "中国人保",
          "insuranceExpireDate": "2025-01-15",
          "annualInspectionDate": "2025-01-15",
          "location": "北京市朝阳区",
          "images": ["string"],
          "features": ["空调", "冰箱"],
          "dailyPrice": 800,
          "remark": "string",
          "createdAt": "2024-01-15 10:00:00",
          "updatedAt": "2024-11-29 14:30:00"
        }
      ],
      "total": 8,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.2.2 获取车辆详情
- **接口**: `GET /api/v1/vehicles/:id`
- **状态**: 🟡 已开发

#### 3.2.3 创建车辆
- **接口**: `POST /api/v1/vehicles`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "vehicleNumber": "string",
    "modelId": 1,
    "ownershipType": "crowdfunding",
    "crowdfundingProjectId": 1,
    "crowdfundingProjectName": "string",
    "storeId": 1,
    "storeName": "string",
    "purchaseDate": "2024-01-15",
    "purchasePrice": 450000,
    "currentMileage": 0,
    "dailyPrice": 800,
    "location": "string",
    "insuranceCompany": "string",
    "insuranceExpireDate": "2025-01-15",
    "annualInspectionDate": "2025-01-15",
    "lastMaintenanceDate": "2024-11-01",
    "nextMaintenanceDate": "2024-12-01",
    "remark": "string"
  }
  ```

#### 3.2.4 更新车辆
- **接口**: `PUT /api/v1/vehicles/:id`
- **状态**: 🟡 已开发

#### 3.2.5 删除车辆
- **接口**: `DELETE /api/v1/vehicles/:id`
- **状态**: 🟡 已开发

#### 3.2.6 更改车辆状态
- **接口**: `PUT /api/v1/vehicles/:id/status`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "status": "available|rented|maintenance|repair|retired"
  }
  ```

### 3.3 车辆状态管理

#### 3.3.1 获取车辆状态统计
- **接口**: `GET /api/v1/vehicles/status/stats`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "available": 3,
      "rented": 1,
      "maintenance": 2,
      "repair": 1,
      "retired": 1
    }
  }
  ```

#### 3.3.2 获取车辆状态历史
- **接口**: `GET /api/v1/vehicles/:vehicleId/status/history`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": [
      {
        "id": 1,
        "vehicleId": 1,
        "vehicleNumber": "京A12345",
        "oldStatus": "maintenance",
        "newStatus": "available",
        "reason": "定期保养完成，车辆已恢复正常",
        "remark": "更换了机油、机滤、空气滤芯",
        "operator": "张三",
        "operatorId": 1,
        "estimatedRecoveryTime": "2024-11-29 18:00:00",
        "createdAt": "2024-11-29 14:30:00"
      }
    ]
  }
  ```

#### 3.3.3 创建状态变更记录
- **接口**: `POST /api/v1/vehicles/:vehicleId/status/history`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "vehicleId": 1,
    "newStatus": "maintenance",
    "reason": "达到保养里程，进行定期保养",
    "remark": "里程数：15000km",
    "estimatedRecoveryTime": "2024-11-29 18:00:00"
  }
  ```

---

## 4. 订单管理模块

### 4.1 订单列表
- **接口**: `GET /api/v1/orders`
- **状态**: 🔴 未开发

### 4.2 订单详情
- **接口**: `GET /api/v1/orders/:id`
- **状态**: 🔴 未开发

### 4.3 更新订单状态
- **接口**: `PUT /api/v1/orders/:id/status`
- **状态**: 🔴 未开发

---

## 5. 支付管理模块

### 5.1 支付记录列表
- **接口**: `GET /api/v1/payments`
- **状态**: 🔴 未开发

### 5.2 退款处理
- **接口**: `POST /api/v1/payments/refund`
- **状态**: 🔴 未开发

---

## 6. 营销管理模块

### 6.1 优惠券列表
- **接口**: `GET /api/v1/coupons`
- **状态**: 🔴 未开发

### 6.2 创建优惠券
- **接口**: `POST /api/v1/coupons`
- **状态**: 🔴 未开发

### 6.3 评价列表
- **接口**: `GET /api/v1/reviews`
- **状态**: 🔴 未开发

---

## 7. 工作台模块

### 7.1 数据概览
- **接口**: `GET /api/v1/dashboard/overview`
- **状态**: 🔴 未开发

### 7.2 今日待办
- **接口**: `GET /api/v1/dashboard/todos`
- **状态**: 🔴 未开发

---

## 8. 门店管理模块

### 8.1 门店列表
- **接口**: `GET /api/v1/stores`
- **状态**: 🔴 未开发

### 8.2 门店详情
- **接口**: `GET /api/v1/stores/:id`
- **状态**: 🔴 未开发

### 8.3 创建门店
- **接口**: `POST /api/v1/stores`
- **状态**: 🔴 未开发

---

## 9. 员工管理模块

### 9.1 员工列表
- **接口**: `GET /api/v1/employees`
- **状态**: 🔴 未开发

### 9.2 员工详情
- **接口**: `GET /api/v1/employees/:id`
- **状态**: 🔴 未开发

---

## 10. 权限管理模块

### 10.1 角色管理

#### 10.1.1 获取角色列表
- **接口**: `GET /api/v1/roles`
- **状态**: 🟢 联调完成（已切换真实API）
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `keyword`: 角色名称搜索
  - `status`: 角色状态（active/inactive）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "name": "平台管理员",
          "code": "platform_admin",
          "type": "platform_admin",
          "description": "拥有系统所有权限",
          "dataScope": "all",
          "userCount": 5,
          "status": "active",
          "isSystem": true,
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "total": 4,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 10.1.2 创建角色
- **接口**: `POST /api/v1/roles`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "name": "string",
    "code": "string",
    "type": "platform_admin|regional_manager|store_manager|store_staff",
    "description": "string",
    "dataScope": "all|region|store|self",
    "status": "active|inactive"
  }
  ```

#### 10.1.3 更新角色
- **接口**: `PUT /api/v1/roles/:id`
- **状态**: 🟢 联调完成（已切换真实API）

#### 10.1.4 删除角色
- **接口**: `DELETE /api/v1/roles/:id`
- **状态**: 🟢 联调完成（已切换真实API）

#### 10.1.5 配置角色权限
- **接口**: `PUT /api/v1/roles/:id/permissions`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "menuPermissions": ["/dashboard", "/users", "/users/list"],
    "functionPermissions": ["user:view", "user:create", "user:edit"]
  }
  ```

#### 10.1.6 获取角色用户列表
- **接口**: `GET /api/v1/roles/:id/users`
- **状态**: 🟢 联调完成（已切换真实API）

### 10.2 操作日志

#### 10.2.1 获取操作日志列表
- **接口**: `GET /api/v1/operation-logs`
- **状态**: 🟢 联调完成（已切换真实API）
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `operator`: 操作人
  - `module`: 操作模块（user/role/permission/vehicle/order）
  - `action`: 操作类型（create/update/delete/query）
  - `startDate`: 开始日期
  - `endDate`: 结束日期
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "operator": "管理员",
          "operatorAvatar": "",
          "module": "user",
          "action": "create",
          "description": "创建用户：张三",
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0...",
          "status": "success",
          "duration": 125,
          "requestParams": "{}",
          "responseData": "{}",
          "createdAt": "2024-11-30T10:30:00.000Z"
        }
      ],
      "total": 100,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 10.2.2 获取操作日志详情
- **接口**: `GET /api/v1/operation-logs/:id`
- **状态**: 🟡 已开发

#### 10.2.3 导出操作日志
- **接口**: `POST /api/v1/operation-logs/export`
- **状态**: 🟡 已开发

#### 10.2.4 清理操作日志
- **接口**: `DELETE /api/v1/operation-logs/clean`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "beforeDate": "2024-01-01"
  }
  ```

---

## 11. 员工管理模块

### 11.1 员工列表
- **接口**: `GET /api/v1/employees`
- **状态**: 🟢 联调完成（已切换真实API）
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `keyword`: 搜索关键词（姓名/手机号/工号）
  - `storeId`: 所属门店ID
  - `roleId`: 角色ID
  - `status`: 员工状态（active/inactive）
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "list": [
        {
          "id": 1,
          "realName": "张三",
          "jobNumber": "EMP001",
          "phone": "13800138000",
          "email": "zhangsan@daodao.com",
          "role": "平台管理员",
          "storeId": 1,
          "storeName": "北京朝阳店",
          "department": "技术部",
          "status": "active",
          "avatar": "",
          "joinDate": "2024-01-15"
        }
      ],
      "total": 3,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

### 11.2 员工详情
- **接口**: `GET /api/v1/employees/:id`
- **状态**: 🟢 联调完成（已切换真实API）

### 11.3 创建员工
- **接口**: `POST /api/v1/employees`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "realName": "string",
    "jobNumber": "string",
    "phone": "string",
    "email": "string",
    "storeId": 1,
    "department": "string",
    "joinDate": "2024-01-15",
    "status": "active"
  }
  ```

### 11.4 更新员工
- **接口**: `PUT /api/v1/employees/:id`
- **状态**: 🟢 联调完成（已切换真实API）

### 11.5 员工状态变更
- **接口**: `PUT /api/v1/employees/:id/status`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "status": "active|inactive"
  }
  ```

### 11.6 分配员工角色
- **接口**: `POST /api/v1/employees/:id/roles`
- **状态**: 🟢 联调完成（已切换真实API）
- **请求参数**:

  ```json
  {
    "roleIds": [1, 2, 3]
  }
  ```

### 11.7 导出员工列表
- **接口**: `POST /api/v1/employees/export`
- **状态**: 🟢 联调完成（已切换真实API）

### 11.8 导入员工数据
- **接口**: `POST /api/v1/employees/import`
- **状态**: 🟢 联调完成（已切换真实API）

---

## 12. 系统配置模块

### 12.1 系统配置

#### 12.1.1 获取系统配置
- **接口**: `GET /api/v1/system/config`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "platformName": "叨叨房车",
      "platformLogo": "string",
      "servicePhone": "400-888-8888",
      "serviceEmail": "service@daodao.com",
      "maintenanceMode": false,
      "sessionTimeout": 30
    }
  }
  ```

#### 12.1.2 更新系统配置
- **接口**: `PUT /api/v1/system/config`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "platformName": "string",
    "servicePhone": "string",
    "serviceEmail": "string",
    "maintenanceMode": false,
    "sessionTimeout": 30
  }
  ```

### 12.2 参数设置

#### 12.2.1 获取参数列表
- **接口**: `GET /api/v1/system/params`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `category`: 参数分类（system/business/performance/security）
  - `keyword`: 参数名称搜索

#### 12.2.2 创建参数
- **接口**: `POST /api/v1/system/params`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "name": "string",
    "key": "string",
    "category": "system",
    "type": "string",
    "value": "string",
    "unit": "string",
    "defaultValue": "string",
    "description": "string"
  }
  ```

#### 12.2.3 更新参数
- **接口**: `PUT /api/v1/system/params/:id`
- **状态**: 🟡 已开发

#### 12.2.4 删除参数
- **接口**: `DELETE /api/v1/system/params/:id`
- **状态**: 🟡 已开发

#### 12.2.5 重置参数值
- **接口**: `PUT /api/v1/system/params/:id/reset`
- **状态**: 🟡 已开发

### 12.3 智能预警

#### 12.3.1 获取预警列表
- **接口**: `GET /api/v1/system/alerts`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `level`: 预警级别（critical/warning/info）
  - `type`: 预警类型（business/system/performance/security）
  - `status`: 处理状态（pending/processing/resolved/ignored）

#### 12.3.2 获取预警详情
- **接口**: `GET /api/v1/system/alerts/:id`
- **状态**: 🟡 已开发

#### 12.3.3 标记预警已处理
- **接口**: `PUT /api/v1/system/alerts/:id/resolve`
- **状态**: 🟡 已开发

#### 12.3.4 忽略预警
- **接口**: `PUT /api/v1/system/alerts/:id/ignore`
- **状态**: 🟡 已开发

#### 12.3.5 创建预警规则
- **接口**: `POST /api/v1/system/alert-rules`
- **状态**: 🟡 已开发

#### 12.3.6 获取预警统计
- **接口**: `GET /api/v1/system/alerts/stats`
- **状态**: 🟡 已开发

### 12.4 系统监控

#### 12.4.1 获取系统状态
- **接口**: `GET /api/v1/system/monitor/status`
- **状态**: 🟡 已开发
- **响应数据**:

  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "cpu": 45,
      "memory": 68,
      "disk": 52,
      "network": 12.5
    }
  }
  ```

#### 12.4.2 获取服务状态
- **接口**: `GET /api/v1/system/monitor/services`
- **状态**: 🟡 已开发

#### 12.4.3 获取数据库连接池状态
- **接口**: `GET /api/v1/system/monitor/database`
- **状态**: 🟡 已开发

#### 12.4.4 获取API性能统计
- **接口**: `GET /api/v1/system/monitor/api-stats`
- **状态**: 🟡 已开发

#### 12.4.5 获取系统日志
- **接口**: `GET /api/v1/system/monitor/logs`
- **状态**: 🟡 已开发
- **查询参数**:
  - `level`: 日志级别（error/warn/info）
  - `limit`: 返回数量

### 12.5 审计日志

#### 12.5.1 获取审计日志列表
- **接口**: `GET /api/v1/system/audit-logs`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `operator`: 操作人
  - `module`: 操作模块
  - `action`: 操作类型
  - `status`: 操作结果
  - `startDate`: 开始日期
  - `endDate`: 结束日期

#### 12.5.2 获取审计日志详情
- **接口**: `GET /api/v1/system/audit-logs/:id`
- **状态**: 🟡 已开发

#### 12.5.3 导出审计日志
- **接口**: `POST /api/v1/system/audit-logs/export`
- **状态**: 🟡 已开发

#### 12.5.4 清理审计日志
- **接口**: `DELETE /api/v1/system/audit-logs/clean`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "strategy": "date",
    "days": 90
  }
  ```

### 12.6 数据备份

#### 12.6.1 获取备份列表
- **接口**: `GET /api/v1/system/backups`
- **状态**: 🟡 已开发
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `type`: 备份类型（full/incremental/differential）
  - `status`: 备份状态（success/failed/processing）

#### 12.6.2 创建备份
- **接口**: `POST /api/v1/system/backups`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "name": "string",
    "type": "full",
    "compress": true,
    "tables": ["users", "orders"],
    "remark": "string"
  }
  ```

#### 12.6.3 恢复备份
- **接口**: `POST /api/v1/system/backups/:id/restore`
- **状态**: 🟡 已开发

#### 12.6.4 下载备份
- **接口**: `GET /api/v1/system/backups/:id/download`
- **状态**: 🟡 已开发

#### 12.6.5 验证备份
- **接口**: `POST /api/v1/system/backups/:id/verify`
- **状态**: 🟡 已开发

#### 12.6.6 删除备份
- **接口**: `DELETE /api/v1/system/backups/:id`
- **状态**: 🟡 已开发

#### 12.6.7 获取自动备份设置
- **接口**: `GET /api/v1/system/backups/auto-settings`
- **状态**: 🟡 已开发

#### 12.6.8 更新自动备份设置
- **接口**: `PUT /api/v1/system/backups/auto-settings`
- **状态**: 🟡 已开发
- **请求参数**:

  ```json
  {
    "enabled": true,
    "frequency": "daily",
    "time": "02:00",
    "keepCount": 7,
    "type": "full"
  }
  ```

#### 12.6.9 获取备份统计
- **接口**: `GET /api/v1/system/backups/stats`
- **状态**: 🟡 已开发

---

**最后更新**: 2025-11-30
