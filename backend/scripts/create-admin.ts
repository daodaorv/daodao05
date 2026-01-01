import { createConnection } from 'mysql2/promise';
import { hashPassword } from '../src/utils/bcrypt';
import { config } from '../src/config';

/**
 * 创建管理员账号脚本
 */
async function createAdminUser() {
  const connection = await createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  try {
    console.log('开始创建管理员账号...');

    // 1. 检查管理员是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE phone = ?',
      ['13800138000']
    );

    if ((existingUsers as any[]).length > 0) {
      console.log('管理员账号已存在，跳过创建');
      return;
    }

    // 2. 生成密码哈希
    const passwordHash = await hashPassword('123456');

    // 3. 插入管理员用户
    const [result] = await connection.execute(
      `INSERT INTO users (phone, password_hash, username, email, real_name, user_type, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['13800138000', passwordHash, 'admin', 'admin@daodao.com', '系统管理员', 'pc_admin', 'active']
    );

    const adminUserId = (result as any).insertId;
    console.log(`管理员用户创建成功，ID: ${adminUserId}`);

    // 4. 查找平台管理员角色
    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE code = 'admin_super' LIMIT 1"
    );

    if ((roles as any[]).length === 0) {
      console.log('警告: 未找到超级管理员角色，请先创建角色');
      return;
    }

    const roleId = (roles as any[])[0].id;

    // 5. 分配角色
    await connection.execute(
      'INSERT INTO user_roles (user_id, role_id, created_at) VALUES (?, ?, NOW())',
      [adminUserId, roleId]
    );

    console.log('管理员角色分配成功');
    console.log('\n管理员账号信息:');
    console.log('手机号: 13800138000');
    console.log('密码: 123456');
    console.log('用户类型: pc_admin');
  } catch (error) {
    console.error('创建管理员账号失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createAdminUser()
  .then(() => {
    console.log('\n脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
