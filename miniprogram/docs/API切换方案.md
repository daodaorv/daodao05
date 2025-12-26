# 小程序API切换方案

**创建时间**: 2025-12-25 17:15
**状态**: 进行中

---

## 📊 模块切换状态总览

| 模块 | 前端文件 | 后端状态 | 切换状态 | 优先级 |
|------|---------|---------|---------|--------|
| 认证模块 | auth.ts | ✅ 完成 | ✅ 已完成 | P1 |
| 门店模块 | store.ts | ✅ 完成 | ✅ 已完成 | P1 |
| 车辆模块 | vehicle.ts | ✅ 完成 | ✅ 已完成 | P2 |
| 订单模块 | order.ts | ✅ 完成 | ✅ 已完成 | P2 |
| 支付模块 | payment.ts | ✅ 完成 | ✅ 已完成 | P2 |

---

## 🎯 阶段1: 认证模块切换 (✅ 已完成)

### 改造清单

#### 1. sendCode() - 发送验证码
- **后端接口**: `POST /api/v1/auth/send-code`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端

#### 2. register() - 用户注册
- **后端接口**: `POST /api/v1/auth/register`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端,自动保存token

#### 3. login() - 密码登录
- **后端接口**: `POST /api/v1/auth/login`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端,自动保存token

#### 4. loginWithCode() - 验证码登录
- **后端接口**: `POST /api/v1/auth/login-with-code`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端,自动保存token

#### 5. getUserProfile() - 获取用户资料
- **后端接口**: `GET /api/v1/users/profile`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `get()` 调用后端

#### 6. updateUserProfile() - 更新用户资料
- **后端接口**: `PUT /api/v1/users/profile`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `put()` 调用后端,自动更新本地存储

#### 7. logout() - 退出登录
- **后端接口**: 暂无(本地清除token即可)
- **状态**: ✅ 无需改造
- **说明**: 保持现有实现,清除本地token和用户信息

---

## 🎯 阶段2: 订单模块切换 (✅ 已完成)

### 改造清单

#### 1. createOrder() - 创建订单
- **后端接口**: `POST /api/v1/orders`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端

#### 2. getOrders() / getUserOrders() - 获取订单列表
- **后端接口**: `GET /api/v1/orders`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `get()` 调用后端,支持状态筛选和分页

#### 3. getOrderDetail() - 获取订单详情
- **后端接口**: `GET /api/v1/orders/:id`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `get()` 调用后端

#### 4. cancelOrder() - 取消订单
- **后端接口**: `POST /api/v1/orders/:id/cancel`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `post()` 调用后端,支持取消原因

#### 5. deleteOrder() - 删除订单
- **后端接口**: `DELETE /api/v1/orders/:id`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `del()` 调用后端

#### 6. updateOrderStatus() - 更新订单状态
- **后端接口**: `PUT /api/v1/orders/:orderNo/status`
- **状态**: ✅ 已完成
- **改造方式**: 使用 `put()` 调用后端

#### 7. calculatePrice() - 计算订单价格
- **后端接口**: 待确认
- **状态**: ⚠️ 保持Mock
- **说明**: 等待后端实现

#### 8. getOrderStatusList() - 获取订单状态列表
- **后端接口**: 待确认
- **状态**: ⚠️ 保持Mock
- **说明**: 等待后端实现

---

## 📝 改造注意事项

### 1. 保持函数签名不变
- 不修改函数参数和返回类型
- 确保前端页面无需修改

### 2. 统一错误处理
- 使用 request.ts 的统一错误处理
- 保持错误格式一致

### 3. Token管理
- request.ts 已自动处理 token
- 登录成功后保存 token 到本地存储

### 4. 数据格式转换
- 后端返回格式: `{ code, message, data }`
- 前端需要的格式: 根据具体函数调整

---

## ✅ 已完成的模块

### 门店模块 (store.ts)
- ✅ getCities() - 获取城市列表
- ✅ getStores() - 获取门店列表
- ✅ getStoreDetail() - 获取门店详情

### 车辆模块 (vehicle.ts)
- ✅ getVehicles() - 查询可用房车
- ✅ getVehicleDetail() - 获取房车详情
- ⚠️ lockVehicle() - 锁定库存(Mock)
- ⚠️ unlockVehicle() - 释放库存(Mock)

### 支付模块 (payment.ts)
- ✅ createPayment() - 创建支付
- ✅ getPaymentStatus() - 查询支付状态
- ✅ getWalletBalance() - 获取钱包余额
