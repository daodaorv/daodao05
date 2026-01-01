-- 创建管理员测试账号
-- 密码: admin123 (已加密)

-- 1. 插入管理员用户
INSERT INTO users (phone, password_hash, username, email, real_name, user_type, status, created_at, updated_at)
VALUES (
  '13900000000',
  '$2b$10$YourHashedPasswordHere',
  'admin',
  'admin@daodao.com',
  '系统管理员',
  'pc_admin',
  'active',
  NOW(),
  NOW()
);

-- 2. 获取刚创建的用户ID (假设为1，实际使用时需要查询)
SET @admin_user_id = LAST_INSERT_ID();

-- 3. 为管理员分配平台管理员角色 (假设角色ID为1)
INSERT INTO user_roles (user_id, role_id, created_at)
VALUES (@admin_user_id, 1, NOW());

-- 查询结果
SELECT * FROM users WHERE phone = '13900000000';
