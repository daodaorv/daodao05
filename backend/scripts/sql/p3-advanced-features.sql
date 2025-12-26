-- ============================================
-- P3 高级功能模块数据库表结构
-- 创建时间: 2025-12-25
-- 说明: 包含托管中心、众筹、通知、社区、积分、会员、评价、帮助、钱包等模块
-- ============================================

USE daodao;

-- ============================================
-- 1. 托管中心模块 (Hosting)
-- ============================================

-- 托管车辆表
CREATE TABLE IF NOT EXISTS hosting_vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '托管车辆ID',
    user_id BIGINT NOT NULL COMMENT '车主用户ID',
    vehicle_id BIGINT COMMENT '关联的车辆ID（购车托管）',
    plate_number VARCHAR(20) COMMENT '车牌号（自有车托管）',
    brand VARCHAR(50) NOT NULL COMMENT '品牌',
    model VARCHAR(100) NOT NULL COMMENT '车型',
    year INT COMMENT '年份',
    mileage INT COMMENT '里程数（公里）',
    hosting_type ENUM('own_car', 'new_car') NOT NULL COMMENT '托管类型：own_car-自有车托管, new_car-购车托管',
    status ENUM('pending', 'approved', 'operating', 'maintenance', 'self_use', 'rejected', 'terminated') NOT NULL DEFAULT 'pending' COMMENT '状态',
    store_id BIGINT COMMENT '所属门店ID',
    hosting_start_date DATE COMMENT '托管开始日期',
    hosting_end_date DATE COMMENT '托管结束日期',
    total_income DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计收益',
    available_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '可提现余额',
    frozen_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '冻结余额',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_hosting_type (hosting_type),
    INDEX idx_store_id (store_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='托管车辆表';

-- 托管申请表
CREATE TABLE IF NOT EXISTS hosting_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '申请ID',
    user_id BIGINT NOT NULL COMMENT '申请人用户ID',
    application_type ENUM('own_car', 'new_car', 'self_use') NOT NULL COMMENT '申请类型',
    hosting_vehicle_id BIGINT COMMENT '托管车辆ID（车主自用时）',
    vehicle_info JSON COMMENT '车辆信息',
    owner_info JSON COMMENT '车主信息',
    photos JSON COMMENT '照片列表',
    store_id BIGINT COMMENT '门店ID',
    pickup_time TIMESTAMP COMMENT '取车时间（自用）',
    return_time TIMESTAMP COMMENT '还车时间（自用）',
    additional_services JSON COMMENT '附加服务',
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
    reject_reason TEXT COMMENT '拒绝原因',
    reviewed_by BIGINT COMMENT '审核人ID',
    reviewed_at TIMESTAMP COMMENT '审核时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hosting_vehicle_id) REFERENCES hosting_vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_application_type (application_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='托管申请表';

-- 托管收益明细表
CREATE TABLE IF NOT EXISTS hosting_income_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '收益明细ID',
    hosting_vehicle_id BIGINT NOT NULL COMMENT '托管车辆ID',
    user_id BIGINT NOT NULL COMMENT '车主用户ID',
    order_id BIGINT COMMENT '关联订单ID',
    income_type ENUM('rental', 'bonus', 'subsidy', 'other') NOT NULL COMMENT '收益类型',
    amount DECIMAL(10,2) NOT NULL COMMENT '收益金额',
    description VARCHAR(255) COMMENT '收益描述',
    income_date DATE NOT NULL COMMENT '收益日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (hosting_vehicle_id) REFERENCES hosting_vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,

    INDEX idx_hosting_vehicle_id (hosting_vehicle_id),
    INDEX idx_user_id (user_id),
    INDEX idx_income_date (income_date),
    INDEX idx_income_type (income_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='托管收益明细表';

-- 托管提现记录表
CREATE TABLE IF NOT EXISTS hosting_withdrawals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '提现记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    hosting_vehicle_id BIGINT COMMENT '托管车辆ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '提现金额',
    fee DECIMAL(10,2) DEFAULT 0.00 COMMENT '手续费',
    actual_amount DECIMAL(10,2) NOT NULL COMMENT '实际到账金额',
    bank_account VARCHAR(50) NOT NULL COMMENT '银行账号',
    bank_name VARCHAR(100) NOT NULL COMMENT '开户行',
    account_name VARCHAR(50) NOT NULL COMMENT '账户名',
    status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT '提现状态',
    fail_reason TEXT COMMENT '失败原因',
    processed_at TIMESTAMP COMMENT '处理时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hosting_vehicle_id) REFERENCES hosting_vehicles(id) ON DELETE SET NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='托管提现记录表';

-- ============================================
-- 2. 众筹托管模块 (Crowdfunding)
-- ============================================

-- 众筹车型表
CREATE TABLE IF NOT EXISTS crowdfunding_models (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '车型ID',
    brand VARCHAR(50) NOT NULL COMMENT '品牌',
    model VARCHAR(100) NOT NULL COMMENT '车型',
    type VARCHAR(50) NOT NULL COMMENT '类型（如：C型房车）',
    images JSON COMMENT '图片列表',
    price DECIMAL(10,2) NOT NULL COMMENT '车辆总价',
    share_price DECIMAL(10,2) NOT NULL COMMENT '单份价格',
    total_shares INT NOT NULL COMMENT '总份数',
    min_shares INT DEFAULT 1 COMMENT '最少购买份数',
    max_shares INT COMMENT '最多购买份数',
    expected_annual_return DECIMAL(5,4) COMMENT '预期年化收益率',
    expected_monthly_income DECIMAL(10,2) COMMENT '预期月收益',
    specifications JSON COMMENT '车辆规格',
    features JSON COMMENT '车辆特色',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_status (status),
    INDEX idx_is_hot (is_hot),
    INDEX idx_is_recommended (is_recommended)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='众筹车型表';

-- 众筹项目表
CREATE TABLE IF NOT EXISTS crowdfunding_projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '项目ID',
    project_no VARCHAR(50) UNIQUE NOT NULL COMMENT '项目编号',
    model_id BIGINT NOT NULL COMMENT '车型ID',
    initiator_id BIGINT NOT NULL COMMENT '发起人ID',
    target_amount DECIMAL(10,2) NOT NULL COMMENT '目标金额',
    current_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '当前金额',
    total_shares INT NOT NULL COMMENT '总份数',
    sold_shares INT DEFAULT 0 COMMENT '已售份数',
    participant_count INT DEFAULT 0 COMMENT '参与人数',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    status ENUM('preparing', 'funding', 'success', 'failed', 'operating') NOT NULL DEFAULT 'preparing' COMMENT '状态',
    vehicle_id BIGINT COMMENT '关联车辆ID（成功后）',
    store_id BIGINT COMMENT '运营门店ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (model_id) REFERENCES crowdfunding_models(id) ON DELETE CASCADE,
    FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL,

    INDEX idx_status (status),
    INDEX idx_initiator_id (initiator_id),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='众筹项目表';

-- 众筹份额表
CREATE TABLE IF NOT EXISTS crowdfunding_shares (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '份额ID',
    project_id BIGINT NOT NULL COMMENT '项目ID',
    user_id BIGINT NOT NULL COMMENT '持有人ID',
    shares INT NOT NULL COMMENT '份额数量',
    amount DECIMAL(10,2) NOT NULL COMMENT '投资金额',
    status ENUM('active', 'listed', 'transferred') NOT NULL DEFAULT 'active' COMMENT '状态',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '购买时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (project_id) REFERENCES crowdfunding_projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='众筹份额表';

-- 份额交易市场表
CREATE TABLE IF NOT EXISTS share_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '交易ID',
    share_id BIGINT NOT NULL COMMENT '份额ID',
    seller_id BIGINT NOT NULL COMMENT '卖家ID',
    buyer_id BIGINT COMMENT '买家ID',
    shares INT NOT NULL COMMENT '交易份额数',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
    status ENUM('listed', 'sold', 'cancelled') NOT NULL DEFAULT 'listed' COMMENT '状态',
    listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '挂单时间',
    sold_at TIMESTAMP COMMENT '成交时间',
    cancelled_at TIMESTAMP COMMENT '取消时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (share_id) REFERENCES crowdfunding_shares(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_status (status),
    INDEX idx_seller_id (seller_id),
    INDEX idx_buyer_id (buyer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='份额交易市场表';

-- ============================================
-- 3. 通知模块 (Notifications)
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '通知ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('system', 'order', 'payment', 'promotion', 'activity') NOT NULL COMMENT '通知类型',
    title VARCHAR(100) NOT NULL COMMENT '通知标题',
    content TEXT NOT NULL COMMENT '通知内容',
    link VARCHAR(255) COMMENT '跳转链接',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    read_at TIMESTAMP COMMENT '阅读时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- ============================================
-- 4. 社区互动模块 (Community)
-- ============================================

-- 社区帖子表
CREATE TABLE IF NOT EXISTS community_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '帖子ID',
    user_id BIGINT NOT NULL COMMENT '发帖人ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    images JSON COMMENT '图片列表',
    location VARCHAR(100) COMMENT '位置',
    tags JSON COMMENT '标签',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    is_top BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    status ENUM('published', 'hidden', 'deleted') DEFAULT 'published' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_is_top (is_top),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区帖子表';

-- 帖子评论表
CREATE TABLE IF NOT EXISTS post_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    user_id BIGINT NOT NULL COMMENT '评论人ID',
    parent_id BIGINT COMMENT '父评论ID（回复）',
    content TEXT NOT NULL COMMENT '评论内容',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES post_comments(id) ON DELETE CASCADE,

    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子评论表';

-- 帖子点赞表
CREATE TABLE IF NOT EXISTS post_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE KEY uk_post_user (post_id, user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子点赞表';

-- ============================================
-- 5. 积分系统模块 (Points)
-- ============================================

-- 用户积分表
CREATE TABLE IF NOT EXISTS user_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '积分ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_points INT DEFAULT 0 COMMENT '累计积分',
    available_points INT DEFAULT 0 COMMENT '可用积分',
    frozen_points INT DEFAULT 0 COMMENT '冻结积分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分表';

-- 积分交易记录表
CREATE TABLE IF NOT EXISTS point_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '交易ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('earn', 'spend', 'expire', 'refund') NOT NULL COMMENT '交易类型',
    points INT NOT NULL COMMENT '积分数量',
    balance INT NOT NULL COMMENT '交易后余额',
    source VARCHAR(50) NOT NULL COMMENT '来源',
    description VARCHAR(255) COMMENT '描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分交易记录表';

-- ============================================
-- 6. 会员服务模块 (Membership)
-- ============================================

-- 会员套餐表
CREATE TABLE IF NOT EXISTS membership_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '套餐ID',
    name VARCHAR(50) NOT NULL COMMENT '套餐名称',
    level INT NOT NULL COMMENT '会员等级',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    duration INT NOT NULL COMMENT '有效期（天）',
    benefits JSON COMMENT '权益列表',
    discount_rate DECIMAL(3,2) COMMENT '折扣率',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    INDEX idx_level (level),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员套餐表';

-- 用户会员表
CREATE TABLE IF NOT EXISTS user_memberships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '会员ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    plan_id BIGINT NOT NULL COMMENT '套餐ID',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    auto_renew BOOLEAN DEFAULT FALSE COMMENT '自动续费',
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会员表';

-- ============================================
-- 7. 评价反馈模块 (Reviews)
-- ============================================

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    vehicle_id BIGINT NOT NULL COMMENT '车辆ID',
    rating INT NOT NULL COMMENT '评分（1-5）',
    content TEXT COMMENT '评价内容',
    images JSON COMMENT '图片列表',
    tags JSON COMMENT '标签',
    is_anonymous BOOLEAN DEFAULT FALSE COMMENT '是否匿名',
    status ENUM('published', 'hidden') DEFAULT 'published' COMMENT '状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,

    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- 评价回复表
CREATE TABLE IF NOT EXISTS review_replies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '回复ID',
    review_id BIGINT NOT NULL COMMENT '评价ID',
    user_id BIGINT NOT NULL COMMENT '回复人ID',
    content TEXT NOT NULL COMMENT '回复内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_review_id (review_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价回复表';

-- ============================================
-- 8. 帮助中心模块 (Help)
-- ============================================

-- 帮助分类表
CREATE TABLE IF NOT EXISTS help_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(100) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帮助分类表';

-- 帮助文章表
CREATE TABLE IF NOT EXISTS help_articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (category_id) REFERENCES help_categories(id) ON DELETE CASCADE,

    INDEX idx_category_id (category_id),
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帮助文章表';

-- ============================================
-- 9. 钱包模块 (Wallet)
-- ============================================

-- 用户钱包表
CREATE TABLE IF NOT EXISTS user_wallets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '钱包ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
    frozen_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '冻结余额',
    total_income DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计收入',
    total_expense DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计支出',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户钱包表';

-- 钱包交易记录表
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '交易ID',
    wallet_id BIGINT NOT NULL COMMENT '钱包ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type ENUM('recharge', 'withdraw', 'payment', 'refund', 'income') NOT NULL COMMENT '交易类型',
    amount DECIMAL(10,2) NOT NULL COMMENT '交易金额',
    balance DECIMAL(10,2) NOT NULL COMMENT '交易后余额',
    description VARCHAR(255) COMMENT '交易描述',
    related_order_id BIGINT COMMENT '关联订单ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',

    FOREIGN KEY (wallet_id) REFERENCES user_wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_wallet_id (wallet_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='钱包交易记录表';
