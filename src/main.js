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

// vou-debounce
import vueDebounce from 'vue-debounce'
Vue.use(vueDebounce)

// vue-toastification
import Toast, {POSITION} from 'vue-toastification'
const options = {
    position: POSITION.BOTTOM_RIGHT
};
Vue.use(Toast, options);

Vue.prototype.$api = axiosInstance
Vue.config.productionTip = false

import messageMixin from '@/mixins/MessagesMixin'
Vue.mixin(messageMixin)

import {DateTime} from "luxon";
Vue.filter('date', function (d) {
    if (!d)
        return '';
    let dt = DateTime.fromJSDate(new Date(d)).setLocale('de')
    return dt.toFormat('dd.MM.yy')
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
