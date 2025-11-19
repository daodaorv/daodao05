# 叨叨房车 API 测试指南

## 启动服务

```bash
# 1. 确保数据库服务运行
docker compose up -d mysql redis

# 2. 启动后端服务
cd backend
npm run dev

# 服务将运行在 http://localhost:3000
```

## API 端点列表

### 1. 健康检查
```http
GET http://localhost:3000/health
```

### 2. 发送验证码
```http
POST http://localhost:3000/api/v1/auth/send-code
Content-Type: application/json

{
  "phone": "13900139001",
  "code_type": "register"
}
```

### 3. 用户注册
```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "phone": "13900139001",
  "password": "123456",
  "verification_code": "查看控制台输出的验证码",
  "username": "test_user_001"
}
```

### 4. 用户登录（密码方式）
```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456",
  "platform": "pc"
}
```

**测试账号**:
- 管理员: phone: `13800138000`, password: `123456`
- 普通用户: phone: `13900139000`, password: `123456`

### 5. 用户登录（验证码方式）
```http
POST http://localhost:3000/api/v1/auth/login-with-code
Content-Type: application/json

{
  "phone": "13900139000",
  "verification_code": "查看控制台输出的验证码",
  "platform": "miniprogram"
}
```

### 6. 获取用户信息（需要认证）
```http
GET http://localhost:3000/api/v1/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### 7. 更新用户信息（需要认证）
```http
PUT http://localhost:3000/api/v1/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "real_name": "张三",
  "email": "zhangsan@example.com",
  "gender": "male",
  "address": "北京市朝阳区"
}
```

### 8. 获取登录日志（需要认证）
```http
GET http://localhost:3000/api/v1/users/login-logs?limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 9. 获取所有用户（管理员）
```http
GET http://localhost:3000/api/v1/users?page=1&pageSize=20
Authorization: Bearer ADMIN_TOKEN_HERE
```

### 10. 更新用户状态（管理员）
```http
PUT http://localhost:3000/api/v1/users/2/status
Authorization: Bearer ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "status": "inactive"
}
```

## 使用 cURL 测试

### 1. 健康检查
```bash
curl http://localhost:3000/health
```

### 2. 发送验证码
```bash
curl -X POST http://localhost:3000/api/v1/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900139001","code_type":"register"}'
```

### 3. 用户登录
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456"}'
```

### 4. 获取用户信息（替换 YOUR_TOKEN）
```bash
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 响应数据
  }
}
```

### 错误响应
```json
{
  "code": 400001,
  "message": "Validation failed",
  "data": null,
  "errors": [
    {
      "field": "phone",
      "message": "Invalid phone number format"
    }
  ]
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400001 | 参数验证失败 |
| 400002 | 发送验证码失败 |
| 400003 | 注册失败 |
| 401001 | 未提供Token |
| 401002 | 用户不存在 |
| 401003 | 用户账户未激活 |
| 401004 | Token已过期 |
| 401005 | Token无效 |
| 401006 | 登录失败 |
| 403001 | 权限不足 |
| 404001 | 用户未找到 |

## 注意事项

1. **验证码**: 开发环境下验证码会输出到控制台，格式为 `[SMS] Verification code for 手机号: 验证码`
2. **Token**: 登录成功后会返回Token，有效期7天
3. **认证**: 需要认证的接口必须在请求头中添加 `Authorization: Bearer TOKEN`
4. **权限**: 部分接口需要管理员权限（user_type为pc_admin）

## 测试流程建议

1. 发送注册验证码
2. 使用验证码注册新用户
3. 使用密码登录获取Token
4. 使用Token获取用户信息
5. 使用Token更新用户信息
6. 使用管理员账号登录
7. 查看所有用户列表
8. 更新用户状态

