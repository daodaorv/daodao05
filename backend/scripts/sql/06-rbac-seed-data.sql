-- =====================================================
-- 叨叨房车 RBAC 权限系统初始数据
-- 创建时间: 2025-12-28
-- 说明: 预定义角色、权限和角色权限关联数据
-- =====================================================

USE daodao;

-- =====================================================
-- 第一部分：插入角色数据
-- =====================================================

-- C端角色（type='customer'）
INSERT INTO roles (name, code, type, data_scope, description, status) VALUES
-- 基础用户角色
('普通用户', 'customer_normal', 'customer', 'self', 'C端普通用户，基础租车权限', 'active'),
('PLUS会员', 'customer_plus', 'customer', 'self', 'PLUS会员，享受会员折扣和优先服务', 'active'),
('VIP会员', 'customer_vip', 'customer', 'self', 'VIP高级会员，享受最高折扣和专属服务', 'active'),

-- 托管车主角色
('自有车托管车主', 'host_own_vehicle', 'customer', 'self', '托管自有房车的车主', 'active'),
('购车托管车主', 'host_purchase_vehicle', 'customer', 'self', '购买新车并托管的车主', 'active'),
('众筹托管参与者', 'host_crowdfunding', 'customer', 'self', '参与众筹托管的用户', 'active');

-- B端角色（type='admin'）
INSERT INTO roles (name, code, type, data_scope, description, status) VALUES
-- 平台级角色
('超级管理员', 'admin_super', 'admin', 'all', '拥有所有权限的超级管理员', 'active'),
('平台管理员', 'admin_platform', 'admin', 'all', '平台运营管理员', 'active'),
('区域经理', 'admin_regional', 'admin', 'region', '区域级别管理员', 'active'),
('财务人员', 'admin_finance', 'admin', 'all', '财务数据查看和管理', 'active'),
('客服人员', 'admin_service', 'admin', 'all', '客户服务和订单处理', 'active'),

-- 门店级角色
('门店经理', 'admin_store_manager', 'admin', 'store', '门店全部数据管理', 'active'),
('门店员工', 'admin_store_staff', 'admin', 'store', '门店基础操作', 'active'),
('整备员工', 'admin_preparation', 'admin', 'store', '车辆整备和检查', 'active'),
('司机', 'admin_driver', 'admin', 'self', '车辆接送服务', 'active');

SELECT 'Step 1: 角色数据插入完成' AS message;

-- =====================================================
-- 第二部分：插入C端权限数据
-- =====================================================

INSERT INTO permissions (code, name, resource, action, description) VALUES
-- 订单权限
('order:view', '查看订单', 'order', 'view', '查看自己的订单'),
('order:create', '创建订单', 'order', 'create', '创建租车订单'),
('order:cancel', '取消订单', 'order', 'cancel', '取消自己的订单'),

-- 托管权限
('hosting:view', '查看托管信息', 'hosting', 'view', '查看托管车辆和收益'),
('hosting:apply', '申请托管', 'hosting', 'apply', '提交托管申请'),
('hosting:withdraw', '提现收益', 'hosting', 'withdraw', '申请托管收益提现'),

-- 会员权限
('membership:view', '查看会员信息', 'membership', 'view', '查看会员权益'),
('membership:purchase', '购买会员', 'membership', 'purchase', '购买PLUS会员');

SELECT 'Step 2: C端权限数据插入完成' AS message;

-- =====================================================
-- 第三部分：插入B端权限数据
-- =====================================================

INSERT INTO permissions (code, name, resource, action, description) VALUES
-- 车辆管理权限
('vehicle:view', '查看车辆', 'vehicle', 'view', '查看车辆信息'),
('vehicle:create', '创建车辆', 'vehicle', 'create', '添加新车辆'),
('vehicle:update', '更新车辆', 'vehicle', 'update', '修改车辆信息'),
('vehicle:delete', '删除车辆', 'vehicle', 'delete', '删除车辆'),
('vehicle:dispatch', '调度车辆', 'vehicle', 'dispatch', '车辆调度管理'),

-- 订单管理权限
('order:view_all', '查看所有订单', 'order', 'view_all', '查看所有订单'),
('order:update', '更新订单', 'order', 'update', '修改订单信息'),
('order:refund', '订单退款', 'order', 'refund', '处理订单退款'),

-- 用户管理权限
('user:view', '查看用户', 'user', 'view', '查看用户信息'),
('user:update', '更新用户', 'user', 'update', '修改用户信息'),
('user:disable', '禁用用户', 'user', 'disable', '禁用用户账号'),
('user:assign_role', '分配角色', 'user', 'assign_role', '给用户分配角色'),

-- 财务管理权限
('finance:view', '查看财务', 'finance', 'view', '查看财务数据'),
('finance:export', '导出报表', 'finance', 'export', '导出财务报表'),
('finance:settle', '财务结算', 'finance', 'settle', '处理财务结算');

SELECT 'Step 3: B端权限数据插入完成' AS message;

-- =====================================================
-- 第四部分：C端角色权限关联
-- =====================================================

-- 普通用户权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'customer_normal'),
  id
FROM permissions
WHERE code IN ('order:view', 'order:create', 'order:cancel', 'membership:view', 'membership:purchase');

-- PLUS会员权限（与普通用户相同）
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'customer_plus'),
  id
FROM permissions
WHERE code IN ('order:view', 'order:create', 'order:cancel', 'membership:view', 'membership:purchase');

-- VIP会员权限（与PLUS会员相同）
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'customer_vip'),
  id
FROM permissions
WHERE code IN ('order:view', 'order:create', 'order:cancel', 'membership:view', 'membership:purchase');

-- 自有车托管车主权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'host_own_vehicle'),
  id
FROM permissions
WHERE code IN ('order:view', 'order:create', 'hosting:view', 'hosting:withdraw');

-- 购车托管车主权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'host_purchase_vehicle'),
  id
FROM permissions
WHERE code IN ('order:view', 'order:create', 'hosting:view', 'hosting:withdraw');

-- 众筹托管参与者权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'host_crowdfunding'),
  id
FROM permissions
WHERE code IN ('order:view', 'hosting:view', 'hosting:withdraw');

SELECT 'Step 4: C端角色权限关联完成' AS message;

-- =====================================================
-- 第五部分：B端角色权限关联
-- =====================================================

-- 超级管理员（所有权限）
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_super'),
  id
FROM permissions;

-- 平台管理员权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_platform'),
  id
FROM permissions
WHERE code IN (
  'vehicle:view', 'vehicle:create', 'vehicle:update', 'vehicle:delete', 'vehicle:dispatch',
  'order:view_all', 'order:update', 'order:refund',
  'user:view', 'user:update', 'user:disable', 'user:assign_role'
);

SELECT 'Step 5: B端角色权限关联完成' AS message;

-- 门店经理权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_store_manager'),
  id
FROM permissions
WHERE code IN (
  'vehicle:view', 'vehicle:create', 'vehicle:update', 'vehicle:dispatch',
  'order:view_all', 'order:update', 'order:refund',
  'user:view'
);

-- 门店员工权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_store_staff'),
  id
FROM permissions
WHERE code IN ('vehicle:view', 'order:view_all', 'order:update');

-- 整备员工权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_preparation'),
  id
FROM permissions
WHERE code IN ('vehicle:view', 'vehicle:update');

-- 司机权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_driver'),
  id
FROM permissions
WHERE code IN ('vehicle:view', 'order:view_all');

-- 财务人员权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_finance'),
  id
FROM permissions
WHERE code IN ('finance:view', 'finance:export', 'finance:settle', 'order:view_all');

-- 客服人员权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT
  (SELECT id FROM roles WHERE code = 'admin_service'),
  id
FROM permissions
WHERE code IN ('order:view_all', 'order:update', 'order:refund', 'user:view');

-- =====================================================
-- 完成
-- =====================================================

SELECT '✅ RBAC初始数据插入完成！' AS message;
SELECT CONCAT('角色数量: ', COUNT(*)) AS roles_count FROM roles;
SELECT CONCAT('权限数量: ', COUNT(*)) AS permissions_count FROM permissions;
SELECT CONCAT('角色权限关联数量: ', COUNT(*)) AS role_permissions_count FROM role_permissions;
