import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axiosInstance from "@/axiosInstance"
import '@/assets/custom.scss'

// Form validation
import {ValidationProvider, ValidationObserver} from 'vee-validate';
import '@/validation.js'
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.prototype.$api = axiosInstance
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
