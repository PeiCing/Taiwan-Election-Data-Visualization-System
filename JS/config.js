/**
 * config.js
 * 根據運行環境（本地開發或線上部署）自動選擇 API URL
 */

const CONFIG = {
  // 本地開發環境
  development: {
    apiUrl: 'http://localhost:52000/api.php',
    token: 'h6kcdm9pazx7j9xd',
    description: '本地開發環境'
  },
  
  // Render 生產環境
  production: {
    apiUrl: 'https://taiwan-election-data-visualization-system.onrender.com/api.php',
    token: 'h6kcdm9pazx7j9xd',
    description: 'Render 生產環境'
  },
  
  // 備用部署環境（如果使用其他主機）
  // staging: {
  //   apiUrl: 'https://your-staging-api.com/api.php',
  //   token: 'h6kcdm9pazx7j9xd',
  //   description: 'Staging 環境'
  // }
};

/**
 * 判斷當前環境
 * 本地開發：localhost 或 127.0.0.1
 * 線上部署：其他域名
 */
function getCurrentEnvironment() {
  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  
  return isDevelopment ? 'development' : 'production';
}

/**
 * 獲取當前環境配置
 */
const CURRENT_ENV = getCurrentEnvironment();
const CURRENT_CONFIG = CONFIG[CURRENT_ENV];

// 導出供其他 JS 檔案使用
const API_URL = CURRENT_CONFIG.apiUrl;
const API_TOKEN = CURRENT_CONFIG.token;

// 在控制台輸出當前環境信息（調試用）
console.log(`
╔════════════════════════════════════════╗
║     Taiwan Election Map Configuration   ║
╠════════════════════════════════════════╣
║ 環境: ${CURRENT_ENV.toUpperCase().padEnd(32)}║
║ API URL: ${CURRENT_CONFIG.apiUrl}${' '.repeat(Math.max(0, 32 - CURRENT_CONFIG.apiUrl.length))}║
║ 描述: ${CURRENT_CONFIG.description.padEnd(30)}║
╚════════════════════════════════════════╝
`);

// 也可以在全局變數中儲存配置
if (typeof window !== 'undefined') {
  window.APP_CONFIG = {
    apiUrl: API_URL,
    apiToken: API_TOKEN,
    currentEnv: CURRENT_ENV,
    config: CURRENT_CONFIG
  };
}
