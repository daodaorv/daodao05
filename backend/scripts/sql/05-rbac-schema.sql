-- =====================================================
-- 叨叨房车 RBAC 权限系统表结构
-- 创建时间: 2025-12-28
-- 说明: 统一的角色权限管理系统，支持C端和B端用户
-- =====================================================

USE daodao;

-- =====================================================
-- 1. 修改 users 表的 user_type 字段
-- =====================================================

-- 备份现有数据（如果需要回滚）
-- CREATE TABLE users_backup_20251228 AS SELECT * FROM users;

-- 修改 user_type 字段为简化的两种类型
ALTER TABLE users
MODIFY COLUMN user_type ENUM('customer', 'admin') NOT NULL DEFAULT 'customer'
COMMENT 'C端用户customer，B端管理员admin';

-- =====================================================
-- 2. 删除旧的 roles 表（如果存在）
-- =====================================================

DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;

-- =====================================================
-- 3. 创建新的 roles 表（角色表）
-- =====================================================

CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '角色代码',
    type ENUM('customer', 'admin') NOT NULL COMMENT '角色类型：customer=C端角色，admin=B端角色',
    data_scope ENUM('all', 'region', 'store', 'self') DEFAULT 'self' COMMENT '数据权限范围：all=全局，region=区域，store=门店，self=个人',
    description TEXT COMMENT '角色描述',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '角色状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- =====================================================
-- 4. 创建 permissions 表（权限表）
-- =====================================================

CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(100) UNIQUE NOT NULL COMMENT '权限代码，格式：resource:action',
    name VARCHAR(100) NOT NULL COMMENT '权限名称',
    resource VARCHAR(50) NOT NULL COMMENT '资源模块',
    action VARCHAR(50) NOT NULL COMMENT '操作类型',
    description TEXT COMMENT '权限描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_resource (resource),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- =====================================================
-- 5. 创建 role_permissions 表（角色权限关联表）
-- =====================================================

CREATE TABLE role_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL COMMENT '角色ID',
    permission_id BIGINT NOT NULL COMMENT '权限ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_permission (role_id, permission_id),
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- =====================================================
-- 6. 创建 user_roles 表（用户角色关联表）
-- =====================================================

CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    store_id BIGINT NULL COMMENT '关联门店ID（门店角色必填）',
    granted_by BIGINT COMMENT '授权人ID',
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
    expires_at TIMESTAMP NULL COMMENT '过期时间（可选）',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_role_store (user_id, role_id, store_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_store_id (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- =====================================================
-- 完成
-- =====================================================

SELECT 'RBAC表结构创建完成！' AS message;
