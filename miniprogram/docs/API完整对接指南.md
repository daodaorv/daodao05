# 小程序端API完整对接指南

**更新时间**: 2025-12-26
**状态**: 🚀 完整对接方案

---

## 📋 目录

1. [对接概览](#对接概览)
2. [已完成接口](#已完成接口)
3. [待补充接口](#待补充接口)
4. [数据格式规范](#数据格式规范)
5. [配置说明](#配置说明)
6. [测试指南](#测试指南)

---

## 对接概览

### 当前状态

**后端服务**:
- 端口: 3001
- 基础URL: http://localhost:3001/api/v1
- 数据库: MySQL 8.0
- 缓存: Redis 7.2

**小程序配置**:
- USE_MOCK: false (已关闭Mock模式)
- BASE_URL: http://localhost:3001/api/v1
- Token管理: 自动处理

### 模块统计

| 模块 | 后端接口数 | 已联调 | 待实现 | 状态 |
|------|-----------|--------|--------|------|
| 认证模块 | 5 | 5 | 0 | ✅ 完成 |
| 用户模块 | 2 | 2 | 0 | ✅ 完成 |
| 门店模块 | 2 | 2 | 0 | ✅ 完成 |
| 车辆模块 | 2 | 2 | 0 | ✅ 完成 |
| 订单模块 | 6 | 3 | 3 | ⚠️ 部分 |
| 支付模块 | 1 | 1 | 0 | ✅ 完成 |
| 托管中心 | 10 | 0 | 10 | ❌ 未开始 |
| 优惠券 | 11 | 0 | 11 | ❌ 未开始 |
| 众筹 | 16 | 0 | 16 | ❌ 未开始 |
| 通知 | 5 | 0 | 5 | ❌ 未开始 |
| 社区 | 10 | 0 | 10 | ❌ 未开始 |
| 积分 | 6 | 0 | 6 | ❌ 未开始 |
| 会员 | 7 | 0 | 7 | ❌ 未开始 |
| 评价 | 6 | 0 | 6 | ❌ 未开始 |
| 帮助 | 6 | 0 | 6 | ❌ 未开始 |
| 钱包 | 3 | 0 | 3 | ❌ 未开始 |

**总计**: 98个接口 | 已联调: 15个 | 待实现: 83个

---

## 已完成接口

### 1. 认证模块 (5个接口)

#### 1.1 发送验证码
```
POST /api/v1/auth/send-code
```

**请求参数**:
```json
{
  "phone": "13800138000",
  "type": "login" // login | register | bind
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "success": true
  }
}
```

#### 1.2 验证码登录
```
POST /api/v1/auth/login-with-code
```

**请求参数**:
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "phone": "13800138000",
      "nickname": "叨叨用户",
      "avatar": "/static/default-avatar.png",
      "userType": "NORMAL",
      "status": "ACTIVE"
    }
  }
}
```

#### 1.3 用户注册
```
POST /api/v1/auth/register
```

**请求参数**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123",
  "nickname": "新用户",
  "inviteCode": "ABC123"
}
```

**响应数据**: 同登录接口

#### 1.4 密码登录
```
POST /api/v1/auth/login
```

**请求参数**:
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**响应数据**: 同登录接口

#### 1.5 获取用户信息
```
GET /api/v1/users/profile
```

**请求头**:
```
Authorization: Bearer {token}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "1",
    "phone": "13800138000",
    "nickname": "叨叨用户",
    "avatar": "/static/default-avatar.png",
    "gender": 1,
    "birthday": "1990-01-01",
    "email": "user@example.com",
    "userType": "NORMAL",
    "tags": [],
    "status": "ACTIVE"
  }
}
```

---

### 2. 门店模块 (2个接口)

#### 2.1 获取城市列表
```
GET /api/v1/stores/cities
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": "1",
      "name": "杭州",
      "code": "hangzhou",
      "storeCount": 3
    }
  ]
}
```

#### 2.2 获取门店列表
```
GET /api/v1/stores?cityId=1&page=1&pageSize=10
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "1",
        "name": "杭州西湖门店",
        "address": "浙江省杭州市西湖区...",
        "phone": "0571-88888888",
        "businessHours": "09:00-18:00",
        "latitude": 30.2741,
        "longitude": 120.1551
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 3. 车辆模块 (2个接口)

#### 3.1 获取车辆列表
```
GET /api/v1/vehicles?storeId=1&page=1&pageSize=10
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "1",
        "name": "依维柯欧胜C型房车",
        "model": "C型",
        "brand": "依维柯",
        "seats": 4,
        "price": 800,
        "images": ["/uploads/vehicle1.jpg"],
        "status": "available"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 3.2 获取车辆详情
```
GET /api/v1/vehicles/:id
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "1",
    "name": "依维柯欧胜C型房车",
    "model": "C型",
    "brand": "依维柯",
    "seats": 4,
    "price": 800,
    "images": ["/uploads/vehicle1.jpg"],
    "specifications": {
      "fuelType": "柴油",
      "transmission": "手动",
      "displacement": "3.0L"
    },
    "features": ["空调", "冰箱", "卫生间"],
    "status": "available"
  }
}
```

---

### 4. 订单模块 (3个接口)

#### 4.1 获取订单列表
```
GET /api/v1/orders?status=pending_payment&page=1&pageSize=10
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [
      {
        "id": "1",
        "orderNo": "DD202512010001",
        "status": "pending_payment",
        "vehicleId": "1",
        "pickupStoreId": "1",
        "returnStoreId": "1",
        "pickupTime": "2025-12-05T10:00:00",
        "returnTime": "2025-12-08T18:00:00",
        "totalAmount": 2880,
        "actualAmount": 1280,
        "depositAmount": 5000,
        "createdAt": "2025-12-01T10:00:00"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 4.2 获取订单详情
```
GET /api/v1/orders/:id
```

**响应数据**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "1",
    "orderNo": "DD202512010001",
    "status": "pending_payment",
    "vehicle": {
      "id": "1",
      "name": "依维柯欧胜C型房车",
      "images": ["/uploads/vehicle1.jpg"]
    },
    "pickupStore": {
      "id": "1",
      "name": "杭州西湖门店",
      "address": "浙江省杭州市西湖区..."
    },
    "returnStore": {
      "id": "1",
      "name": "杭州西湖门店"
    },
    "pickupTime": "2025-12-05T10:00:00",
    "returnTime": "2025-12-08T18:00:00",
    "totalAmount": 2880,
    "actualAmount": 1280,
    "depositAmount": 5000,
    "createdAt": "2025-12-01T10:00:00"
  }
}
```

#### 4.3 创建订单
```
POST /api/v1/orders
```

**请求参数**:
```json
{
  "vehicleId": "1",
  "pickupStoreId": "1",
  "returnStoreId": "1",
  "pickupTime": "2025-12-05T10:00:00",
  "returnTime": "2025-12-08T18:00:00",
  "contactName": "张三",
  "contactPhone": "13800138000",
  "remark": "需要儿童座椅"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": "1",
    "orderNo": "DD202512010001",
    "totalAmount": 2880,
    "depositAmount": 5000
  }
}
```

---

### 5. 支付模块 (1个接口)

#### 5.1 创建支付
```
POST /api/v1/payments
```

**请求参数**:
```json
{
  "orderId": "1",
  "paymentMethod": "wechat",
  "amount": 2880
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "支付创建成功",
  "data": {
    "paymentId": "1",
    "paymentNo": "PAY202512010001",
    "prepayInfo": {
      "appId": "wx1234567890",
      "timeStamp": "1234567890",
      "nonceStr": "abc123",
      "package": "prepay_id=wx123",
      "signType": "RSA",
      "paySign": "sign123"
    }
  }
}
```

---

## 待补充接口

### 订单模块待补充 (3个)

1. **取消订单**: `PUT /api/v1/orders/:id/cancel`
2. **确认订单**: `PUT /api/v1/orders/:id/confirm`
3. **完成订单**: `PUT /api/v1/orders/:id/complete`

### P3高级功能模块 (83个)

详见后续章节...

---

## 数据格式规范

### 统一响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "成功",
  "data": { ... }
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 分页数据格式

```json
{
  "list": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### 日期时间格式

统一使用 ISO 8601 格式: `2025-12-26T10:30:00`

---

## 配置说明

### 小程序端配置

**文件**: `miniprogram/utils/request.ts`

```typescript
// 是否使用Mock数据
const USE_MOCK = false;

// API基础URL
const BASE_URL = 'http://localhost:3001/api/v1';
```

### Token管理

Token自动存储在本地存储中:
- `token`: 访问令牌
- `refreshToken`: 刷新令牌
- `userInfo`: 用户信息

请求时自动在Header中添加:
```
Authorization: Bearer {token}
```

---

## 测试指南

### 启动后端服务

```bash
cd backend
npm run dev
```

服务启动在: http://localhost:3001

### 运行小程序

1. 使用HBuilderX打开 `miniprogram` 目录
2. 点击"运行" → "运行到微信开发者工具"
3. 在微信开发者工具中勾选"不校验合法域名"

### 测试流程

1. **认证测试**
   - 发送验证码
   - 验证码登录
   - 获取用户信息

2. **业务流程测试**
   - 浏览门店列表
   - 查看车辆列表
   - 创建订单
   - 支付订单

3. **错误处理测试**
   - Token过期
   - 网络错误
   - 参数错误

---

**文档版本**: v2.0
**维护者**: Claude Code
