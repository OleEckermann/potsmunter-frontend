import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: String
});

/*
axiosInstance.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401)
        return store.dispatch('authenticationFailed')
});
*/
window.console.log('MPT API base URL: ' + process.env.VUE_APP_MPT_API_URL)
axiosInstance.defaults.baseURL = process.env.VUE_APP_MPT_API_URL

export default axiosInstance