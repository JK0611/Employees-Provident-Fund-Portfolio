# Employees Provident Fund (EPF) Portfolio Tracking System

A full-stack data pipeline and interactive Web UI for tracking and analyzing Employees Provident Fund (EPF / KWSP) investment holdings in public-listed companies on Bursa Malaysia.

---

## 📁 Project Architecture & Directory Structure

```
Employees-Provident-Fund-Portfolio/
├── assets/                         # Media Assets & Branding Specifications
│   └── logo/                       # Corporate Logos & Document Specifications
├── data/                           # Scraped Datasets, SQL Dumps & Cache
│   ├── links.json                  # Target Announcement URLs & Metadata
│   ├── scrape_results.sql          # Exported SQL Database Backup
│   ├── scrape_test_results.json    # Processed Announcement Records
│   ├── codes_cache.json            # Cached Stock Tickers & Company Profiles
│   ├── detected_cessations.json    # Cessation of Substantial Shareholder Logs
│   ├── skipped_ids.json            # Skipped ID Cache for Incremental Scrapes
│   └── test_scrape.json            # Sample Test Data Payload
├── frontend/                       # Interactive Dashboard Web Application
│   ├── index.html                  # Main Web Interface Entrypoint
│   ├── style.css                   # Custom CSS Layout & Themes
│   ├── app.js                      # Portfolio Analytics & Data Visualization Logic
│   ├── data.js                     # Compiled Portfolio Payload
│   └── logo.json                   # Stock Logo Mapping Matrix
├── scripts/                        # Data Collection & ETL Processing Pipeline
│   ├── process_data.js             # ETL Pipeline: Aggregates Raw Data -> frontend/data.js
│   ├── scrape_test.js              # Scraper: Fetches EPF Bursa Malaysia Announcements
│   ├── check_pagination.js         # API Pagination Diagnostic Script
│   └── verify-scrape-schedule.js   # Automated Scraping Scheduler Verification
├── scratch/                        # Temporary Workspace & Investigation Bench
│   └── extracted_docx/             # Extracted Specification Documents
├── .gitignore                      # Git Version Control Exclusions
├── package.json                    # Node.js Dependencies & Execution Scripts
├── README.md                       # Project Documentation & Architecture Guide
└── vercel.json                     # Vercel Deployment Configuration
```

---

## 🚀 Quick Start Guide

### 1. Run Development Server
To launch the interactive frontend dashboard locally:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Run Data Pipeline (ETL)
To re-process raw Bursa announcements into `frontend/data.js`:
```bash
npm run process
```

### 3. Run Announcement Scraper
To fetch new announcement records from Bursa Malaysia:
```bash
npm run scrape
```

---

## 🛠 Tech Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Responsive & Custom Design)
- **Data Scraping**: Node.js, Cheerio, Axios, Puppeteer Extra, Got Scraping
- **Deployment**: Vercel (`vercel.json`)