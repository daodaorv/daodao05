/**
 * uView Plus 字体本地化修复脚本
 * 用途：每次 npm install 后自动修改 uView Plus 的字体配置为本地路径
 * 使用：node scripts/fix-uview-font.js
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 本地字体路径
  localFontPath: '/static/uicon-iconfont.ttf',
  // 在线字体 URL（用于匹配）
  onlineFontUrl: 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf',
  // 需要修改的文件
  files: [
    {
      path: '../node_modules/uview-plus/libs/config/config.js',
      replacements: [
        {
          search: /iconUrl:\s*['"]https:\/\/at\.alicdn\.com\/t\/font_2225171_8kdcwk4po24\.ttf['"]/,
          replace: `iconUrl: '/static/uicon-iconfont.ttf'`,
          description: '修改 config.js 中的 iconUrl 配置'
        },
        {
          search: /loadFontOnce:\s*false/,
          replace: `loadFontOnce: true`,
          description: '启用 loadFontOnce 配置（关键：确保字体加载）'
        }
      ]
    },
    {
      path: '../node_modules/uview-plus/components/u-icon/u-icon.vue',
      replacements: [
        {
          search: /src:\s*url\(['"]https:\/\/at\.alicdn\.com\/t\/font_2225171_8kdcwk4po24\.ttf['"]\)/,
          replace: `src: url('/static/uicon-iconfont.ttf')`,
          description: '修改 u-icon.vue 中的字体 URL'
        }
      ]
    }
  ]
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 修改文件
function fixFile(fileConfig) {
  const filePath = path.join(__dirname, '..', fileConfig.path);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    log(`❌ 文件不存在: ${fileConfig.path}`, 'red');
    return false;
  }

  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 应用所有替换规则
  fileConfig.replacements.forEach(replacement => {
    if (replacement.search.test(content)) {
      content = content.replace(replacement.search, replacement.replace);
      log(`  ✅ ${replacement.description}`, 'green');
      modified = true;
    } else {
      log(`  ⚠️  未找到匹配内容: ${replacement.description}`, 'yellow');
    }
  });

  // 如果有修改，写回文件
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    log(`✅ 已修改: ${fileConfig.path}`, 'green');
    return true;
  } else {
    log(`ℹ️  无需修改: ${fileConfig.path}`, 'cyan');
    return false;
  }
}

// 主函数
function main() {
  log('\n🔧 开始修复 uView Plus 字体配置...\n', 'cyan');

  let successCount = 0;
  let failCount = 0;

  CONFIG.files.forEach(fileConfig => {
    log(`📝 处理文件: ${fileConfig.path}`, 'cyan');
    const result = fixFile(fileConfig);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log('');
  });

  // 输出总结
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`✅ 成功修改: ${successCount} 个文件`, 'green');
  if (failCount > 0) {
    log(`⚠️  跳过: ${failCount} 个文件`, 'yellow');
  }
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  // 检查字体文件是否存在
  const fontPath = path.join(__dirname, '..', 'static', 'uicon-iconfont.ttf');
  if (fs.existsSync(fontPath)) {
    const stats = fs.statSync(fontPath);
    log(`✅ 本地字体文件存在: static/uicon-iconfont.ttf (${(stats.size / 1024).toFixed(2)} KB)`, 'green');
  } else {
    log('❌ 警告: 本地字体文件不存在！请先下载字体文件到 static/uicon-iconfont.ttf', 'red');
  }

  log('\n✨ 修复完成！请重新编译项目以使更改生效。\n', 'cyan');
}

// 运行
try {
  main();
} catch (error) {
  log(`\n❌ 发生错误: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
}
