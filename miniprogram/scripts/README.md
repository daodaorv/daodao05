# uView Plus 字体本地化修复脚本

## 📋 问题背景

uView Plus 默认使用阿里云 CDN 字体文件：
```
https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf
```

在微信开发者工具中，由于缓存机制问题，可能导致字体加载失败，图标无法正常显示。

## ✅ 解决方案

本脚本自动将 uView Plus 的字体配置修改为本地路径，解决开发环境字体加载失败的问题。

## 🚀 使用方法

### 方法 1：自动执行（推荐）

每次执行 `npm install` 后，脚本会自动运行（通过 `postinstall` 钩子）：

```bash
cd miniprogram
npm install
# 脚本会自动执行，修复字体配置
```

### 方法 2：手动执行

如果需要手动修复字体配置：

```bash
cd miniprogram
npm run fix-font
```

或者直接运行脚本：

```bash
cd miniprogram
node scripts/fix-uview-font.js
```

## 📝 脚本功能

脚本会自动修改以下两个文件：

### 1. `node_modules/uview-plus/libs/config/config.js`

**修改内容**：
```javascript
// 修改前
iconUrl: 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf',

// 修改后
iconUrl: '/static/uicon-iconfont.ttf',
```

**作用**：微信小程序使用 `uni.loadFontFace` API 加载字体，配置在此文件中。

### 2. `node_modules/uview-plus/components/u-icon/u-icon.vue`

**修改内容**：
```scss
// 修改前
src: url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');

// 修改后
src: url('/static/uicon-iconfont.ttf') format('truetype');
```

**作用**：APP、QQ 小程序等其他平台使用 CSS `@font-face` 加载字体。

## 📦 文件结构

```
miniprogram/
├── static/
│   └── uicon-iconfont.ttf          # 本地字体文件 (55KB)
├── scripts/
│   ├── fix-uview-font.js           # 修复脚本
│   └── README.md                   # 本文档
├── package.json                    # 包含 postinstall 钩子
└── node_modules/
    └── uview-plus/
        ├── libs/config/config.js   # 需要修改的配置文件
        └── components/u-icon/u-icon.vue  # 需要修改的组件文件
```

## 🔍 验证修复结果

运行脚本后，你会看到类似的输出：

```
🔧 开始修复 uView Plus 字体配置...

📝 处理文件: node_modules/uview-plus/libs/config/config.js
  ✅ 修改 config.js 中的 iconUrl 配置
✅ 已修改: node_modules/uview-plus/libs/config/config.js

📝 处理文件: node_modules/uview-plus/components/u-icon/u-icon.vue
  ✅ 修改 u-icon.vue 中的字体 URL
✅ 已修改: node_modules/uview-plus/components/u-icon/u-icon.vue

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 成功修改: 2 个文件
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 本地字体文件存在: static/uicon-iconfont.ttf (54.63 KB)

✨ 修复完成！请重新编译项目以使更改生效。
```

## ⚠️ 注意事项

### 1. 字体文件必须存在

确保 `static/uicon-iconfont.ttf` 文件存在。如果不存在，可以从以下地址下载：

```bash
curl -o static/uicon-iconfont.ttf https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf
```

或使用 PowerShell（Windows）：

```powershell
Invoke-WebRequest -Uri 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf' -OutFile 'static/uicon-iconfont.ttf'
```

### 2. 每次 npm install 后自动执行

由于 `package.json` 中配置了 `postinstall` 钩子，每次执行 `npm install` 后脚本会自动运行。

### 3. 真机环境建议

- **开发环境**：使用本地字体（避免加载失败）
- **生产环境**：建议使用 CDN 字体（加载更快）

如果需要在生产环境使用 CDN 字体，可以在发布前手动恢复配置。

### 4. 重新编译项目

修改字体配置后，需要在 HBuilderX 中重新编译项目：

1. 保存所有文件
2. 点击"运行" → "停止运行"
3. 重新点击"运行" → "运行到微信开发者工具"

## 🐛 故障排除

### 问题 1：脚本执行失败

**错误信息**：
```
Error: Cannot find module 'fs'
```

**解决方案**：
确保在 `miniprogram` 目录下执行脚本，而不是项目根目录。

### 问题 2：字体仍然加载失败

**可能原因**：
1. 字体文件不存在或路径错误
2. 未重新编译项目
3. 微信开发者工具缓存问题

**解决方案**：
1. 检查 `static/uicon-iconfont.ttf` 是否存在
2. 在 HBuilderX 中重新编译项目
3. 在微信开发者工具中清除缓存：工具 → 清除缓存 → 全部清除

### 问题 3：图标显示为方框

**可能原因**：
字体文件损坏或格式不正确

**解决方案**：
重新下载字体文件：
```bash
cd miniprogram
rm static/uicon-iconfont.ttf
curl -o static/uicon-iconfont.ttf https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf
npm run fix-font
```

## 📚 相关文档

- [uView Plus 官方文档](https://uview-plus.jiangruyi.com)
- [uni.loadFontFace API 文档](https://uniapp.dcloud.net.cn/api/ui/font.html)
- [微信小程序字体加载文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/font/wx.loadFontFace.html)

## 🔄 更新日志

### v1.0.0 (2025-12-03)
- ✅ 初始版本
- ✅ 支持自动修改 config.js 和 u-icon.vue
- ✅ 支持 postinstall 自动执行
- ✅ 添加彩色输出和详细日志

---

**维护者**: Claude Code
**最后更新**: 2025-12-03
