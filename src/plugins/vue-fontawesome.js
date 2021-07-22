import Vue from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faUser, faPowerOff
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser)
library.add(faPowerOff)
Vue.component('icon', FontAwesomeIcon)