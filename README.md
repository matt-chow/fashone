# Fashone — The Illustrated Handbook of Men's Style

An interactive, illustrated guide to menswear: how clothes fit, how colours and patterns combine, what occasions ask for, and where style traditions come from. Every figure is drawn in code (SVG). Alongside them sit 26 archival photographs, fashion plates and advertisements, all public domain, CC0 or CC BY. Each has its source and rights recorded in `src/data/archive.json` and credited on the in-app `/credits` page. All data stays in your browser.

## What's inside

| Area | Route | What it does |
| --- | --- | --- |
| Handbook | `/handbook`, `/handbook/:id` | 28 chapters in four volumes. Interactive anatomy plates, embedded outfits and exercises, "Go deeper" sections, reading progress, bookmarks, cross-links. |
| Encyclopedia | `/encyclopedia`, `/encyclopedia/:id`, `/compare` | 80 garments with filtering (category, formality, season), fit, fabrics, history, buying and care notes, plus side-by-side comparison. |
| Outfit Studio | `/studio` | Dress a layered figure slot by slot: garment, colour, pattern, fit, skin tone and hair; set occasion, season and tradition. Rule-based notes are labelled **Convention** or **Interpretation**, and nothing is scored. Includes randomise, reset, save, share links, guided lessons and 21 presets. |
| Style Atlas | `/atlas`, `/atlas/:id` | 15 traditions on a timeline, with what each draws on and what it feeds into. |
| Practice | `/practice`, `/practice/:id` | Colour workshop, silhouette lab, formality ladder, pattern match, garment identification, and Studio challenges. |
| Saved | `/saved` | Saved outfits, bookmarks, reading progress, and JSON export/import. |

Also included: global search (press `/`), breadcrumbs, deep links for every outfit (`/studio?o=…`), and four themes (Study, Heritage, Midnight, Archive) remembered per browser.

## Running it

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit tests
npx playwright install chromium   # once
npm run e2e        # Playwright, desktop + mobile viewports
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/
```

## Deploying for free

`dist/` is a static site. The build copies `index.html` to `404.html`, so client-side routes resolve on GitHub Pages; Netlify and Cloudflare Pages need an SPA fallback (`/* /index.html 200`). If you serve from a sub-path (e.g. `https://user.github.io/fashone/`), set `base` in `vite.config.ts` (the router follows it).

## Architecture

- **Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, React Router, Motion (respects `prefers-reduced-motion`), idb-keyval, lucide-react. Self-hosted fonts: Gloock, Libre Caslon Text and Jost.
- **One data model** (`src/data`): garments, colours, patterns, occasions, styles, presets, challenges and chapters cross-reference each other by id. A unit test validates every reference.
- **Figure** (`src/figure`): a 400×1000 SVG figure with one layer per wardrobe slot. Every view uses it: Studio, encyclopedia specimens, anatomy plates and activities.
- **Explanations** (`src/lib/explain.ts`): pure rules that turn an outfit and its context into notes, each tagged as convention or interpretation.
- **Persistence** (`src/lib/store.tsx`): IndexedDB with a versioned schema and validation on import. Themes are kept in localStorage.

## Notes on content

The editorial text is original and written for this project. It summarises widely shared tailoring conventions and is not copied from any publication. Style histories are deliberately broad and approximate. `PRODUCT.md` records the product intent behind the design; it was inferred from the original brief.

## Known limitations

- 28 chapters rather than the ~36 first planned; the remaining topics are covered inside existing chapters.
- The figure is a single front-facing pose with stylised garments, so fine details (lapel roll, shoe last) are only suggested.
- Data is per-browser; use Export/Import on the Saved page to move it.
