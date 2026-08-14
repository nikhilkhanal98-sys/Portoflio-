# Nikhil Khanal — Portfolio

Static HTML/CSS/JS portfolio. No framework, no build step required to serve — the
site is the files in `public/`. A small Python generator (`build_cases.py`) produces
the case-study pages from a data list; you only need it if you're editing content.

```
portfolio/
├── wrangler.jsonc          # Cloudflare Workers (Static Assets) config
├── build_cases.py          # regenerates public/work/** from the PROJECTS list
├── build_standalone.py     # regenerates the single-file portfolio-standalone.html
└── public/                 # <-- this is the deployable site
    ├── index.html          # home
    ├── style.css           # all styles
    ├── site.js             # scroll bar, reveals, cursor
    ├── 404.html
    ├── img/<project>/…     # optimised images
    └── work/<project>/index.html   # one case study per folder
```

## Preview locally
```bash
cd public
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy — Cloudflare Workers (via Wrangler CLI)
The included `wrangler.jsonc` serves `public/` as static assets.
```bash
cd portfolio
npx wrangler login      # one-time: authorises your Cloudflare account in the browser
npx wrangler deploy     # deploys; prints the live URL (portfolio.<account>.workers.dev)
```

## Deploy — Cloudflare Pages (via GitHub)
1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `portfolio/public`  (or `public` if this folder is the repo root)
4. Save & Deploy. Every push auto-deploys.

Any static host works the same way (Netlify, Vercel, GitHub Pages) — just point it at `public/`.

## Editing content
Case studies are generated. Edit the `PROJECTS` list in `build_cases.py`
(copy, image paths, per-section hero images), then:
```bash
python3 build_cases.py        # rebuild public/work/** and the Works index
python3 build_standalone.py   # (optional) rebuild the one-file version
```
Images with no asset yet render a bold **image** placeholder — drop a real file into
`public/img/<project>/` with the referenced name and re-run to fill it.

Optimise images before adding: max width 2000px, JPEG quality ~82, progressive.
Keep total `public/` under ~10 MB.
