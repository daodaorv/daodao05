import mysql from 'mysql2/promise';
import { config } from '../src/config/index';

async function cleanTestUsers() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    charset: 'utf8mb4',
  });

  try {
    // 删除测试用户
    const [result] = await connection.query(
      'DELETE FROM users WHERE phone LIKE "139001390%"'
    );
    console.log('清理测试用户完成:', result);
  } finally {
    await connection.end();
  }
}

cleanTestUsers().catch(console.error);
