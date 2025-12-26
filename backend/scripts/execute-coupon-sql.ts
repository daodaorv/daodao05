import { readFileSync } from 'fs';
import { join } from 'path';
import mysql from 'mysql2/promise';

async function executeSqlFile() {
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'daodao_dev',
    password: 'daodao_dev_2024',
    database: 'daodao',
    waitForConnections: true,
    connectionLimit: 10,
  });

  const sqlFilePath = join(__dirname, 'sql', '15-create-coupon-tables.sql');
  const sql = readFileSync(sqlFilePath, 'utf-8');

  const statements = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')
    .split(';')
    .filter(stmt => stmt.trim() !== '');

  let successCount = 0;
  let failCount = 0;

  for (const statement of statements) {
    try {
      await pool.query(statement);
      successCount++;
    } catch (error: any) {
      console.error('执行失败:', error.message);
      failCount++;
    }
  }

  console.log(`执行完成: 成功 ${successCount} 条, 失败 ${failCount} 条`);
  await pool.end();
}

executeSqlFile().catch(console.error);
