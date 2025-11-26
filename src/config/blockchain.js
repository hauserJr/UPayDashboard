// 區塊鏈瀏覽器配置
export const blockchainConfig = {
    // 區塊鏈瀏覽器 URL 模板
    explorerUrl: import.meta.env.VITE_EXPLORER_URL || 'https://testnet.bscscan.com/tx/{txHash}',

    // 其他可用的區塊鏈瀏覽器選項（註解供參考）
    // Ethereum Mainnet: 'https://etherscan.io/tx/{txHash}'
    // BSC Mainnet: 'https://bscscan.com/tx/{txHash}'
    // BSC Testnet: 'https://testnet.bscscan.com/tx/{txHash}'
    // Polygon: 'https://polygonscan.com/tx/{txHash}'
    // Arbitrum: 'https://arbiscan.io/tx/{txHash}'
}

/**
 * 取得區塊鏈瀏覽器的交易 URL
 * @param {string} txHash - 交易雜湊
 * @returns {string} 完整的瀏覽器 URL
 */
export function getExplorerUrl(txHash) {
    if (!txHash) return '#'
    return blockchainConfig.explorerUrl.replace('{txHash}', txHash)
}
