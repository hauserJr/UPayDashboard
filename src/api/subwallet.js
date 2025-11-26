import api from './axios'

export const subwalletApi = {
    getList(params) {
        return api.get('/subwallet/list', { params })
    }
}
