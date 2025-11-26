import api from './axios'

export const authApi = {
    login(data) {
        return api.post('/merchant/login', data)
    },

    register(data) {
        return api.post('/merchant/create', data)
    }
}
