/**
 * EPF Tracker — Pie / Donut Chart Engine
 * Clean interactive SVG/Canvas with smooth segment pop-out and hover legend tracking
 */

import { formatCompact, formatCurrency } from '../core/utils.js';

const PIE_COLORS = [
  '#f43f5e', '#fb7185', '#e11d48', '#fda4af',
  '#38bdf8', '#fbbf24', '#34d399', '#a78bfa',
  '#f97316', '#22d3ee', '#818cf8', '#64748b'
];

let pieMeta = {};

export function getPieData(type = 'company', rawData = window.EPF_DATA) {
  if (!rawData || !rawData.holdings) return [];
  const total = rawData.holdings.reduce((s, h) => s + (h.market_value || 0), 0);
  if (total === 0) return [];

  if (type === 'company') {
    const sorted = [...rawData.holdings].sort((a, b) => (b.market_value || 0) - (a.market_value || 0));
    const top9 = sorted.slice(0, 9);
    const top9Total = top9.reduce((s, h) => s + (h.market_value || 0), 0);
    const othersVal = total - top9Total;

    const result = top9.map((h, i) => ({
      label: h.stock_name,
      sublabel: h.company_name,
      value: h.market_value || 0,
      pct: ((h.market_value || 0) / total * 100).toFixed(1),
      color: PIE_COLORS[i % PIE_COLORS.length]
    }));

    if (othersVal > 0) {
      result.push({
        label: `Others (${sorted.length - 9})`,
        sublabel: 'Remaining Holdings',
        value: othersVal,
        pct: (othersVal / total * 100).toFixed(1),
        color: '#64748b'
      });
    }
    return result;
  } else {
    const map = {};
    rawData.holdings.forEach(h => {
      map[h.sector] = (map[h.sector] || 0) + (h.market_value || 0);
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const top8 = sorted.slice(0, 8);
    const top8Total = top8.reduce((s, [, v]) => s + v, 0);
    const othersVal = total - top8Total;

    const result = top8.map(([sec, val], i) => ({
      label: sec,
      sublabel: '',
      value: val,
      pct: (val / total * 100).toFixed(1),
      color: PIE_COLORS[i % PIE_COLORS.length]
    }));

    if (othersVal > 0) {
      result.push({
        label: 'Others',
        sublabel: '',
        value: othersVal,
        pct: (othersVal / total * 100).toFixed(1),
        color: '#64748b'
      });
    }
    return result;
  }
}

export function drawPieChart(canvasId, data, type = 'company', animate = true) {
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
  const cx = w / 2;
  const cy = h / 2;
  const outerR = Math.min(cx, cy) - 16;
  const innerR = outerR * 0.58;

  ctx.clearRect(0, 0, w, h);

  if (!data || data.length === 0) return;

  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;
  const slices = [];

  data.forEach((d) => {
    const sweep = (d.value / total) * (Math.PI * 2);
    const endAngle = startAngle + sweep;
    slices.push({
      ...d,
      startAngle,
      endAngle,
      cx,
      cy,
      innerR,
      outerR
    });

    ctx.save();
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#08090e';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    startAngle = endAngle;
  });

  // Center Count & Subtext
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const centerText = type === 'company' ? `${window.EPF_DATA?.holdings?.length || 260} stocks` : `${data.length} sectors`;
  ctx.fillText(centerText, cx, cy);

  pieMeta[canvasId] = { slices, cx, cy, innerR, outerR };
}

export function renderPieLegend(containerId, data) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.map(d => `
    <div class="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${d.color}"></span>
        <span class="font-bold text-white truncate">${d.label}</span>
      </div>
      <span class="font-mono text-outline shrink-0 ml-2">${d.pct}%</span>
    </div>
  `).join('');
}
