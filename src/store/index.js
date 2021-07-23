import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loading: false,
        message: ''
    },
    mutations: {
        loading(state, {message, loadingState}) {
            state.message = message
            state.loading = loadingState
        }
    },
    actions: {
        startLoading({commit}, message) {
            commit('loading', {message, loadingState: true})
        },
        stopLoading({commit}) {
            commit('loading', {message: '', loadingState: false})
        }
    },
    getters: {
        loading(state) {
            return state.loading
        },
        loadingMessage(state){
            return state.message
        }
    },
    modules: {
        auth
    }
})

store.dispatch('init')

export default store