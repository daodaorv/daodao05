import mysql from 'mysql2/promise';
import { config } from '../src/config/index';

async function getUserInfo() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    charset: 'utf8mb4',
  });

  try {
    const [users] = await connection.query(
      'SELECT id, phone, username FROM users WHERE id IN (1, 2) ORDER BY id'
    );
    console.log('用户信息:', users);
  } finally {
    await connection.end();
  }
}

getUserInfo().catch(console.error);
