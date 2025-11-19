// 全局变量，定义投影和路径生成器
var width = 960, height = 750;
var projection = d3.geoMercator().center([121, 24]).scale(9000).translate([width / 2, height / 2]);
var pathGenerator = d3.geoPath().projection(projection);

// 选择 SVG 元素并添加一个 g 元素用于绘制地图
var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);
var g = svg.append("g"); 

var centers = {
  "臺灣": { center: [121, 24],scale:9000},
  "基隆市": { center: [121.69, 25.11],scale: 120000 },  "臺北市": { center: [121.56, 25.08],scale: 80000 },
  "新北市": { center: [121.64, 24.99],scale: 30000 },  "桃園市": { center: [121.23, 24.86],scale: 30000 },
  "新竹市": { center: [120.95, 24.78],scale: 120000 },  "新竹縣": { center: [121.17, 24.69],scale: 30000 },
  "苗栗縣": { center: [120.94, 24.51],scale: 30000 },  "臺中市": { center: [120.95, 24.22],scale: 30000 },
  "彰化縣": { center: [120.45, 24.00],scale: 60000 },  "南投縣": { center: [120.98, 23.84],scale: 30000 },
  "雲林縣": { center: [120.37, 23.66],scale: 30000 },  "嘉義縣": { center: [120.54, 23.43],scale: 30000 },
  "嘉義市": { center: [120.45, 23.48],scale: 80000 },  "臺南市": { center: [120.34, 23.15],scale: 30000 },
  "高雄市": { center: [120.58, 22.98],scale: 30000 },  "屏東縣": { center: [120.63, 22.39],scale: 30000 },
  "臺東縣": { center: [121.18, 22.70],scale: 15000 },  "花蓮縣": { center: [121.38, 23.74],scale: 15000 },
  "宜蘭縣": { center: [121.60, 24.55],scale: 15000 },  "澎湖縣": { center: [119.50, 23.47],scale: 60000 },
  "金門縣": { center: [118.32, 24.45],scale: 20000 },  "連江縣": { center: [120.21, 26.17],scale: 30000 },
};

// 将页面滚动位置设置为顶部
window.onload = function () {
  window.scrollTo(0, 0);
  var selectedYear = 2024; // 預設年分
  drawMapWithVotingData_County('臺灣', selectedYear);
}

// 获取下拉式菜单元素

const Town_yearSelect = document.getElementById("Town_yearSelect");


// 定义绘制地图和获取数据的函数
function drawMapAndFetchData_County(selectedYear) {
  drawMapWithVotingData_County('臺灣', selectedYear);
}

/* 定义绘制地图和获取数据的函数*/
function drawMapAndFetchData_Town(CountyTown,selectedYear,clickedCountyBounds) {
  drawMapWithVotingData_Town(CountyTown, selectedYear,clickedCountyBounds);
}


/* -----------------獲取API資料------------------ */
async function fetchVotingData(area, year) {
  //const url = 'http://wwweb2024.csie.io:52000/api.php';
  //const token = 'h6kcdm9pazx7j9xd'; // 提供的认证Token
  /*const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
  };*/
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + API_TOKEN
  };
  const body = JSON.stringify({ area: area, year: year });

  /*try {
      const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Data received:', data);
          return data;
      } else {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }*/
  try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: headers,
          body: body
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Data received:', data);
          return data;
      } else {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

/* -----------------獲取城市API資料------------------ */
async function fetchVotingDataByCounty(area, year, CountyName) {
  //const url = 'http://wwweb2024.csie.io:52000/api.php';
  //const token = 'h6kcdm9pazx7j9xd'; // 提供的认证Token
  /*const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
  };*/
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + API_TOKEN
  };
  const body = JSON.stringify({ area: area, year: year, County: CountyName });

  /*try {
      const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: body
      });

      if (response.ok) {
          const data = await response.json();
          //console.log('Data received for', CountyName, ':', data);
          return data;
      } else {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }*/
  try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.ok) {
            const data = await response.json();
            //console.log('Data received for', CountyName, ':', data);
            return data;
        } else {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/* --------------------------------------------- */
/* 處理API數據，得到顏色映射及最大票數候選人 */
function processData(data) {
  let colorMap = {};
  let maxVoteRates = { candidate1: 0, candidate2: 0, candidate3: 0 };
  let highestVoteAreas = { candidate1: null, candidate2: null, candidate3: null };

  data.forEach(item => {
      for (let i = 1; i <= 3; i++) {
          const voteRate = parseFloat(item[`candidate${i}_vote_rate`]);
          if (voteRate > maxVoteRates[`candidate${i}`]) {
              maxVoteRates[`candidate${i}`] = voteRate;
              highestVoteAreas[`candidate${i}`] = item.full_district_name;
          }
      }
  });

  data.forEach(item => {
      const maxIndex = getMaxVoteCandidateIndex(item);
      const voteRate = parseFloat(item[`candidate${maxIndex}_vote_rate`]);

      let colorIntensity = Math.round((voteRate / maxVoteRates[`candidate${maxIndex}`]) * 100);
      const baseColor = item[`candidate${maxIndex}_color`];

      if (item.full_district_name === highestVoteAreas[`candidate${maxIndex}`]) {
          colorIntensity = 100;
      }

      const color = adjustColorIntensity(baseColor, colorIntensity);
      colorMap[item.full_district_name] = color;
  });

  return colorMap;
}


// 根据颜色强度调整原先的颜色

function adjustColorIntensity(color, intensity) {
  const intensityMap = {
      white: [255, 255, 255],
      blue: [0, 0, 255],
      green: [0, 255, 0]
  };

  const baseRGB = intensityMap[color.toLowerCase()];
  if (!baseRGB) return color;

  const adjustedRGB = baseRGB.map(value => Math.max(0, value - value * (intensity / 150)));
  return `rgb(${adjustedRGB.join(', ')})`;
}

/* --------------------------------------------- */
/* 找出票數最多的候選人索引 */
function getMaxVoteCandidateIndex(item) {
  const votes = [
      parseFloat(item.candidate1_vote_rate),
      parseFloat(item.candidate2_vote_rate),
      parseFloat(item.candidate3_vote_rate)
  ];
  return votes.indexOf(Math.max(...votes)) + 1; // +1 because candidates are 1-indexed
}

function getMaxVote(item) {
  const votes = [
      parseInt(item.candidate1_votes),
      parseInt(item.candidate2_votes),
      parseInt(item.candidate3_votes)
  ];
  // 找到最大票数的索引
  const maxIndex = votes.indexOf(Math.max(...votes));

  // 返回相应的候选人票数
  switch (maxIndex) {
    case 0:
      return parseInt(item.candidate1_votes);
    case 1:
      return parseInt(item.candidate2_votes);
    case 2:
      return parseInt(item.candidate3_votes);
    default:
      return 0; // 如果没有最大票数，则返回0或者其他你认为合适的值
  }
}
/* --------------------------------------------- */

// 在全局定义变量来保存地理位置和缩放比例
let savedProjection;

/* 繪製縣市地圖並根據選舉數據上色 */
async function drawMapWithVotingData_County(area, year) {
  document.getElementById("btn").innerHTML = "";  // 移除“上一层”按钮 

  // 监听下拉式菜单选择变化事件
  const County_yearSelect = document.getElementById("County_yearSelect");
  County_yearSelect.addEventListener("change", function() {
    document.getElementById("content").innerHTML = '';
    g.selectAll("path").remove();
    selectedYear = parseInt(this.value); // 获取选择的年份并转换为整数
    drawMapWithVotingData_County('臺灣', selectedYear);
  });  
  /*
  if(area==="臺灣"){
    console.log("HI");
    document.getElementById("content").innerHTML = 
    `<div  class="content"><p id="County" Align="Center" style="font-size: 25px;font-weight: bold;"></p>
    <svg_bar id="bar"  Align="Center" width="350" height="400"></svg_bar></div>`;

    updateCountyName(area);
    fetchVotingDataByCounty('臺灣', year, area)
    .then(electionData => {
      console.log("electionData"+electionData.find(data => "臺灣"));

      const TWData = electionData.find(data => "臺灣");
      if (TWData) {
        drawBarChart(TWData);
      }
    });      
  }
   */     
  const votingData = await fetchVotingData(area, year);
  if (votingData) {
    const colorMap = processData(votingData);

    d3.json("JSON/taiwan-county2.json").then(data => {

      // 清空之前的路径
      g.selectAll("path").remove();
      const counties = topojson.feature(data, data.objects["COUNTY_MOI_1080617"]);
      const paths = g.selectAll("path").data(counties.features);

      // 隐藏其他县市地图
      paths.exit().remove();

      // 过渡效果
      paths.enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("class", "county")
        .style("stroke-width", "0.5px").style("stroke", "white")
        .style("fill", d => colorMap[d.properties.COUNTYNAME] || "#ccc")  // Default color if no data
        .on("mouseover", function(d) {
          document.getElementById("content").innerHTML = 
          `<div  class="content"><p id="County" Align="Center" style="font-size: 25px;font-weight: bold;"></p>
          <svg_bar id="bar"  Align="Center" width="350" height="400"></svg_bar></div>`;

          const CountyName = d.properties.COUNTYNAME;
          updateCountyName(CountyName);
          /*fetchVotingDataByCounty('臺灣', year, CountyName)
          .then(electionData => {
            const CountyData = electionData.find(data => data.full_district_name === CountyName);
            if (CountyData) {
              drawBarChart(CountyData);
            }
          });*/
          fetchVotingData(CountyName, year)
          .then(electionData => {
            if (!electionData) {
              console.error('No data returned for', CountyName);
              return;
            }

            const CountyData = electionData.find(
              data => data.full_district_name === CountyName
            );

            if (CountyData) {
              drawBarChart(CountyData);
            } else {
              console.warn('No matching data for', CountyName, 'in response:', electionData);
            }
          });

          // 更改路径样式以显示准备被点击的效果
          // 添加浮起效果
          d3.select(this)
          .style("stroke-width", "1px")
          .style("stroke", "white")
          .style("filter", "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.9))");

        })
        .on("mouseout", function() {
          // 恢复默认颜色
          d3.select(this)
          .style("stroke-width", "0.4px")
          .style("stroke", "white")
          .style("filter", null); // 移除陰影效果
        })
        .on("click", function(d) {
          const clickedCountyBounds = pathGenerator.bounds(d);
          CountyName = d.properties.COUNTYNAME;
          //隱藏更改縣市的年份
          document.getElementById("select_county_year").innerHTML='';
          document.getElementById("content").innerHTML = '';
          let year2016 = "", year2020 = "", year2024 = "";
          if (year == "2016") year2016 = "selected";
          else if (year == "2020") year2020 = "selected";
          else if (year == "2024") year2024 = "selected";

          //新增更改鄉鎮的年份
          document.getElementById("select_town_year").innerHTML=`
          <select id="Town_yearSelect">
          <option value="2016" ${year2016}>2016</option>
          <option value="2020" ${year2020}>2020</option>
          <option value="2024" ${year2024}>2024</option>
          </select>`;

          // 缓存地理位置和缩放比例
          savedProjection = { center: centers[CountyName].center, scale: centers[CountyName].scale };
          
          

          // 绘制被点击县市的地图和数据
          drawMapWithVotingData_Town(CountyName, year,clickedCountyBounds);
       })
        .append("title")
        .text(d => d.properties["COUNTYNAME"]);
    });
  }
}

/* 繪製鄉鎮地圖並根據選舉數據上色 */
async function drawMapWithVotingData_Town(area, year,clickedCountyBounds) {
  // 清除其他县市地图
  g.selectAll(".county")
    .filter(d => d.properties.COUNTYNAME !== CountyName)
    .remove();
  
  // 获取点击县市的中心点和缩放比例
  const center123 = centers[CountyName].center;

  // 定义缩放函数
  function zoomed() {
    g.attr("transform", d3.event.transform);
  }
  // 计算缩放比例
  const dx = clickedCountyBounds[1][0] - clickedCountyBounds[0][0];
  const dy = clickedCountyBounds[1][1] - clickedCountyBounds[0][1];
  const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));

  // 计算中心点
  const x = (clickedCountyBounds[0][0] + clickedCountyBounds[1][0]) / 2;
  const y = (clickedCountyBounds[0][1] + clickedCountyBounds[1][1]) / 2;
  
  // 创建一个缩放函数
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

  // 应用缩放函数到SVG
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y))
    document.getElementById("content").innerHTML = '';
    document.getElementById("btn").innerHTML = `<a id="backButton" class="btn">上一層</a>`;
    
    /* 监听下拉式菜单选择变化事件*/
    const Town_yearSelect = document.getElementById("Town_yearSelect");
    Town_yearSelect.addEventListener("change", function() {
      //document.getElementById("content").innerHTML = '';
      selectedYear = parseInt(Town_yearSelect.value); // 获取选择的年份并转换为整数
      drawMapAndFetchData_Town(area,selectedYear,clickedCountyBounds);
    });
  
    // 添加按钮点击事件
    document.getElementById("backButton").addEventListener("click", function() {
      // 移除当前的缩放效果，回到台湾的中心点和初始大小
      svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
      document.getElementById("content").innerHTML = '';
      g.selectAll("path").remove();
      document.getElementById("select_town_year").innerHTML='';
      let year2016 = "", year2020 = "", year2024 = "";
      if (year == "2016") year2016 = "selected";
      else if (year == "2020") year2020 = "selected";
      else if (year == "2024") year2024 = "selected";
  
      //新增更改鄉鎮的年份
      document.getElementById("select_county_year").innerHTML=`
      <select id="County_yearSelect">
      <option value="2016" ${year2016}>2016</option>
      <option value="2020" ${year2020}>2020</option>
      <option value="2024" ${year2024}>2024</option>
      </select>`;      
      
      drawMapWithVotingData_County('臺灣', year);
    });
    
    const votingData = await fetchVotingData(area, year);
    if (votingData) {
      const colorMap = processData(votingData);
  
      d3.json("JSON/taiwan-town2.json").then(data => {
        const townships = topojson.feature(data, data.objects["TOWN_MOI_1080617"]);
        const filteredTownships = townships.features.filter(d => d.properties.COUNTYNAME === area);
        
        // 清空之前的路径
        g.selectAll("path").remove();
  
        const paths = g.selectAll("path").data(filteredTownships);
  
        paths.enter()
          .append("path")
          .attr("d", d3.geoPath().projection(projection))
          .attr("class", "township")
          .style("stroke-width", "0.5px").style("stroke", "white")
          .style("fill", d => colorMap[d.properties.COUNTYNAME+d.properties.TOWNNAME] || "transparent")  // 使用县市颜色，其他地方透明
          .on("mouseover", function(d) {
            document.getElementById("content").innerHTML = 
            `<div  class="content"><p id="County" Align="Center" style="font-size: 25px;font-weight: bold;"></p>
            <svg_bar id="bar"  Align="Center" width="350" height="500"></svg_bar></div>`;
  
            const COUNTYNAME = d.properties.COUNTYNAME;
            const townshipName = d.properties.TOWNNAME;
            updateCountyName(townshipName); // 更新相关信息
            fetchVotingDataByCounty(COUNTYNAME, year, townshipName)
              .then(electionData => {
                const townData = electionData.find(data => data.full_district_name === COUNTYNAME+townshipName);
                if (townData) {
                  drawBarChart(townData); // 绘制条形图
                }
              });
              // 更改路径样式以显示准备被点击的效果
              d3.select(this)
              .style("stroke-width", "0.4px")
              .style("stroke", "white")
              .style("filter", "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.9))");
    
            })
            .on("mouseout", function() {
              // 恢复默认颜色
              d3.select(this)
              .style("stroke-width", "0.4px")
              .style("stroke", "white")
              .style("filter", null); // 移除陰影效果
          })
          .append("title")
          .text(d => d.properties["TOWNNAME"]);
      });
    }
  }

  // 定义缩放函数
function zoomTo(scale, x, y) {
    // 创建一个缩放函数
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
  
    // 定义缩放函数
    function zoomed() {
      g.attr("transform", d3.event.transform);
    }
  
    // 应用缩放函数到SVG
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y));
}

// 更新城市文本的函数
function updateCountyName(CountyName) {
  // 获取需要更新的元素
  const CountyText = document.getElementById("County");
  CountyText.textContent = CountyName;
}

/* 绘制条形图 */
function drawBarChart(electionData) {
  const barChartSvg = document.getElementById("bar");
  if (!barChartSvg) {
    console.warn('drawBarChart 被呼叫時，找不到 id="bar" 的元素，可能是視圖已切換或按了上一層。略過繪圖。');
    return;
  }
  /*
  console.log(electionData);
  console.log(electionData.candidate1_name);
  console.log(electionData.candidate1_color);
  console.log(electionData.candidate1_votes);
  */
  // 清空之前的条形图
  barChartSvg.innerHTML = '';

  // 提取候选人数据
  const candidatesData = [
    {
      name: electionData.candidate1_name,
      color: electionData.candidate1_color,
      votes: parseInt(electionData.candidate1_votes),
      vote_rate: parseFloat(electionData.candidate1_vote_rate)
    },
    {
      name: electionData.candidate2_name,
      color: electionData.candidate2_color,
      votes: parseInt(electionData.candidate2_votes),
      vote_rate: parseFloat(electionData.candidate2_vote_rate)
    },
    {
      name: electionData.candidate3_name,
      color: electionData.candidate3_color,
      votes: parseInt(electionData.candidate3_votes),
      vote_rate: parseFloat(electionData.candidate3_vote_rate)
    }
  ];

  // 计算最大票数
  const maxVotes = getMaxVote(electionData);
  //console.log(maxVotes);
  // 设置条形图的尺寸
  const margin = { top: 50, right: 30, bottom: 30, left: 20 };
  const width = 300 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  // 创建 SVG 元素
  const svg = d3.select(barChartSvg)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 设置 x 和 y 轴
  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1)
    .domain(candidatesData.map(candidate => candidate.name))

  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, maxVotes]);

  // 添加 x 和 y 轴
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //svg.append("g")
  //  .call(d3.axisLeft(y));

  // 绘制条形图
// 绘制条形图
svg.selectAll(".bar")
    .data(candidatesData)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", d => "translate(" + x(d.name) + ",0)")  // 移动到正确的 x 位置
    .each(function(d) {
        // 添加条形
        d3.select(this).append("rect")
            .style("fill", candidate => candidate.color)
            .attr("width", x.bandwidth())
            .attr("y", candidate => y(candidate.votes))
            .attr("height", candidate => height - y(candidate.votes));
        
        // 添加票数文本
        d3.select(this).append("text")
            .attr("x", x.bandwidth() / 2)  // 放置在条形中心
            .attr("y", candidate => y(candidate.votes) - 5)  // 位于条形上方
            .attr("text-anchor", "middle")
            .text(candidate => candidate.votes);
        
        // 添加投票率文本
        d3.select(this).append("text")
            .attr("x", x.bandwidth() / 2)  // 放置在条形中心
            .attr("y", candidate => y(candidate.votes) - 20)  // 位于票数文本的上方
            .attr("text-anchor", "middle")
            .text(candidate => (candidate.vote_rate * 100).toFixed(2) + "%");
    });
  }

