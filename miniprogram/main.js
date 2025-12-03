import App from './App'
import pinia from './stores'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uView from 'uview-ui'
export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uView)
  return {
    app
  }
}
// #endif