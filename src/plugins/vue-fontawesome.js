import Vue from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faUser, faPowerOff, faChevronLeft, faChevronRight, faCheckCircle, faTimesCircle, faSpinner, faUpload, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser)
library.add(faPowerOff)
library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faCheckCircle)
library.add(faTimesCircle)
library.add(faSpinner)
library.add(faUpload)
library.add(faExclamationTriangle)
Vue.component('icon', FontAwesomeIcon)