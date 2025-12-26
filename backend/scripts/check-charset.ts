import mysql from 'mysql2/promise';
import { config } from '../src/config/index';

async function checkCharset() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });

  try {
    // 检查数据库字符集
    const [dbCharset] = await connection.query(
      `SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
       FROM information_schema.SCHEMATA
       WHERE SCHEMA_NAME = ?`,
      [config.db.name]
    );
    console.log('数据库字符集:', dbCharset);

    // 检查users表字符集
    const [tableCharset] = await connection.query(
      `SELECT TABLE_NAME, TABLE_COLLATION
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [config.db.name]
    );
    console.log('users表字符集:', tableCharset);

    // 检查username字段字符集
    const [columnCharset] = await connection.query(
      `SELECT COLUMN_NAME, CHARACTER_SET_NAME, COLLATION_NAME
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'username'`,
      [config.db.name]
    );
    console.log('username字段字符集:', columnCharset);

    // 测试查询中文数据
    const [users] = await connection.query('SELECT id, username FROM users ORDER BY id DESC LIMIT 3');
    console.log('查询结果:', users);
  } finally {
    await connection.end();
  }
}

checkCharset().catch(console.error);
