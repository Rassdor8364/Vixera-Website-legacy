# Vixera AI — Website

The official public website for **Vixera AI** and its ecosystem: Vixera (business operating system — live), Praxion (document intelligence), Pantrix (home intelligence), Praevion (predictive & financial intelligence), and **Vixera One** (personal intelligence — coming soon).

## Stack

Pure static HTML/CSS/JS — no framework, no build step. Deploys anywhere that serves static files (Vercel, Netlify, Cloudflare Pages, any web server).

```
/                       Homepage
/products/              Ecosystem overview
/products/vixera/       Vixera — business OS (live product)
/products/praxion/      Praxion — documents
/products/pantrix/      Pantrix — home
/products/praevion/     Praevion — markets
/vixera-one/            Vixera One announcement + waitlist (COMING SOON)
/about/ /updates/ /security/ /contact/ /privacy/ /terms/
assets/css/site.css     Design system (all tokens at the top)
assets/js/site.js       Nav, menus, reveal motion, forms
```

## Design system

- **Global palette**: the Vixera AI brand — `#0B0E14` ground, `#121826`/`#1E293B` surfaces, violet→blue→cyan accents (`#7C3AED / #3B82FF / #00D4FF`).
- **Vixera One only** uses the warm champagne sub-brand, scoped under the `.one-world` class (the tokens are redefined there — nothing else needs to change).
- Type: Jost (display), Geist (body), Geist Mono (labels) via Google Fonts.

## Run locally

```bash
npx serve . -l 4173
```

Then open http://localhost:4173. (A static server is required — the pages use absolute paths.)

## Deploy on Vercel

Import this repo → Framework preset: **Other** → no build command → output directory: root. `sitemap.xml`, `robots.txt`, per-page SEO/OG tags and a `404.html` are included.

## Honest-preview notes (to finish before launch)

- **Waitlist & contact forms** currently store submissions in the visitor's browser only (`assets/js/site.js`) and say so in the UI, privacy policy and terms. Connect a backend (e.g. Supabase table + serverless endpoint) and update that copy.
- All product mockups use fictional demo data and are labeled as conceptual previews.
- Unshipped features are written in "designed to / planned" tense on purpose — keep it that way until they ship.
- No analytics wired; `data-track` attributes are in place if Vercel Analytics is added later.
- `assets/img/vixera-lockup.png` (1.2 MB) is used only as the social og:image; consider exporting a 1200×630 version.
