/**
 * Console自动清理脚本
 * 自动将console.log/error/warn/info替换为logger调用
 * 并自动添加logger导入语句
 */

const fs = require('fs');
const path = require('path');

// 配置
const config = {
	// 需要处理的文件模式（相对于miniprogram目录）
	patterns: [
		'pages/**/*.vue',
		'pages/**/*.ts',
		'pages/**/*.js'
	],
	// 排除的文件
	excludes: [
		'utils/logger.ts',
		'scripts/**/*',
		'node_modules/**/*'
	],
	// 项目根目录
	rootDir: path.join(__dirname, '..')
};

// 替换规则
const replacements = [
	{
		// console.log → logger.debug
		pattern: /console\.log\(/g,
		replacement: 'logger.debug('
	},
	{
		// console.error → logger.error
		pattern: /console\.error\(/g,
		replacement: 'logger.error('
	},
	{
		// console.warn → logger.warn
		pattern: /console\.warn\(/g,
		replacement: 'logger.warn('
	},
	{
		// console.info → logger.info
		pattern: /console\.info\(/g,
		replacement: 'logger.info('
	}
];

/**
 * 检查文件是否需要添加logger导入
 */
function needsLoggerImport(content) {
	return content.includes('logger.') && !content.includes("from '@/utils/logger'") && !content.includes('from "@/utils/logger"');
}

/**
 * 为.vue文件添加logger导入
 */
function addLoggerImportToVue(content) {
	// 查找<script>或<script setup>标签
	const scriptMatch = content.match(/(<script[^>]*>)/);
	if (scriptMatch) {
		const scriptTag = scriptMatch[1];
		const insertPos = content.indexOf(scriptTag) + scriptTag.length;

		// 检查是否已有import语句
		const afterScript = content.substring(insertPos);
		const firstImportMatch = afterScript.match(/\nimport\s/);

		if (firstImportMatch) {
			// 在第一个import之前插入
			const firstImportPos = insertPos + firstImportMatch.index;
			return content.substring(0, firstImportPos) +
				"\nimport { logger } from '@/utils/logger';" +
				content.substring(firstImportPos);
		} else {
			// 没有import语句，直接在script标签后插入
			return content.substring(0, insertPos) +
				"\nimport { logger } from '@/utils/logger';\n" +
				content.substring(insertPos);
		}
	}
	return content;
}

/**
 * 为.ts/.js文件添加logger导入
 */
function addLoggerImportToScript(content) {
	// 查找第一个import语句
	const firstImportMatch = content.match(/^import\s/m);

	if (firstImportMatch) {
		// 在第一个import之前插入
		const insertPos = firstImportMatch.index;
		return content.substring(0, insertPos) +
			"import { logger } from '@/utils/logger';\n" +
			content.substring(insertPos);
	} else {
		// 没有import语句，在文件开头插入
		return "import { logger } from '@/utils/logger';\n\n" + content;
	}
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		let modified = false;
		let replacementCount = 0;

		// 应用所有替换规则
		replacements.forEach(({ pattern, replacement }) => {
			const matches = content.match(pattern);
			if (matches) {
				content = content.replace(pattern, replacement);
				modified = true;
				replacementCount += matches.length;
			}
		});

		// 如果修改了内容且需要添加import
		if (modified && needsLoggerImport(content)) {
			const ext = path.extname(filePath);
			if (ext === '.vue') {
				content = addLoggerImportToVue(content);
			} else if (ext === '.ts' || ext === '.js') {
				content = addLoggerImportToScript(content);
			}
		}

		// 写回文件
		if (modified) {
			fs.writeFileSync(filePath, content, 'utf8');
			return { modified: true, count: replacementCount };
		}

		return { modified: false, count: 0 };
	} catch (error) {
		console.error(`处理文件失败: ${filePath}`, error.message);
		return { modified: false, count: 0, error: error.message };
	}
}

/**
 * 递归查找匹配的文件
 */
function findFiles(dir, pattern) {
	const files = [];

	function walk(currentDir) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name);
			const relativePath = path.relative(config.rootDir, fullPath).replace(/\\/g, '/');

			// 检查是否在排除列表中
			const isExcluded = config.excludes.some(exclude => {
				if (exclude.includes('**')) {
					const regex = new RegExp(exclude.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
					return regex.test(relativePath);
				}
				return relativePath.includes(exclude);
			});

			if (isExcluded) continue;

			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (entry.isFile()) {
				// 检查文件是否匹配模式
				const ext = path.extname(entry.name);
				if (pattern.includes('**/*.vue') && ext === '.vue') {
					files.push(fullPath);
				} else if (pattern.includes('**/*.ts') && ext === '.ts') {
					files.push(fullPath);
				} else if (pattern.includes('**/*.js') && ext === '.js') {
					files.push(fullPath);
				}
			}
		}
	}

	walk(dir);
	return files;
}

/**
 * 主函数
 */
function main() {
	console.log('='.repeat(60));
	console.log('Console自动清理脚本');
	console.log('='.repeat(60));
	console.log('');

	let totalFiles = 0;
	let modifiedFiles = 0;
	let totalReplacements = 0;
	const modifiedFilesList = [];
	const errorFiles = [];

	// 处理每个模式
	config.patterns.forEach(pattern => {
		const dir = path.join(config.rootDir, pattern.split('/')[0]);
		if (!fs.existsSync(dir)) {
			console.log(`⚠️  目录不存在: ${dir}`);
			return;
		}

		const files = findFiles(dir, pattern);
		console.log(`📁 扫描 ${pattern}: 找到 ${files.length} 个文件`);

		files.forEach(file => {
			totalFiles++;
			const result = processFile(file);

			if (result.error) {
				errorFiles.push({ file, error: result.error });
			} else if (result.modified) {
				modifiedFiles++;
				totalReplacements += result.count;
				const relativePath = path.relative(config.rootDir, file).replace(/\\/g, '/');
				modifiedFilesList.push({ path: relativePath, count: result.count });
			}
		});
	});

	// 输出结果
	console.log('');
	console.log('='.repeat(60));
	console.log('处理完成');
	console.log('='.repeat(60));
	console.log(`📊 总文件数: ${totalFiles}`);
	console.log(`✅ 修改文件数: ${modifiedFiles}`);
	console.log(`🔄 替换console数: ${totalReplacements}`);
	console.log('');

	if (modifiedFilesList.length > 0) {
		console.log('📝 修改的文件列表:');
		modifiedFilesList.forEach(({ path, count }) => {
			console.log(`   ✅ ${path} (${count}处)`);
		});
		console.log('');
	}

	if (errorFiles.length > 0) {
		console.log('❌ 处理失败的文件:');
		errorFiles.forEach(({ file, error }) => {
			const relativePath = path.relative(config.rootDir, file).replace(/\\/g, '/');
			console.log(`   ❌ ${relativePath}: ${error}`);
		});
		console.log('');
	}

	console.log('='.repeat(60));
	console.log('✨ 清理完成！请手动检查修改的文件');
	console.log('='.repeat(60));
}

// 运行脚本
main();
