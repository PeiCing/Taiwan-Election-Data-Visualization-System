const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 52000;

// 啟用 CORS
app.use(cors());
app.use(express.json());

// 載入選舉資料
let electionData = {};
try {
  const dataPath = path.join(__dirname, 'election_data_with_town.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  electionData = JSON.parse(rawData);
  console.log('✅ Election data loaded successfully');
} catch (error) {
  console.error('❌ Error loading election data:', error);
}

// 模擬原始 API 的認證檢查
function checkAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // 檢查 Token (可以設定為你想要的值)
  const validTokens = [
    'Token h6kcdm9pazx7j9xd',
    'Token your_custom_token_here'
  ];
  
  if (!authHeader || !validTokens.includes(authHeader)) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid or missing token' 
    });
  }
  
  next();
}

// API 端點 - 完全模擬原始 API
app.post('/api.php', checkAuth, (req, res) => {
  try {
    const { area, year, County } = req.body;
    
    console.log(`📊 API Request: area=${area}, year=${year}, County=${County}`);
    
    // 驗證參數
    if (!area || !year) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Missing required parameters: area and year' 
      });
    }
    
    const yearStr = year.toString();
    
    // 檢查年份資料是否存在
    if (!electionData[yearStr]) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `No data available for year ${year}` 
      });
    }
    
    // 情況 1: 獲取特定縣市的鄉鎮資料
    if (County) {
      // 檢查是否有鄉鎮資料
      if (electionData[yearStr][area]) {
        const townData = electionData[yearStr][area];
        const filteredData = townData.filter(item => 
          item.full_district_name === area + County ||
          item.full_district_name.includes(County)
        );
        
        if (filteredData.length > 0) {
          console.log(`✅ Returning town data for ${area} - ${County}`);
          return res.json(filteredData);
        }
      }
      
      // 如果沒有鄉鎮資料,返回縣市資料
      const countyData = electionData[yearStr]['Taiwan'].filter(
        item => item.full_district_name === area
      );
      
      if (countyData.length > 0) {
        console.log(`⚠️ No town data, returning county data for ${area}`);
        return res.json(countyData);
      }
      
      return res.status(404).json({ 
        error: 'Not Found',
        message: `No data found for ${area} - ${County}` 
      });
    }
    
    // 情況 2: 獲取全台灣或特定縣市資料
    if (area === '臺灣' || area === 'Taiwan') {
      const taiwanData = electionData[yearStr]['Taiwan'] || [];
      console.log(`✅ Returning Taiwan data (${taiwanData.length} counties)`);
      return res.json(taiwanData);
    }
    
    // 情況 3: 獲取特定縣市資料
    const allData = electionData[yearStr]['Taiwan'] || [];
    const countyData = allData.filter(item => item.full_district_name === area);
    
    if (countyData.length > 0) {
      console.log(`✅ Returning data for ${area}`);
      return res.json(countyData);
    }
    
    return res.status(404).json({ 
      error: 'Not Found',
      message: `No data found for area: ${area}` 
    });
    
  } catch (error) {
    console.error('❌ Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Mock API Server is running',
    availableYears: Object.keys(electionData),
    timestamp: new Date().toISOString()
  });
});

// 根路徑
app.get('/', (req, res) => {
  res.json({
    message: 'Taiwan Election Mock API',
    version: '1.0.0',
    endpoints: {
      'POST /api.php': 'Get election data',
      'GET /health': 'Health check'
    },
    usage: {
      method: 'POST',
      url: '/api.php',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token h6kcdm9pazx7j9xd'
      },
      body: {
        area: 'Taiwan | 縣市名稱',
        year: '2024 | 2020 | 2016',
        County: '鄉鎮名稱 (optional)'
      }
    }
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'Endpoint not found' 
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Available years: ${Object.keys(electionData).join(', ')}`);
});
