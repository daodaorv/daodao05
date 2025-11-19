# 叨叨项目API文档中心

**版本**: v1.0 | **创建时间**: 2025-11-13 | **维护者**: 后端开发窗口

## 📋 API文档索引

### 🔐 认证授权模块
- [用户登录](#用户登录) - `POST /api/v1/auth/login`
- [用户登出](#用户登出) - `POST /api/v1/auth/logout`
- [Token刷新](#token刷新) - `POST /api/v1/auth/refresh`
- [密码重置](#密码重置) - `POST /api/v1/auth/reset-password`

### 👥 用户管理模块
- [获取用户信息](#获取用户信息) - `GET /api/v1/users/profile`
- [更新用户信息](#更新用户信息) - `PUT /api/v1/users/profile`
- [用户列表查询](#用户列表查询) - `GET /api/v1/users`
- [用户详情查询](#用户详情查询) - `GET /api/v1/users/{id}`
- [用户状态更新](#用户状态更新) - `PUT /api/v1/users/{id}/status`

### 🚗 车辆管理模块
- [车辆列表查询](#车辆列表查询) - `GET /api/v1/vehicles`
- [车辆详情查询](#车辆详情查询) - `GET /api/v1/vehicles/{id}`
- [车辆状态更新](#车辆状态更新) - `PUT /api/v1/vehicles/{id}/status`
- [车辆位置更新](#车辆位置更新) - `PUT /api/v1/vehicles/{id}/location`

### 📋 订单管理模块
- [创建订单](#创建订单) - `POST /api/v1/orders`
- [订单列表查询](#订单列表查询) - `GET /api/v1/orders`
- [订单详情查询](#订单详情查询) - `GET /api/v1/orders/{id}`
- [订单状态更新](#订单状态更新) - `PUT /api/v1/orders/{id}/status`
- [订单取消](#订单取消) - `POST /api/v1/orders/{id}/cancel`

### 💰 支付管理模块
- [创建支付](#创建支付) - `POST /api/v1/payments`
- [支付查询](#支付查询) - `GET /api/v1/payments/{id}`
- [支付确认](#支付确认) - `POST /api/v1/payments/{id}/confirm`
- [退款申请](#退款申请) - `POST /api/v1/payments/{id}/refund`

### 🏪 门店管理模块
- [门店列表查询](#门店列表查询) - `GET /api/v1/stores`
- [门店详情查询](#门店详情查询) - `GET /api/v1/stores/{id}`
- [门店员工管理](#门店员工管理) - `GET /api/v1/stores/{id}/employees`

### 📊 数据统计模块
- [业务统计](#业务统计) - `GET /api/v1/statistics/business`
- [财务报表](#财务报表) - `GET /api/v1/statistics/finance`
- [用户分析](#用户分析) - `GET /api/v1/statistics/users`

### ⚙️ 系统管理模块
- [系统配置](#系统配置) - `GET /api/v1/system/config`
- [操作日志](#操作日志) - `GET /api/v1/system/logs`
- [系统监控](#系统监控) - `GET /api/v1/system/monitor`

---

## 🔐 认证授权模块

### 用户登录
用户登录接口，支持多种登录方式。

#### 📋 基本信息
- **接口路径**: `/api/v1/auth/login`
- **请求方法**: `POST`
- **接口描述**: 用户登录认证
- **负责窗口**: 后端API窗口
- **优先级**: P0
- **状态**: 设计中

#### 🔑 权限要求
- **登录要求**: 否
- **角色要求**: 无
- **权限要求**: 无

#### 📤 请求参数
#### Body参数
```json
{
  "username": {
    "type": "string",
    "required": true,
    "description": "用户名或手机号",
    "example": "user123"
  },
  "password": {
    "type": "string",
    "required": true,
    "description": "密码",
    "example": "password123"
  },
  "loginType": {
    "type": "string",
    "required": false,
    "description": "登录类型: password,sms,wechat",
    "example": "password"
  }
}
```

#### 📥 响应数据
#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": {
      "type": "string",
      "description": "访问令牌",
      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "refreshToken": {
      "type": "string", 
      "description": "刷新令牌",
      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "user": {
      "id": {
        "type": "integer",
        "description": "用户ID",
        "example": 123
      },
      "username": {
        "type": "string",
        "description": "用户名",
        "example": "user123"
      },
      "nickname": {
        "type": "string",
        "description": "昵称",
        "example": "张三"
      },
      "avatar": {
        "type": "string",
        "description": "头像URL",
        "example": "https://example.com/avatar.jpg"
      },
      "role": {
        "type": "string",
        "description": "角色类型",
        "example": "customer"
      },
      "permissions": {
        "type": "array",
        "description": "权限列表",
        "example": ["order:create", "order:read"]
      }
    }
  }
}
```

#### 错误响应
```json
{
  "code": 200001,
  "message": "用户名或密码错误",
  "details": "请检查用户名和密码是否正确"
}
```

#### 🔗 相关接口
- **依赖接口**: 无
- **被依赖接口**: 获取用户信息、用户权限验证
- **相似接口**: 微信登录、短信登录

#### ⚠️ 注意事项
- 📌 密码错误次数过多会触发账户锁定
- 📌 需要支持图形验证码防止暴力破解
- 📌 Token有效期为24小时，refreshToken有效期为7天

---

### 用户登出
用户登出接口，清除登录状态。

#### 📋 基本信息
- **接口路径**: `/api/v1/auth/logout`
- **请求方法**: `POST`
- **接口描述**: 用户登出
- **负责窗口**: 后端API窗口
- **优先级**: P1
- **状态**: 设计中

#### 🔑 权限要求
- **登录要求**: 是
- **角色要求**: 无
- **权限要求**: 无

#### 📤 请求参数
#### Header参数
```json
{
  "Authorization": {
    "type": "string",
    "required": true,
    "description": "Bearer token",
    "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 📥 响应数据
#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": {
      "type": "string",
      "description": "登出成功信息",
      "example": "登出成功"
    }
  }
}
```

---

## 👥 用户管理模块

### 获取用户信息
获取当前登录用户的详细信息。

#### 📋 基本信息
- **接口路径**: `/api/v1/users/profile`
- **请求方法**: `GET`
- **接口描述**: 获取用户信息
- **负责窗口**: 后端API窗口
- **优先级**: P0
- **状态**: 设计中

#### 🔑 权限要求
- **登录要求**: 是
- **角色要求**: 无
- **权限要求**: 无

#### 📤 请求参数
#### Header参数
```json
{
  "Authorization": {
    "type": "string",
    "required": true,
    "description": "Bearer token",
    "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Query参数
```json
{
  "fields": {
    "type": "string",
    "required": false,
    "description": "需要返回的字段，逗号分隔",
    "example": "id,username,nickname,avatar"
  }
}
```

#### 📥 响应数据
#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": {
      "type": "integer",
      "description": "用户ID",
      "example": 123
    },
    "username": {
      "type": "string",
      "description": "用户名",
      "example": "user123"
    },
    "nickname": {
      "type": "string",
      "description": "昵称",
      "example": "张三"
    },
    "realName": {
      "type": "string",
      "description": "真实姓名",
      "example": "张三"
    },
    "avatar": {
      "type": "string",
      "description": "头像URL",
      "example": "https://example.com/avatar.jpg"
    },
    "phone": {
      "type": "string",
      "description": "手机号",
      "example": "13800138000"
    },
    "email": {
      "type": "string",
      "description": "邮箱",
      "example": "zhangsan@example.com"
    },
    "gender": {
      "type": "integer",
      "description": "性别: 0-未知, 1-男, 2-女",
      "example": 1
    },
    "birthday": {
      "type": "string",
      "description": "生日",
      "example": "1990-01-01"
    },
    "role": {
      "type": "string",
      "description": "角色类型",
      "example": "customer"
    },
    "status": {
      "type": "integer",
      "description": "状态: 0-禁用, 1-正常",
      "example": 1
    },
    "createdAt": {
      "type": "string",
      "description": "创建时间",
      "example": "2025-01-01T00:00:00+08:00"
    },
    "updatedAt": {
      "type": "string",
      "description": "更新时间",
      "example": "2025-01-01T00:00:00+08:00"
    }
  }
}
```

---

### 用户列表查询
分页查询用户列表，支持多种筛选条件。

#### 📋 基本信息
- **接口路径**: `/api/v1/users`
- **请求方法**: `GET`
- **接口描述**: 用户列表查询
- **负责窗口**: 后端API窗口
- **优先级**: P0
- **状态**: 设计中

#### 🔑 权限要求
- **登录要求**: 是
- **角色要求**: admin
- **权限要求**: user:read

#### 📤 请求参数
#### Header参数
```json
{
  "Authorization": {
    "type": "string",
    "required": true,
    "description": "Bearer token",
    "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Query参数
```json
{
  "page": {
    "type": "integer",
    "required": false,
    "description": "页码，从1开始",
    "example": 1
  },
  "pageSize": {
    "type": "integer",
    "required": false,
    "description": "每页条数，默认20",
    "example": 20
  },
  "keyword": {
    "type": "string",
    "required": false,
    "description": "搜索关键词(用户名/昵称/手机号)",
    "example": "张三"
  },
  "role": {
    "type": "string",
    "required": false,
    "description": "角色类型",
    "example": "customer"
  },
  "status": {
    "type": "integer",
    "required": false,
    "description": "状态: 0-禁用, 1-正常",
    "example": 1
  },
  "startDate": {
    "type": "string",
    "required": false,
    "description": "开始日期",
    "example": "2025-01-01"
  },
  "endDate": {
    "type": "string",
    "required": false,
    "description": "结束日期",
    "example": "2025-12-31"
  }
}
```

#### 📥 响应数据
#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": {
        "type": "integer",
        "description": "用户ID",
        "example": 123
      },
      "username": {
        "type": "string",
        "description": "用户名",
        "example": "user123"
      },
      "nickname": {
        "type": "string",
        "description": "昵称",
        "example": "张三"
      },
      "realName": {
        "type": "string",
        "description": "真实姓名",
        "example": "张三"
      },
      "avatar": {
        "type": "string",
        "description": "头像URL",
        "example": "https://example.com/avatar.jpg"
      },
      "phone": {
        "type": "string",
        "description": "手机号",
        "example": "13800138000"
      },
      "email": {
        "type": "string",
        "description": "邮箱",
        "example": "zhangsan@example.com"
      },
      "role": {
        "type": "string",
        "description": "角色类型",
        "example": "customer"
      },
      "status": {
        "type": "integer",
        "description": "状态",
        "example": 1
      },
      "createdAt": {
        "type": "string",
        "description": "创建时间",
        "example": "2025-01-01T00:00:00+08:00"
      },
      "lastLoginAt": {
        "type": "string",
        "description": "最后登录时间",
        "example": "2025-01-01T00:00:00+08:00"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 📋 接口状态说明

### 状态定义
- **🟢 已完成**: 接口已开发完成，通过测试
- **🟡 开发中**: 接口正在开发中
- **🔵 设计中**: 接口设计已完成，待开发
- **⚪ 未开始**: 接口尚未开始设计
- **🚫 已废弃**: 接口已废弃，不再维护

### 优先级定义
- **P0 - 阻塞性**: 无此接口功能完全无法开发
- **P1 - 重要性**: 有此接口功能才能完整实现
- **P2 - 优化性**: 有此接口功能体验更好
- **P3 - 未来性**: 未来可能需要，当前非必须

---

## 📊 接口统计

### 按模块统计
| 模块 | 总计 | 已完成 | 开发中 | 设计中 | 完成率 |
|------|------|--------|--------|--------|--------|
| 认证授权 | 4 | 0 | 0 | 4 | 0% |
| 用户管理 | 4 | 0 | 0 | 4 | 0% |
| 车辆管理 | 4 | 0 | 0 | 4 | 0% |
| 订单管理 | 5 | 0 | 0 | 5 | 0% |
| 支付管理 | 4 | 0 | 0 | 4 | 0% |
| 门店管理 | 3 | 0 | 0 | 3 | 0% |
| 数据统计 | 3 | 0 | 0 | 3 | 0% |
| 系统管理 | 3 | 0 | 0 | 3 | 0% |
| **总计** | **30** | **0** | **0** | **30** | **0%** |

### 按优先级统计
| 优先级 | 总计 | 已完成 | 开发中 | 设计中 | 完成率 |
|--------|------|--------|--------|--------|--------|
| P0 | 12 | 0 | 0 | 12 | 0% |
| P1 | 10 | 0 | 0 | 10 | 0% |
| P2 | 5 | 0 | 0 | 5 | 0% |
| P3 | 3 | 0 | 0 | 3 | 0% |
| **总计** | **30** | **0** | **0** | **30** | **0%** |

---

## 📝 文档维护

### 更新记录
| 日期 | 版本 | 更新内容 | 更新人 | 审核人 |
|------|------|----------|--------|--------|
| 2025-11-13 | v1.0 | 初始版本，建立API文档框架 | 后端窗口 | 项目协调员 |

### 维护责任
- **文档维护**: 后端API窗口
- **内容审核**: 各窗口负责人
- **版本发布**: 项目协调员
- **使用反馈**: 各前端窗口

### 下步计划
1. **本周完成**: 认证授权模块接口开发
2. **下周计划**: 用户管理模块接口开发
3. **本月目标**: 完成P0级别接口开发
4. **持续优化**: 根据开发反馈完善接口设计

---

**文档状态**: 🟢 活跃维护
**最后更新**: 2025-11-13
**下次审核**: 2025-11-20