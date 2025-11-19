// generate_town_data.js
const fs = require('fs');
const topojson = require('topojson-client');

// 讀取原本的縣市資料
const electionData = JSON.parse(fs.readFileSync('./election_data.json', 'utf8'));

// 讀取鄉鎮 TopoJSON（就是你 map 用的那份）
const townTopo = JSON.parse(fs.readFileSync('./taiwan-town2.json', 'utf8'));

// 這裡不用記 object 名稱，直接拿第一個 objects 就好
const topoObject = Object.values(townTopo.objects)[0];
const townFeatures = topojson.feature(townTopo, topoObject).features;

// 依照縣市分組所有鄉鎮名稱
const countyTownMap = {};
townFeatures.forEach(f => {
  const county = f.properties.COUNTYNAME; // 例如 "臺北市"
  const town = f.properties.TOWNNAME;     // 例如 "中山區"
  if (!countyTownMap[county]) {
    countyTownMap[county] = [];
  }
  if (!countyTownMap[county].includes(town)) {
    countyTownMap[county].push(town);
  }
});

const years = ['2016', '2020', '2024'];

// 產生一筆假資料的工具函式
function createFakeTownRecord(year, county, town) {
  // 嘗試沿用縣市的候選人名字和顏色
  let baseCounty = null;
  if (electionData[year] && electionData[year]['Taiwan']) {
    baseCounty = electionData[year]['Taiwan'].find(
      d => d.full_district_name === county
    );
  }

  const candidate1_name = baseCounty?.candidate1_name || '候選人A';
  const candidate2_name = baseCounty?.candidate2_name || '候選人B';
  const candidate3_name = baseCounty?.candidate3_name || '候選人C';

  const candidate1_color = baseCounty?.candidate1_color || 'green';
  const candidate2_color = baseCounty?.candidate2_color || 'blue';
  const candidate3_color = baseCounty?.candidate3_color || 'white';

  // 隨機產生總票數 & 三個候選人的比例
  const totalVotes = 8000 + Math.floor(Math.random() * 22000); // 8k ~ 30k

  let r1 = Math.random();
  let r2 = Math.random();
  let r3 = Math.random();
  const sum = r1 + r2 + r3;

  r1 /= sum;
  r2 /= sum;
  r3 /= sum;

  const v1 = Math.round(totalVotes * r1);
  const v2 = Math.round(totalVotes * r2);
  const v3 = totalVotes - v1 - v2; // 確保三者加總剛好

  const rate1 = v1 / totalVotes;
  const rate2 = v2 / totalVotes;
  const rate3 = v3 / totalVotes;

  return {
    full_district_name: county + town, // 例如 "臺北市中山區"
    candidate1_name,
    candidate1_color,
    candidate1_votes: String(v1),
    candidate1_vote_rate: rate1.toFixed(4),
    candidate2_name,
    candidate2_color,
    candidate2_votes: String(v2),
    candidate2_vote_rate: rate2.toFixed(4),
    candidate3_name,
    candidate3_color,
    candidate3_votes: String(v3),
    candidate3_vote_rate: rate3.toFixed(4)
  };
}

// 對三個年份都產生鄉鎮資料
years.forEach(year => {
  if (!electionData[year]) {
    electionData[year] = {};
  }

  Object.entries(countyTownMap).forEach(([county, towns]) => {
    if (!electionData[year][county]) {
      electionData[year][county] = [];
    }

    towns.forEach(townName => {
      const record = createFakeTownRecord(year, county, townName);
      electionData[year][county].push(record);
    });
  });
});

fs.writeFileSync('./election_data.json', JSON.stringify(electionData, null, 2), 'utf8');
console.log('✅ 已為 2016 / 2020 / 2024 產生所有鄉鎮假資料，寫回 election_data.json');
