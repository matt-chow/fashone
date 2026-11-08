# Fashone — The Illustrated Handbook of Men's Style

An interactive, illustrated guide to menswear: how clothes fit, how colours and patterns combine, what occasions ask for, and where style traditions come from. Every figure is drawn in code (SVG). Alongside them sit 26 archival photographs, fashion plates and advertisements (provenance in `src/data/archive.json`) and 65 photographs of real garments and people (provenance in `src/data/photos.json`). Every image is public domain, CC0, CC BY or CC BY-SA, checked against its source record, and credited on the in-app `/credits` page. All data stays in your browser.

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

## Photographs

`src/data/photos.json` is the manifest for photographs. Each entry has the file, creator, date, source page, original file URL, licence and licence URL, the rights basis, a ready-made attribution line, alt text, an optional caption note, and where it is used (`garments` for the Encyclopedia header, `body` for the "As worn" figure, `styles` for the Atlas). `validate()` checks that every field is present and every licence is on the open list, and a test checks that every file is on disk. Photographs are shown on a 4:5 plate, uncropped (`object-contain`) and without the tint used on archival plates, so colours stay true. Style photographs that are contemporary or revival carry a note saying so.

All photographs come from Wikimedia Commons, some via museums (Auckland Museum, RISD, Museum Rotterdam), the Library of Congress, Fortepan or Flickr. Unsplash and Pexels need API keys and were not used. The CC BY-SA images were resized and converted to WebP; those adapted files remain under CC BY-SA.

Still on illustration only, because no accurate photograph with clear rights was found: chambray shirt, chore coat, corduroys, crewneck sweater, dress trousers, braided dress trousers, suit jacket, suit trousers, fatigue trousers, gilet, knit tie, linen shirt, linen trousers, opera pumps, overshirt, peacoat, pleated trousers, shorts, T-shirt, turtleneck, V-neck sweater, leather jacket, trench coat, Oxford shoe and service boots. The same applies to these styles: Classic Tailoring, Ivy, Preppy, Outdoor, Japanese Americana and Contemporary Casual. Candidates for leather jacket, trench coat, Oxford, service boots and Classic Tailoring were rejected for unclear rights (a "No Copyright – United States" statement only, a photographer credit that did not match the uploader, or no stated photo licence) or a wrong subject (a pair of women's boots).

## Known limitations

- 28 chapters rather than the ~36 first planned; the remaining topics are covered inside existing chapters.
- The figure is a single front-facing pose with stylised garments, so fine details (lapel roll, shoe last) are only suggested.
- Data is per-browser; use Export/Import on the Saved page to move it.
