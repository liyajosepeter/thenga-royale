# THENGA ROYALE 👑
### *The Sovereign Arboreal Hairstyle Pageant — Mr. Coconut 2026*

> **"Which coconut tree has the best hairstyle?"**
> A serious scientific research system + A luxury beauty pageant + An absolutely unnecessary coconut competition.

---

## 🌴 Core Concept & Pageant Metrics

Every uploaded coconut tree crown image represents an independent contestant in the **Mr. Coconut 2026** competition. There are:
- **NO user accounts**
- **NO authentication / login**
- **NO one-entry-per-person restrictions**
- The same operator can enter unlimited coconut trees into the global competition.

### 📐 The 4 Hairstyle Dimensions (OpenCV Calibrated)

1. **🌿 HAIR VOLUME (30%)** — Foliage pixel density and crown coverage relative to the convex hull envelope.
2. **↔️ HAIR SPREAD (25%)** — Horizontal canopy wingspan aspect ratio vs. vertical height.
3. **⚖️ SYMMETRY (25%)** — Bilateral frond equilibrium across the vertical trunk centroid axis ($1.0 - \frac{|L - R|}{L + R}$).
4. **💨 WIND STYLE (20%)** — Directional Sobel gradient variance measuring aerodynamic drama and monsoonal hairtoss intensity.

$$\text{Overall Score} = (\text{Volume} \times 0.30) + (\text{Spread} \times 0.25) + (\text{Symmetry} \times 0.25) + (\text{Wind Style} \times 0.20)$$

### 👑 Sovereign Awards
- 👑 **MR. COCONUT 2026** — Highest Overall Composite Score
- 🌿 **VOLUME KING** — Highest Volume Score
- ↔️ **SPREAD KING** — Highest Spread Score
- ⚖️ **SYMMETRY KING** — Highest Symmetry Score
- 💨 **WIND KING** — Highest Wind Style Score

---

## 🛠️ Architecture & Tech Stack

- **Computer Vision Engine**: Python 3.13, OpenCV Headless (`cv2`), NumPy
- **Frontend / Fullstack**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Database & Storage**: Supabase PostgreSQL & Supabase Storage (with graceful offline mock fallback)
- **Serverless API**: Vercel Python Serverless Functions (`api/health.py`, `api/analyze.py`)
- **Deployment**: **Vercel ONLY**

---

## 📁 Project Directory Structure

```
thenga-royale/
├── app/
│   ├── page.tsx          # Grand Hall (Home / Hero / Hall of Fame preview)
│   ├── judge/            # Jury Chamber (Arboreal Appraisal / Upload / CV Analysis)
│   ├── leaderboard/      # Sovereign Leaderboard (Podium / Category King filter)
│   ├── results/          # Official Dossier (Pageant Certificate / Frond Diagnostics)
│   ├── layout.tsx        # Root Pageant Layout
│   └── globals.css       # Luxury styling & design tokens
├── components/
│   ├── Navbar.tsx        # Luxury navigation header with CV active indicator
│   ├── Footer.tsx        # Pageant footer & credits
│   ├── ContestantCard.tsx# Contestant card with metrics and awards
│   ├── MetricBar.tsx     # Dimension progress bar with weights
│   ├── AwardBadge.tsx    # Pageant King crown badges
│   └── UploadDropzone.tsx# Drag-and-drop coconut crown uploader & presets
├── python/
│   ├── __init__.py
│   ├── image_analysis.py # OpenCV HSV segmentation, contours, moments, metrics
│   └── scoring.py        # Official weighted formula & jury critique generator
├── api/
│   ├── health.py         # Vercel serverless Python health endpoint
│   └── analyze.py        # Vercel serverless Python CV analysis endpoint
├── lib/
│   ├── types.ts          # TypeScript models
│   ├── mockData.ts       # Iconic seed contestants
│   └── supabase.ts       # Supabase client initializer
├── public/
│   └── crown.svg
├── styles/
│   └── theme.css
├── .env.example
├── .gitignore
├── package.json
├── requirements.txt
├── vercel.json
└── README.md
```

---

## 🚀 Local Development

### 1. Python Environment
```bash
python -m pip install -r requirements.txt
python -m python.image_analysis
```

### 2. Next.js Web Application
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repository into Vercel.
3. Vercel automatically detects `vercel.json`, Next.js frontend, and the Python serverless endpoints in `api/`.
4. (Optional) Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables.