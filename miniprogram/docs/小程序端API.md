# 叨叨房车小程序端API需求文档

> **文件版本**: v1.0
> **创建时间**: 2025-11-26
> **维护者**: 小程序端开发团队
> **后端对接**: 必须严格按照后端@api-specification.md总规范实现

## 📋 文档说明

本文档记录小程序端所需的所有API接口需求，作为前后端对接的契约文档。后端开发人员必须严格按照此文档和后端API总规范实现接口。

---

## 📚 API开发状态说明

**开发状态标记**：
- `未开发` - API接口已定义，后端未开始开发
- `待后端开发` - 前端已完成Mock开发，等待后端实现
- `已开发` - 后端API已实现，具备基础功能
- `待联调` - 前后端API均已完成，需要进行接口联调测试
- `联调成功` - API联调通过，功能正常，可投入使用
- `联调失败` - API联调发现问题，需要修复并重新联调

---

## 1. 用户认证模块 (auth)

### 1.1 发送验证码
**接口**: `POST /api/v1/auth/send-code`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:66`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- phone: string (必填) - 手机号
- type: string (可选) - 验证码类型：login/register/reset_password

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "codeId": "string",
    "expireIn": 300
  }
}
```

### 1.2 用户注册
**接口**: `POST /api/v1/auth/register`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:85`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- phone: string (必填) - 手机号
- code: string (必填) - 验证码
- password: string (可选) - 登录密码
- userInfo: object (可选) - 用户基本信息（昵称、头像等）

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "string",
      "phone": "string",
      "nickname": "string",
      "avatar": "string",
      "userType": "CUSTOMER"
    }
  }
}
```

### 1.3 用户登录
**接口**: `POST /api/v1/auth/login`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:106`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- phone: string (必填) - 手机号
- password: string (必填) - 登录密码

**响应格式**: 同注册接口

### 1.4 微信授权登录
**接口**: `POST /api/v1/auth/wechat-login`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:160`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- code: string (必填) - 微信授权码
- userInfo: object (可选) - 微信用户信息

**响应格式**: 同注册接口

### 1.5 刷新Token
**接口**: `POST /api/v1/auth/refresh-token`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:194`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- refreshToken: string (必填) - 刷新令牌

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 1.6 验证码登录
**接口**: `POST /api/v1/auth/login-with-code`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:133`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- phone: string (必填) - 手机号
- code: string (必填) - 验证码

**响应格式**: 同注册接口

### 1.7 绑定手机号
**接口**: `POST /api/v1/auth/bind-phone`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:180`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- phone: string (必填) - 手机号
- code: string (必填) - 验证码

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "success": true
  }
}
```

### 1.8 支付宝授权登录
**接口**: `POST /api/v1/auth/alipay-login`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:201`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- code: string (必填) - 支付宝授权码
- authCode: string (可选) - 支付宝认证码

**响应格式**: 同注册接口

### 1.9 抖音授权登录
**接口**: `POST /api/v1/auth/douyin-login`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:221`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- code: string (必填) - 抖音授权码
- anonymousCode: string (可选) - 抖音匿名码

**响应格式**: 同注册接口

### 1.10 用户名密码登录
**接口**: `POST /api/v1/auth/login-with-username`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:241`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- username: string (必填) - 用户名或邮箱
- password: string (必填) - 登录密码

**响应格式**: 同注册接口

### 1.11 退出登录
**接口**: `POST /api/v1/auth/logout`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:236`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "success": true
  }
}
```

### 1.9 检查登录状态
**接口**: `GET /api/v1/auth/check-login`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:254`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "isLoggedIn": true,
    "user": {
      "id": "string",
      "phone": "string",
      "nickname": "string",
      "avatar": "string"
    }
  }
}
```

### 1.10 获取用户信息
**接口**: `GET /api/v1/users/profile`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/auth.ts:209`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "phone": "string",
    "nickname": "string",
    "avatar": "string",
    "userType": "CUSTOMER",
    "tags": [],  // 用户标签列表，如 ["PLUS会员", "VIP用户"]
    "walletBalance": 0,
    "integrals": 0,
    "profile": {
      "realName": "string",
      "idCard": "string",
      "driverLicense": "string"
    }
  }
}
```

---

## 2. 房车租赁模块 (vehicles)

### 2.1 查询可用房车
**接口**: `GET /api/v1/vehicles`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/vehicle.js:6`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- pickupCity: string (必填) - 取车城市
- pickupStoreId: string (必填) - 取车门店ID
- pickupDate: string (必填) - 取车时间 (ISO 8601)
- returnDate: string (必填) - 还车时间 (ISO 8601)
- returnCity: string (可选) - 还车城市
- returnStoreId: string (可选) - 还车门店ID
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "string",
        "brand": "string",
        "model": "string",
        "year": "number",
        "seats": "number",
        "images": ["string"],
        "basePrice": 580,
        "store": {
          "id": "string",
          "name": "string",
          "address": "string",
          "distance": 5.2
        },
        "features": ["自动挡", "导航系统"],
        "available": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 2.2 获取房车详情
**接口**: `GET /api/v1/vehicles/{id}`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/vehicle.js:24`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "brand": "string",
    "model": "string",
    "year": "number",
    "seats": "number",
    "sleepCapacity": "number",
    "images": ["string"],
    "gallery": ["string"],
    "basePrice": 580,
    "weeklyDiscount": 0.8,
    "monthlyDiscount": 0.7,
    "features": ["string"],
    "specifications": {
      "length": "7.5米",
      "width": "2.3米",
      "height": "3.2米",
      "fuelType": "汽油",
      "transmission": "自动挡",
      "mileage": 10000
    },
    "equipment": ["string"],
    "insurance": {
      "basic": 50,
      "standard": 80,
      "comprehensive": 120
    },
    "services": [
      {
        "id": "string",
        "name": "string",
        "price": 50,
        "description": "string"
      }
    ],
    "store": {
      "id": "string",
      "name": "string",
      "address": "string",
      "phone": "string",
      "businessHours": "string"
    },
    "rating": {
      "average": 4.8,
      "count": 156
    },
    "reviews": [
      {
        "id": "string",
        "userId": "string",
        "userName": "string",
        "avatar": "string",
        "rating": 5,
        "content": "string",
        "images": ["string"],
        "createdAt": "2025-11-20T10:00:00+08:00"
      }
    ]
  }
}
```

### 2.3 收藏房车
**接口**: `POST /api/v1/vehicles/{id}/favorite`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/vehicle.js:44`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "收藏成功",
  "data": {
    "favorited": true
  }
}
```

### 2.4 获取收藏列表
**接口**: `GET /api/v1/vehicles/favorites`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/vehicle.js:54`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认20

**响应格式**: 类似车辆列表，但包含收藏时间。

---

## 3. 订单管理模块 (orders)

### 3.1 创建订单
**接口**: `POST /api/v1/orders`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/order.js:5`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "vehicleId": "string",
  "pickupStoreId": "string",
  "pickupDate": "2025-12-01T10:00:00+08:00",
  "returnStoreId": "string",
  "returnDate": "2025-12-03T18:00:00+08:00",
  "insuranceType": "standard",
  "selectedServices": ["string"],
  "couponCode": "string",
  "useWalletBalance": false,
  "contactInfo": {
    "name": "string",
    "phone": "string",
    "idCard": "string",
    "driverLicense": "string"
  }
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "订单创建成功",
  "data": {
    "orderId": "string",
    "orderNo": "DD202511260001",
    "status": "PENDING_PAYMENT",
    "amount": {
      "vehicleFee": 1160,
      "insuranceFee": 160,
      "serviceFee": 100,
      "discount": 100,
      "totalAmount": 1320
    },
    "expireTime": "2025-11-26T10:15:00+08:00"
  }
}
```

### 3.2 计算订单价格
**接口**: `POST /api/v1/orders/calculate-price`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/order.js:25`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**: 与创建订单相同的参数，但不实际创建订单。

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "vehicleFee": 1160,
    "insuranceFee": 160,
    "serviceFee": 100,
    "discount": 100,
    "totalAmount": 1320,
    "breakdown": [
      {
        "name": "基础租金",
        "amount": 1160,
        "description": "2天 x 580元/天"
      }
    ]
  }
}
```

### 3.3 获取用户订单列表
**接口**: `GET /api/v1/orders`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/order.js:10`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- status: string (可选) - 订单状态筛选
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "orderId": "string",
        "orderNo": "string",
        "status": "PENDING_PAYMENT",
        "vehicle": {
          "id": "string",
          "name": "string",
          "image": "string"
        },
        "pickupInfo": {
          "storeName": "string",
          "date": "2025-12-01T10:00:00+08:00"
        },
        "returnInfo": {
          "storeName": "string",
          "date": "2025-12-03T18:00:00+08:00"
        },
        "totalAmount": 1320,
        "createdAt": "2025-11-26T10:00:00+08:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### 3.4 获取订单详情
**接口**: `GET /api/v1/orders/{orderId}`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/order.js:15`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**: 包含订单的完整信息，包括车辆信息、价格明细、状态日志等。

### 3.5 取消订单
**接口**: `POST /api/v1/orders/{orderId}/cancel`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/order.js:20`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- reason: string (必填) - 取消原因

---

## 4. 特惠租车模块 (special-offers)

### 4.1 获取特惠套餐列表
**接口**: `GET /api/v1/special-offers`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/special-offer/list.vue:236`

**前端API位置**: `miniprogram/api/special-offer.ts:13`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- route: string (可选) - 路线筛选（如：hangzhou, shanghai）
- priceRange: string (可选) - 价格区间（如：0-1000, 1000-1500）
- sortBy: string (可选) - 排序方式（price-asc, price-desc, quota）
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "route": {
          "from": "杭州",
          "to": "千岛湖"
        },
        "vehicle": {
          "name": "依维柯欧胜C型房车",
          "image": "string",
          "features": ["自动挡", "4-6人", "独立卫浴"]
        },
        "packagePrice": 1280,
        "originalPrice": 1680,
        "rentalDays": 3,
        "availableTimeRange": {
          "start": "2025-12-01",
          "end": "2025-12-31"
        },
        "remainingQuota": 3,
        "totalQuota": 10
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### 4.2 获取特惠套餐详情
**接口**: `GET /api/v1/special-offers/{id}`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/special-offer/detail.vue:95`

**前端API位置**: `miniprogram/api/special-offer.ts:34`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "route": {
      "from": "杭州",
      "to": "千岛湖"
    },
    "vehicle": {
      "name": "依维柯欧胜C型房车",
      "images": ["string"],
      "specifications": [
        { "label": "车型", "value": "C型房车" },
        { "label": "座位数", "value": "4-6座" }
      ],
      "features": ["独立卫浴", "太阳能系统"]
    },
    "packagePrice": 1280,
    "originalPrice": 1680,
    "rentalDays": 3,
    "remainingQuota": 3,
    "totalQuota": 10,
    "pickupStore": {
      "name": "杭州西湖门店",
      "address": "浙江省杭州市西湖区文三路123号"
    },
    "returnStore": {
      "name": "千岛湖景区门店",
      "address": "浙江省杭州市淳安县千岛湖镇环湖路88号"
    },
    "availableTimeRange": {
      "start": "2025-12-01",
      "end": "2025-12-31"
    },
    "packageIncludes": [
      { "name": "车辆租金", "description": "3天2晚固定租期" },
      { "name": "基础保险", "description": "第三者责任险" }
    ],
    "bookingNotices": ["string"],
    "cancellationPolicy": [
      { "condition": "出发前7天以上取消", "result": "全额退款" }
    ]
  }
}
```

### 4.3 创建特惠套餐订单
**接口**: `POST /api/v1/special-offers/orders`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/special-offer.ts:47`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "offerId": "string",
  "pickupDate": "2025-12-05T10:00:00+08:00",
  "insuranceType": "standard",
  "selectedServices": ["string"],
  "couponCode": "string",
  "contactInfo": {
    "name": "string",
    "phone": "string",
    "idCard": "string",
    "driverLicense": "string"
  }
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "订单创建成功",
  "data": {
    "orderId": "string",
    "orderNo": "DD202512050001",
    "status": "PENDING_PAYMENT",
    "amount": {
      "packageFee": 1280,
      "insuranceFee": 80,
      "serviceFee": 50,
      "discount": 100,
      "totalAmount": 1310
    },
    "returnTime": "2025-12-08T10:00:00+08:00",
    "expireTime": "2025-12-05T10:15:00+08:00"
  }
}
```

### 4.4 计算特惠套餐价格
**接口**: `POST /api/v1/special-offers/calculate-price`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/special-offer.ts:71`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**: 与创建订单相同的参数，但不实际创建订单。

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "packageFee": 1280,
    "insuranceFee": 80,
    "serviceFee": 50,
    "discount": 100,
    "totalAmount": 1310,
    "breakdown": [
      {
        "name": "套餐费用",
        "amount": 1280,
        "description": "杭州→千岛湖 3天2晚"
      },
      {
        "name": "保险费用",
        "amount": 80,
        "description": "标准险"
      }
    ]
  }
}
```

### 4.5 检查套餐可用性
**接口**: `GET /api/v1/special-offers/{id}/availability`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/special-offer.ts:87`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- pickupDate: string (必填) - 取车日期

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "available": true,
    "remainingQuota": 3,
    "message": "该日期可预订"
  }
}
```

---

## 5. 营地预订模块 (campsites)

### 5.1 获取营地列表
**接口**: `GET /api/v1/campsites`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/campsite/list.vue:167`

**前端API位置**: `miniprogram/api/campsite.ts:95`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20
- distance: string (可选) - 距离筛选（如：0-5, 5-10, 10-20, 20-）
- price: string (可选) - 价格筛选（如：0-200, 200-300, 300-400, 400-）
- type: string (可选) - 类型筛选（lake, mountain, sea, forest）
- keyword: string (可选) - 搜索关键词
- latitude: number (可选) - 用户纬度
- longitude: number (可选) - 用户经度

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "千岛湖房车营地",
        "image": "string",
        "images": ["string"],
        "tags": ["湖景", "烧烤", "WiFi"],
        "rating": 4.8,
        "reviewCount": 156,
        "distance": 5.2,
        "price": 280,
        "availableSites": 8,
        "isHot": true,
        "address": "浙江省杭州市淳安县千岛湖镇环湖路88号"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

### 5.2 获取营地详情
**接口**: `GET /api/v1/campsites/{id}`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/campsite/detail.vue:236`

**前端API位置**: `miniprogram/api/campsite.ts:108`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "name": "千岛湖房车营地",
    "images": ["string"],
    "rating": 4.8,
    "reviewCount": 156,
    "address": "浙江省杭州市淳安县千岛湖镇环湖路88号",
    "distance": 5.2,
    "minPrice": 280,
    "isHot": true,
    "features": ["湖景", "烧烤区", "WiFi覆盖", "24小时热水"],
    "facilities": [
      {
        "name": "淋浴间",
        "icon": "fire"
      },
      {
        "name": "卫生间",
        "icon": "home"
      }
    ],
    "siteTypes": [
      {
        "id": "string",
        "name": "标准营位",
        "description": "适合小型房车或帐篷，配备基础设施",
        "area": 50,
        "capacity": 4,
        "price": 280,
        "available": 8
      }
    ],
    "description": "营地详细介绍...",
    "checkInNotices": ["入住时间：14:00后，退房时间：12:00前"],
    "cancellationPolicy": [
      {
        "condition": "入住前3天以上取消",
        "result": "全额退款"
      }
    ],
    "reviews": [
      {
        "id": "string",
        "userName": "房车旅行家",
        "userAvatar": "string",
        "rating": 5,
        "content": "营地环境非常好...",
        "images": ["string"],
        "createdAt": "2025-11-25"
      }
    ]
  }
}
```

### 5.3 创建营地预订订单
**接口**: `POST /api/v1/campsites/bookings`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/campsite/booking.vue:329`

**前端API位置**: `miniprogram/api/campsite.ts:121`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "campsiteId": "string",
  "siteTypeId": "string",
  "checkInDate": "2025-12-05",
  "checkOutDate": "2025-12-07",
  "guests": 2,
  "contactName": "张三",
  "contactPhone": "13800138000",
  "remark": "需要靠近湖边的位置"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "预订成功",
  "data": {
    "orderId": "string",
    "orderNo": "CS202512050001",
    "status": "PENDING_PAYMENT",
    "totalPrice": 610,
    "paymentDeadline": "2025-12-05T10:15:00+08:00"
  }
}
```

### 5.4 计算营地预订价格
**接口**: `POST /api/v1/campsites/calculate-price`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/campsite.ts:135`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "campsiteId": "string",
  "siteTypeId": "string",
  "checkInDate": "2025-12-05",
  "checkOutDate": "2025-12-07",
  "guests": 2
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "siteFee": 560,
    "cleaningFee": 50,
    "serviceFee": 0,
    "totalPrice": 610,
    "nights": 2
  }
}
```

### 5.5 检查营位可用性
**接口**: `POST /api/v1/campsites/check-availability`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/campsite.ts:149`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "campsiteId": "string",
  "siteTypeId": "string",
  "checkInDate": "2025-12-05",
  "checkOutDate": "2025-12-07"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "available": true,
    "remainingCount": 8,
    "message": "该时间段可预订"
  }
}
```

### 5.6 获取营地评价列表
**接口**: `GET /api/v1/campsites/{id}/reviews`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/campsite.ts:163`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "userName": "房车旅行家",
        "userAvatar": "string",
        "rating": 5,
        "content": "营地环境非常好...",
        "images": ["string"],
        "createdAt": "2025-11-25"
      }
    ],
    "total": 156,
    "hasMore": true
  }
}
```

### 5.7 获取附近营地
**接口**: `GET /api/v1/campsites/nearby`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/campsite.ts:179`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- latitude: number (必填) - 纬度
- longitude: number (必填) - 经度
- radius: number (可选) - 半径（公里），默认50
- limit: number (可选) - 返回数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "string",
      "name": "千岛湖房车营地",
      "image": "string",
      "rating": 4.8,
      "reviewCount": 156,
      "distance": 5.2,
      "price": 280,
      "availableSites": 8,
      "isHot": true
    }
  ]
}
```

### 5.8 获取热门营地
**接口**: `GET /api/v1/campsites/hot`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/campsite.ts:195`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- limit: number (可选) - 返回数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "string",
      "name": "千岛湖房车营地",
      "image": "string",
      "rating": 4.8,
      "reviewCount": 156,
      "distance": 5.2,
      "price": 280,
      "availableSites": 8,
      "isHot": true
    }
  ]
}
```

---

## 6. 房车旅游模块 (tours)

### 6.1 获取旅游线路列表
**接口**: `GET /api/v1/tours`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/tour/list.vue:157`

**前端API位置**: `miniprogram/api/tour.ts:95`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20
- duration: string (可选) - 行程天数筛选（如：3-5, 6-8, 9-）
- price: string (可选) - 价格筛选（如：0-3000, 3000-5000, 5000-7000, 7000-）
- status: string (可选) - 状态筛选（recruiting, confirmed, departed）
- keyword: string (可选) - 搜索关键词

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "title": "川西秘境·稻城亚丁房车深度游",
        "image": "string",
        "tags": ["高原风光", "摄影天堂", "藏族文化"],
        "days": 7,
        "minPeople": 5,
        "maxPeople": 12,
        "currentPeople": 8,
        "price": 4980,
        "childPrice": 2490,
        "status": "recruiting",
        "isHot": true,
        "available": 4
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

### 6.2 获取旅游线路详情
**接口**: `GET /api/v1/tours/{id}`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/tour/detail.vue:236`

**前端API位置**: `miniprogram/api/tour.ts:109`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "title": "川西秘境·稻城亚丁房车深度游",
    "images": ["string"],
    "tags": ["高原风光", "摄影天堂", "藏族文化"],
    "duration": 7,
    "minPeople": 5,
    "maxPeople": 12,
    "destination": "四川·稻城亚丁",
    "pricePerPerson": 4980,
    "childPrice": 2490,
    "isHot": true,
    "batches": [
      {
        "id": "string",
        "departureDate": "2025-12-15",
        "status": "recruiting",
        "currentPeople": 8,
        "maxPeople": 12
      }
    ],
    "itinerary": [
      {
        "title": "成都集合",
        "content": "全天成都集合，入住酒店...",
        "highlights": ["成都美食", "自由活动"]
      }
    ],
    "priceIncludes": ["全程房车使用费", "6晚住宿"],
    "priceExcludes": ["往返成都大交通", "午餐和晚餐"],
    "bookingNotices": ["本线路为成团产品..."],
    "cancellationPolicy": [
      {
        "condition": "出发前7天以上取消",
        "result": "全额退款"
      }
    ]
  }
}
```

### 6.3 创建旅游预订订单
**接口**: `POST /api/v1/tours/bookings`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/pages/tour/booking.vue:329`

**前端API位置**: `miniprogram/api/tour.ts:122`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "tourId": "string",
  "batchId": "string",
  "adults": 2,
  "children": 1,
  "contactName": "张三",
  "contactPhone": "13800138000",
  "idCard": "330106199001011234",
  "emergencyContact": "李四",
  "emergencyPhone": "13900139000",
  "remark": "有高原反应史，需要特别关注",
  "couponId": "CP004"
}
```

> couponId 为可选字段，仅在用户选择了与房车旅游订单类型匹配的优惠券时传入，并由管理端在创建优惠券时配置适用的产品范围（房车租赁、营地、旅游互不通用）。

**响应格式**:
```json
{
  "code": 0,
  "message": "预订成功",
  "data": {
    "orderId": "string",
    "orderNo": "TR202512050001",
    "status": "PENDING_PAYMENT",
    "totalPrice": 12450,
    "paymentDeadline": "2025-12-05T10:15:00+08:00"
  }
}
```

### 6.4 计算旅游预订价格
**接口**: `POST /api/v1/tours/calculate-price`

**开发状态**: 🟡 已开发（前端API完成）

**前端API位置**: `miniprogram/api/tour.ts:136`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "tourId": "string",
  "batchId": "string",
  "adults": 2,
  "children": 1
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "adultFee": 9960,
    "childFee": 2490,
    "insuranceFee": 150,
    "totalPrice": 12600,
    "breakdown": [
      {
        "name": "成人费用",
        "amount": 9960,
        "description": "¥4980 × 2人"
      },
      {
        "name": "儿童费用",
        "amount": 2490,
        "description": "¥2490 × 1人"
      },
      {
        "name": "保险费用",
        "amount": 150,
        "description": "¥50 × 3人"
      }
    ]
  }
}
```

### 6.5 检查批次可用性
**接口**: `POST /api/v1/tours/check-availability`

**开发状态**: 🟡 已开发（前端API完成）

**前端API位置**: `miniprogram/api/tour.ts:150`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "tourId": "string",
  "batchId": "string",
  "people": 3
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "available": true,
    "remainingSeats": 4,
    "message": "该批次还有4个名额"
  }
}
```

### 6.6 获取热门旅游线路
**接口**: `GET /api/v1/tours/hot`

**开发状态**: 🟡 已开发（前端API完成）

**前端API位置**: `miniprogram/api/tour.ts:164`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- limit: number (可选) - 返回数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "string",
      "title": "川西秘境·稻城亚丁房车深度游",
      "image": "string",
      "tags": ["高原风光", "摄影天堂"],
      "days": 7,
      "price": 4980,
      "status": "recruiting",
      "isHot": true
    }
  ]
}
```

### 6.7 获取推荐旅游线路
**接口**: `GET /api/v1/tours/recommended`

**开发状态**: 🟡 已开发（前端API完成）

**前端API位置**: `miniprogram/api/tour.ts:178`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- limit: number (可选) - 返回数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "string",
      "title": "云南秘境·香格里拉梅里雪山行",
      "image": "string",
      "tags": ["雪山风光", "藏区文化"],
      "days": 6,
      "price": 4280,
      "status": "recruiting"
    }
  ]
}
```

### 6.8 获取批次列表
**接口**: `GET /api/v1/tours/{id}/batches`

**开发状态**: 🟡 已开发（前端API完成）

**前端API位置**: `miniprogram/api/tour.ts:192`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "string",
      "departureDate": "2025-12-15",
      "status": "recruiting",
      "currentPeople": 8,
      "maxPeople": 12
    }
  ]
}
```

---

## 7. 支付模块 (payments)

### 7.1 创建支付订单
**接口**: `POST /api/v1/payments`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/payment.js:10`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "orderId": "string",
  "paymentMethod": "wechat",
  "amount": 1320,
  "splitPayment": [
    {
      "method": "wallet",
      "amount": 320
    },
    {
      "method": "wechat",
      "amount": 1000
    }
  ]
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "paymentNo": "string",
    "paymentParams": {
      "appId": "string",
      "timeStamp": "string",
      "nonceStr": "string",
      "package": "string",
      "signType": "MD5",
      "paySign": "string"
    }
  }
}
```

### 4.2 查询支付状态
**接口**: `GET /api/v1/payments/{paymentNo}/status`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/payment.js:15`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status": "SUCCESS",
    "paidAt": "2025-11-26T10:05:00+08:00",
    "amount": 1320,
    "method": "wechat"
  }
}
```

---

## 5. 托管中心模块 (hosting)

### 5.1 获取托管收益
**接口**: `GET /api/v1/hosting/income`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:10`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalIncome": 125800.50,
    "todayIncome": 350.00,
    "monthIncome": 8500.00,
    "availableBalance": 5200.00,
    "frozenBalance": 0
  }
}
```

### 5.2 获取托管车辆列表
**接口**: `GET /api/v1/hosting/vehicles`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:20`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- status: string (可选) - 车辆状态：operating/maintenance/self_use
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "plateNumber": "string",
        "brand": "string",
        "model": "string",
        "image": "string",
        "status": "operating",
        "location": "string",
        "todayIncome": 350.00,
        "monthIncome": 8500.00,
        "totalIncome": 125800.50,
        "hostingStartDate": "2024-01-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 5.3 提交自有车托管申请
**接口**: `POST /api/v1/hosting/old-car/apply`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:30`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "vehicleInfo": {
    "plateNumber": "string",
    "brand": "string",
    "model": "string",
    "year": 2020,
    "mileage": 50000,
    "registrationCertificate": "string"
  },
  "photos": ["string"],
  "ownerInfo": {
    "name": "string",
    "phone": "string",
    "idCard": "string"
  },
  "storeId": "string"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "applicationId": "string",
    "status": "pending",
    "estimatedReviewTime": "1-3个工作日"
  }
}
```

### 5.4 提交购车托管申请
**接口**: `POST /api/v1/hosting/new-car/apply`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:40`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "modelId": "string",
  "installmentPeriod": 24,
  "applicantInfo": {
    "name": "string",
    "phone": "string",
    "idCard": "string",
    "income": "string"
  }
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "applicationId": "string",
    "status": "pending",
    "estimatedReviewTime": "3-5个工作日"
  }
}
```

### 5.5 申请车主自用
**接口**: `POST /api/v1/hosting/self-use/apply`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:50`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "vehicleId": "string",
  "pickupStoreId": "string",
  "returnStoreId": "string",
  "pickupTime": "2025-12-05T10:00:00+08:00",
  "returnTime": "2025-12-10T18:00:00+08:00",
  "additionalServices": ["string"]
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "orderId": "string",
    "status": "pending",
    "totalFee": 500.00,
    "serviceFee": 300.00,
    "crossCityFee": 200.00
  }
}
```

### 5.6 获取收益明细
**接口**: `GET /api/v1/hosting/income/detail`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:60`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- vehicleId: string (可选) - 车辆ID
- startDate: string (可选) - 开始日期
- endDate: string (可选) - 结束日期
- page: number (可选) - 页码，默认1
- limit: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "vehicleId": "string",
        "plateNumber": "string",
        "date": "2025-12-01",
        "income": 350.00,
        "type": "rental",
        "description": "租赁收益"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 5.7 提现
**接口**: `POST /api/v1/hosting/withdraw`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:70`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
```json
{
  "amount": 1000.00,
  "bankCard": "string"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "withdrawId": "string",
    "status": "processing",
    "estimatedArrivalTime": "T+1到账"
  }
}
```

### 5.8 获取车辆详情
**接口**: `GET /api/v1/hosting/vehicles/{id}`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:80`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "plateNumber": "string",
    "brand": "string",
    "model": "string",
    "images": ["string"],
    "status": "operating",
    "location": "string",
    "todayIncome": 350.00,
    "monthIncome": 8500.00,
    "totalIncome": 125800.50,
    "hostingStartDate": "2024-01-15",
    "insurance": {
      "expiryDate": "2025-12-31",
      "status": "valid"
    },
    "maintenance": {
      "lastDate": "2025-11-01",
      "nextDate": "2026-02-01"
    }
  }
}
```

### 5.9 获取热门车型
**接口**: `GET /api/v1/hosting/popular-models`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:90`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "brand": "string",
        "model": "string",
        "image": "string",
        "price": 450000,
        "monthlyIncome": 3500,
        "annualReturn": "9.3%",
        "installmentOptions": [12, 24, 36]
      }
    ]
  }
}
```

### 5.10 获取门店列表
**接口**: `GET /api/v1/hosting/stores`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/hosting.ts:100`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- city: string (可选) - 城市
- type: string (可选) - 门店类型

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "string",
        "address": "string",
        "phone": "string",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "businessHours": "09:00-18:00"
      }
    ]
  }
}
```

---

## 6. 优惠券模块 (coupons)

### 6.1 获取可用优惠券
**接口**: `GET /api/v1/coupons/available`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/coupon.js:12`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- orderAmount: number (必填) - 订单金额
- vehicleId: string (可选) - 车辆ID
- category: string (可选) - 车辆分类

### 6.2 领取优惠券
**接口**: `POST /api/v1/coupons/{id}/claim`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/coupon.js:33`

**后端实现位置**: 待开发

**联调结果**: 待测试

### 6.3 获取优惠券列表（特惠商城）
**接口**: `GET /api/v1/coupons`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:14`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- category: string (可选) - 优惠券分类：all/discount/rate/daily/service/special
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "string",
        "type": "discount|rate|daily|service|special",
        "amount": 50,
        "condition": "满500元可用",
        "scope": "房车租赁",
        "validity": "领取后30天有效",
        "price": 0,
        "pointsPrice": 0,
        "stock": 1000,
        "claimed": false,
        "soldOut": false,
        "isNew": true,
        "isVip": false,
        "isHot": true
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 6.4 获取优惠券详情
**接口**: `GET /api/v1/coupons/{id}`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:26`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "name": "房车租赁50元满减券",
    "type": "discount",
    "amount": 50,
    "condition": "满500元可用",
    "scope": "适用于所有房车租赁订单",
    "validity": "领取后30天内有效",
    "description": "本优惠券适用于所有房车租赁订单...",
    "stackRule": "不可与其他满减券叠加使用",
    "specialLimit": "仅限新用户首单使用",
    "price": 0,
    "pointsPrice": 0,
    "stock": 1000,
    "limitPerUser": 1
  }
}
```

### 6.5 获取我的优惠券列表
**接口**: `GET /api/v1/coupons/my`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:68`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- status: string (可选) - 优惠券状态：unused/used/expired
- page: number (可选) - 页码
- pageSize: number (可选) - 每页数量

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "name": "string",
        "type": "discount",
        "amount": 50,
        "condition": "满500元可用",
        "scope": "房车租赁",
        "expiryDate": "2025-12-05",
        "usedDate": "2025-11-20",
        "orderId": "ORD202511200001"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  }
}
```

### 6.6 分享优惠券
**接口**: `POST /api/v1/coupons/{id}/share`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:80`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "shareUrl": "https://example.com/coupon/123",
    "shareCode": "SHARE123"
  }
}
```

### 6.7 获取优惠券分类
**接口**: `GET /api/v1/coupons/categories`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:46`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "id": "all", "name": "全部" },
    { "id": "discount", "name": "满减券" },
    { "id": "rate", "name": "折扣券" },
    { "id": "daily", "name": "日租抵扣" },
    { "id": "service", "name": "服务费减免" },
    { "id": "special", "name": "特殊券种" }
  ]
}
```

### 6.8 检查优惠券可用性
**接口**: `POST /api/v1/coupons/check-availability`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:54`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求参数**:
- couponId: string (必填) - 优惠券ID
- orderId: string (可选) - 订单ID
- orderAmount: number (可选) - 订单金额

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "available": true,
    "reason": ""
  }
}
```

### 6.9 生成邀请码
**接口**: `POST /api/v1/invite/generate-code`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:89`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "inviteCode": "DAODAO2025",
    "inviteUrl": "https://example.com/invite/DAODAO2025"
  }
}
```

### 6.10 获取邀请统计
**接口**: `GET /api/v1/invite/stats`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:96`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalInvites": 12,
    "successfulRegistrations": 8,
    "completedFirstOrders": 5,
    "totalRewards": 15,
    "inviteCode": "DAODAO2025"
  }
}
```

### 6.11 获取邀请记录
**接口**: `GET /api/v1/invite/records`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/coupon.ts:104`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- page: number (可选) - 页码
- pageSize: number (可选) - 每页数量

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "string",
        "username": "张三",
        "avatar": "string",
        "registerTime": "2025-11-28 10:30:00",
        "status": "registered|first_order_completed",
        "rewardStatus": "pending|granted"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 7. 门店模块 (stores)

### 7.1 获取城市列表
**接口**: `GET /api/v1/stores/cities`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/store.js`

**后端实现位置**: 待开发

**联调结果**: 待测试

### 7.2 获取门店列表
**接口**: `GET /api/v1/stores`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/store.js`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- cityId: string (必填) - 城市ID

---

## 7. 会员服务模块 (membership)

### 7.1 获取会员信息
**接口**: `GET /api/v1/membership/info`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/membership.ts:mockGetMembershipInfo`

**前端API位置**: `miniprogram/api/membership.ts:getMembershipInfo`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "mem_001",
    "userId": "user_001",
    "tagName": "PLUS会员",  // 标签名称
    "startDate": "2024-01-15",
    "endDate": "2025-01-15",
    "autoRenew": true,
    "status": "ACTIVE",
    "benefits": [
      {
        "id": "benefit_001",
        "name": "租车95折",
        "description": "房车租赁享受95折优惠",
        "icon": "discount",
        "type": "DISCOUNT",
        "value": "95%"
      }
    ]
  }
}
```

### 7.2 获取会员套餐列表
**接口**: `GET /api/v1/membership/packages`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/membership.ts:mockGetMembershipPackages`

**前端API位置**: `miniprogram/api/membership.ts:getMembershipPackages`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "package_001",
      "name": "PLUS会员年卡",
      "price": 99,
      "originalPrice": 199,
      "duration": 12,
      "isRecommended": true,
      "benefits": [
        {
          "id": "benefit_001",
          "name": "租车95折",
          "description": "房车租赁享受95折优惠（特惠套餐除外）",
          "icon": "discount",
          "type": "DISCOUNT",
          "value": "95%"
        }
      ]
    }
  ]
}
```

### 7.3 获取会员权益列表
**接口**: `GET /api/v1/membership/benefits`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/membership.ts:getMembershipBenefits`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "benefit_001",
      "name": "租车95折",
      "description": "房车租赁享受95折优惠（特惠套餐除外）",
      "icon": "discount",
      "type": "DISCOUNT",
      "value": "95%"
    }
  ]
}
```

### 7.4 购买会员
**接口**: `POST /api/v1/membership/purchase`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/membership.ts:mockPurchaseMembership`

**前端API位置**: `miniprogram/api/membership.ts:purchaseMembership`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "packageId": "package_001",
  "autoRenew": true,
  "paymentMethod": "wechat"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "购买成功",
  "data": {
    "orderId": "order_123456",
    "orderNo": "MEM202512010001",
    "amount": 99,
    "paymentParams": {
      "appId": "wx545d8668053b84a8",
      "timeStamp": "1701234567",
      "nonceStr": "mock_nonce_123",
      "package": "prepay_id=mock_prepay_id",
      "signType": "MD5",
      "paySign": "mock_sign"
    }
  }
}
```

### 7.5 续费会员
**接口**: `POST /api/v1/membership/renew`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/membership.ts:renewMembership`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**: 同购买会员

**响应格式**: 同购买会员

### 7.6 取消自动续费
**接口**: `POST /api/v1/membership/cancel-auto-renew`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/membership.ts:cancelAutoRenew`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "已取消自动续费",
  "data": {
    "autoRenew": false
  }
}
```

### 7.7 开启自动续费
**接口**: `POST /api/v1/membership/enable-auto-renew`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/membership.ts:enableAutoRenew`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "已开启自动续费",
  "data": {
    "autoRenew": true
  }
}
```

---

## 8. 评价反馈模块 (ratings)

### 8.1 创建评价
**接口**: `POST /api/v1/ratings`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/rating.ts:mockCreateRating`

**前端API位置**: `miniprogram/api/rating.ts:createRating`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "orderId": "order_001",
  "type": "VEHICLE",
  "targetId": "vehicle_001",
  "rating": 5,
  "content": "车况非常好，内部设施齐全，驾驶体验很棒！",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "tags": ["车况好", "服务好", "性价比高"]
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "评价成功",
  "data": {
    "id": "rating_001",
    "userId": "user_001",
    "userName": "房车旅行家",
    "userAvatar": "/static/images/default-avatar.png",
    "orderId": "order_001",
    "type": "VEHICLE",
    "targetId": "vehicle_001",
    "targetName": "依维柯欧胜C型房车",
    "rating": 5,
    "content": "车况非常好，内部设施齐全，驾驶体验很棒！",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["车况好", "服务好"],
    "status": "PUBLISHED",
    "rewardPoints": 50,
    "createdAt": "2025-12-01T10:30:00+08:00"
  }
}
```

### 8.2 获取我的评价列表
**接口**: `GET /api/v1/ratings`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/rating.ts:mockGetMyRatings`

**前端API位置**: `miniprogram/api/rating.ts:getMyRatings`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- type: string (可选) - 评价类型：VEHICLE/CAMPSITE/TOUR
- status: string (可选) - 评价状态：PENDING/PUBLISHED/REJECTED
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "rating_001",
        "userId": "user_001",
        "userName": "房车旅行家",
        "userAvatar": "/static/images/default-avatar.png",
        "orderId": "order_001",
        "type": "VEHICLE",
        "targetId": "vehicle_001",
        "targetName": "依维柯欧胜C型房车",
        "rating": 5,
        "content": "车况非常好，内部设施齐全，驾驶体验很棒！",
        "images": ["/static/images/rating-1.jpg"],
        "tags": ["车况好", "服务好", "性价比高"],
        "status": "PUBLISHED",
        "rewardPoints": 50,
        "createdAt": "2025-11-25T10:30:00+08:00",
        "reply": {
          "id": "reply_001",
          "content": "感谢您的好评！我们会继续努力为您提供更好的服务。",
          "createdAt": "2025-11-25T14:20:00+08:00"
        }
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "hasMore": false
  }
}
```

### 8.3 获取评价详情
**接口**: `GET /api/v1/ratings/{id}`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/rating.ts:getRatingDetail`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**: 同创建评价响应

### 8.4 更新评价
**接口**: `PUT /api/v1/ratings/{id}`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/rating.ts:mockUpdateRating`

**前端API位置**: `miniprogram/api/rating.ts:updateRating`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "rating": 5,
  "content": "更新后的评价内容",
  "images": ["https://example.com/image1.jpg"],
  "tags": ["车况好", "服务好"]
}
```

**响应格式**: 同创建评价响应

**业务规则**:
- 仅支持24小时内修改
- 仅限修改1次
- 商家已回复的评价不可修改

### 8.5 删除评价
**接口**: `DELETE /api/v1/ratings/{id}`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/rating.ts:deleteRating`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "删除成功",
  "data": null
}
```

### 8.6 上传评价图片
**接口**: `POST /api/v1/ratings/upload-image`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/rating.ts:mockUploadRatingImage`

**前端API位置**: `miniprogram/api/rating.ts:uploadRatingImage`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**: multipart/form-data
- file: File (必填) - 图片文件

**响应格式**:
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/images/123456.jpg"
  }
}
```

**业务规则**:
- 支持格式：JPG、PNG、WEBP
- 单张图片最大5MB
- 自动压缩处理
- 最多上传9张

---

## 9. 帮助中心模块 (help)

### 9.1 获取帮助分类列表
**接口**: `GET /api/v1/help/categories`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/help.ts:mockGetHelpCategories`

**前端API位置**: `miniprogram/api/help.ts:getHelpCategories`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "cat_001",
      "name": "租车相关",
      "icon": "car",
      "articleCount": 12,
      "order": 1
    }
  ]
}
```

### 9.2 获取帮助文章列表
**接口**: `GET /api/v1/help/articles`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/help.ts:mockGetHelpArticles`

**前端API位置**: `miniprogram/api/help.ts:getHelpArticles`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- categoryId: string (可选) - 分类ID
- keyword: string (可选) - 搜索关键词
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认10

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "article_001",
        "categoryId": "cat_001",
        "categoryName": "租车相关",
        "title": "如何预订房车？",
        "summary": "详细介绍房车预订的完整流程和注意事项",
        "content": "# 如何预订房车？\n\n## 预订流程...",
        "views": 1250,
        "helpful": 89,
        "isHot": true,
        "createdAt": "2025-11-01T10:00:00+08:00"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  }
}
```

### 9.3 获取帮助文章详情
**接口**: `GET /api/v1/help/articles/{id}`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/help.ts:mockGetHelpArticleDetail`

**前端API位置**: `miniprogram/api/help.ts:getHelpArticleDetail`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "article_001",
    "categoryId": "cat_001",
    "categoryName": "租车相关",
    "title": "如何预订房车？",
    "summary": "详细介绍房车预订的完整流程和注意事项",
    "content": "# 如何预订房车？\n\n## 预订流程...",
    "views": 1250,
    "helpful": 89,
    "isHot": true,
    "createdAt": "2025-11-01T10:00:00+08:00"
  }
}
```

### 9.4 搜索帮助文章
**接口**: `GET /api/v1/help/search`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/help.ts:searchHelpArticles`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- keyword: string (必填) - 搜索关键词

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "article_001",
      "categoryId": "cat_001",
      "categoryName": "租车相关",
      "title": "如何预订房车？",
      "summary": "详细介绍房车预订的完整流程和注意事项",
      "content": "",
      "views": 1250,
      "helpful": 89,
      "isHot": true,
      "createdAt": "2025-11-01T10:00:00+08:00"
    }
  ]
}
```

### 9.5 获取热门问题
**接口**: `GET /api/v1/help/hot`

**开发状态**: 🟡 已开发（前端Mock完成）

**前端Mock位置**: `miniprogram/api/help.ts:mockGetHotArticles`

**前端API位置**: `miniprogram/api/help.ts:getHotArticles`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "article_001",
      "categoryId": "cat_001",
      "categoryName": "租车相关",
      "title": "如何预订房车？",
      "summary": "详细介绍房车预订的完整流程和注意事项",
      "content": "",
      "views": 1250,
      "helpful": 89,
      "isHot": true,
      "createdAt": "2025-11-01T10:00:00+08:00"
    }
  ]
}
```

### 9.6 标记文章有帮助
**接口**: `POST /api/v1/help/articles/{id}/helpful`

**开发状态**: 🔴 未开发

**前端API位置**: `miniprogram/api/help.ts:markArticleHelpful`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "感谢您的反馈",
  "data": {
    "helpful": 90
  }
}
```

---

## 10. 用户中心模块

### 10.1 更新用户资料
**接口**: `PUT /api/v1/users/profile`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/auth.js:60`

**后端实现位置**: 待开发

**联调结果**: 待测试

### 8.2 获取用户钱包余额
**接口**: `GET /api/v1/users/wallet`

**开发状态**: 待后端开发

**前端Mock位置**: `miniprogram/api/payment.js:55`

**后端实现位置**: 待开发

**联调结果**: 待测试

### 8.3 获取用户众筹资产
**接口**: `GET /api/v1/users/crowdfunding/assets`

**开发状态**: 待后端开发

**前端Mock位置**: 需要新建

**后端实现位置**: 待开发

**联调结果**: 待测试

---

## 🔧 重要技术要求

### API路径规范
- **所有接口必须使用**: `/api/v1/{模块}/{资源}` 格式
- **禁止使用**: 硬编码域名或自定义路径
- **RESTful设计**: 严格遵循GET、POST、PUT、DELETE语义

### 认证机制
- **统一认证**: 使用JWT Bearer Token
- **Token刷新**: Access Token 15分钟，Refresh Token 7天
- **权限控制**: 基于用户类型的API访问控制

### 响应格式
- **统一格式**: 必须符合后端API总规范
- **错误处理**: 统一错误码和错误消息
- **分页格式**: 标准分页响应结构

### 联调流程
1. **前端Mock完成** - 标记状态为"待后端开发"
2. **后端API实现** - 标记状态为"已开发"
3. **前后端联调** - 标记状态为"待联调"
4. **联调测试通过** - 标记状态为"联调成功"
5. **问题修复** - 标记状态为"联调失败"并重新联调

---

**特别注意**:
- **必须删除现有错误的众筹API实现** (`miniprogram/api/crowdfunding.js`)
- **必须按照后端总规范重新实现**所有API接口
- **严禁直接返回Mock数据**，必须连接真实后端服务
- **所有API调用必须通过统一request工具**，包含认证和错误处理

**文档维护**:
- 每次API开发完成后，必须及时更新开发状态
- 联调过程中发现问题，必须记录在联调结果中
- 最终完成后，所有API状态都应为"联调成功"

---

## 11. 社区互动模块 (community)

### 11.1 发布内容
**接口**: `POST /api/v1/community/posts`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:createPost`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "type": "GUIDE",
  "title": "川西房车自驾攻略",
  "content": "详细的攻略内容...",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "tags": ["川西", "自驾", "攻略"],
  "location": "四川省成都市"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "发布成功，等待审核",
  "data": {
    "id": "post_001",
    "userId": "user_001",
    "type": "GUIDE",
    "title": "川西房车自驾攻略",
    "content": "详细的攻略内容...",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["川西", "自驾", "攻略"],
    "location": "四川省成都市",
    "status": "PENDING",
    "createdAt": "2025-12-01T10:00:00+08:00"
  }
}
```

**业务规则**:
- 内容类型：GUIDE（攻略）、EXPERIENCE（体验）、ACTIVITY（活动）、QA（问答）
- 图片限制：最多9张，单张最大5MB
- 标签限制：最多5个标签
- 审核机制：发布后进入待审核状态，24小时内完成审核

---

### 11.2 获取内容详情
**接口**: `GET /api/v1/community/posts/{id}`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:getPostDetail`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "post_001",
    "userId": "user_001",
    "userName": "房车旅行家",
    "userAvatar": "/static/images/avatar.png",
    "type": "GUIDE",
    "title": "川西房车自驾攻略",
    "content": "详细的攻略内容...",
    "images": ["https://example.com/image1.jpg"],
    "tags": ["川西", "自驾", "攻略"],
    "location": "四川省成都市",
    "viewCount": 1250,
    "likeCount": 89,
    "commentCount": 23,
    "favoriteCount": 45,
    "isLiked": false,
    "isFavorited": false,
    "status": "PUBLISHED",
    "createdAt": "2025-11-25T10:00:00+08:00"
  }
}
```

---

### 11.3 点赞内容
**接口**: `POST /api/v1/community/posts/{id}/like`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:likePost`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "点赞成功",
  "data": {
    "isLiked": true,
    "likeCount": 90
  }
}
```

---

### 11.4 评论内容
**接口**: `POST /api/v1/community/posts/{id}/comments`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:commentPost`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "content": "非常实用的攻略，感谢分享！",
  "replyToId": "comment_001",
  "replyToUserId": "user_002"
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "评论成功",
  "data": {
    "id": "comment_003",
    "postId": "post_001",
    "userId": "user_001",
    "userName": "房车爱好者",
    "userAvatar": "/static/images/avatar.png",
    "content": "非常实用的攻略，感谢分享！",
    "replyToId": "comment_001",
    "replyToUserId": "user_002",
    "replyToUserName": "旅行达人",
    "likeCount": 0,
    "createdAt": "2025-12-01T10:30:00+08:00"
  }
}
```

---

### 11.5 获取评论列表
**接口**: `GET /api/v1/community/posts/{id}/comments`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:getComments`

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "comment_001",
        "postId": "post_001",
        "userId": "user_002",
        "userName": "旅行达人",
        "userAvatar": "/static/images/avatar.png",
        "content": "很棒的攻略！",
        "likeCount": 5,
        "replyCount": 2,
        "createdAt": "2025-11-26T10:00:00+08:00",
        "replies": [
          {
            "id": "comment_002",
            "userId": "user_001",
            "userName": "房车旅行家",
            "content": "谢谢支持！",
            "createdAt": "2025-11-26T10:05:00+08:00"
          }
        ]
      }
    ],
    "total": 23,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

---

### 11.6 收藏内容
**接口**: `POST /api/v1/community/posts/{id}/favorite`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:favoritePost`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "收藏成功",
  "data": {
    "isFavorited": true,
    "favoriteCount": 46
  }
}
```

---

### 11.7 获取用户主页
**接口**: `GET /api/v1/community/users/{id}`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:getUserProfile`

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "user_001",
    "userName": "房车旅行家",
    "avatar": "/static/images/avatar.png",
    "bio": "热爱房车旅行，分享旅途故事",
    "postCount": 25,
    "followerCount": 1250,
    "followingCount": 320,
    "likeCount": 5680,
    "isFollowing": false,
    "posts": [
      {
        "id": "post_001",
        "type": "GUIDE",
        "title": "川西房车自驾攻略",
        "coverImage": "/static/images/post1.jpg",
        "likeCount": 89,
        "commentCount": 23,
        "createdAt": "2025-11-25T10:00:00+08:00"
      }
    ]
  }
}
```

---

### 11.8 关注用户
**接口**: `POST /api/v1/community/users/{id}/follow`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:followUser`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "关注成功",
  "data": {
    "isFollowing": true,
    "followerCount": 1251
  }
}
```

**业务规则**:
- 关注上限：最多关注500人
- 不能关注自己
- 重复关注自动取消关注

---

### 11.9 上传图片
**接口**: `POST /api/v1/community/upload-image`

**开发状态**: 🔴 未开发

**前端API位置**: 待创建 `miniprogram/api/community.ts:uploadImage`

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**: multipart/form-data
- file: File (必填) - 图片文件

**响应格式**:
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/images/123456.jpg",
    "thumbnail": "https://example.com/images/123456_thumb.jpg"
  }
}
```

**业务规则**:
- 支持格式：JPG、PNG、WEBP
- 单张图片最大5MB
- 自动压缩和生成缩略图

---

## 12. 积分系统模块 (points)

### 12.1 获取积分余额
**接口**: `GET /api/v1/points/balance`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:152` (getPointsBalance函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 1250,
    "totalEarned": 5680,
    "totalUsed": 4430,
    "expiringSoon": 100,
    "expiryDate": "2025-12-31"
  }
}
```

---

### 12.2 获取积分记录
**接口**: `GET /api/v1/points/records`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:172` (getPointsRecords函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- type: string (可选) - 记录类型：EARN（获取）、USE（使用）
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "record_001",
        "type": "EARN",
        "amount": 50,
        "source": "REVIEW",
        "description": "优质评价奖励",
        "balance": 1250,
        "createdAt": "2025-12-01T10:00:00+08:00"
      },
      {
        "id": "record_002",
        "type": "USE",
        "amount": -100,
        "source": "EXCHANGE",
        "description": "兑换优惠券",
        "balance": 1200,
        "createdAt": "2025-11-30T15:30:00+08:00"
      }
    ],
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

---

### 12.3 获取积分规则
**接口**: `GET /api/v1/points/rules`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:280` (getPointsRules函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "earnRules": [
      {
        "type": "HOSTING_INCOME",
        "name": "托管收益",
        "description": "托管车主每月收益的1%转化为消费积分（仅首次托管）",
        "points": "收益的1%",
        "userType": "HOSTING_OWNER"
      },
      {
        "type": "REVIEW",
        "name": "评价反馈",
        "description": "优质评价获得10-50积分，图片评价额外20积分",
        "points": "10-50",
        "userType": "HOSTING_OWNER"
      },
      {
        "type": "DAILY_SIGNIN",
        "name": "签到打卡",
        "description": "每日签到获得2积分，连续签到额外奖励",
        "points": "2+",
        "userType": "HOSTING_OWNER"
      },
      {
        "type": "RENTAL",
        "name": "租车消费",
        "description": "普通用户租车消费100元返1积分",
        "points": "消费的1%",
        "userType": "NORMAL"
      }
    ],
    "useRules": [
      {
        "type": "EXCHANGE_COUPON",
        "name": "兑换优惠券",
        "description": "1积分=1元，仅可兑换优惠券",
        "ratio": "1:1"
      }
    ],
    "generalRules": [
      "积分根据用户身份获取，不设定有效期",
      "积分不支持转让或赠送",
      "积分不可抵扣现金，仅用于特惠商城兑换优惠券"
    ]
  }
}
```

---

### 12.4 获取兑换商品列表
**接口**: `GET /api/v1/points/mall/items`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:343` (getExchangeItems函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**查询参数**:
- category: string (可选) - 商品分类：COUPON（优惠券）
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "item_001",
        "type": "COUPON",
        "name": "50元租车优惠券",
        "description": "适用于房车租赁，满500元可用",
        "points": 50,
        "stock": 100,
        "image": "/static/images/coupon.png",
        "validDays": 30
      },
      {
        "id": "item_002",
        "type": "COUPON",
        "name": "100元租车优惠券",
        "description": "适用于房车租赁，满1000元可用",
        "points": 100,
        "stock": 50,
        "image": "/static/images/coupon.png",
        "validDays": 30
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20,
    "hasMore": false
  }
}
```

---

### 12.5 兑换商品
**接口**: `POST /api/v1/points/mall/exchange`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:485` (exchangeItem函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**请求参数**:
```json
{
  "itemId": "item_001",
  "quantity": 1
}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "兑换成功",
  "data": {
    "exchangeId": "exchange_001",
    "itemId": "item_001",
    "itemName": "50元租车优惠券",
    "pointsUsed": 50,
    "balance": 1200,
    "couponId": "coupon_123",
    "validUntil": "2026-01-01T23:59:59+08:00",
    "createdAt": "2025-12-01T10:00:00+08:00"
  }
}
```

**业务规则**:
- 积分不足时无法兑换
- 库存不足时无法兑换
- 兑换成功后积分立即扣除
- 优惠券自动发放到账户

---

### 12.6 获取兑换记录
**接口**: `GET /api/v1/points/mall/records`

**开发状态**: 🟡 已开发（使用Mock）

**前端Mock位置**: `miniprogram/api/points.ts:510` (getExchangeRecords函数)

**后端实现位置**: 待开发

**联调结果**: 待测试

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- page: number (可选) - 页码，默认1
- pageSize: number (可选) - 每页数量，默认20

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "exchange_001",
        "itemId": "item_001",
        "itemName": "50元租车优惠券",
        "itemImage": "/static/images/coupon.png",
        "pointsUsed": 50,
        "quantity": 1,
        "status": "SUCCESS",
        "createdAt": "2025-12-01T10:00:00+08:00"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 20,
    "hasMore": false
  }
}
```

---

**文档更新时间**: 2025-12-01
**文档版本**: v1.1.0
**维护者**: 小程序端开发团队
