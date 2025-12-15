# uView Plus 配置检查清单

## ✅ 已完成的配置

### 1. 依赖安装
- [x] `uview-plus@3.6.18` 已安装
- [x] `sass@1.63.2` 已安装
- [x] `sass-loader@10.4.1` 已安装
- [x] `clipboard@2.0.11` 已安装
- [x] `dayjs@1.11.10` 已安装

### 2. main.js 配置
```javascript
// #ifdef VUE3
import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uviewPlus)  // ✅ 已配置
  return {
    app
  }
}
// #endif
```

### 3. uni.scss 配置
```scss
/* 导入 uView Plus 主题文件（包含所有变量和 mixin） */
@import 'uview-plus/theme.scss';  // ✅ 已配置

/* uView Plus 主题色配置 - 映射到叨叨房车主题色 */
$u-primary: #FF9F29;
$u-success: #4CAF50;
// ... 其他颜色变量 ✅ 已配置
```

### 4. App.vue 配置
```scss
<style lang="scss">
  /* 按照 uview-plus 官方文档要求，第一行导入 uview-plus 样式 */
  @import "uview-plus/index.scss";  // ✅ 已配置
  // ... 其他样式
</style>
```

### 5. pages.json 配置
```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u--(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^up-(.*)": "uview-plus/components/u-$1/u-$1.vue",
      "^u-([^-].*)": "uview-plus/components/u-$1/u-$1.vue"
    }
  }
}
```
✅ 已配置（使用官方推荐的三个规则）

### 6. manifest.json 配置
```json
{
  "mp-weixin": {
    "mergeVirtualHostAttributes": true  // ✅ 已配置
  }
}
```

### 7. 字体文件本地化配置 ✅ 已完成
**问题**: uView Plus 默认使用阿里云 CDN 字体，开发环境可能加载失败

**解决方案**:
1. ✅ 已下载字体到本地：`miniprogram/static/uicon-iconfont.ttf` (55KB)

2. ✅ **关键修改 1**：修改 `node_modules/uview-plus/libs/config/config.js:42`
   ```javascript
   // 原始配置（在线字体）
   iconUrl: 'https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf',

   // 修改后（本地字体）
   iconUrl: '/static/uicon-iconfont.ttf',
   ```

   **说明**: 微信小程序使用 `uni.loadFontFace` API 加载字体，配置在 config.js 中

3. ✅ **关键修改 2（最重要）**：修改 `node_modules/uview-plus/libs/config/config.js:57`
   ```javascript
   // 原始配置（默认不加载）
   loadFontOnce: false,

   // 修改后（启用字体加载）
   loadFontOnce: true,
   ```

   **说明**:
   - 🔥 **这是最关键的配置！** 根据 uView Plus 官方文档，默认不再自动加载字体
   - 必须设置 `loadFontOnce: true` 才能启用字体加载
   - 这就是图标显示为文字的根本原因

4. ✅ 已修改 `node_modules/uview-plus/components/u-icon/u-icon.vue:169`（用于其他平台）
   ```scss
   // 原始配置（在线字体）
   src: url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');

   // 修改后（本地字体）
   src: url('/static/uicon-iconfont.ttf') format('truetype');
   ```

   **说明**: 此修改用于 APP、QQ 小程序等其他平台

**⚠️ 重要提示**:
- 每次执行 `npm install` 后需要重新修改以下配置：
  1. `node_modules/uview-plus/libs/config/config.js` (第 42 行 - iconUrl)
  2. `node_modules/uview-plus/libs/config/config.js` (第 57 行 - loadFontOnce) 🔥 **最关键**
  3. `node_modules/uview-plus/components/u-icon/u-icon.vue` (第 169 行)
- ✅ 已创建自动化脚本：`npm run fix-font` 或 `npm install` 自动执行
- 真机环境建议使用在线字体（CDN 更快）

**📚 官方文档参考**:
- [uView Plus Icon 组件文档](https://uview-plus.jiangruyi.com/components/icon.html)
- 官方说明：微信开发者工具中的字体加载失败提示可以忽略（微信已知问题）

## 🔍 已解决的问题

### 问题 1: 字体加载失败 ✅ 已解决
**错误信息**:
```
Failed to load font https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf
net::ERR_CACHE_MISS
```

**原因**:
- uView Plus 默认使用阿里云 CDN 字体
- 微信开发者工具缓存机制导致加载失败

**解决方案**:
- ✅ 已下载字体到本地并修改配置（见上方第 7 点）

### 问题 2: WebSocket 错误 ⚠️ 可忽略
**错误信息**:
```
closeSocket:fail Failed to execute 'close' on 'WebSocket':
The code must be either 1000, or between 3000 and 4999. 1006 is neither.
```

**原因**:
- 微信开发者工具的已知问题
- 错误码 1006 是浏览器内部状态码

**影响**:
- 仅在开发环境出现
- 不影响实际功能
- 真机运行正常

**处理**: 无需修复，可以忽略此警告

### 问题 3: 组件路径解析错误（历史问题）
**错误信息**:
```
Component is not found in path "node-modules/uview-plus/components/u-icon/u-icon"
```

**问题分析**:
- HBuilderX 将 `node_modules` 转换为 `node-modules`（带连字符）
- 但实际文件系统中是 `node_modules`（带下划线）
- 这是 HBuilderX 的路径解析问题

**解决方案**: 已通过正确配置 easycom 规则解决

## 🛠️ 解决步骤

### 步骤 1: 完全重启 HBuilderX（必须）
1. 保存所有文件
2. **完全关闭** HBuilderX（不是最小化）
3. 重新打开 HBuilderX
4. 重新打开项目

**原因**: 修改 easycom 规则后，HBuilderX 必须重启才能重新解析配置

### 步骤 2: 清理编译缓存
如果步骤 1 后仍有问题：

1. 在 HBuilderX 中，点击菜单：**运行** → **清理编译缓存**
2. 或手动删除 `miniprogram/unpackage` 目录
3. 重新编译项目

### 步骤 3: 验证 node_modules 目录
确认以下文件存在：
```
miniprogram/node_modules/uview-plus/components/u-icon/u-icon.vue
miniprogram/node_modules/uview-plus/components/u-button/u-button.vue
miniprogram/node_modules/uview-plus/components/u-popup/u-popup.vue
```

### 步骤 4: 检查 HBuilderX 版本
确保 HBuilderX 版本 >= 3.1.0（支持 Vue 3）

当前项目使用 Vue 3，需要较新版本的 HBuilderX

## 📝 备选方案

如果上述步骤都无法解决，可以尝试：

### 方案 A: 使用 uni_modules 安装方式
1. 卸载 npm 版本：`npm uninstall uview-plus`
2. 通过 uni-app 插件市场安装 uview-plus
3. 组件会自动安装到 `uni_modules` 目录
4. easycom 配置改为：
   ```json
   {
     "^u-(.*)": "@/uni_modules/uview-plus/components/u-$1/u-$1.vue"
   }
   ```

### 方案 B: 手动复制组件
1. 创建 `miniprogram/uni_modules/uview-plus` 目录
2. 将 `node_modules/uview-plus` 的内容复制到 `uni_modules/uview-plus`
3. 使用方案 A 的 easycom 配置

## ✅ 验证成功标志

编译成功后，应该看到：
- ✅ 没有 "Component is not found" 错误
- ✅ 页面能正常显示 uView Plus 组件
- ✅ 组件样式正常

## 📚 参考文档

- [uView Plus 官方文档](https://uview-plus.jiangruyi.com)
- [uView Plus NPM 安装指南](https://uview-plus.jiangruyi.com/components/npmSetting.html)
- [uni-app easycom 文档](https://uniapp.dcloud.net.cn/collocation/pages.html#easycom)

---

**最后更新**: 2025-12-03
**维护者**: Claude Code
