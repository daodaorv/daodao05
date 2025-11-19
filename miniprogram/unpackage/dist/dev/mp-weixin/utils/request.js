"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:3000/api/v1";
class Request {
  constructor() {
    this.baseURL = BASE_URL;
    this.timeout = 1e4;
  }
  request(options) {
    return new Promise((resolve, reject) => {
      const { url, method = "GET", data = {}, header = {} } = options;
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }
      common_vendor.index.request({
        url: this.baseURL + url,
        method,
        data,
        header: {
          "Content-Type": "application/json",
          ...header
        },
        timeout: this.timeout,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              const error = new Error(res.data.message || "请求失败");
              error.code = res.data.code;
              reject(error);
            }
          } else if (res.statusCode === 401) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.showToast({
              title: "请先登录",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.navigateTo({
                url: "/pages/login/index"
              });
            }, 1500);
            reject(new Error("未授权"));
          } else {
            reject(new Error(res.data.message || `请求失败 (${res.statusCode})`));
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at utils/request.js:60", "Request failed:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
          reject(new Error("网络请求失败"));
        }
      });
    });
  }
  get(url, data, header) {
    return this.request({ url, method: "GET", data, header });
  }
  post(url, data, header) {
    return this.request({ url, method: "POST", data, header });
  }
  put(url, data, header) {
    return this.request({ url, method: "PUT", data, header });
  }
  delete(url, data, header) {
    return this.request({ url, method: "DELETE", data, header });
  }
}
const request = new Request();
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
