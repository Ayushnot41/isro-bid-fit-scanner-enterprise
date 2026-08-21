# 🇮🇳 ISRO Bid-Fit Scanner Enterprise
### Autonomous E-Procurement Intelligence, GD&T Tolerance Engine & Statutory MSME Compliance Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5_Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4_Dark_Aerospace-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11_Springs-purple?style=flat-square&logo=framer)](https://motion.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_RLS_Vault-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/Compliance-GFR_2017_%26_ISRO_GCC-E05624?style=flat-square)]()

---

## 🛰️ What is ISRO Bid-Fit Scanner Enterprise? (In Simple Words)

When the **Indian Space Research Organisation (ISRO)** publishes tenders for rocket assemblies (PSLV, GSLV, LVM3), satellite hardware, or cryogenic valves, hundreds of pages of complex technical specifications are posted across different centers (**VSSC Trivandrum**, **URSC Bengaluru**, **SAC Ahmedabad**, **SDSC SHAR**, **IPRC Mahendragiri**, and **LPSC Valiamala**).

For manufacturing companies, reading every 100-page tender document manually takes **days**, and any slight mismatch (such as a missing $\pm 5\ \mu\text{m}$ machining capability or missing quality accreditation) leads to **immediate disqualification**.

### 💡 What this Platform Does:
1. **Autonomous 24/7 Scraper**: Continuously monitors **`eproc.isro.gov.in`** and extracts active RFPs, closing dates, estimated values, and engineering requirements.
2. **Mathematical Bid-Fit Engine**: Compares the tender's engineering drawings with the vendor's actual machine capabilities (Linear Tolerances in microns, Surface Roughness $Ra$, Cleanroom class, and AS9100D certificates).
3. **Statutory MSME Waiver Calculator**: Automatically calculates **₹0 Earnest Money Deposit (EMD)** exemptions under **Rule 170(i) of General Financial Rules (GFR) 2017** and validates the 25% MSME purchase preference.
4. **Institutional PDF Audit Dossier**: Generates a Government-of-India / ISRO level audit report in `.pdf` format ready for technical bidding submission.

---

## 🏗️ System Architecture

```
                                  eproc.isro.gov.in
                                         │
                         [ 24/7 Autonomous Scraper Engine ]
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

## 🚀 Key Features

* **⚡ Instant Fast-Loading UI**: Optimized response times ($<15\text{ms}$) with zero-lag transitions on mobile and desktop.
* **🤖 Dynamic Streaming AI Evaluator**: Word-by-word token generation with inline citation chips linking to ISRO General Conditions of Contract (GCC Section 4) and Ministry of MSME policies.
* **📑 Institutional PDF Dossier Generator**: Real vector PDF generator with structured GD&T compliance tables, zero text collision, and official audit verification hashes.
* **📂 Drag-and-Drop RFP Ingestion Studio**: Upload any ISRO procurement PDF for automated OCR and specification extraction (alloys, cleanroom standard, and tolerances).
* **🔐 Multi-Role Authentication Vault**: Dedicated tabs for **Vendor Sign In**, **Enterprise Register**, **ISRO Admin**, and **1-Click Demo Showcase**.

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

### 1. Prerequisites
* **Node.js**: v18.17+ or v20+
* **npm**: v9+

### 2. Installation & Running
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/isro-bid-fit-scanner-enterprise.git
cd isro-bid-fit-scanner-enterprise

# Install dependencies
npm install

# Start development server
npm run dev
# OR run the optimized production server:
npm run build && npm run start
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** and click **"Launch Demo Showcase (AeroPrecision India)"**.

---

## 🌐 Environment Variables (`.env.local`)

```env
# Supabase Configuration (Optional for Demo Mode / Required for Live Multi-Tenant Cloud)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🏛️ Contributing & Push to GitHub

```bash
# Stage and commit all changes
git add .
git commit -m "feat: complete ISRO Bid-Fit Scanner Enterprise rebuild with institutional PDF dossier & live scraper"

# Link to your new GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/isro-bid-fit-scanner-enterprise.git
git branch -M main
git push -u origin main
```

---

## 📜 Compliance & Statutory References
* **General Financial Rules (GFR) 2017** — Ministry of Finance, Govt. of India (Rule 170(i) for EMD exemption).
* **Public Procurement Policy for Micro and Small Enterprises (MSEs) Order, 2012** — Ministry of MSME.
* **General Conditions of Contract (GCC)** — Indian Space Research Organisation (ISRO).
