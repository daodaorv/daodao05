"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const pickupCity = common_vendor.ref("");
    const pickupStore = common_vendor.ref("");
    const isDifferentReturn = common_vendor.ref(false);
    const returnCity = common_vendor.ref("");
    const returnStore = common_vendor.ref("");
    const pickupTime = common_vendor.ref("");
    const returnTime = common_vendor.ref("");
    const recommendTab = common_vendor.ref("vehicle");
    const canSearch = common_vendor.computed(() => {
      return pickupCity.value && pickupStore.value && pickupTime.value;
    });
    common_vendor.onMounted(() => {
      getCurrentCity();
    });
    const getCurrentCity = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          pickupCity.value = "深圳";
        },
        fail: () => {
          common_vendor.index.showToast({ title: "定位失败，请手动选择城市", icon: "none" });
        }
      });
    };
    const selectCity = () => {
      common_vendor.index.showActionSheet({
        itemList: ["北京", "上海", "广州", "深圳", "成都", "杭州"],
        success: (res) => {
          const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州"];
          pickupCity.value = cities[res.tapIndex];
          pickupStore.value = "";
        }
      });
    };
    const selectReturnCity = () => {
      common_vendor.index.showActionSheet({
        itemList: ["北京", "上海", "广州", "深圳", "成都", "杭州"],
        success: (res) => {
          const cities = ["北京", "上海", "广州", "深圳", "成都", "杭州"];
          returnCity.value = cities[res.tapIndex];
          returnStore.value = "";
        }
      });
    };
    const selectStore = (type) => {
      const city = type === "pickup" ? pickupCity.value : returnCity.value;
      if (!city) {
        common_vendor.index.showToast({
          title: type === "pickup" ? "请先选择取车城市" : "请先选择还车城市",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showActionSheet({
        itemList: [
          `${city}机场店`,
          `${city}市中心店`,
          `${city}火车站店`,
          `${city}商业区店`
        ],
        success: (res) => {
          const stores = [
            `${city}机场店`,
            `${city}市中心店`,
            `${city}火车站店`,
            `${city}商业区店`
          ];
          if (type === "pickup") {
            pickupStore.value = stores[res.tapIndex];
          } else {
            returnStore.value = stores[res.tapIndex];
          }
        }
      });
    };
    const onDifferentReturnChange = (e) => {
      isDifferentReturn.value = e.detail.value;
      if (!e.detail.value) {
        returnCity.value = "";
        returnStore.value = "";
      }
    };
    const selectDateTime = (type) => {
      const currentDate = /* @__PURE__ */ new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      common_vendor.index.showModal({
        title: type === "pickup" ? "选择取车时间" : "选择还车时间",
        content: "日期时间选择功能开发中，暂时使用模拟数据",
        success: (res) => {
          if (res.confirm) {
            const mockDate = new Date(year, month, day + (type === "pickup" ? 1 : 3));
            const dateStr = `${mockDate.getMonth() + 1}月${mockDate.getDate()}日 10:00`;
            if (type === "pickup") {
              pickupTime.value = dateStr;
            } else {
              returnTime.value = dateStr;
            }
          }
        }
      });
    };
    const searchVehicles = () => {
      if (!canSearch.value) {
        common_vendor.index.showToast({
          title: "请完整填写取车城市、门店和时间",
          icon: "none"
        });
        return;
      }
      const params = {
        pickupCity: pickupCity.value,
        pickupStore: pickupStore.value,
        pickupTime: pickupTime.value,
        returnTime: returnTime.value,
        isDifferentReturn: isDifferentReturn.value,
        returnCity: returnCity.value,
        returnStore: returnStore.value
      };
      common_vendor.index.__f__("log", "at pages/home/index.vue:515", "查询参数:", params);
      common_vendor.index.showToast({
        title: "车辆列表页面开发中",
        icon: "none"
      });
    };
    const goToMore = () => {
      common_vendor.index.showToast({ title: "更多优惠开发中", icon: "none" });
    };
    const goToService = (type) => {
      common_vendor.index.showToast({ title: "服务功能开发中", icon: "none" });
    };
    const switchRecommendTab = (tab) => {
      recommendTab.value = tab;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "notification",
          size: "16",
          color: "#FF9F29"
        }),
        b: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999"
        }),
        c: common_vendor.p({
          type: "location",
          size: "18",
          color: "#FF9F29"
        }),
        d: common_vendor.t(pickupCity.value || "请选择城市"),
        e: !pickupCity.value ? 1 : "",
        f: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        g: common_vendor.o(selectCity),
        h: common_vendor.p({
          type: "shop",
          size: "18",
          color: "#FF9F29"
        }),
        i: common_vendor.t(pickupStore.value || "请选择门店"),
        j: !pickupStore.value ? 1 : "",
        k: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        l: common_vendor.o(($event) => selectStore("pickup")),
        m: common_vendor.p({
          type: "flag",
          size: "18",
          color: "#FF9F29"
        }),
        n: isDifferentReturn.value,
        o: common_vendor.o(onDifferentReturnChange),
        p: isDifferentReturn.value
      }, isDifferentReturn.value ? {
        q: common_vendor.p({
          type: "location",
          size: "18",
          color: "#4B91FF"
        }),
        r: common_vendor.t(returnCity.value || "请选择城市"),
        s: !returnCity.value ? 1 : "",
        t: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        v: common_vendor.o(selectReturnCity)
      } : {}, {
        w: isDifferentReturn.value
      }, isDifferentReturn.value ? {
        x: common_vendor.p({
          type: "shop",
          size: "18",
          color: "#4B91FF"
        }),
        y: common_vendor.t(returnStore.value || "请选择门店"),
        z: !returnStore.value ? 1 : "",
        A: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        B: common_vendor.o(($event) => selectStore("return"))
      } : {}, {
        C: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#FF9F29"
        }),
        D: common_vendor.t(pickupTime.value || "请选择时间"),
        E: !pickupTime.value ? 1 : "",
        F: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        G: common_vendor.o(($event) => selectDateTime("pickup")),
        H: common_vendor.p({
          type: "calendar",
          size: "18",
          color: "#FF9F29"
        }),
        I: common_vendor.t(returnTime.value || "请选择时间"),
        J: !returnTime.value ? 1 : "",
        K: common_vendor.p({
          type: "arrowdown",
          size: "14",
          color: "#999"
        }),
        L: common_vendor.o(($event) => selectDateTime("return")),
        M: !canSearch.value ? 1 : "",
        N: !canSearch.value,
        O: common_vendor.o(searchVehicles),
        P: !canSearch.value
      }, !canSearch.value ? {
        Q: common_vendor.p({
          type: "info",
          size: "14",
          color: "#FF9F29"
        })
      } : {}, {
        R: common_vendor.o(goToMore),
        S: common_vendor.p({
          type: "car",
          size: "24",
          color: "#FF9F29"
        }),
        T: common_vendor.o(($event) => goToService()),
        U: common_vendor.p({
          type: "person",
          size: "24",
          color: "#FF9F29"
        }),
        V: common_vendor.o(($event) => goToService()),
        W: common_vendor.p({
          type: "paperplane",
          size: "24",
          color: "#FF9F29"
        }),
        X: common_vendor.o(($event) => goToService()),
        Y: common_vendor.p({
          type: "map",
          size: "24",
          color: "#FF9F29"
        }),
        Z: common_vendor.o(($event) => goToService()),
        aa: common_vendor.p({
          type: "vip",
          size: "16",
          color: "#FFFFFF"
        }),
        ab: common_vendor.p({
          type: "gift",
          size: "16",
          color: "#FFFFFF"
        }),
        ac: common_vendor.p({
          type: "star",
          size: "16",
          color: "#FFFFFF"
        }),
        ad: common_vendor.o(goToMore),
        ae: recommendTab.value === "vehicle" ? 1 : "",
        af: common_vendor.o(($event) => switchRecommendTab("vehicle")),
        ag: recommendTab.value === "crowdfunding" ? 1 : "",
        ah: common_vendor.o(($event) => switchRecommendTab("crowdfunding")),
        ai: recommendTab.value === "community" ? 1 : "",
        aj: common_vendor.o(($event) => switchRecommendTab("community")),
        ak: recommendTab.value === "vehicle"
      }, recommendTab.value === "vehicle" ? {
        al: common_assets._imports_0,
        am: common_vendor.p({
          type: "star-filled",
          size: "14",
          color: "#FF9F29"
        }),
        an: common_assets._imports_0,
        ao: common_vendor.p({
          type: "star-filled",
          size: "14",
          color: "#FF9F29"
        })
      } : {}, {
        ap: recommendTab.value === "crowdfunding"
      }, recommendTab.value === "crowdfunding" ? {} : {}, {
        aq: recommendTab.value === "community"
      }, recommendTab.value === "community" ? {
        ar: common_vendor.p({
          type: "eye",
          size: "14",
          color: "#999"
        }),
        as: common_vendor.p({
          type: "heart",
          size: "14",
          color: "#999"
        }),
        at: common_vendor.p({
          type: "eye",
          size: "14",
          color: "#999"
        }),
        av: common_vendor.p({
          type: "heart",
          size: "14",
          color: "#999"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
