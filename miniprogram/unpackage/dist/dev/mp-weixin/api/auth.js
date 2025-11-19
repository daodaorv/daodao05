"use strict";
const utils_request = require("../utils/request.js");
const authApi = {
  // 发送验证码
  sendCode(data) {
    return utils_request.request.post("/auth/send-code", data);
  },
  // 用户注册
  register(data) {
    return utils_request.request.post("/auth/register", data);
  },
  // 密码登录
  login(data) {
    return utils_request.request.post("/auth/login", data);
  },
  // 验证码登录
  loginWithCode(data) {
    return utils_request.request.post("/auth/login-with-code", data);
  },
  // 获取用户信息
  getUserInfo() {
    return utils_request.request.get("/users/profile");
  },
  // 更新用户信息
  updateUserInfo(data) {
    return utils_request.request.put("/users/profile", data);
  },
  // 获取登录日志
  getLoginLogs(params) {
    return utils_request.request.get("/users/login-logs", params);
  }
};
exports.authApi = authApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/auth.js.map
