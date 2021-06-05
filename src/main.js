import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axiosInstance from "@/axiosInstance"
import '@/assets/custom.scss'

Vue.prototype.$api = axiosInstance

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
