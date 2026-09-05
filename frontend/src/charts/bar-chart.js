/**
 * EPF Tracker — Bar Chart Engine (Net Capital Activity)
 * High-performance animated canvas with growth easing, vertical dashed probe & bottom date badge
 */

import { formatCompact, parseDateStringToYYYYMMDD } from '../core/utils.js';

let barChartAnimId = null;
let barChartMeta = null;

export function drawBarChart(canvasId, data, animateChart = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 24, right: 24, bottom: 36, left: 70 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  if (barChartAnimId) {
    cancelAnimationFrame(barChartAnimId);
    barChartAnimId = null;
  }

  ctx.clearRect(0, 0, w, h);

  if (!data || data.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No capital flow activity in this timeframe', w / 2, h / 2);
    return;
  }

  const values = data.map(d => d.value);
  const maxV = Math.max(...values, 0);
  const minV = Math.min(...values, 0);
  const range = maxV - minV || 1;

  const zeroY = pad.top + plotH - ((0 - minV) / range * plotH);
  const rawBarW = (plotW / data.length);
  const barW = Math.max(3, rawBarW - (data.length > 60 ? 1 : data.length > 25 ? 3 : 6));

  let startTime = null;
  const DURATION = animateChart ? 700 : 0;

  function renderFrame(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = DURATION > 0 ? Math.min(elapsed / DURATION, 1) : 1;
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    ctx.clearRect(0, 0, w, h);

    // 1. Grid & Y Axis
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minV + (range * i / 4);
      const y = pad.top + plotH - (plotH * i / 4);
      ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // 2. Zero baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(w - pad.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Animated Bars (Growing smoothly from zero baseline)
    data.forEach((d, i) => {
      const x = pad.left + (plotW * i / data.length) + (plotW / data.length - barW) / 2;
      const fullBarH = (Math.abs(d.value) / range) * plotH;
      const currentBarH = fullBarH * easeProgress;
      const y = d.value >= 0 ? zeroY - currentBarH : zeroY;

      if (d.value >= 0) {
        const grad = ctx.createLinearGradient(0, y, 0, zeroY);
        grad.addColorStop(0, '#10b981');
        grad.addColorStop(1, '#059669');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
        ctx.shadowBlur = 6;
      } else {
        const grad = ctx.createLinearGradient(0, zeroY, 0, y + currentBarH);
        grad.addColorStop(0, '#e11d48');
        grad.addColorStop(1, '#f43f5e');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.3)';
        ctx.shadowBlur = 6;
      }

      ctx.beginPath();
      const r = Math.min(3, barW / 2);
      ctx.roundRect(x, y, barW, Math.max(1, currentBarH), d.value >= 0 ? [r, r, 0, 0] : [0, 0, r, r]);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 4. X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const isMobile = window.innerWidth < 768;
    const maxLabels = isMobile ? 4 : 8;

    let formatLabel = (labelStr) => {
      const parts = labelStr.split(' ');
      return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : labelStr;
    };

    if (data.length >= 2) {
      const parseDate = (str) => {
        const parts = str.split(' ');
        const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        return new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
      };
      const startDate = parseDate(data[0].label);
      const endDate = parseDate(data[data.length - 1].label);
      const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

      if (diffDays > 365 * 1.5) {
        formatLabel = (labelStr) => parts => parts.length >= 3 ? parts[2] : labelStr;
      } else if (diffDays > 45) {
        formatLabel = (labelStr) => {
          const parts = labelStr.split(' ');
          return parts.length >= 3 ? `${parts[1]} '${parts[2].slice(-2)}` : labelStr;
        };
      }
    }

    const indicesToDraw = [];
    if (data.length > 0) {
      indicesToDraw.push(0);
      if (data.length > 1) {
        const step = (data.length - 1) / (maxLabels - 1);
        for (let i = 1; i < maxLabels - 1; i++) {
          const idx = Math.round(i * step);
          if (!indicesToDraw.includes(idx)) indicesToDraw.push(idx);
        }
        if (!indicesToDraw.includes(data.length - 1)) indicesToDraw.push(data.length - 1);
      }
    }
    indicesToDraw.sort((a, b) => a - b);

    const labelY = pad.top + plotH + Math.round(pad.bottom * 0.55);
    ctx.textBaseline = 'middle';
    indicesToDraw.forEach(i => {
      const x = pad.left + (plotW * i / data.length) + (plotW / data.length) / 2;
      ctx.fillText(formatLabel(data[i].label), x, labelY);
    });

    if (progress < 1) {
      barChartAnimId = requestAnimationFrame(renderFrame);
    } else {
      barChartMeta = { data, pad, plotW, plotH, minV, range, barW, w, h, zeroY };
      if (window._barSaveCanvas) window._barSaveCanvas();
    }
  }

  if (animateChart) {
    barChartAnimId = requestAnimationFrame(renderFrame);
  } else {
    renderFrame(performance.now() + DURATION);
  }
}

export function setupBarChartHover(canvasId = 'returns-canvas', onBarClick = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  let savedImageData = null;

  function saveCanvas() {
    const ctx = canvas.getContext('2d');
    savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreCanvas() {
    if (!savedImageData) return;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(savedImageData, 0, 0);
  }

  canvas.addEventListener('mousemove', (e) => {
    if (!barChartMeta || !barChartMeta.data || barChartMeta.data.length === 0) return;
    const { data, pad, plotW, plotH, minV, range, barW, w, h, zeroY } = barChartMeta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;
    const relX = mx - pad.left;

    if (relX < 0 || relX > plotW) {
      restoreCanvas();
      hideTooltip();
      canvas.style.cursor = 'default';
      return;
    }

    const idx = Math.floor(relX / (plotW / data.length));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    canvas.style.cursor = 'pointer';

    const valClass = d.value >= 0 ? 'tt-positive' : 'tt-negative';
    const valSign = d.value >= 0 ? '+' : '';
    showTooltip(e, `
      <div class="tt-label">${d.label}</div>
      <div class="tt-value ${valClass}">${valSign}${formatCompact(d.value)} shares</div>
      <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">${d.count} announcements</div>
    `);

    restoreCanvas();

    const ctx = canvas.getContext('2d');
    ctx.save();

    const barCenterX = pad.left + (plotW * clampedIdx / data.length) + (plotW / data.length) / 2;
    const barX = pad.left + (plotW * clampedIdx / data.length) + (plotW / data.length - barW) / 2;
    const barH = (Math.abs(d.value) / range) * plotH;
    const barY = d.value >= 0 ? zeroY - barH : zeroY;
    const r = Math.min(3, barW / 2);

    // 1. Vertical Dashed Probe
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(barCenterX, pad.top);
    ctx.lineTo(barCenterX, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Hovered Bar Glow
    ctx.fillStyle = d.value >= 0 ? '#10b981' : '#f43f5e';
    ctx.shadowColor = d.value >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(244, 63, 94, 0.8)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, Math.max(2, barH), d.value >= 0 ? [r, r, 0, 0] : [0, 0, r, r]);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Current Date Pill Badge
    ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
    const dateText = d.label;
    const textW = ctx.measureText(dateText).width;
    const pillW = textW + 16;
    const pillH = 22;
    const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, barCenterX - (pillW / 2)));
    const pillY = h - 26;

    ctx.fillStyle = 'rgba(18, 20, 30, 0.96)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateText, pillX + (pillW / 2), pillY + (pillH / 2));

    ctx.restore();
  });

  canvas.addEventListener('mouseleave', () => {
    restoreCanvas();
    hideTooltip();
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', (e) => {
    if (!barChartMeta || !barChartMeta.data || barChartMeta.data.length === 0) return;
    const { data, pad, plotW } = barChartMeta;
    const canvasRect = canvas.getBoundingClientRect();
    const mx = e.clientX - canvasRect.left;
    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) return;

    const idx = Math.floor(relX / (plotW / data.length));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    if (onBarClick) {
      onBarClick(d);
    }
  });

  window._barSaveCanvas = saveCanvas;
}

function showTooltip(e, html) {
  let tt = document.getElementById('chart-tooltip');
  if (!tt) {
    tt = document.createElement('div');
    tt.id = 'chart-tooltip';
    tt.className = 'chart-tooltip';
    document.body.appendChild(tt);
  }
  tt.innerHTML = html;
  tt.style.display = 'block';
  const x = Math.min(window.innerWidth - 180, e.clientX + 14);
  const y = Math.max(10, e.clientY - 35);
  tt.style.left = `${x}px`;
  tt.style.top = `${y}px`;
}

function hideTooltip() {
  const tt = document.getElementById('chart-tooltip');
  if (tt) tt.style.display = 'none';
}
