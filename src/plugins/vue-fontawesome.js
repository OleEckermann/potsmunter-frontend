import Vue from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faUser
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser)
Vue.component('icon', FontAwesomeIcon)