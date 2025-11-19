"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const isLoggedIn = common_vendor.ref(false);
    const userInfo = common_vendor.ref({});
    common_vendor.onMounted(() => {
      checkLoginStatus();
    });
    const checkLoginStatus = () => {
      isLoggedIn.value = userStore.isLoggedIn;
      if (isLoggedIn.value) {
        userInfo.value = userStore.userInfo;
      }
    };
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/index"
      });
    };
    const handleMenuClick = (type) => {
      if (!isLoggedIn.value) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          goToLogin();
        }, 1500);
        return;
      }
      common_vendor.index.showToast({
        title: `${type} 功能开发中`,
        icon: "none"
      });
    };
    const handleLogout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
            isLoggedIn.value = false;
            userInfo.value = {};
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLoggedIn.value
      }, isLoggedIn.value ? {
        b: userInfo.value.avatar_url || "/static/default-avatar.png",
        c: common_vendor.t(userInfo.value.username || userInfo.value.phone),
        d: common_vendor.t(userInfo.value.phone)
      } : {
        e: common_assets._imports_0$1,
        f: common_vendor.p({
          type: "right",
          size: "20",
          color: "#999"
        }),
        g: common_vendor.o(goToLogin)
      }, {
        h: common_vendor.p({
          type: "list",
          size: "22",
          color: "#3cc51f"
        }),
        i: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        j: common_vendor.o(($event) => handleMenuClick("orders")),
        k: common_vendor.p({
          type: "heart",
          size: "22",
          color: "#3cc51f"
        }),
        l: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        m: common_vendor.o(($event) => handleMenuClick("favorites")),
        n: common_vendor.p({
          type: "gift",
          size: "22",
          color: "#3cc51f"
        }),
        o: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        p: common_vendor.o(($event) => handleMenuClick("coupons")),
        q: common_vendor.p({
          type: "gear",
          size: "22",
          color: "#3cc51f"
        }),
        r: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        s: common_vendor.o(($event) => handleMenuClick("settings")),
        t: common_vendor.p({
          type: "help",
          size: "22",
          color: "#3cc51f"
        }),
        v: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        w: common_vendor.o(($event) => handleMenuClick("help")),
        x: isLoggedIn.value
      }, isLoggedIn.value ? {
        y: common_vendor.o(handleLogout)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
