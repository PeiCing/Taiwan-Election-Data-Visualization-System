d3.select('css-selector'); //根據指定的 css-selector(節點、id、class…等) 返回 HTML 文檔中第一個匹配的元素
d3.selectAll('css-selector'); //根據指定的 css-selector 返回 HTML 文檔中所有匹配的元素
text('content'); //獲取或設置被選元素的文本

//append()&insert()只是新增空的標籤而已, 必須再呼叫text()或html()加入內容才看得到。
append('element name'); //在所選元素內，但在所選元素的末尾之前添加一個元素
insert('element name'); //在被選元素中插入一個新元素

html('content'); //獲取或設置被選元素的內部 HTML

//獲取或設置所選元素的屬性
attr('name','value'); 
property('name','value');
style('name','value');
classed('css class',bool); //從選擇中獲取、添加或刪除一個 css class

//D3 提供方法鏈，將第一個方法的輸出作為輸入，傳遞給鏈中的下一個方法。
var bodyElement = d3.select("body");
var paragraph = bodyElement.append("p");
paragraph.text("Hello D3!");
// 可以使用方法鏈簡化寫成：
d3.select("body").append("p").text("Hello D3!");

/*延伸運用也提供了動態屬性
<p>Error: This is error.</p>
<p>Warning:This is warning.</p>
<script>
    d3.selectAll("p").style("color", function(d, i) {
            var text = this.innerText;
        
            if (text.indexOf("Error") >= 0) {
                return "red";
            } else if (text.indexOf("Warning") >= 0) {
                return "yellow";
            }
    });
</script>*/

d3.selection.on(type[, listener[, capture]]); //添加或刪除事件偵聽器以捕獲事件類型，如單擊、鼠標懸停、鼠標移出等
d3.selection.dispatch(type[, listener[, capture]]); //捕獲事件類型，如 click、mouseover、mouseout
d3.event//事件對象，用於訪問標準事件字段，例如時間戳或 preventDefault 等方法
d3.mouse(container)//獲取指定 DOM 元素中當前鼠標位置的 x 和 y 坐標
d3.touch()//獲取容器的觸摸坐標

//✨ D3 — 動畫 ( Animation )
selection.transition()// 為所選元素安排轉換
transition.duration() //指定每個元素的動畫持續時間(以毫秒為單位)
transition.ease()//緩動指定緩動函數，如：linear、elastic、bounce
transition.delay()//指定每個元素的動畫延遲(以毫秒為單位)

//將數據連接到所選元素
//<p>D3 Tutorials</p>
var myData = ["Hello D3!"];
var p = d3.select("body")
        .selectAll("p")
        .data(myData)
        .text(function (d) {
            return d;
        });

//如果元素(節點)的數量和數據值不匹配怎麼辦？
enter() //創建一個包含缺失元素佔位符引用的選擇
var data = [0, 3, 0, 3];
var body = d3.select("body")
            .selectAll("span")
            .data(data)
            .enter()
            .append("span")
            .text(function(d) { 
                return d + " "; 
            });
//enter() 用於添加新的引用節點，而 exit() 用於刪除多餘的節點。
exit()//刪除節點並將它們添加到退出選擇中
//<p>D3 Tutorials</p>
//<p></p>
//<p></p>
var myData = ["Hello D3!"];
var p = d3.select("body")
        .selectAll("p")
        .data(myData)
        .text(function (d, i) {
            return d;
        })
        .exit()
        .remove();

// SVG 是使用文本創建圖像的方法，它會根據瀏覽器的大小自行縮放
fill//元素的填充顏色，可以是顏色名稱、十六進制值或 RGB 或 RGBA 值
stroke//筆觸顏色，可以是顏色名稱、十六進制值或 RGB 或 RGBA 值
stroke-width//筆觸寬度指定我們的線條或邊界的寬度(以像素為單位)
opacity//指定一個不透明度/透明度數字(0 是完全透明，1 是完全不透明)
font-family//對於文本元素，用法與 CSS 一樣
font-size//指定文本元素的字體大小

/*畫出一條線
var width = 500;
var height = 500;

//Create SVG element
var svg = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height);

//Create line element inside SVG
svg.append("line")
   .attr("x1", 15)
   .attr("x2", 200)
   .attr("y1", 15)
   .attr("y2", 50)
   .attr("stroke", "black")
*/

/* 畫出一個矩形 
var width = 500;
var height = 500;

//Create SVG element
var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

//Create and append rectangle element
svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 200)
        .attr("height", 100)
*/

/*畫出一個圓形 
var width = 500;
var height = 500;

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

//Append circle 
svg.append("circle")
   .attr("cx", 250)
   .attr("cy", 50)
   .attr("r", 50)
*/

/* 畫出一個橢圓形 
var width = 500;
var height = 500;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

svg.append("ellipse")
   .attr("cx", 250)
   .attr("cy", 50)
   .attr("rx", 150)
   .attr("ry", 50)
*/
/* 橫的長條圖 
var data = [5, 10, 12];
var width = 200,
scaleFactor = 10,
barHeight = 20;

var graph = d3.select("body")
          .append("svg")
          .attr("width", width)
          .attr("height", barHeight * data.length);

var bar = graph.selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("transform", function(d, i) {
                return "translate(0," + i * barHeight + ")";//為了讓三個 bar 不重疊呈現
          });

    bar.append("rect")
       .attr("width", function(d) {
                return d * scaleFactor;
       })
       .attr("height", barHeight - 1);

    bar.append("text")
       .attr("x", function(d) { return (d*scaleFactor); })
       .attr("y", barHeight / 2)
       .attr("dy", ".35em")
       .text(function(d) { return d; });
*/
/* 圓餅圖 
var data = [4, 4, 8, 10];
var svg = d3.select("svg_bar"),
    width = svg.attr("width"),
    height = svg.attr("height"),
    //修改radius(留空間給title) Math.min...為了確保生成的餅圖不會超出 SVG 畫布的邊界
    radius = (Math.min(width, height) / 2) -20,
    k = svg.append("k").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(['#ffcfad','#9b8742','#b8aa95','#5e5a54','#e6d1b1','ce8303']);

    var pie = d3.pie().value(function(d) { return d; });

    var arc = d3.arc()
              .innerRadius(0)
              .outerRadius(radius);

    //新增label
    var label = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius - 80);

    var arcs = k.selectAll("arc")
              .data(pie(data))
              .enter()
              .append("k")
              .attr("class", "arc")

    arcs.append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", arc);

    //將label加到圓餅上
    arcs.append("text")
      .attr("transform", function(d) {
        return "translate(" + label.centroid(d) + ")";
      })
      .text(function(d) { return d.value });

    //加上標題
    svg.append("k")
    .attr("transform", "translate(" + (width / 2 - 100) + "," + 20 + ")")
    .append("text")
    .text("Stay in different locations")
    .attr("class", "title")
*/
