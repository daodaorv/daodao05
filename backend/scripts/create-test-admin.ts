import { createConnection } from 'mysql2/promise';
import { hashPassword } from '../src/utils/bcrypt';
import { config } from '../src/config';

/**
 * 创建测试管理员账号 13800138000 / 123456
 */
async function createTestAdmin() {
  const connection = await createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  try {
    console.log('开始创建测试管理员账号...');

    // 1. 检查账号是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT id, user_type, status FROM users WHERE phone = ?',
      ['13800138000']
    );

    let adminUserId: number;

    if ((existingUsers as any[]).length > 0) {
      const existingUser = (existingUsers as any[])[0];
      adminUserId = existingUser.id;
      console.log(`账号已存在，ID: ${adminUserId}`);

      // 更新用户类型和状态
      await connection.execute(
        'UPDATE users SET user_type = ?, status = ?, password_hash = ?, updated_at = NOW() WHERE id = ?',
        ['admin', 'active', await hashPassword('123456'), adminUserId]
      );
      console.log('已更新用户类型为 admin 和密码');
    } else {
      // 2. 生成密码哈希
      const passwordHash = await hashPassword('123456');

      // 3. 插入管理员用户
      const [result] = await connection.execute(
        `INSERT INTO users (phone, password_hash, username, email, real_name, user_type, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        ['13800138000', passwordHash, 'admin', 'admin@daodao.com', '系统管理员', 'admin', 'active']
      );

      adminUserId = (result as any).insertId;
      console.log(`管理员用户创建成功，ID: ${adminUserId}`);
    }

    // 4. 查找超级管理员角色
    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE code = 'admin_super' LIMIT 1"
    );

    if ((roles as any[]).length === 0) {
      console.log('警告: 未找到超级管理员角色 (admin_super)');
      console.log('尝试查找其他管理员角色...');

      // 尝试查找其他管理员角色
      const [altRoles] = await connection.execute(
        "SELECT id, code FROM roles WHERE code LIKE 'admin%' ORDER BY id LIMIT 1"
      );

      if ((altRoles as any[]).length === 0) {
        console.log('错误: 未找到任何管理员角色，请先执行 RBAC 初始化脚本');
        return;
      }

      const roleId = (altRoles as any[])[0].id;
      const roleCode = (altRoles as any[])[0].code;
      console.log(`使用角色: ${roleCode} (ID: ${roleId})`);

      // 检查是否已分配角色
      const [existingRoles] = await connection.execute(
        'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
        [adminUserId, roleId]
      );

      if ((existingRoles as any[]).length === 0) {
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [adminUserId, roleId]
        );
        console.log('管理员角色分配成功');
      } else {
        console.log('角色已分配，跳过');
      }
    } else {
      const roleId = (roles as any[])[0].id;

      // 检查是否已分配角色
      const [existingRoles] = await connection.execute(
        'SELECT id FROM user_roles WHERE user_id = ? AND role_id = ?',
        [adminUserId, roleId]
      );

      if ((existingRoles as any[]).length === 0) {
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [adminUserId, roleId]
        );
        console.log('超级管理员角色分配成功');
      } else {
        console.log('角色已分配，跳过');
      }
    }

    // 5. 查询最终结果
    const [finalUser] = await connection.execute(
      `SELECT u.id, u.phone, u.username, u.user_type, u.status,
              GROUP_CONCAT(r.code) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.phone = ?
       GROUP BY u.id`,
      ['13800138000']
    );

    console.log('\n✅ 测试管理员账号信息:');
    console.log('手机号: 13800138000');
    console.log('密码: 123456');
    console.log('详细信息:', (finalUser as any[])[0]);
  } catch (error) {
    console.error('创建测试管理员账号失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createTestAdmin()
  .then(() => {
    console.log('\n脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
