import { readFileSync } from 'fs';
import { join } from 'path';
import mysql from 'mysql2/promise';

async function executeSqlFile() {
  // 创建数据库连接
  const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'daodao_dev',
    password: 'daodao_dev_2024',
    database: 'daodao',
    waitForConnections: true,
    connectionLimit: 10,
  });

  const sqlFilePath = join(__dirname, 'sql', 'p3-advanced-features.sql');
  const sql = readFileSync(sqlFilePath, 'utf-8');

  // 分割 SQL 语句（按分号分割，但忽略注释中的分号）
  const statements = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('USE'));

  console.log(`准备执行 ${statements.length} 条 SQL 语句...`);

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      await pool.query(statement);
      successCount++;

      // 提取表名用于日志
      const match = statement.match(/CREATE TABLE.*?`?(\w+)`?\s*\(/i);
      if (match) {
        console.log(`✅ 创建表: ${match[1]}`);
      }
    } catch (error: any) {
      errorCount++;
      console.error(`❌ 执行失败:`, error.message);
      console.error(`SQL: ${statement.substring(0, 100)}...`);
    }
  }

  console.log(`\n执行完成: 成功 ${successCount} 条, 失败 ${errorCount} 条`);

  await pool.end();
  process.exit(errorCount > 0 ? 1 : 0);
}

executeSqlFile().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
});
