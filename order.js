//Initialize function on Page Load
$(document).ready(function () {
  initStatistics();
});



// Data
var clientData = [
    { type: "Retail", buy: 88.72, sell: 87.60, total: 88.16 },
    { type: "Institution", buy: 8.82, sell: 8.46, total: 8.64 },
    { type: "Dealer", buy: 1.20, sell: 1.65, total: 1.43 },
    { type: "Foreign", buy: 0.08, sell: 1.29, total: 0.69 },
    { type: "Others", buy: 1.18, sell: 1.00, total: 1.08 }
];

var categoryData = [
  { code: "A", name: "Category", trades: 2669850, value: 3322.48, pct: 52.64, color: "var(--stat-cat-a)" },
  { code: "B", name: "Category", trades: 670950,  value: 834.96,  pct: 13.23, color: "var(--stat-cat-b)" },
  { code: "D", name: "Category", trades: 210300,  value: 262.1,   pct: 4.15,  color: "var(--stat-cat-d)" },
  { code: "N", name: "Category", trades: 972450,  value: 1210.16, pct: 19.17, color: "var(--stat-cat-n)" },
  { code: "P", name: "Category", trades: 95200,   value: 118.35,  pct: 1.88,  color: "var(--stat-cat-p)" },
  { code: "S", name: "Category", trades: 154800,  value: 192.6,   pct: 3.05,  color: "var(--stat-cat-s)" },
  { code: "X", name: "Category", trades: 62100,   value: 77.2,    pct: 1.22,  color: "var(--stat-cat-x)" },
  { code: "Y", name: "Category", trades: 48950,   value: 60.85,   pct: 0.97,  color: "var(--stat-cat-y)" },
  { code: "Z", name: "Category", trades: 186750,  value: 232.4,   pct: 3.68,  color: "var(--stat-cat-z)" },
];

var charts = {};
var currentMode = "client";
var formatNumber = value => value.toLocaleString("en-US");

function resolveVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderClientTable() {
  var rowsEl = document.getElementById("statClientRows");
  if (!rowsEl) return;

  var maxBuy = Math.max(...clientData.map(item => item.buy));

  rowsEl.innerHTML = clientData.map((item, index) => {
    var width = ((item.buy / maxBuy) * 100).toFixed(1);
    return `
      <div class="stat-client-row ${index === 0 ? "stat-top" : ""}">
        <div class="stat-bar-fill" style="width:${width}%"></div>
        <div class="stat-client-name">${item.type}</div>
        <div class="stat-client-buy">${item.buy.toFixed(2)}%</div>
        <div class="stat-client-sell">${item.sell.toFixed(2)}%</div>
        <div class="stat-client-total">${item.total.toFixed(2)}%</div>
      </div>
    `;
  }).join("");
}

function renderCategoryTable() {
  var rowsEl = document.getElementById("statCategoryRows");
  if (!rowsEl) return;

  var totalTrade = categoryData.reduce((s, c) => s + c.trades, 0);
  var totalValue = categoryData.reduce((s, c) => s + c.value, 0);
  var totalPct = categoryData.reduce((s, c) => s + c.pct, 0);

  document.getElementById("statTotalTrade").textContent = formatNumber(totalTrade);
  document.getElementById("statTotalValue").textContent = totalValue.toFixed(2);
  document.getElementById("statTotalPct").textContent = totalPct.toFixed(2) + "%";

  rowsEl.innerHTML = categoryData.map(item => `
    <tr>
      <td>${item.code}</td>
      <td>${formatNumber(item.trades)}</td>
      <td>${item.value.toFixed(2)}</td>
      <td>${item.pct.toFixed(2)}%</td>
    </tr>
  `).join("");
}

// Pie Chart
function drawDonut(chartId) {
  var el = document.getElementById(chartId);
  if (!el) return;
  if (charts[chartId]) {
    charts[chartId].dispose();
  }
  var chart = echarts.init(el);
  charts[chartId] = chart;

  var data = categoryData;

  chart.setOption({
    tooltip: {
      trigger: "item",
      formatter: (p) => `${p.name}: ${p.percent}%`,
    },
    series: [
      {
        type: "pie",
        radius: ["45%", "85%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: resolveVar("--stat-bg-panel"),
          borderWidth: 3,
          borderRadius: 8,
        },
        label: {
          show: true,
          position: "inside",
          color: "#fff",
          fontWeight: 700,
          fontSize: 11,
          formatter: (p) => p.name.replace("Category ", ""),
        },
        labelLine: { show: false },
        data: data.map((c) => ({
          name: c.code,
          value: c.trades,
          itemStyle: {
            color: resolveVar(c.color.replace("var(", "").replace(")", "")),
            borderRadius: 8,
          },
        })),
      },
    ],
  });
}

// View switching between Client Statistics / Category Statistics
function switchStatMode(mode) {
  if (mode === currentMode) return;
  currentMode = mode;

  var clientBtn = document.getElementById("client_statistics");
  var categoryBtn = document.getElementById("category_statistics");
  var clientView = document.getElementById("statClientView");
  var categoryView = document.getElementById("statCategoryView");
  var cateExchange = document.getElementById("exchange_statistics");

  if (mode === "client") {
    clientBtn.classList.add("sub-menu-btn-active");
    categoryBtn.classList.remove("sub-menu-btn-active");
    clientView.style.display = "";
    categoryView.style.display = "none";
    cateExchange.style.display = "none";
  } else {
    categoryBtn.classList.add("sub-menu-btn-active");
    clientBtn.classList.remove("sub-menu-btn-active");
    categoryView.style.display = "";
    cateExchange.style.display = "";
    clientView.style.display = "none"; 
    renderCategoryTable();
    drawDonut("statCategoryDonut");
  }
}

function initStatistics() {
  renderClientTable();
  document.getElementById("client_statistics").addEventListener("click", () => switchStatMode("client"));
  document.getElementById("category_statistics").addEventListener("click", () => switchStatMode("category"));
}

$("#exchange_statistics").on("change", function () {
  const exchange = $(this).val();
  console.log(exchange);
});

window.addEventListener("resize", () => {
  Object.values(charts).forEach(chart => chart.resize());
});