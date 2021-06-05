import axiosInstance from "@/axiosInstance";

export default {
    state: {
        token: undefined,
        user: undefined
    },
    mutations: {
        token(state, token) {
            state.token = token
            axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
            localStorage.setItem('token', token)
        },
        user(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        clearAll(state) {
            state.token = undefined
            state.user = undefined
            axiosInstance.defaults.headers.common['Authorization'] = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    },
    actions: {
        init({commit}) {
            try {
                let storedToken = localStorage.getItem('token')
                if (storedToken)
                    commit('token', storedToken)
                let storedUser = localStorage.getItem('user')
                if (storedUser)
                    commit('user', JSON.parse(storedUser))
            } catch {
                commit('clearAll')
            }
        },
        async login({commit}, credentials) {
            try {
                commit('loading', true, {root: true})
                await axiosInstance.post('/login', credentials).then(response => {
                    commit('token', response.data)
                })
                await axiosInstance.get('/users', {
                    params: {
                        username: credentials.username
                    }
                }).then(response => {
                    commit('user', response.data)
                })
            } finally {
                commit('loading', false, {root: true})
            }
        },
        changePassword({state, commit}, passwordObj) {
            return axiosInstance.post(`/users/${state.user.id}/password`, passwordObj).then(response => {
                commit('user', response.data)
            })
        }
    },
    getters: {
        loggedIn(state) {
            return state.token
        },
        user(state) {
            return state.user
        }
    }
}
