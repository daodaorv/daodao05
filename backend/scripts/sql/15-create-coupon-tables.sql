-- ============================================
-- 优惠券模块数据库表结构
-- 创建时间: 2025-12-25
-- 说明: 包含优惠券、用户优惠券、邀请码、邀请记录等表
-- ============================================

USE daodao;

-- 优惠券表
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '优惠券ID',
    name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
    type ENUM('discount', 'rate', 'daily', 'service', 'special') NOT NULL COMMENT '优惠券类型',
    amount DECIMAL(10,2) COMMENT '优惠金额（满减券）',
    rate DECIMAL(5,4) COMMENT '折扣率（折扣券，如0.9表示9折）',
    min_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '最低消费金额',
    scope VARCHAR(50) COMMENT '适用范围：rental/campsite/tour',
    description TEXT COMMENT '优惠券描述',
    validity_days INT DEFAULT 30 COMMENT '有效天数（领取后）',
    price DECIMAL(10,2) DEFAULT 0.00 COMMENT '购买价格（0表示免费）',
    points_price INT DEFAULT 0 COMMENT '积分价格（0表示不可用积分兑换）',
    total_stock INT DEFAULT 0 COMMENT '总库存（0表示无限制）',
    remaining_stock INT DEFAULT 0 COMMENT '剩余库存',
    limit_per_user INT DEFAULT 1 COMMENT '每人限领数量',
    is_new_user BOOLEAN DEFAULT FALSE COMMENT '是否仅限新用户',
    is_vip BOOLEAN DEFAULT FALSE COMMENT '是否仅限会员',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    stack_rule VARCHAR(255) COMMENT '叠加规则',
    special_limit VARCHAR(255) COMMENT '特殊限制',
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active' COMMENT '状态',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_scope (scope),
    INDEX idx_is_hot (is_hot),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券表';

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS user_coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户优惠券ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    coupon_id BIGINT NOT NULL COMMENT '优惠券ID',
    status ENUM('unused', 'used', 'expired') DEFAULT 'unused' COMMENT '状态',
    claim_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
    expiry_date DATE NOT NULL COMMENT '过期日期',
    used_date TIMESTAMP COMMENT '使用时间',
    order_id BIGINT COMMENT '使用的订单ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_status (status),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';

-- 邀请码表
CREATE TABLE IF NOT EXISTS invite_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '邀请码ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    invite_code VARCHAR(20) UNIQUE NOT NULL COMMENT '邀请码',
    total_invites INT DEFAULT 0 COMMENT '总邀请数',
    successful_registrations INT DEFAULT 0 COMMENT '成功注册数',
    completed_first_orders INT DEFAULT 0 COMMENT '完成首单数',
    total_rewards INT DEFAULT 0 COMMENT '累计奖励（优惠券数量）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id),
    INDEX idx_invite_code (invite_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请码表';

-- 邀请记录表
CREATE TABLE IF NOT EXISTS invite_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '邀请记录ID',
    inviter_id BIGINT NOT NULL COMMENT '邀请人ID',
    invitee_id BIGINT COMMENT '被邀请人ID',
    invite_code VARCHAR(20) NOT NULL COMMENT '邀请码',
    invitee_phone VARCHAR(20) COMMENT '被邀请人手机号',
    status ENUM('pending', 'registered', 'completed_order') DEFAULT 'pending' COMMENT '状态',
    registered_at TIMESTAMP COMMENT '注册时间',
    first_order_at TIMESTAMP COMMENT '首单完成时间',
    reward_amount INT DEFAULT 0 COMMENT '奖励金额（优惠券数量）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invitee_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_inviter_id (inviter_id),
    INDEX idx_invitee_id (invitee_id),
    INDEX idx_invite_code (invite_code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请记录表';
