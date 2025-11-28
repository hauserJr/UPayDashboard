// API 環境配置
export const apiConfig = {
    // API Base URL
    // 開發環境使用 localhost，正式環境請修改為實際的 API domain
    baseURL: 'https://api.u-pay.cloud/api',

    // 其他環境範例（註解供參考）
    // 正式環境: 'https://api.yourdomain.com/api'
    // 測試環境: 'https://api-test.yourdomain.com/api'

    // API 請求逾時設定（毫秒）
    timeout: 30000,

    // 其他 API 相關配置
    headers: {
        'Content-Type': 'application/json'
    }
}

// 根據環境變數自動切換（如果有設定 VITE_API_BASE_URL）
if (import.meta.env.VITE_API_BASE_URL) {
    apiConfig.baseURL = import.meta.env.VITE_API_BASE_URL
}
