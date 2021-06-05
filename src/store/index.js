import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/auth";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loading: false
    },
    mutations: {
        loading(state, loading) {
            state.loading = loading
        }
    },
    actions: {},
    getters: {
        isLoading(state) {
            return state.loading
        }
    },
    modules: {
        auth
    }
})

store.dispatch('init')

export default store