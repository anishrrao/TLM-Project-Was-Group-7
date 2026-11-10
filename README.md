# LODGEMATE AI — Lodge Management Dashboard

> *Your lodge. One intelligent management system.*

[![Deploy to GitHub Pages](https://github.com/anishrrao03-ops/LodgeMate-AI/actions/workflows/deploy.yml/badge.svg)](https://github.com/anishrrao03-ops/LodgeMate-AI/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-emerald?style=flat&logo=github)](https://anishrrao03-ops.github.io/LodgeMate-AI/)

**LODGEMATE AI** is an intelligent lodge management agent designed for **Temple Trails Family Lodge**, a 40-key family-run lodge located near a major temple town in Karnataka, India.

---

## 🌟 Live Demo

The static frontend is published directly via GitHub Pages:
👉 **[https://anishrrao03-ops.github.io/LodgeMate-AI/](https://anishrrao03-ops.github.io/LodgeMate-AI/)**

---

## 🏨 The Business Problem Solved

The lodge faces two opposite operational challenges:
1. **Peak Festival Surges**: During annual temple festivals (Rathotsava, Maha Shivaratri, Karthika Deepotsava), demand surges, causing overbooking, staff shortages, kitchen stockouts, and transport bottlenecks.
2. **Ordinary Weekday Slumps**: On normal weekdays (Mon–Thu), occupancy falls to 30–40%, leaving rooms empty and hurting revenue.

LODGEMATE AI acts as a central operational assistant that evaluates demand, recommends rule-based pricing adjustments, schedules staff, manages inventory, coordinates local transport, and prepares actions for **mandatory manager approval**.

---

## 🚀 Key Modules & Features

1. **Executive Overview**: 40-room physical state matrix (Standard, Deluxe, Premium, Suites), real-time occupancy, ADR, RevPAR, and operational alerts.
2. **AI Command Centre**: Simulated interactive reasoning agent answering complex questions regarding demand, supplies, staffing, and festival pace.
3. **Demand Forecasting Engine**: Implements the formula:
   $$\text{Forecast} = (0.40 \times H) + (0.25 \times W) + (0.25 \times B) + (0.10 \times C)$$
   with 7, 14, and 30-day horizons and weekday occupancy recovery strategies.
4. **Dynamic Room Pricing & 10 Guardrails**: Tiered pricing matrix with booking pace adjustments, competitor median caps, $\pm 10\%$ daily volatility bounds, and profitable rate floors.
5. **Competitor Intelligence**: Live benchmarking across 5 local temple town lodges with price variance and amenity tracking.
6. **Workforce Planning**: Ratios for Housekeeping (1:12 checkouts, 1:20 stayovers), Kitchen (1:40 meals), Front Desk, and Maintenance to compute staff shortages and temporary guild costs.
7. **Inventory & Procurement**: Reorder points, safety stock calculations, and 1-click purchase order generation for critical dairy and vegetables.
8. **Food & Kitchen Planning**: Batch preparation planning for authentic satvik Udupi vegetarian meals, Annadana offset tracking, and overflow catering alerts.
9. **Local Partner Coordination**: Transport capacity gap calculator with local taxi fleets, auto-rickshaw clusters, and dining mess partners.
10. **Festival Management**: Karnataka religious festival calendar, 3-year demand comparisons, Festival Readiness Scores (0–100), and interactive prep checklists.
11. **Financial Analytics**: 3-year YoY financial ledger (2024 vs 2025 vs 2026), ADR, RevPAR, and projected net profit recovery from AI interventions.
12. **AI Approval Centre**: Human-in-the-loop governance where the manager reviews, approves, or rejects proposed actions with full audit logging in `localStorage`.
13. **Reports & 2026 Decline Deep Dive**: Forensic analysis identifying the 5 contributing factors behind the 2026 festival booking drop (marketing spend cuts, new competitor supply, road detours, shrinking booking windows, and review friction).
14. **Settings & AI Architecture**: Architecture demonstration of Retrieval-Augmented Generation (RAG) and Model Context Protocol (MCP) with ethical safeguards.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting**: Static GitHub Pages via GitHub Actions
- **Storage**: Client-side `localStorage` persistence

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/anishrrao03-ops/LodgeMate-AI.git
cd LodgeMate-AI

# Install dependencies (consistent with package-lock.json)
npm ci

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Apache-2.0
