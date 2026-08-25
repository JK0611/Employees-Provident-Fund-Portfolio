/**
 * EPF Tracker — Line Chart Engine (Portfolio Trend)
 * High-performance smooth Bezier canvas with dynamic DPI & theme awareness
 */

import { formatCompact } from '../core/utils.js';

let lineAnimId = null;

export function drawLineChart(canvasId, data, color = null, animateChart = true) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const dynamicColor = color || (getComputedStyle(document.documentElement).getPropertyValue('--chart-primary').trim() || '#f43f5e');
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#64748b';
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-subtle').trim() || 'rgba(255, 255, 255, 0.06)';

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  if (lineAnimId) {
    cancelAnimationFrame(lineAnimId);
    lineAnimId = null;
  }

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
  const DURATION = animateChart ? 800 : 0;

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

    // Moving Glowing Head Node
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

    // X Labels
    ctx.fillStyle = textColor;
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    const isMobile = window.innerWidth < 768;
    const maxLabels = isMobile ? 3 : 6;
    const step = Math.ceil((data.length - 1) / (maxLabels - 1));

    for (let i = 0; i < data.length; i += step) {
      const x = pad.left + (plotW * i / (data.length - 1));
      const label = data[i].label;
      const parts = label.split(' ');
      const displayLabel = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : label;
      ctx.fillText(displayLabel, x, h - 10);
    }

    if (progress < 1) {
      lineAnimId = requestAnimationFrame(render);
    }
  }

  if (animateChart) {
    lineAnimId = requestAnimationFrame(render);
  } else {
    render(performance.now() + DURATION);
  }
}
