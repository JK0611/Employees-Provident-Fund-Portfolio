/**
 * Line Chart Canvas Engine with Smooth Cubic/Linear Path,
 * dynamic theme awareness, single glowing head node,
 * clean hover probe with vertical dashed guide,
 * and guaranteed single tracking circle.
 */

import { formatCompact } from '../core/utils.js';

let lineAnimMap = {};
let lineChartMeta = {};

export function drawLineChart(canvasId, data, color = null, animateChart = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement;
  if (!parent) return;

  const w = parent.clientWidth || 300;
  const h = parent.clientHeight || 280;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const isMobile = window.innerWidth < 768;
  const dynamicColor = color || (getComputedStyle(document.documentElement).getPropertyValue('--chart-primary').trim() || '#f43f5e');
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim() || 'rgba(255, 255, 255, 0.06)';

  const pad = {
    top: 20,
    right: isMobile ? 12 : 24,
    bottom: isMobile ? 26 : 32,
    left: isMobile ? 48 : 64
  };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  if (lineAnimMap[canvasId]) cancelAnimationFrame(lineAnimMap[canvasId]);
  ctx.clearRect(0, 0, w, h);

  if (!data || data.length < 2) {
    ctx.fillStyle = textColor;
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Insufficient data for this range', w / 2, h / 2);
    return;
  }

  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  let startTime = null;
  const DURATION = animateChart ? 600 : 0;

  function render(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = DURATION > 0 ? Math.min(elapsed / DURATION, 1) : 1;
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const maxDrawIndex = (data.length - 1) * easeProgress;

    ctx.clearRect(0, 0, w, h);

    // Grid + Y labels
    ctx.fillStyle = textColor;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = minV + (range * i / 4);
      const y = pad.top + plotH - (plotH * i / 4);
      ctx.fillText(formatCompact(val), pad.left - 8, y + 3);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
    }

    // Line Path
    ctx.save();
    ctx.beginPath();
    data.forEach((d, i) => {
      if (i > Math.ceil(maxDrawIndex)) return;
      let x = pad.left + (plotW * i / (data.length - 1));
      let y = pad.top + plotH - ((d.value - minV) / range * plotH);

      if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
        const prev = data[i - 1];
        const prevX = pad.left + (plotW * (i - 1) / (data.length - 1));
        const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
        const fraction = maxDrawIndex % 1;
        x = prevX + (x - prevX) * fraction;
        y = prevY + (y - prevY) * fraction;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.shadowColor = dynamicColor;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = dynamicColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // Area Gradient Fill
    ctx.save();
    ctx.beginPath();
    let lastX = pad.left;
    let lastY = pad.top + plotH;

    data.forEach((d, i) => {
      if (i > Math.ceil(maxDrawIndex)) return;
      let x = pad.left + (plotW * i / (data.length - 1));
      let y = pad.top + plotH - ((d.value - minV) / range * plotH);

      if (i === Math.ceil(maxDrawIndex) && i > 0 && maxDrawIndex % 1 !== 0) {
        const prev = data[i - 1];
        const prevX = pad.left + (plotW * (i - 1) / (data.length - 1));
        const prevY = pad.top + plotH - ((prev.value - minV) / range * plotH);
        const fraction = maxDrawIndex % 1;
        x = prevX + (x - prevX) * fraction;
        y = prevY + (y - prevY) * fraction;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      lastX = x;
      lastY = y;
    });

    ctx.lineTo(lastX, pad.top + plotH);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + plotH);
    grad.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
    grad.addColorStop(1, 'rgba(244, 63, 94, 0.00)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();


    // X Labels
    ctx.fillStyle = textColor;
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const maxLabels = isMobile ? 3 : 6;
    const step = Math.ceil((data.length - 1) / (maxLabels - 1));

    for (let i = 0; i < data.length; i += step) {
      const x = pad.left + (plotW * i / (data.length - 1));
      const label = data[i].label;
      const parts = label.split(' ');
      const displayLabel = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : label;
      ctx.fillText(displayLabel, x, h - 8);
    }

    // 1. Capture clean canvas (WITHOUT HEAD CIRCLE) for hover restore
    const cleanImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 2. Draw Head Node (The Single Circle at the end of the line)
    if (data.length > 0) {
      const lastIdx = Math.min(Math.ceil(maxDrawIndex), data.length - 1);
      const currX = pad.left + (plotW * lastIdx / (data.length - 1));
      const currY = pad.top + plotH - ((data[lastIdx].value - minV) / range * plotH);

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = dynamicColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(currX, currY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = dynamicColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // 3. Capture full canvas (WITH HEAD CIRCLE) for mouseleave restore
    const fullImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    lineChartMeta[canvasId] = { data, pad, plotW, plotH, minV, range, w, h, dynamicColor, cleanImageData, fullImageData };

    if (progress < 1) {
      lineAnimMap[canvasId] = requestAnimationFrame(render);
    }
  }

  if (animateChart) lineAnimMap[canvasId] = requestAnimationFrame(render);
  else render(performance.now() + DURATION);
}

export function setupLineChartHover(canvasId = 'portfolio-canvas', options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (canvas._hasHoverAttached) return;
  canvas._hasHoverAttached = true;

  function handlePointerMove(clientX, clientY) {
    if (lineAnimMap[canvasId]) {
      cancelAnimationFrame(lineAnimMap[canvasId]);
      lineAnimMap[canvasId] = null;
      if (lineChartMeta[canvasId]?.data) {
        drawLineChart(canvasId, lineChartMeta[canvasId].data, options.color || null, false);
      }
    }

    const meta = lineChartMeta[canvasId];
    if (!meta || !meta.data || meta.data.length < 2 || !meta.cleanImageData) return;
    const { data, pad, plotW, plotH, minV, range, w, h, dynamicColor, cleanImageData, fullImageData } = meta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = clientX - canvasRect.left;
    const relX = mx - pad.left;

    const ctx = canvas.getContext('2d');

    if (relX < 0 || relX > plotW) {
      if (fullImageData) ctx.putImageData(fullImageData, 0, 0);
      hideTooltip();
      resetLineDisplay();
      canvas.style.cursor = 'default';
      return;
    }

    const idx = Math.round(relX / (plotW / (data.length - 1)));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const d = data[clampedIdx];

    canvas.style.cursor = canvasId === 'drawer-history-canvas' ? 'pointer' : 'crosshair';

    const pointX = pad.left + (plotW * clampedIdx / (data.length - 1));
    const pointY = pad.top + plotH - ((d.value - minV) / range * plotH);

    // RESTORE CLEAN IMAGE DATA (ELIMINATES THE ORIGINAL HEAD CIRCLE!)
    ctx.putImageData(cleanImageData, 0, 0);

    // DRAW HOVER ELEMENTS
    ctx.save();

    // 1. Vertical Dashed Probe Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pointX, pad.top);
    ctx.lineTo(pointX, pad.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. The Follower Glowing Circle on Canvas
    const haloColor = options.color || dynamicColor || '#f43f5e';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = haloColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(pointX, pointY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = haloColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3. Current Date Pill Badge
    ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
    const dateText = d.label;
    const textW = ctx.measureText(dateText).width;
    const pillW = textW + 16;
    const pillH = 22;
    const pillX = Math.max(pad.left, Math.min(w - pad.right - pillW, pointX - (pillW / 2)));
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

    // Tooltip and UI updates
    const virtualEvent = { clientX, clientY };
    if (canvasId === 'drawer-history-canvas') {
      const subtitle = document.getElementById('drawer-chart-subtitle');
      if (subtitle) {
        subtitle.innerHTML = `<span class="text-white font-semibold">${d.label}</span>: <span class="text-rose-400 font-bold font-mono-numeric">${d.value.toLocaleString()} shares</span>`;
      }
      showTooltip(virtualEvent, `
        <div class="tt-label">${d.label}</div>
        <div class="tt-value text-rose-400 font-extrabold font-mono-numeric">${d.value.toLocaleString()} shares</div>
        <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">EPF Cumulative Hold</div>
        <div class="text-[9.5px] text-sky-400 font-semibold mt-1.5 flex items-center gap-1">
          <span>👇 Click point to jump to transaction in ledger</span>
        </div>
      `);
    } else {
      showTooltip(virtualEvent, `
        <div class="tt-label">${d.label}</div>
        <div class="tt-value tt-positive">${formatCompact(d.value)} shares</div>
        <div style="color:var(--text-muted);font-size:0.7rem;margin-top:2px">Net cumulative hold</div>
      `);

      // Update Live Value Display
      const valDisp = document.getElementById('portfolio-value-display');
      if (valDisp) valDisp.textContent = `${formatCompact(d.value)} shares (net)`;
      const legDate = document.getElementById('portfolio-legend-date');
      if (legDate) legDate.textContent = d.label;
    }
  }

  function handlePointerLeave() {
    const meta = lineChartMeta[canvasId];
    if (meta && meta.fullImageData) {
      const ctx = canvas.getContext('2d');
      ctx.putImageData(meta.fullImageData, 0, 0); // RESTORES ORIGINAL CIRCLE!
    }
    hideTooltip();
    resetLineDisplay();
    canvas.style.cursor = 'default';
  }

  function resetLineDisplay() {
    const meta = lineChartMeta[canvasId];
    if (!meta || !meta.data || meta.data.length === 0) return;
    if (canvasId === 'drawer-history-canvas') {
      const subtitle = document.getElementById('drawer-chart-subtitle');
      if (subtitle) subtitle.textContent = 'Historical shares balance over time';
    } else {
      const lastVal = meta.data[meta.data.length - 1].value;
      const valDisp = document.getElementById('portfolio-value-display');
      if (valDisp) valDisp.textContent = `${formatCompact(lastVal)} shares (net)`;
      const legDate = document.getElementById('portfolio-legend-date');
      if (legDate) legDate.textContent = 'Net Shareholdings Trend';
    }
  }

  function handleCanvasClick(clientX) {
    if (canvasId !== 'drawer-history-canvas') return;
    const meta = lineChartMeta[canvasId];
    if (!meta || !meta.data || meta.data.length < 2) return;
    const { data, pad, plotW } = meta;

    const canvasRect = canvas.getBoundingClientRect();
    const mx = clientX - canvasRect.left;
    const relX = mx - pad.left;
    if (relX < 0 || relX > plotW) return;

    const idx = Math.round(relX / (plotW / (data.length - 1)));
    const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
    const selected = data[clampedIdx];
    if (selected && selected.label && typeof window.jumpToDrawerLedgerDate === 'function') {
      window.jumpToDrawerLedgerDate(selected.label);
    }
  }

  // Mouse events (Desktop)
  canvas.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX, e.clientY);
  });
  canvas.addEventListener('mouseleave', handlePointerLeave);
  canvas.addEventListener('click', (e) => {
    handleCanvasClick(e.clientX);
  });

  // Touch events (Mobile)
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      handlePointerMove(touchStartX, touchStartY);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      if (e.cancelable) e.preventDefault();
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      if (Math.hypot(endX - touchStartX, endY - touchStartY) < 14) {
        handleCanvasClick(endX);
      }
    }
    handlePointerLeave();
  });
  canvas.addEventListener('touchcancel', handlePointerLeave);
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
