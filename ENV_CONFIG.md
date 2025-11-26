# 環境配置說明

本專案使用環境變數來管理不同環境的配置。

## 設定步驟

1. 複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 根據您的環境修改 `.env` 中的配置

## 配置項目說明

### API 配置

- **VITE_API_BASE_URL**: API 的基礎 URL
  - 開發環境：`http://localhost:5010/api`
  - 正式環境：修改為實際的 API domain，例如 `https://api.yourdomain.com/api`

### 區塊鏈瀏覽器配置

- **VITE_EXPLORER_URL**: 區塊鏈瀏覽器的 URL 模板
  - BSC 測試網：`https://testnet.bscscan.com/tx/{txHash}`
  - BSC 主網：`https://bscscan.com/tx/{txHash}`
  - Ethereum 主網：`https://etherscan.io/tx/{txHash}`

## 部署到正式環境

部署時，請確保：

1. 修改 `.env` 中的 `VITE_API_BASE_URL` 為正式環境的 API URL
2. 修改 `VITE_EXPLORER_URL` 為對應的區塊鏈網路瀏覽器
3. 重新建置專案：`npm run build`

## 注意事項

- `.env` 檔案包含敏感資訊，請勿提交到版本控制系統
- `.env.example` 是範例檔案，可以提交到版本控制
- 環境變數必須以 `VITE_` 開頭才能在前端使用
