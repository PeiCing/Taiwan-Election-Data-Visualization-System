# 🚀 Taiwan Election Mock API Server

完全模擬原始選舉 API 的 Mock Server,可部署到 Render 或在本地運行。

## 📁 檔案結構

```
mock-api/
├── server.js              # Express 伺服器
├── package.json           # 依賴套件
├── election_data.json     # 選舉資料
├── .gitignore            
└── README.md              # 說明文件
```

---

## 🛠️ 本地安裝與運行

### 1. 安裝 Node.js
確保已安裝 Node.js (v14 以上)
```bash
node --version
```

### 2. 安裝依賴
```bash
cd mock-api
npm install
```

### 3. 啟動伺服器
```bash
npm start
```

伺服器會運行在: `http://localhost:52000`

### 4. 測試 API
開啟瀏覽器訪問: `http://localhost:52000`

或使用 curl:
```bash
curl -X POST http://localhost:52000/api.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Token h6kcdm9pazx7j9xd" \
  -d '{"area": "Taiwan", "year": 2024}'
```

---

## 🌐 部署到 Render

### 方法 1: 從 GitHub 部署 (推薦)

#### Step 1: 上傳到 GitHub
```bash
cd mock-api
git init
git add .
git commit -m "Initial commit: Mock API Server"
git remote add origin https://github.com/你的帳號/taiwan-election-api.git
git push -u origin main
```

#### Step 2: 在 Render 建立 Web Service
1. 登入 [Render](https://render.com/)
2. 點擊 **New** → **Web Service**
3. 連接你的 GitHub repository
4. 設定:
   - **Name**: `taiwan-election-api` (或任意名稱)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. 點擊 **Create Web Service**

#### Step 3: 等待部署完成
部署完成後,你會獲得一個 URL,例如:
```
https://taiwan-election-api.onrender.com
```

### 方法 2: 使用 Render CLI

```bash
# 安裝 Render CLI
npm install -g render

# 部署
render deploy
```

---

## 📡 API 使用方式

### 端點 1: 獲取所有縣市資料
```javascript
fetch('https://你的API網址/api.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Token h6kcdm9pazx7j9xd'
  },
  body: JSON.stringify({
    area: 'Taiwan',
    year: 2024
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 端點 2: 獲取特定縣市資料
```javascript
fetch('https://你的API網址/api.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Token h6kcdm9pazx7j9xd'
  },
  body: JSON.stringify({
    area: '台北市',
    year: 2024
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 端點 3: 獲取鄉鎮資料
```javascript
fetch('https://你的API網址/api.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Token h6kcdm9pazx7j9xd'
  },
  body: JSON.stringify({
    area: '台北市',
    year: 2024,
    County: '中正區'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### 健康檢查
```bash
curl https://你的API網址/health
```

---

## 🔧 修改你的前端程式碼

### 原本的程式碼 (不需要改)
```javascript
async function fetchVotingData(area, year) {
  const url = 'http://wwweb2024.csie.io:52000/api.php';  // 舊的 URL
  const token = 'h6kcdm9pazx7j9xd';
  // ... 其他程式碼
}
```

### 只需改這一行!
```javascript
async function fetchVotingData(area, year) {
  const url = 'https://你的API網址.onrender.com/api.php';  // ← 只改這裡!
  const token = 'h6kcdm9pazx7j9xd';
  // ... 其他程式碼完全不用改
}
```

---

## 🎨 自訂 Token

如果想使用自己的 Token,編輯 `server.js`:

```javascript
const validTokens = [
  'Token h6kcdm9pazx7j9xd',      // 原始 Token
  'Token your_custom_token_here'  // ← 加入你的 Token
];
```

---

## 📊 新增更多資料

編輯 `election_data.json`,按照相同格式新增:

```json
{
  "2024": {
    "Taiwan": [
      // 縣市資料...
    ],
    "台北市": [
      // 鄉鎮資料...
      {
        "full_district_name": "台北市中正區",
        "candidate1_name": "賴清德",
        "candidate1_color": "green",
        "candidate1_votes": "25000",
        "candidate1_vote_rate": "0.5000",
        // ...
      }
    ]
  }
}
```

---

## 🐛 除錯

### 檢查伺服器日誌
在 Render Dashboard 中查看 Logs

### 本地測試
```bash
npm start
```
檢查 Console 輸出

### 常見問題

**Q: API 返回 401 Unauthorized?**
A: 檢查 Authorization header 是否正確

**Q: API 返回 404 Not Found?**
A: 檢查縣市名稱是否正確,例如 "台北市" vs "臺北市"

**Q: CORS 錯誤?**
A: 伺服器已啟用 CORS,檢查前端程式碼是否正確

**Q: Render 部署失敗?**
A: 確認選擇的是 **Web Service** 而非 Static Site

---

## 🔒 安全性

- ✅ Token 認證
- ✅ CORS 啟用
- ✅ 錯誤處理
- ✅ 請求驗證

---

## 📈 效能

免費方案限制:
- 💤 15 分鐘無活動會休眠
- 🔄 首次喚醒需要幾秒鐘
- 💾 512MB RAM

建議:
- 使用付費方案 ($7/月) 避免休眠
- 或使用本地 JSON 方案

---

## 🎯 優點

### 使用 Mock API 的優點:
1. ✅ 前端程式碼**完全不用改**
2. ✅ 完全模擬原始 API 行為
3. ✅ 可以部署到雲端
4. ✅ 可以自訂 Token
5. ✅ 可以隨時擴充資料

### vs 使用本地 JSON:
| 特性 | Mock API | 本地 JSON |
|------|----------|-----------|
| 需要改程式碼 | ❌ 只改 URL | ✅ 要改很多 |
| 部署難度 | 🟡 中等 | 🟢 簡單 |
| 運行成本 | 🟡 免費但會休眠 | 🟢 完全免費 |
| 擴充性 | ✅ 易於擴充 | ⚠️ 需修改前端 |

---

## 📞 支援

如有問題,檢查:
1. 伺服器日誌 (Render Dashboard → Logs)
2. 瀏覽器 Console (F12)
3. Network Tab 查看請求詳情

---

## 🎉 完成!

現在你有一個完整的 Mock API 伺服器了!

**本地測試**: `http://localhost:52000`
**部署後**: `https://你的網址.onrender.com`
