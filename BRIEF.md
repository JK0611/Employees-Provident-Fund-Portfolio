# BRIEF — EPF Invest Portfolio Dashboard

**Date:** 2026-08-08 · **Status:** approved

## What this is

EPF Invest is an institutional-grade financial portfolio tracker for monitoring Employees Provident Fund (EPF / KWSP) equity investments across Bursa Malaysia. It provides real-time portfolio valuation, sector allocation, gain/loss metrics, and granular transaction history for institutional investors and analysts.

- **Type:** Financial Dashboard / Console
- **Audience:** Institutional investors, financial analysts, retail tracking
- **Primary Action:** Explore EPF holdings, analyze sector weightings, and track valuation movements
- **Secondary Actions:** Search company tickers, filter by sector, inspect historical announcement logs

## Success looks like

- An executive-level financial UI with instant readability of key portfolio KPIs (Total Value, Net Change, Dividend Yield, Holding Count).
- Glassmorphic dark theme (`#0b0c1f` / `#111224`) with sleek glowing indicators and backdrop blurs.
- Responsive, pixel-perfect layout at desktop, tablet, and mobile widths.

## Design direction

- **Direction:** High-End Executive Analytics (Bloomberg / Linear terminal feel)
- **Theme:** Dark-First (Deep midnight `#0b0c1f` with violet `#8b5cf6`, cyan `#4cd7f6`, and emerald `#4ae176` accents)
- **Motion:** Restrained & sleek (subtle hover lifts, glowing border effects, crisp transition curves)
- **Brand inputs:** EPF logo & institutional styling cues

### Explicitly not this

- Not a generic template with plain flat cards.
- Not unstyled white/light default tables.
- Not hardcoded inline style colors scattered across JS.

## Scope

| Surface | Components | Priority |
|---|---|---|
| Header & Nav | Institutional Header, Live Pulse Indicator, Search Bar | P0 |
| KPI Hero Grid | Total Portfolio Value, Net Return, Sector Breakdown, Active Holdings Count | P0 |
| Holdings Data Table | Interactive Search, Sector Filter Pills, Sorting, Logo Badges, Status Chips | P0 |
| Sector Distribution | Progress Bars, Percentage Share Cards | P1 |

## Build

- **Stack:** HTML5 + Vanilla CSS (Design Tokens & Glassmorphism) + Vanilla JS (ES6+)
- **Deploy:** Vercel
