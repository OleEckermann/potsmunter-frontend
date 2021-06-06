import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axiosInstance from "@/axiosInstance"
import '@/assets/custom.scss'
import '@/plugins/vue-fontawesome'

// Form validation
import {ValidationProvider, ValidationObserver} from 'vee-validate';
import '@/validation.js'

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// vue-toastification
import Toast, {POSITION} from 'vue-toastification'
import "vue-toastification/dist/index.css";

const options = {
    position: POSITION.BOTTOM_RIGHT
};
Vue.use(Toast, options);

Vue.prototype.$api = axiosInstance
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
