# 🚨 安全问题修复指南

**严重性**: 🔴 高危
**问题**: 微信 API App ID 泄露到 Git 历史记录中
**影响**: 3 个微信小程序 App ID 公开暴露

---

## 📋 问题详情

GitHub Secret Scanning 检测到以下泄露：

1. **Tencent WeChat API App ID**: `wx123456789abcdef`
   - 位置: `admin-console/.../sections/ActionSection.vue:135`
   - 提交: 早期历史提交

2. **Tencent WeChat API App ID**: `wx545d8668853b84a8`
   - 位置: `miniprogram/.../mp-weixin/project.config.json:16`
   - 提交: `273bec31` 及更早

3. **Tencent WeChat API App ID**: `wx22adb9162e896132`
   - 位置: `mobile-admin/.../mp-weixin/project.config.json:16`
   - 提交: `273bec31` 及更早

---

## 🔧 立即修复步骤

### 步骤 1: 添加 .gitignore 文件（已完成 ✅）

已为以下项目创建 `.gitignore` 文件：
- ✅ `miniprogram/.gitignore`
- ✅ `mobile-admin/.gitignore`

这将防止未来再次提交构建输出目录。

### 步骤 2: 从 Git 历史中彻底删除敏感文件

**⚠️ 警告**: 这将重写 Git 历史，需要强制推送！

#### 方法 1: 使用 git filter-repo（推荐）

```bash
# 安装 git-filter-repo
pip install git-filter-repo

# 删除所有 unpackage 目录
git filter-repo --path miniprogram/unpackage --invert-paths
git filter-repo --path mobile-admin/unpackage --invert-paths

# 强制推送到远程仓库
git push origin --force --all
git push origin --force --tags
```

#### 方法 2: 使用 BFG Repo-Cleaner（更快）

```bash
# 下载 BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 删除包含敏感信息的文件
java -jar bfg.jar --delete-folders unpackage

# 清理和推送
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

#### 方法 3: 使用 git filter-branch（传统方法）

```bash
# 删除 miniprogram/unpackage
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch miniprogram/unpackage" \
  --prune-empty --tag-name-filter cat -- --all

# 删除 mobile-admin/unpackage
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch mobile-admin/unpackage" \
  --prune-empty --tag-name-filter cat -- --all

# 清理和推送
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
git push origin --force --tags
```

### 步骤 3: 撤销并重新生成泄露的密钥

**🔴 关键步骤**: 必须立即执行！

1. **登录微信公众平台**:
   - 小程序 1: https://mp.weixin.qq.com/
   - 小程序 2: https://mp.weixin.qq.com/
   - 小程序 3: https://mp.weixin.qq.com/

2. **重置 App ID 和 App Secret**:
   - 进入"开发" → "开发管理" → "开发设置"
   - 重置 App Secret（App ID 无法更改，但需要重置 Secret）
   - 记录新的 App Secret

3. **更新项目配置**:
   - 使用环境变量存储新的密钥
   - 不要直接写入代码文件
   - 使用 `.env` 文件（已加入 .gitignore）

### 步骤 4: 使用环境变量管理敏感信息

#### 创建 .env 文件（不提交到 Git）

**miniprogram/.env**:
```env
# 微信小程序配置
VITE_WECHAT_APP_ID=wx_your_new_app_id_here
VITE_WECHAT_APP_SECRET=your_new_app_secret_here
```

**mobile-admin/.env**:
```env
# 移动管理端配置
VITE_WECHAT_APP_ID=wx_your_new_app_id_here
VITE_WECHAT_APP_SECRET=your_new_app_secret_here
```

#### 更新代码以使用环境变量

**project.config.json**:
```json
{
  "appid": "{{VITE_WECHAT_APP_ID}}",
  "projectname": "项目名称"
}
```

**在代码中使用**:
```javascript
const appId = import.meta.env.VITE_WECHAT_APP_ID;
const appSecret = import.meta.env.VITE_WECHAT_APP_SECRET;
```

### 步骤 5: 通知 GitHub 关闭 Secret Scanning Alerts

完成上述步骤后：

1. 访问: https://github.com/daodaorv/daodao05/security/secret-scanning
2. 对每个 Alert 点击 "Close as" → "Revoked"
3. 添加说明: "密钥已重置，敏感文件已从 Git 历史中删除"

---

## 📚 预防措施

### 1. 更新所有项目的 .gitignore

确保以下目录/文件被忽略：

```gitignore
# 构建输出
unpackage/
dist/
build/

# 环境变量
.env
.env.local
.env.*.local

# 配置文件（如果包含敏感信息）
**/project.config.json
```

### 2. 使用 Git Hooks 防止提交敏感信息

在 `.husky/pre-commit` 中添加检查：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 检查是否包含敏感信息
if git diff --cached --name-only | grep -E "(\.env$|project\.config\.json$)"; then
  echo "❌ 警告: 尝试提交敏感配置文件！"
  echo "请确认这些文件不包含敏感信息。"
  exit 1
fi
```

### 3. 使用 git-secrets 工具

```bash
# 安装 git-secrets
brew install git-secrets  # macOS
# 或从 https://github.com/awslabs/git-secrets 安装

# 配置
git secrets --install
git secrets --register-aws
git secrets --add 'wx[a-z0-9]{16}'  # 微信 App ID 模式
```

### 4. 定期审查 GitHub Security Alerts

- 启用 Dependabot alerts
- 启用 Secret scanning
- 启用 Code scanning
- 定期查看 Security 标签页

---

## ✅ 验证清单

完成修复后，请确认：

- [ ] 已从 Git 历史中删除所有敏感文件
- [ ] 已重置所有泄露的微信 App ID/Secret
- [ ] 已更新代码使用环境变量
- [ ] 已创建 .env.example 模板文件
- [ ] 已更新 .gitignore 文件
- [ ] 已强制推送到远程仓库
- [ ] 已关闭 GitHub Secret Scanning Alerts
- [ ] 已通知团队成员更新本地仓库
- [ ] 已配置 Git Hooks 防止未来泄露
- [ ] 已更新项目文档说明环境变量配置

---

## 🚨 紧急联系

如果发现密钥已被滥用：

1. **立即禁用**所有泄露的 App ID
2. **联系微信客服**报告安全事件
3. **审查访问日志**检查是否有异常访问
4. **通知团队**和相关负责人

---

## 📖 相关文档

- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [微信公众平台 - 安全中心](https://mp.weixin.qq.com/)

---

**创建时间**: 2025-12-15
**创建者**: Claude Code
**优先级**: 🔴 紧急

⚠️ **重要**: 这是一个严重的安全问题，必须立即处理！
