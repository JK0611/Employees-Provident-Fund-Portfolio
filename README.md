# EPF Tracker — Malaysian Institutional Portfolio & Filings Tracker

> Real-time tracker for Employees Provident Fund (KWSP / EPF) equity transactions and domestic shareholdings on Bursa Malaysia.

🌐 **Live Website**: [https://employees-provident-fund-portfolio.vercel.app/](https://employees-provident-fund-portfolio.vercel.app/)

---

## 📌 Overview

**EPF Tracker** is an institutional-grade portfolio intelligence dashboard that tracks and visualizes the equity investments of Malaysia's **Employees Provident Fund (KWSP)** across all public-listed companies on Bursa Malaysia.

It provides complete transparency into:
* 📅 **Transaction Timestamps & Dates**: Real-time tracking of when EPF buys or sells shares.
* 🔄 **Buy & Sell Actions (Inflow / Outflow)**: Precise logging of share acquisitions (+), disposals (-), and cessation events.
* 📊 **Share Volumes & Values**: Exact number of shares transacted and their estimated capital value (RM).
* 💼 **Portfolio Holdings & Stakes**: Total domestic equity portfolio breakdown (RM 228B+), direct ownership percentages (e.g. Tenaga 24.9%, Maybank 7.5%), and sector allocations.
* 🏛 **Official Bursa Filings**: Direct links to substantial shareholder notices filed on Bursa Malaysia.

---

## ✨ Key Features

* **⚡ Responsive Dual-Layout Engine**: Custom-tailored, independent UI experiences for both Desktop (institutional multi-column) and Mobile (smooth swipe gestures & native scroll).
* **🍩 Interactive Allocation Donut Charts**: Interactive breakdown of top 10 company weightings and macro sector distributions.
* **📈 Net Capital Activity Flow**: Dynamic volume charts visualizing EPF's capital accumulation vs. divestment over 1M, 3M, 1Y, and All-Time ranges.
* **🛡 Enterprise-Grade Security & Privacy**: OWASP Top 10 compliant, strict CSP headers, anti-clickjacking, and zero-cookie telemetry.
* **📊 Privacy-First Analytics**: PostHog telemetry with full PII input masking and mobile device diagnostics.

---

## 🛠 Tech Stack

* **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Obsidian Crimson Design System)
* **Analytics & Telemetry**: PostHog (Session Replay & Device Intelligence)
* **Data & Scraping Pipeline**: Node.js, Cheerio, Axios, Puppeteer
* **Deployment & Edge Security**: Vercel (`vercel.json` with HSTS, CSP & Security Headers)

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/JK0611/Employees-Provident-Fund-Portfolio.git

# Open frontend in browser or start local static server
npx serve frontend
```

---

## 🔗 Live Application
Access the production dashboard anytime at:  
👉 **[https://employees-provident-fund-portfolio.vercel.app/](https://employees-provident-fund-portfolio.vercel.app/)**