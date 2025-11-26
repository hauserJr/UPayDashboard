import axios from './axios'

export const merchantApi = {
    // 取得商戶配置
    getSettings() {
        return axios.get('/merchant/merchant-settings')
    },

    // 設置 Callback URL
    setCallbackUrl(callbackUrl) {
        // 根據 API 定義，callbackUrl 是路徑參數
        // 需要對 url 進行 encodeURIComponent 處理，避免特殊字符導致路由錯誤
        return axios.post(`/Merchant/${encodeURIComponent(callbackUrl)}`)
    }
}
