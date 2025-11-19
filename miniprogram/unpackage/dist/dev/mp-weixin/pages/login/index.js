"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_auth = require("../../api/auth.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const loginType = common_vendor.ref("password");
    const phone = common_vendor.ref("");
    const password = common_vendor.ref("");
    const verificationCode = common_vendor.ref("");
    const showPassword = common_vendor.ref(false);
    const agreedToTerms = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const codeCountdown = common_vendor.ref(0);
    let countdownTimer = null;
    const switchLoginType = (type) => {
      loginType.value = type;
    };
    const sendCode = async () => {
      if (!phone.value) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone.value)) {
        common_vendor.index.showToast({ title: "手机号格式不正确", icon: "none" });
        return;
      }
      try {
        await api_auth.authApi.sendCode({
          phone: phone.value,
          code_type: "login"
        });
        common_vendor.index.showToast({ title: "验证码已发送", icon: "success" });
        codeCountdown.value = 60;
        countdownTimer = setInterval(() => {
          codeCountdown.value--;
          if (codeCountdown.value <= 0) {
            clearInterval(countdownTimer);
          }
        }, 1e3);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "发送失败",
          icon: "none"
        });
      }
    };
    const handleLogin = async () => {
      if (!phone.value) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone.value)) {
        common_vendor.index.showToast({ title: "手机号格式不正确", icon: "none" });
        return;
      }
      if (loginType.value === "password") {
        if (!password.value) {
          common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
          return;
        }
      } else {
        if (!verificationCode.value) {
          common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
          return;
        }
      }
      if (!agreedToTerms.value) {
        common_vendor.index.showToast({ title: "请同意用户协议和隐私政策", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        let result;
        if (loginType.value === "password") {
          result = await api_auth.authApi.login({
            phone: phone.value,
            password: password.value,
            platform: "miniprogram"
          });
        } else {
          result = await api_auth.authApi.loginWithCode({
            phone: phone.value,
            verification_code: verificationCode.value,
            platform: "miniprogram"
          });
        }
        userStore.setToken(result.token);
        userStore.setUserInfo(result.user);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/profile/index" });
        }, 1500);
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const onAgreementChange = (e) => {
      agreedToTerms.value = e.detail.value.length > 0;
    };
    const goToRegister = () => {
      common_vendor.index.showToast({ title: "注册功能开发中", icon: "none" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: loginType.value === "password" ? 1 : "",
        c: common_vendor.o(($event) => switchLoginType("password")),
        d: loginType.value === "code" ? 1 : "",
        e: common_vendor.o(($event) => switchLoginType("code")),
        f: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#999"
        }),
        g: phone.value,
        h: common_vendor.o(($event) => phone.value = $event.detail.value),
        i: loginType.value === "password"
      }, loginType.value === "password" ? {
        j: common_vendor.p({
          type: "locked",
          size: "20",
          color: "#999"
        }),
        k: showPassword.value ? "text" : "password",
        l: password.value,
        m: common_vendor.o(($event) => password.value = $event.detail.value),
        n: common_vendor.o(($event) => showPassword.value = !showPassword.value),
        o: common_vendor.p({
          type: showPassword.value ? "eye-filled" : "eye-slash-filled",
          size: "20",
          color: "#999"
        })
      } : {
        p: common_vendor.p({
          type: "chatbubble",
          size: "20",
          color: "#999"
        }),
        q: verificationCode.value,
        r: common_vendor.o(($event) => verificationCode.value = $event.detail.value),
        s: common_vendor.t(codeCountdown.value > 0 ? `${codeCountdown.value}s` : "获取验证码"),
        t: codeCountdown.value > 0,
        v: common_vendor.o(sendCode)
      }, {
        w: loading.value,
        x: common_vendor.o(handleLogin),
        y: common_vendor.o(goToRegister),
        z: agreedToTerms.value,
        A: common_vendor.o(onAgreementChange)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
