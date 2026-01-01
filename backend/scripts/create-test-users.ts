import { createConnection } from 'mysql2/promise';
import { hashPassword } from '../src/utils/bcrypt';
import { config } from '../src/config';

/**
 * 创建测试用户数据
 */
async function createTestUsers() {
  const connection = await createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  try {
    console.log('开始创建测试用户...');

    // 测试用户数据
    const testUsers = [
      {
        phone: '13800000001',
        username: '张三',
        email: 'zhangsan@example.com',
        real_name: '张三',
      },
      {
        phone: '13800000002',
        username: '李四',
        email: 'lisi@example.com',
        real_name: '李四',
      },
      {
        phone: '13800000003',
        username: '王五',
        email: 'wangwu@example.com',
        real_name: '王五',
      },
      {
        phone: '13800000004',
        username: '赵六',
        email: 'zhaoliu@example.com',
        real_name: '赵六',
      },
      {
        phone: '13800000005',
        username: '钱七',
        email: 'qianqi@example.com',
        real_name: '钱七',
      },
    ];

    const passwordHash = await hashPassword('123456');

    for (const userData of testUsers) {
      // 检查用户是否已存在
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE phone = ?',
        [userData.phone]
      );

      if ((existingUsers as any[]).length > 0) {
        console.log(`用户 ${userData.phone} 已存在，跳过`);
        continue;
      }

      // 插入用户
      await connection.execute(
        `INSERT INTO users (phone, password_hash, username, email, real_name, user_type, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userData.phone,
          passwordHash,
          userData.username,
          userData.email,
          userData.real_name,
          'customer',
          'active',
        ]
      );

      console.log(`✅ 创建用户: ${userData.username} (${userData.phone})`);
    }

    // 查询创建结果
    const [users] = await connection.execute(
      "SELECT id, phone, username, user_type, status FROM users WHERE user_type = 'customer' ORDER BY id DESC LIMIT 5"
    );

    console.log('\n✅ 测试用户创建完成！');
    console.log('用户列表:');
    console.table(users);
    console.log('\n默认密码: 123456');
  } catch (error) {
    console.error('创建测试用户失败:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

createTestUsers()
  .then(() => {
    console.log('\n脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });
