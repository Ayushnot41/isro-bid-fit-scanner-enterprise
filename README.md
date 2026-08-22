# 🇮🇳 ISRO Bid-Fit Scanner Enterprise
### Autonomous E-Procurement Intelligence, WebCMD Scraper & Statutory MSME Compliance Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel_Live_App-isro--bid--fit--scanner--enterprise.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://isro-bid-fit-scanner-enterprise.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5_Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Dark_Aerospace-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11_Springs-purple?style=flat-square&logo=framer)](https://motion.dev/)
[![WebCMD Scraper](https://img.shields.io/badge/WebCMD-Autonomous_Crawler-10B981?style=flat-square)](https://github.com/Ayushnot41/isro-bid-fit-scanner-enterprise)
[![Compliance](https://img.shields.io/badge/Compliance-GFR_2017_%26_ISRO_GCC-E05624?style=flat-square)]()

---

## 🚀 Live Vercel Production Links

| Environment / Asset | Direct URL | Description |
| :--- | :--- | :--- |
| **🌐 Production Web App** | [**`isro-bid-fit-scanner-enterprise.vercel.app`**](https://isro-bid-fit-scanner-enterprise.vercel.app) | Live deployed Next.js application on Vercel |
| **📊 Command Center HUD** | [**`isro-bid-fit-scanner-enterprise.vercel.app/dashboard`**](https://isro-bid-fit-scanner-enterprise.vercel.app/dashboard) | Live Bid-Fit Command Center & KPI telemetry |
| **🛰️ Active ISRO RFPs** | [**`isro-bid-fit-scanner-enterprise.vercel.app/tenders`**](https://isro-bid-fit-scanner-enterprise.vercel.app/tenders) | Multi-center live ISRO tenders catalog |
| **📑 Evaluations Vault** | [**`isro-bid-fit-scanner-enterprise.vercel.app/evaluations`**](https://isro-bid-fit-scanner-enterprise.vercel.app/evaluations) | Technical Dossier archive & fit scores |
| **🎯 Competitor Intelligence** | [**`isro-bid-fit-scanner-enterprise.vercel.app/competitors`**](https://isro-bid-fit-scanner-enterprise.vercel.app/competitors) | L1 winning margins & co-bidding overlap |
| **🛠️ Capability Matrix** | [**`isro-bid-fit-scanner-enterprise.vercel.app/profile`**](https://isro-bid-fit-scanner-enterprise.vercel.app/profile) | 5-Axis CNC GD&T & Udyam configuration |
| **📄 Hackathon Pitch Dossier (PDF)** | [**`ISRO_BidFit_Scanner_Hackathon_Winning_Dossier.pdf`**](https://isro-bid-fit-scanner-enterprise.vercel.app/ISRO_BidFit_Scanner_Hackathon_Winning_Dossier.pdf) | Official PDF Pitch Deck for judges |

---

## 🛰️ What is ISRO Bid-Fit Scanner Enterprise? (In Simple Words)

When the **Indian Space Research Organisation (ISRO)** publishes tenders for rocket assemblies (PSLV, GSLV, LVM3), satellite hardware, or cryogenic valves, hundreds of pages of complex technical specifications are posted across different centers (**VSSC Trivandrum**, **URSC Bengaluru**, **SAC Ahmedabad**, **SDSC SHAR**, **IPRC Mahendragiri**, and **LPSC Valiamala**).

For manufacturing companies, reading every 100-page tender document manually takes **days**, and any slight mismatch (such as a missing $\pm 5\ \mu\text{m}$ machining capability or missing quality accreditation) leads to **immediate disqualification**.

### 💡 What this Platform Does:
1. **🌐 WebCMD Autonomous Scraper**: Continuously navigates **`eproc.isro.gov.in`** to extract active RFPs, closing dates, estimated values, and engineering requirements.
2. **📐 Mathematical Bid-Fit Engine**: Compares the tender's engineering drawings with the vendor's actual machine capabilities (Linear Tolerances in microns, Surface Roughness $Ra$, Cleanroom class, and AS9100D certificates).
3. **💰 Statutory MSME Waiver Calculator**: Automatically calculates **₹0 Earnest Money Deposit (EMD)** exemptions under **Rule 170(i) of General Financial Rules (GFR) 2017** and validates the 25% MSME purchase preference.
4. **📄 Institutional PDF Audit Dossier**: Generates a Government-of-India / ISRO level audit report in pure `.pdf` format ready for technical bidding submission.

---

## 🌐 WebCMD Scraping Infrastructure & Features

### ❓ What is WebCMD?
**WebCMD (Web Command & Control Engine)** is the autonomous headless crawling and extraction protocol engineered specifically for ISRO's e-Procurement portal (`eproc.isro.gov.in`).

Because government procurement portals use complex dynamic tables, session tokens, and PDF attachments, traditional static scraping fails. WebCMD uses a headless browser automation agent to execute structured commands against the portal.

```
                          eproc.isro.gov.in (ISRO Portal)
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │          WebCMD Scraping Engine               │
                 │   [ Headless Chromium + Session Manager ]     │
                 └───────────────────────┬───────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
[ Command: NAVIGATE ]         [ Command: EXTRACT_TABLE ]     [ Command: SCAN_NIT_PDF ]
  Traverses VSSC, URSC,         Parses Reference Numbers,      Extracts Alloys, GD&T
  SAC, SDSC, IPRC & LPSC        Closing Dates, EMD & Budgets   Tolerances & Cleanrooms
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         ▼
                     [ JSON Telemetry & Real-Time Sync ]
```

---

### ✨ WebCMD Features Used in this Project

| WebCMD Feature | Purpose & Implementation | Where in Code |
| :--- | :--- | :--- |
| **Multi-Center Crawling** | Concurrently scans all 6 major ISRO procurement centers (**VSSC**, **URSC**, **SAC**, **SDSC**, **IPRC**, **LPSC**). | [`src/lib/scraper/webcmd-engine.ts`](src/lib/scraper/webcmd-engine.ts) |
| **Dynamic Table Extraction** | Extracts reference numbers, EMD values, closing dates, and tender categories without page reloads. | [`src/lib/scraper/isro-tenders.ts`](src/lib/scraper/isro-tenders.ts) |
| **Continuous 20s Pulse** | Runs an automated 20-second background reconciliation pulse with live status badges. | [`src/components/tenders/tender-list.tsx`](src/components/tenders/tender-list.tsx) |
| **Telemetry & Latency Profiling** | Returns network latency (ms), DOM elements scanned, and PDF attachments processed. | [`src/app/api/scrape/route.ts`](src/app/api/scrape/route.ts) |
| **Decoupled Worker Container** | Containerized headless Chromium daemon running independently from the Next.js frontend. | [`worker/Dockerfile`](worker/Dockerfile) & [`docker-compose.yml`](docker-compose.yml) |

---

### 🕹️ How to Use & Access WebCMD in this Project

#### Method 1: Via Interactive Web UI (Instant / 20s Pulse)
1. Open **[http://localhost:3000/tenders](http://localhost:3000/tenders)**.
2. In the top-right corner of the tender catalog, notice the **`SYNCING (20s Pulse)`** live indicator.
3. Click **"Sync Live Tenders"** to trigger an on-demand WebCMD scan across all 6 ISRO centers.

#### Method 2: Via REST API Endpoint
You can trigger WebCMD programmatically from any script or terminal:

```bash
# Trigger an autonomous WebCMD synchronization run:
curl -X POST http://localhost:3000/api/scrape

# WebCMD Response:
{
  "success": true,
  "message": "WebCMD: Successfully synchronized 8 ISRO tenders from eproc.isro.gov.in",
  "engine": "WebCMD-Autonomous-Headless-Crawler-v2",
  "webcmd_telemetry": {
    "network_latency_ms": 28,
    "dom_elements_parsed": 142,
    "pdf_nit_attachments_scanned": 8
  },
  "count": 8
}
```

#### Method 3: Via Dockerized Background Worker
Run the full microservice stack with WebCMD worker daemon:

```bash
docker-compose up -d
```

---

## 🏗️ Overall System Architecture

```
                                  eproc.isro.gov.in
                                         │
                         [ WebCMD Autonomous Scraper Engine ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
          [ Scraped Tenders ]                        [ Manual RFP PDF Upload ]
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
                 [ Multi-Factor GD&T & Statutory Evaluation Engine ]
                   ├── Linear Tolerances (± µm)
                   ├── Surface Roughness (Ra µm)
                   ├── AS9100D / ISO 9001 / NABL Accreditations
                   ├── MSME GFR 2017 Rule 170(i) EMD Exemption
                   └── 5-Axis CNC Simultaneous Machining Capability
                                         │
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │         Next.js 14 App Router + Framer Motion          │
            ├────────────────────────────────────────────────────────┤
            │  • Real-time Bid-Fit Telemetry Command Center          │
            │  • Interactive What-If Capability Matrix Studio        │
            │  • Dynamic Streaming AI Token Synthesis (ISRO GCC)     │
            │  • Official Institutional Vector PDF Dossier Export    │
            └────────────────────────────────────────────────────────┘
```

---

## 📊 Evaluation Algorithm (Weighted Scoring)

$$\text{Final Fit Score} = (S_{\text{cert}} \times 0.30) + (S_{\text{tol}} \times 0.30) + (S_{\text{msme}} \times 0.15) + (S_{\text{cap}} \times 0.15) + (S_{\text{turnover}} \times 0.10)$$

Where:
* $S_{\text{cert}}$: Percentage of required aerospace accreditations held (AS9100D, ISO 9001, NABL).
* $S_{\text{tol}}$: Precision machining tolerance matching ($T_{\text{vendor}} \le T_{\text{required}}$).
* $S_{\text{msme}}$: Statutory EMD waiver and purchase preference qualification under GFR 2017.
* $S_{\text{cap}}$: Manufacturing process alignment (5-Axis CNC, Titanium fabrication, NDT).
* $S_{\text{turnover}}$: Financial turnover eligibility against contract value.

---

## 💻 Local Quick Start

```bash
# Clone repository
git clone https://github.com/Ayushnot41/isro-bid-fit-scanner-enterprise.git
cd isro-bid-fit-scanner-enterprise

# Install dependencies
npm install

# Start optimized production server
npm run build && npm run start
```

Visit **[http://localhost:3000](http://localhost:3000)** to launch the platform.

---

## 📜 Statutory & Compliance References
* **General Financial Rules (GFR) 2017** — Ministry of Finance, Govt. of India (Rule 170(i) for EMD exemption).
* **Public Procurement Policy for Micro and Small Enterprises (MSEs) Order, 2012** — Ministry of MSME.
* **General Conditions of Contract (GCC)** — Indian Space Research Organisation (ISRO).
