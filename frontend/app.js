/* ============================================
   EPFTracker — Application Logic
   ============================================ */

// Chart color palette
const COLORS = [
  '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#a855f7', '#0ea5e9', '#eab308', '#f43f5e', '#10b981',
  '#d946ef', '#2dd4bf', '#fb923c', '#818cf8', '#a3e635'
];

// Generate a deterministic color for a stock symbol
function stockColor(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

// Clearbit official company domain mapping for high-quality corporate logos
function getLogoUrl(companyName) {
  const domains = {
    'MALAYAN BANKING BERHAD': 'maybank.com',
    'PUBLIC BANK BERHAD': 'publicbank.com.my',
    'CIMB GROUP HOLDINGS BERHAD': 'cimb.com',
    'AXIATA GROUP BERHAD': 'axiata.com',
    'RHB BANK BERHAD': 'rhbgroup.com',
    'TENAGA NASIONAL BHD': 'tnb.com.my',
    'YTL CORPORATION BERHAD': 'ytl.com',
    'CELCOMDIGI BERHAD': 'celcomdigi.com',
    'DIALOG GROUP BERHAD': 'dialogasia.com',
    'GAMUDA BERHAD': 'gamuda.com.my',
    'IHH HEALTHCARE BERHAD': 'ihhhealthcare.com',
    'SIME DARBY PROPERTY BERHAD': 'simedarbyproperty.com',
    'SIME DARBY BERHAD': 'simedarby.com',
    'SD GUTHRIE BERHAD': 'sdguthrie.com',
    'MAXIS BERHAD': 'maxis.com.my',
    'MR D.I.Y. GROUP (M) BERHAD': 'mrdiy.com',
    'IOI CORPORATION BERHAD': 'ioigroup.com',
    'PETRONAS CHEMICALS GROUP BERHAD': 'petronaschemicals.com',
    'YTL POWER INTERNATIONAL BHD': 'ytlpower.com.my',
    'MALAKOFF CORPORATION BERHAD': 'malakoff.com.my',
    'TELEKOM MALAYSIA BERHAD': 'tm.com.my',
    'PRESS METAL ALUMINIUM HOLDINGS BERHAD': 'pressmetal.com',
    'SUNWAY BERHAD': 'sunway.com.my',
    'IJM CORPORATION BERHAD': 'ijm.com',
    'MISC BERHAD': 'misc.com.my',
    'S P SETIA BERHAD': 'spsetia.com',
    '99 SPEED MART RETAIL HOLDINGS BERHAD': '99speedmart.com.my',
    'INARI AMERTRON BERHAD': 'inaricorp.com',
    'AMMB HOLDINGS BERHAD': 'ambankgroup.com',
    'SUNWAY REAL ESTATE INVESTMENT TRUST': 'sunwayreit.com',
    'PAVILION REAL ESTATE INVESTMENT TRUST': 'pavilionreit.com',
    'CTOS DIGITAL BERHAD': 'ctosdigital.com',
    'AXIS REAL ESTATE INVESTMENT TRUST': 'axisreit.com.my',
    'IGB REAL ESTATE INVESTMENT TRUST': 'igbreit.com',
    'UOA DEVELOPMENT BHD': 'uoa.com.my',
    'IOI PROPERTIES GROUP BERHAD': 'ioiproperties.com.my',
    'BANK ISLAM MALAYSIA BERHAD': 'bankislam.com',
    'FARM FRESH BERHAD': 'farmfresh.com.my',
    'TIME DOTCOM BERHAD': 'time.com.my',
    'FRONTKEN CORPORATION BERHAD': 'frontken.com',
    'PETRONAS GAS BERHAD': 'petronasgas.com',
    'PPB GROUP BERHAD': 'ppbgroup.com',
    'JOHOR PLANTATIONS GROUP BERHAD': 'johorplantations.com',
    'WESTPORTS HOLDINGS BERHAD': 'westportsholdings.com',
    'KUALA LUMPUR KEPONG BERHAD': 'klk.com.my',
    'HONG LEONG BANK BERHAD': 'hlb.com.my',
    'KLCC PROPERTY HOLDINGS BERHAD': 'klcc.com.my',
    'SKP RESOURCES BHD': 'skpres.com',
    'EASTERN & ORIENTAL BERHAD': 'easternandoriental.com',
    'AURELIUS TECHNOLOGIES BERHAD': 'atechgroup.com.my',
    'SYARIKAT TAKAFUL MALAYSIA KELUARGA BERHAD': 'takaful-malaysia.com.my',
    'DRB-HICOM BERHAD': 'drb-hicom.com',
    'DAYANG ENTERPRISE HOLDINGS BERHAD': 'desb.net',
    'ALLIANCE BANK MALAYSIA BERHAD': 'alliancebank.com.my',
    'KOSSAN RUBBER INDUSTRIES BHD.': 'kossan.com.my',
    'GENTING PLANTATIONS BERHAD': 'gentingplantations.com',
    'PETRONAS DAGANGAN BHD': 'mymesra.com.my',
    'BURSA MALAYSIA BERHAD': 'bursamalaysia.com',
    'MEGA FIRST CORPORATION BERHAD': 'megafirst.com',
    'AEON CO. (M) BHD': 'aeongroupmalaysia.com',
    'PADINI HOLDINGS BERHAD': 'padini.com',
    'SOUTHERN CABLE GROUP BERHAD': 'southerncable.com.my',
    'PROLINTAS INFRA BUSINESS TRUST': 'prolintas.com.my',
    'HONG LEONG FINANCIAL GROUP BERHAD': 'hlfg.com.my',
    'ECONPILE HOLDINGS BERHAD': 'econpile.com',
    'BERMAZ AUTO BERHAD': 'bauto.com.my',
    'SUPERCOMNET TECHNOLOGIES BERHAD': 'supercomnet.com.my',
    'ORKIM BERHAD': 'orkim.com.my',
    'UWC BERHAD': 'uwcberhad.com.my',
    'D & O GREEN TECHNOLOGIES BERHAD': 'dogt.com.my',
    'FRASER & NEAVE HOLDINGS BHD': 'fn.com.my',
    'WASCO BERHAD': 'wascoenergy.com',
    'UNITED PLANTATIONS BERHAD': 'unitedplantations.com',
    'SAM ENGINEERING & EQUIPMENT (M) BERHAD': 'sam-mfg.com.my',
    'AME ELITE CONSORTIUM BERHAD': 'ame-elite.com',
    'NESTLE (MALAYSIA) BERHAD': 'nestle.com.my',
    'ALLIANZ MALAYSIA BERHAD': 'allianz.com.my',
    'PANASONIC MANUFACTURING MALAYSIA BERHAD': 'panasonic.com.my'
  };

  const name = companyName.toUpperCase().trim();
  if (domains[name]) {
    return `https://logo.clearbit.com/${domains[name]}`;
  }
  
  // Fallback slug generation
  const clean = name
    .replace(/\b(BERHAD|BHD|CORPORATION|GROUP|HOLDINGS|CO|M)\b/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return `https://logo.clearbit.com/${clean}.com`;
}

// ============================================
// Tab System
// ============================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');

    // Redraw charts that were hidden (canvas needs visible dimensions)
    if (btn.dataset.tab === 'returns') {
      requestAnimationFrame(() => {
        drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
      });
    }
  });
});

// ============================================
// Holdings Tab
// ============================================

// Compute portfolio totals
const totalSecurities = EPF_DATA.holdings.reduce((s, h) => s + h.total_securities, 0);

function renderHoldingsTable() {
  const tbody = document.getElementById('holdings-tbody');
  document.getElementById('holdings-count').textContent = EPF_DATA.holdings.length;

  tbody.innerHTML = EPF_DATA.holdings.map((h, i) => {
    const pctPortfolio = ((h.total_securities / totalSecurities) * 100).toFixed(2);
    const logoUrl = getLogoUrl(h.company_name);
    return `<tr>
      <td>${i + 1}</td>
      <td>
        <div class="stock-symbol">
          ${logoUrl ? `
            <img src="${logoUrl}" 
                 class="stock-icon-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                 alt="${h.stock_name}">
          ` : ''}
          <div class="stock-icon fallback-icon" style="background:${stockColor(h.stock_name)}; ${logoUrl ? 'display:none;' : ''}">${h.stock_name.slice(0, 2)}</div>
          <span class="stock-name">${h.stock_name}</span>
        </div>
      </td>
      <td>${h.company_name}</td>
      <td>${h.sector}</td>
      <td class="align-right">${h.total_securities.toLocaleString()}</td>
      <td class="align-right">${h.direct_percent}%</td>
      <td class="align-right">${pctPortfolio}%</td>
    </tr>`;
  }).join('');
}

// ============================================
// Portfolio Value Line Chart (Canvas)
// ============================================

function getPortfolioTimeSeries(range) {
  // Parse dates and sort chronologically
  const dates = Object.keys(EPF_DATA.txByDate).map(d => ({
    label: d,
    date: new Date(d),
    ...EPF_DATA.txByDate[d]
  })).sort((a, b) => a.date - b.date);

  // Filter by range
  const now = dates[dates.length - 1]?.date || new Date();
  let cutoff;
  switch (range) {
    case '1M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1); break;
    case '3M': cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3); break;
    case '1Y': cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
    default: cutoff = new Date(0);
  }

  const filtered = dates.filter(d => d.date >= cutoff);

  // Build cumulative series
  let cum = 0;
  return filtered.map(d => {
    cum += d.net;
    return { label: d.label, value: cum, count: d.count };
  });
}

function drawLineChart(canvasId, data, color = '#8b5cf6') {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  if (data.length < 2) {
    ctx.fillStyle = '#555570';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Not enough data for this range', w / 2, h / 2);
    return;
  }

  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  // Y-axis labels
  ctx.fillStyle = '#555570';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range * i / 4);
    const y = pad.top + plotH - (plotH * i / 4);
    ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
    // Grid line
    ctx.strokeStyle = 'rgba(37, 37, 58, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // X-axis labels (sample a few)
  ctx.textAlign = 'center';
  const labelStep = Math.max(1, Math.floor(data.length / 6));
  for (let i = 0; i < data.length; i += labelStep) {
    const x = pad.left + (plotW * i / (data.length - 1));
    const parts = data[i].label.split(' ');
    ctx.fillText(`${parts[0]} ${parts[1]}`, x, h - 5);
  }

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
  gradient.addColorStop(0, color + '30');
  gradient.addColorStop(1, color + '00');

  // Line + fill path
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = pad.left + (plotW * i / (data.length - 1));
    const y = pad.top + plotH - ((d.value - minV) / range * plotH);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  // Fill area
  const fillPath = new Path2D();
  data.forEach((d, i) => {
    const x = pad.left + (plotW * i / (data.length - 1));
    const y = pad.top + plotH - ((d.value - minV) / range * plotH);
    if (i === 0) fillPath.moveTo(x, y);
    else fillPath.lineTo(x, y);
  });
  fillPath.lineTo(pad.left + plotW, pad.top + plotH);
  fillPath.lineTo(pad.left, pad.top + plotH);
  fillPath.closePath();
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fill(fillPath);
  ctx.restore();

  // Stroke line
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots on last point
  const lastX = pad.left + plotW;
  const lastY = pad.top + plotH - ((data[data.length - 1].value - minV) / range * plotH);
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
  ctx.fillStyle = color + '30';
  ctx.fill();

  // Store metadata for hover
  lineChartMeta = { data, pad, plotW, plotH, minV, range, rect };
  // Save canvas bitmap for hover overlay
  if (window._lineSaveCanvas) window._lineSaveCanvas();
}

// ============================================
// Pie Chart (Canvas)
// ============================================

function getPieData(mode) {
  const map = {};
  EPF_DATA.holdings.forEach(h => {
    const key = mode === 'sector' ? h.sector : h.stock_name;
    map[key] = (map[key] || 0) + h.total_securities;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);
  const TOP_N = 10;
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const othersValue = rest.reduce((s, [, v]) => s + v, 0);

  const result = top.map(([label, value], i) => ({
    label,
    value,
    pct: ((value / total) * 100).toFixed(1),
    color: COLORS[i % COLORS.length]
  }));

  if (othersValue > 0) {
    result.push({
      label: `Others (${rest.length})`,
      value: othersValue,
      pct: ((othersValue / total) * 100).toFixed(1),
      color: '#555570'
    });
  }

  return result;
}

let currentPieModeForDraw = 'company';
function drawPieChart(canvasId, data, mode) {
  currentPieModeForDraw = mode || 'company';
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const container = canvas.parentElement;
  const size = Math.min(container.clientWidth, container.clientHeight);

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 10;
  const innerRadius = radius * 0.45;
  const total = data.reduce((s, d) => s + d.value, 0);

  ctx.clearRect(0, 0, size, size);

  let startAngle = -Math.PI / 2;
  data.forEach(d => {
    const sliceAngle = (d.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();

    // Slight gap
    ctx.strokeStyle = '#16161f';
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle += sliceAngle;
  });

  // Inner circle (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#16161f';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#eaeaf0';
  ctx.font = '600 15px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const totalItems = mode === 'sector'
    ? Object.keys(Object.fromEntries(EPF_DATA.holdings.map(h => [h.sector, 1]))).length
    : EPF_DATA.holdings.length;
  // +1 to cy helps perfectly center Inter font visually
  ctx.fillText(totalItems + (mode === 'sector' ? ' sectors' : ' stocks'), cx, cy + 1);

  // Store metadata for hover
  pieChartMeta = { data, cx, cy, radius, innerRadius, total };
}

function renderPieLegend(data) {
  const el = document.getElementById('pie-legend');
  el.innerHTML = data.map(d => `
    <div class="pie-legend-item">
      <span class="pie-legend-dot" style="background:${d.color}"></span>
      <span>${d.label} <span style="color:var(--text-muted)">${d.pct}%</span></span>
    </div>
  `).join('');
}

// ============================================
// Returns Tab — Bar Chart
// ============================================

function getReturnsData(view) {
  const dates = Object.keys(EPF_DATA.txByDate).map(d => ({
    label: d,
    date: new Date(d),
    ...EPF_DATA.txByDate[d]
  })).sort((a, b) => a.date - b.date);

  return dates.map(d => ({
    label: d.label,
    value: view === 'net' ? d.net : view === 'acquired' ? d.acquired : -d.disposed,
    count: d.count
  }));
}

function drawBarChart(canvasId, data, color = '#8b5cf6') {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 70 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);

  if (data.length === 0) return;

  const values = data.map(d => d.value);
  const maxV = Math.max(...values, 0);
  const minV = Math.min(...values, 0);
  const range = maxV - minV || 1;

  // Zero line position
  const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);

  // Grid + Y axis
  ctx.fillStyle = '#555570';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range * i / 4);
    const y = pad.top + plotH - (plotH * i / 4);
    ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
    ctx.strokeStyle = 'rgba(37, 37, 58, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // Zero line
  ctx.strokeStyle = 'rgba(136, 136, 160, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, zeroY);
  ctx.lineTo(w - pad.right, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Bars
  const barW = Math.max(2, (plotW / data.length) - 2);
  data.forEach((d, i) => {
    const x = pad.left + (plotW * i / data.length) + 1;
    const barH = (Math.abs(d.value) / range) * plotH;
    const y = d.value >= 0 ? zeroY - barH : zeroY;

    ctx.fillStyle = d.value >= 0 ? '#22c55e' : '#ef4444';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    // Rounded top
    const r = Math.min(2, barW / 2);
    ctx.roundRect(x, y, barW, barH, [r, r, 0, 0]);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // X-axis labels
  ctx.fillStyle = '#555570';
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(data.length / 8));
  for (let i = 0; i < data.length; i += step) {
    const x = pad.left + (plotW * i / data.length) + barW / 2;
    const parts = data[i].label.split(' ');
    ctx.fillText(`${parts[0]} ${parts[1]}`, x, h - 5);
  }

  // Store metadata for hover
  barChartMeta = { data, pad, plotW, plotH, minV, range, barW };
  // Save canvas bitmap for hover overlay
  if (window._barSaveCanvas) window._barSaveCanvas();
}

function renderReturnsSummary() {
  const dates = Object.values(EPF_DATA.txByDate);
  const totalAcquired = dates.reduce((s, d) => s + d.acquired, 0);
  const totalDisposed = dates.reduce((s, d) => s + d.disposed, 0);
  const totalNet = totalAcquired - totalDisposed;
  const totalTx = dates.reduce((s, d) => s + d.count, 0);

  document.getElementById('returns-summary').innerHTML = `
    <div class="summary-card">
      <div class="summary-card-label">Total Acquired</div>
      <div class="summary-card-value positive">${formatCompact(totalAcquired)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Total Disposed</div>
      <div class="summary-card-value negative">${formatCompact(totalDisposed)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Net Activity</div>
      <div class="summary-card-value ${totalNet >= 0 ? 'positive' : 'negative'}">${formatCompact(totalNet)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Total Announcements</div>
      <div class="summary-card-value">${totalTx.toLocaleString()}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Unique Stocks</div>
      <div class="summary-card-value">${EPF_DATA.uniqueStocks}</div>
    </div>
    <div class="summary-card">
      <div class="summary-card-label">Trading Days</div>
      <div class="summary-card-value">${Object.keys(EPF_DATA.txByDate).length}</div>
    </div>
  `;
}

// ============================================
// Transactions Tab
// ============================================

const TX_PER_PAGE = 50;
let txPage = 1;
let filteredTx = [];

function flattenTransactions() {
  const list = [];
  EPF_DATA.transactions.forEach(tx => {
    tx.transactions.forEach(t => {
      list.push({
        date: tx.date,
        stock: tx.stock,
        company: tx.company,
        type: t.type,
        amount: t.amount,
        percent: tx.percent,
        total: tx.total
      });
    });
  });
  // Sort by date descending
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return list;
}

const allFlatTx = flattenTransactions();

function filterTransactions() {
  const typeFilter = document.getElementById('tx-filter-type').value;
  const search = document.getElementById('tx-search').value.toLowerCase().trim();

  filteredTx = allFlatTx.filter(tx => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (search && !tx.company.toLowerCase().includes(search) && !tx.stock.toLowerCase().includes(search)) return false;
    return true;
  });

  txPage = 1;
  renderTransactionsTable();
}

function renderTransactionsTable() {
  const tbody = document.getElementById('tx-tbody');
  const start = (txPage - 1) * TX_PER_PAGE;
  const pageData = filteredTx.slice(start, start + TX_PER_PAGE);

  document.getElementById('tx-count').textContent = filteredTx.length.toLocaleString();

  tbody.innerHTML = pageData.map((tx, i) => `
    <tr>
      <td>${start + i + 1}</td>
      <td>${tx.date}</td>
      <td>
        <div class="stock-symbol">
          <div class="stock-icon" style="background:${stockColor(tx.stock)}">${tx.stock.slice(0, 2)}</div>
          <span class="stock-name">${tx.stock}</span>
        </div>
      </td>
      <td>${tx.company}</td>
      <td><span class="tx-type ${tx.type.toLowerCase()}">${tx.type}</span></td>
      <td class="align-right">${tx.amount.toLocaleString()}</td>
      <td class="align-right">${tx.percent}%</td>
      <td class="align-right">${tx.total.toLocaleString()}</td>
    </tr>
  `).join('');

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredTx.length / TX_PER_PAGE);
  const pag = document.getElementById('tx-pagination');

  if (totalPages <= 1) {
    pag.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" ${txPage === 1 ? 'disabled' : ''} onclick="goToPage(${txPage - 1})">‹</button>`;

  // Show pages around current
  const range = 2;
  const start = Math.max(1, txPage - range);
  const end = Math.min(totalPages, txPage + range);

  if (start > 1) {
    html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (start > 2) html += `<span style="color:var(--text-muted);padding:0 0.3rem;">…</span>`;
  }

  for (let p = start; p <= end; p++) {
    html += `<button class="page-btn ${p === txPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  }

  if (end < totalPages) {
    if (end < totalPages - 1) html += `<span style="color:var(--text-muted);padding:0 0.3rem;">…</span>`;
    html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  html += `<button class="page-btn" ${txPage === totalPages ? 'disabled' : ''} onclick="goToPage(${txPage + 1})">›</button>`;

  pag.innerHTML = html;
}

window.goToPage = function (page) {
  txPage = page;
  renderTransactionsTable();
  document.getElementById('tx-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ============================================
// Utility
// ============================================

function formatCompact(val) {
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';
  if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'K';
  return sign + val.toLocaleString();
}

// ============================================
// Tooltip System
// ============================================

const tooltip = document.getElementById('chart-tooltip');

function showTooltip(e, html) {
  tooltip.innerHTML = html;
  tooltip.classList.add('visible');

  const tt = tooltip.getBoundingClientRect();
  let x = e.clientX + 14;
  let y = e.clientY - 14;

  // Keep within viewport
  if (x + tt.width > window.innerWidth - 8) x = e.clientX - tt.width - 14;
  if (y + tt.height > window.innerHeight - 8) y = e.clientY - tt.height - 14;
  if (y < 8) y = 8;

  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

// Store chart metadata for hover detection
let lineChartMeta = null;
let barChartMeta = null;
let pieChartMeta = null;
let isHoverRedraw = false;

// --- Line Chart Tooltip ---
function setupLineChartHover() {
  const canvas = document.getElementById('portfolio-canvas');
  let savedImage = null;

  function saveCanvas() {
    const ctx = canvas.getContext('2d');
    savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreCanvas() {
    if (!savedImage) return;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(savedImage, 0, 0);
  }

  // Register save function globally so drawLineChart can call it
  window._lineSaveCanvas = saveCanvas;

  canvas.addEventListener('mousemove', (e) => {
    if (!lineChartMeta || lineChartMeta.data.length < 2) return;
    const { data, pad, plotW, plotH, minV, range } = lineChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;

    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) { restoreCanvas(); hideTooltip(); return; }

    const idx = Math.round((relX / plotW) * (data.length - 1));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    // Restore clean chart then draw overlay
    restoreCanvas();

    const ctx = canvas.getContext('2d');
    ctx.save();

    const px = pad.left + (plotW * clampedIdx / (data.length - 1));
    const py = pad.top + plotH - ((d.value - minV) / range * plotH);

    // Vertical crosshair
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(px, pad.top);
    ctx.lineTo(px, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight dot
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.fill();
    ctx.restore();

    const valClass = d.value >= 0 ? 'tt-positive' : 'tt-negative';
    showTooltip(e, `
      <div class="tt-label">${d.label}</div>
      <div class="tt-value ${valClass}">${formatCompact(d.value)} shares</div>
      <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">${d.count} announcements</div>
    `);
  });

  canvas.addEventListener('mouseleave', () => {
    restoreCanvas();
    hideTooltip();
  });

  // Initial save after first draw
  requestAnimationFrame(() => saveCanvas());
}

// --- Pie Chart Tooltip ---
function setupPieChartHover() {
  const canvas = document.getElementById('pie-canvas');

  canvas.addEventListener('mousemove', (e) => {
    if (!pieChartMeta) return;
    const { data, cx, cy, radius, innerRadius, total } = pieChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    // Account for CSS vs canvas coordinate scaling
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const mx = (e.clientX - canvasRect.left) * scaleX / (window.devicePixelRatio || 1);
    const my = (e.clientY - canvasRect.top) * scaleY / (window.devicePixelRatio || 1);

    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < innerRadius || dist > radius) {
      hideTooltip();
      canvas.style.cursor = 'default';
      return;
    }

    let angle = Math.atan2(dy, dx);
    angle = angle + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;

    let cumAngle = 0;
    let hoveredSlice = null;
    for (const d of data) {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      if (angle >= cumAngle && angle < cumAngle + sliceAngle) {
        hoveredSlice = d;
        break;
      }
      cumAngle += sliceAngle;
    }

    if (hoveredSlice) {
      canvas.style.cursor = 'pointer';
      showTooltip(e, `
        <div class="tt-row">
          <span class="tt-dot" style="background:${hoveredSlice.color}"></span>
          <span style="font-weight:600">${hoveredSlice.label}</span>
        </div>
        <div class="tt-value" style="margin-top:2px">${hoveredSlice.value.toLocaleString()} shares</div>
        <div style="color:var(--text-muted);font-size:0.7rem">${hoveredSlice.pct}% of portfolio</div>
      `);
    } else {
      hideTooltip();
      canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hideTooltip();
    canvas.style.cursor = 'default';
  });
}

// --- Bar Chart Tooltip ---
function setupBarChartHover() {
  const canvas = document.getElementById('returns-canvas');
  let savedImage = null;

  function saveCanvas() {
    const ctx = canvas.getContext('2d');
    savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreCanvas() {
    if (!savedImage) return;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(savedImage, 0, 0);
  }

  canvas.addEventListener('mousemove', (e) => {
    if (!barChartMeta || barChartMeta.data.length === 0) return;
    const { data, pad, plotW, plotH, minV, range, barW } = barChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;

    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) { restoreCanvas(); hideTooltip(); return; }

    const idx = Math.floor(relX / (plotW / data.length));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    const valClass = d.value >= 0 ? 'tt-positive' : 'tt-negative';
    const valSign = d.value >= 0 ? '+' : '';
    showTooltip(e, `
      <div class="tt-label">${d.label}</div>
      <div class="tt-value ${valClass}">${valSign}${formatCompact(d.value)} shares</div>
      <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">${d.count} announcements</div>
    `);

    // Highlight the hovered bar
    restoreCanvas();
    const ctx = canvas.getContext('2d');
    ctx.save();
    const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);
    const barX = pad.left + (plotW * clampedIdx / data.length) + 1;
    const barH = (Math.abs(d.value) / range) * plotH;
    const barY = d.value >= 0 ? zeroY - barH : zeroY;

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    const r = Math.min(2, barW / 2);
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, [r, r, 0, 0]);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  canvas.addEventListener('mouseleave', () => {
    restoreCanvas();
    hideTooltip();
  });

  // We need to re-save canvas bitmap whenever bar chart redraws
  // This is handled by calling saveCanvas after drawBarChart
  window._barSaveCanvas = saveCanvas;
}

// ============================================
// Event Bindings & Initial Render
// ============================================

// Time range toggle for portfolio chart
let currentRange = '1M';
document.getElementById('time-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#time-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentRange = btn.dataset.range;
  const series = getPortfolioTimeSeries(currentRange);
  drawLineChart('portfolio-canvas', series);
  const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
  document.getElementById('portfolio-value-display').textContent = formatCompact(lastVal) + ' shares (net)';
});

// Pie chart toggle
let currentPieMode = 'company';
document.getElementById('pie-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#pie-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPieMode = btn.dataset.mode;
  const pieData = getPieData(currentPieMode);
  drawPieChart('pie-canvas', pieData, currentPieMode);
  renderPieLegend(pieData);
});

// Returns toggle
let currentReturnsView = 'net';
document.getElementById('returns-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('.chart-toggle');
  if (!btn) return;
  document.querySelectorAll('#returns-toggle .chart-toggle').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentReturnsView = btn.dataset.view;
  drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
});

// Transaction filters
document.getElementById('tx-filter-type').addEventListener('change', filterTransactions);
document.getElementById('tx-search').addEventListener('input', filterTransactions);

// Initial render
function init() {
  // Holdings
  renderHoldingsTable();

  // Portfolio chart
  const series = getPortfolioTimeSeries(currentRange);
  drawLineChart('portfolio-canvas', series);
  const lastVal = series.length > 0 ? series[series.length - 1].value : 0;
  document.getElementById('portfolio-value-display').textContent = formatCompact(lastVal) + ' shares (net)';

  // Pie chart
  const pieData = getPieData(currentPieMode);
  drawPieChart('pie-canvas', pieData, currentPieMode);
  renderPieLegend(pieData);

  // Returns
  drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
  renderReturnsSummary();

  // Transactions
  filteredTx = allFlatTx;
  renderTransactionsTable();

  // Setup hover tooltips
  setupLineChartHover();
  setupPieChartHover();
  setupBarChartHover();
}

// Handle resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    drawLineChart('portfolio-canvas', getPortfolioTimeSeries(currentRange));
    const pieData = getPieData(currentPieMode);
    drawPieChart('pie-canvas', pieData, currentPieMode);
    drawBarChart('returns-canvas', getReturnsData(currentReturnsView));
  }, 200);
});

init();
