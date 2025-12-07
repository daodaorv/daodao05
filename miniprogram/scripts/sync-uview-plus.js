const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules', 'uview-plus');
const targetRoot = path.join(root, 'uni_modules');
const target = path.join(targetRoot, 'uview-plus');

if (!fs.existsSync(source)) {
	console.warn('[sync-uview-plus] dependency uview-plus was not found in node_modules, skip syncing.');
	process.exit(0);
}

const ensureDir = dir => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

const copyRecursive = (src, dest) => {
	const stats = fs.statSync(src);
	if (stats.isDirectory()) {
		ensureDir(dest);
		const entries = fs.readdirSync(src);
		for (const entry of entries) {
			// 跳过无用文件夹，减小同步体积
			if (entry === 'node_modules' || entry === '.git' || entry === 'demo') continue;
			copyRecursive(path.join(src, entry), path.join(dest, entry));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
};

try {
	ensureDir(targetRoot);
	fs.rmSync(target, { recursive: true, force: true });
	copyRecursive(source, target);
	console.log('[sync-uview-plus] copied uview-plus into uni_modules for easycom resolution.');
} catch (error) {
	console.error('[sync-uview-plus] failed to sync uview-plus:', error);
	process.exit(1);
}
