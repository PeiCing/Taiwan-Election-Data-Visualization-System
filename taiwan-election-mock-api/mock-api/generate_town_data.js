// generate_town_data.js
// 目的：用 taiwan-town2.json 產生 2016/2020/2024「全縣市＋鄉鎮」的假資料，寫入 election_data_with_town.json

const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');

// 1. 讀 election_data.json（原始縣市資料）
const electionPath = path.join(__dirname, 'election_data.json');
const electionData = JSON.parse(fs.readFileSync(electionPath, 'utf8'));

// 2. 讀 taiwan-town2.json（你的鄉鎮 TopoJSON）
const townTopoPath = path.join(__dirname, 'taiwan-town2.json');
const townTopo = JSON.parse(fs.readFileSync(townTopoPath, 'utf8'));

// 3. TopoJSON -> GeoJSON（物件名稱是 TOWN_MOI_1080617）
const townGeo = topojson.feature(
  townTopo,
  townTopo.objects['TOWN_MOI_1080617']
);

// 4. 建立「縣市 → 鄉鎮名列表」對照表
const countyTownMap = {};
townGeo.features.forEach(f => {
  const county = f.properties.COUNTYNAME; // 例如：臺南市
  const town = f.properties.TOWNNAME;     // 例如：楠西區
  if (!countyTownMap[county]) countyTownMap[county] = new Set();
  countyTownMap[county].add(town);
});

// 5. 做一份 2024 的「標準縣市資料表」，給其他年份用來生假資料
const base2024 = {};
(electionData['2024']?.['Taiwan'] || []).forEach(rec => {
  const norm = rec.full_district_name.replace(/台/g, '臺');
  base2024[norm] = rec;
});

// 6. 針對 2016 / 2020 / 2024 三個年份，補滿所有縣市＋鄉鎮
const years = ['2016', '2020', '2024'];

years.forEach(year => {
  if (!electionData[year]) {
    electionData[year] = {};
  }
  if (!electionData[year]['Taiwan']) {
    electionData[year]['Taiwan'] = [];
  }

  const yearData = electionData[year];
  const taiwanList = yearData['Taiwan'];

  // 6-1. 把原本這一年的縣市資料變成 map（用「臺」統一）
  const baseMapNorm = {};
  taiwanList.forEach(rec => {
    const norm = rec.full_district_name.replace(/台/g, '臺');
    baseMapNorm[norm] = rec;
  });

  const newTaiwanList = [...taiwanList];

  // 6-2. 對每一個有鄉鎮的縣市補資料
  Object.keys(countyTownMap).forEach(countyName => {
    const norm = countyName; // topojson 裡已經是「臺」開頭
    let base = baseMapNorm[norm];

    // 如果這一年沒有這個縣市的資料，就自動生一份「假縣市資料」
    if (!base) {
      // 先嘗試用 2024 同一個縣市當模板
      let template = base2024[norm];

      // 如果 2024 也沒有，就退而求其次用這一年第一個縣市，還沒有就用 2024 第一筆
      if (!template) {
        template = taiwanList[0] || (electionData['2024']?.['Taiwan'] || [])[0];
      }

      if (!template) {
        console.warn(`Year ${year}: 找不到可用模板來生假資料（county=${countyName}），跳過`);
        return;
      }

      // 建一筆「這一年、這個縣市」的假資料（票數沿用模板）
      base = {
        full_district_name: countyName,
        candidate1_name: template.candidate1_name,
        candidate1_color: template.candidate1_color,
        candidate1_votes: template.candidate1_votes,
        candidate1_vote_rate: template.candidate1_vote_rate,
        candidate2_name: template.candidate2_name,
        candidate2_color: template.candidate2_color,
        candidate2_votes: template.candidate2_votes,
        candidate2_vote_rate: template.candidate2_vote_rate,
        candidate3_name: template.candidate3_name,
        candidate3_color: template.candidate3_color,
        candidate3_votes: template.candidate3_votes,
        candidate3_vote_rate: template.candidate3_vote_rate,
      };

      newTaiwanList.push(base);
      baseMapNorm[norm] = base;
      console.log(`[${year}] 🔧 為 ${countyName} 自動建立縣市假資料`);
    }

    // 6-3. 針對這個縣市底下所有鄉鎮，建立鄉鎮資料
    const towns = Array.from(countyTownMap[countyName]);
    yearData[countyName] = towns.map(townName => ({
      full_district_name: countyName + townName, // 例如：臺南市楠西區
      candidate1_name: base.candidate1_name,
      candidate1_color: base.candidate1_color,
      candidate1_votes: base.candidate1_votes,
      candidate1_vote_rate: base.candidate1_vote_rate,
      candidate2_name: base.candidate2_name,
      candidate2_color: base.candidate2_color,
      candidate2_votes: base.candidate2_votes,
      candidate2_vote_rate: base.candidate2_vote_rate,
      candidate3_name: base.candidate3_name,
      candidate3_color: base.candidate3_color,
      candidate3_votes: base.candidate3_votes,
      candidate3_vote_rate: base.candidate3_vote_rate,
    }));
  });

  // 更新這一年 Taiwan 的縣市列表（包含自動生出來的縣市）
  yearData['Taiwan'] = newTaiwanList;
});

// 7. 輸出成新的 election_data_with_town.json
const outPath = path.join(__dirname, 'election_data_with_town.json');
fs.writeFileSync(outPath, JSON.stringify(electionData, null, 2), 'utf8');

console.log('✅ 已成功生成 election_data_with_town.json（2016/2020/2024 含全縣市＋鄉鎮假資料）');
