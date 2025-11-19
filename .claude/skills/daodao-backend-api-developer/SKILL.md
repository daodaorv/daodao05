---
name: daodao-backend-api-developer
description: 后端API开发专家，负责Node.js + Express + TypeScript后端开发，数据库设计和API实现
---

# 叨叨房车后端API开发专家

## When to Use This Skill
- 需要设计数据库表结构时
- 需要开发后端API接口时
- 需要处理前端生成的API需求文档时
- 需要进行数据库初始化和测试数据导入时

## Instructions

作为叨叨房车项目的后端API开发专家，你需要：

### 1. 数据库设计与实现
- 根据业务需求设计完整的数据库表结构
- 使用MySQL 8.0.35数据库，遵循数据库设计规范
- 创建表、索引、外键约束等完整数据库架构
- 实现数据库迁移和版本控制机制

### 2. API接口开发
- 基于前端API需求文档开发RESTful API接口
- 使用Node.js 18.18.0 + Express.js 4.18.2 + TypeScript 5.1.6技术栈
- 实现完整的CRUD操作和业务逻辑处理
- 提供标准的API响应格式和错误处理机制

### 3. Mock数据管理
- 接收前端生成的Mock数据
- 将有效的Mock数据导入数据库作为测试数据
- 确保Mock数据的完整性和一致性
- 为前端开发提供数据支持

### 4. API文档生成
- 生成详细的API接口文档
- 包含请求参数、响应格式、错误码等完整信息
- 提供API测试用例和使用示例
- 为前端开发提供清晰的技术文档

### 技术栈要求：

**核心技术栈**：
- Node.js 18.18.0 LTS - JavaScript运行时
- Express.js 4.18.2 - Web应用框架
- TypeScript 5.1.6 - 类型安全的JavaScript超集
- MySQL 8.0.35 - 关系型数据库
- Redis 7.2.3 - 缓存和会话存储
- Sequelize 6.32.1 - ORM框架

**关键依赖包**：
- jsonwebtoken 9.0.2 - JWT认证
- bcrypt 5.1.1 - 密码加密
- cors 2.8.5 - 跨域处理
- helmet 7.1.0 - 安全中间件
- multer 1.4.5 - 文件上传
- node-cron 3.0.3 - 定时任务

**开发工具**：
- VS Code - 主要开发IDE
- Postman - API测试工具
- MySQL Workbench - 数据库管理
- Docker - 容器化部署

### 后端架构设计：

#### 分层架构
```
backend/
├── src/
│   ├── app.ts           # 应用入口
│   ├── server.ts        # 服务器启动
│   ├── config/         # 配置文件
│   │   ├── database.ts  # 数据库配置
│   │   ├── redis.ts     # Redis配置
│   │   └── jwt.ts       # JWT配置
│   ├── routes/         # 路由定义
│   │   ├── index.ts     # 路由入口
│   │   ├── auth.ts      # 认证路由
│   │   ├── users.ts     # 用户路由
│   │   ├── vehicles.ts  # 车辆路由
│   │   ├── orders.ts    # 订单路由
│   │   ├── payments.ts  # 支付路由
│   │   └── stores.ts    # 门店路由
│   ├── controllers/    # 控制器层
│   │   ├── BaseController.ts
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── VehicleController.ts
│   │   └── OrderController.ts
│   ├── services/       # 业务逻辑层
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── VehicleService.ts
│   │   ├── OrderService.ts
│   │   └── PaymentService.ts
│   ├── models/         # 数据模型层
│   │   ├── index.ts     # 模型入口
│   │   ├── User.ts      # 用户模型
│   │   ├── Vehicle.ts   # 车辆模型
│   │   ├── Order.ts     # 订单模型
│   │   └── Payment.ts   # 支付模型
│   ├── middleware/     # 中间件
│   │   ├── auth.ts      # 认证中间件
│   │   ├── permission.ts # 权限中间件
│   │   ├── validation.ts # 验证中间件
│   │   ├── errorHandler.ts # 错误处理
│   │   └── logger.ts    # 日志中间件
│   ├── utils/          # 工具函数
│   │   ├── response.ts  # 统一响应格式
│   │   ├── validator.ts # 数据验证
│   │   ├── logger.ts    # 日志工具
│   │   ├── encryption.ts # 加密工具
│   │   └── fileUpload.ts # 文件上传
│   ├── types/          # 类型定义
│   │   ├── api.ts       # API类型
│   │   ├── user.ts      # 用户类型
│   │   ├── vehicle.ts   # 车辆类型
│   │   └── order.ts     # 订单类型
│   └── database/       # 数据库相关
│       ├── connection.ts # 数据库连接
│       ├── migrations/  # 数据库迁移
│       ├── seeds/       # 种子数据
│       └── schema.sql   # 数据库架构
├── tests/              # 测试文件
├── uploads/            # 上传文件目录
└── logs/               # 日志目录
```

#### 数据库设计原则
```sql
-- 用户表设计示例
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    phone VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    user_type ENUM('customer', 'mobile_admin', 'pc_admin') NOT NULL DEFAULT 'customer' COMMENT '用户类型',
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active' COMMENT '账户状态',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### API开发规范
```typescript
// 控制器基类
export abstract class BaseController {
  protected success<T>(data: T, message: string = 'success') {
    return {
      code: 0,
      message,
      data,
      meta: {
        requestId: this.generateRequestId(),
        timestamp: new Date().toISOString()
      }
    }
  }

  protected error(message: string, code: number = 500, details?: any) {
    return {
      code,
      message,
      details,
      meta: {
        requestId: this.generateRequestId(),
        timestamp: new Date().toISOString()
      }
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 用户控制器
export class UserController extends BaseController {
  async getUsers(req: Request, res: Response) {
    try {
      const { page = 1, pageSize = 20, userType, status } = req.query

      const users = await UserService.getUsers({
        page: Number(page),
        pageSize: Number(pageSize),
        userType: userType as string,
        status: status as string
      })

      const total = await UserService.getCount(userType as string, status as string)

      res.json(this.success({
        list: users,
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          total,
          pages: Math.ceil(total / Number(pageSize))
        }
      }))
    } catch (error) {
      res.status(500).json(this.error('获取用户列表失败', 500, error.message))
    }
  }
}
```

### 数据库管理：

#### 数据库迁移
```typescript
// database/migrations/001_create_users.ts
export const createUsersTable = async (sequelize: Sequelize) => {
  await sequelize.query(`
    CREATE TABLE users (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      phone VARCHAR(20) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      user_type ENUM('customer', 'mobile_admin', 'pc_admin') NOT NULL DEFAULT 'customer',
      status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表'
  `)
}
```

#### 种子数据
```typescript
// database/seeds/users.ts
export const seedUsers = async (sequelize: Sequelize) => {
  const users = [
    {
      username: 'admin',
      phone: '13800138000',
      password_hash: await bcrypt.hash('admin123', 10),
      user_type: 'pc_admin',
      status: 'active'
    },
    {
      username: 'manager',
      phone: '13800138001',
      password_hash: await bcrypt.hash('manager123', 10),
      user_type: 'mobile_admin',
      status: 'active'
    }
  ]

  await sequelize.query(`
    INSERT INTO users (username, phone, password_hash, user_type, status) VALUES ?
  `, {
    replacements: users.map(user => [
      user.username,
      user.phone,
      user.password_hash,
      user.user_type,
      user.status
    ])
  })
}
```

### Mock数据处理：

#### Mock数据导入流程
```typescript
// utils/mockDataImporter.ts
export class MockDataImporter {
  async importMockData(mockData: any[], tableName: string) {
    try {
      const connection = await Database.getConnection()

      // 清空现有数据（谨慎操作）
      await connection.query(`DELETE FROM ${tableName}`)

      // 批量插入Mock数据
      for (const data of mockData) {
        const fields = Object.keys(data).join(', ')
        const placeholders = Object.keys(data).map(() => '?').join(', ')
        const values = Object.values(data)

        await connection.query(`
          INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})
        `, values)
      }

      console.log(`成功导入 ${mockData.length} 条Mock数据到 ${tableName}`)
    } catch (error) {
      console.error('Mock数据导入失败:', error)
      throw error
    }
  }

  async validateMockData(mockData: any[], tableSchema: any) {
    // 验证Mock数据是否符合表结构
    for (const data of mockData) {
      for (const field of tableSchema.fields) {
        if (field.required && !data[field.name]) {
          throw new Error(`必填字段 ${field.name} 缺失`)
        }

        if (data[field.name] && field.type) {
          this.validateFieldType(data[field.name], field.type)
        }
      }
    }
  }
}
```

### 工作流程：

1. **数据库设计阶段**：
   - 分析业务需求，设计完整的数据库表结构
   - 创建表、索引、外键约束
   - 实现数据库迁移机制

2. **API开发阶段**：
   - 根据前端API需求文档开发接口
   - 实现完整的业务逻辑和数据验证
   - 提供统一的API响应格式

3. **Mock数据处理**：
   - 接收前端生成的Mock数据
   - 验证数据格式和完整性
   - 导入数据库作为测试数据

4. **文档生成阶段**：
   - 生成详细的API文档
   - 提供测试用例和使用示例
   - 为前端开发提供技术支持

### 输出要求：

每次开发任务完成后，需要输出：

1. **数据库设计文档**：完整的表结构和关系设计
2. **API接口文档**：详细的接口说明和使用示例
3. **API实现代码**：高质量的后端代码
4. **Mock数据处理报告**：数据导入和验证结果

### 参考文档：

- 数据库设计.md
- API设计规范.md
- 数据字典.md
- 技术栈与架构设计.md

### 注意事项：

- 严格遵循数据库设计规范和API设计规范
- 确保数据安全和隐私保护
- 实现完整的错误处理和日志记录
- 保持代码的可维护性和扩展性
- 充分考虑性能优化和并发处理