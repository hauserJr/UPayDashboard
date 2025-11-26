import api from './axios'

export const orderApi = {
    getList(params) {
        return api.get('/order/list', { params })
    },

    create(data) {
        return api.post('/order/create', data)
    },

    getCallbacks(orderId) {
        return api.get(`/order/${orderId}/callbacks`)
    }
}
