# Saila Bhoomi — Country Condo's Ltd

A modern, fully responsive static website for the **Saila Bhoomi** plotted
residential venture and its developer, **Country Condo's Limited** (Hyderabad).

Rebuilt from the content published at
`https://countrycondos.net/sailabhoomi.php`.

**Live:** https://nareshnaik-95.github.io/Saila-Bhoomi/

---

## Files

```
saila-bhoomi-website/
├── index.html          Saila Bhoomi project landing page
├── projects.html       Full portfolio — 34 ventures, filterable by stage
├── about.html          Company history, method, geography, offices
├── contact.html        Contact details, enquiry form, offices, sitemap
├── assets/
│   ├── css/style.css   Complete design system + all page styles
│   └── js/main.js      Nav, scroll states, reveals, FAQ, lightbox, filters, forms
└── README.md
```

No build step, no dependencies. Open `index.html` in a browser.

---

## Running it locally

Double-clicking `index.html` works. To serve it over HTTP (recommended, so
relative paths and fonts behave exactly as in production):

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

---

## Deploying

It is plain static HTML, so anything works — Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or a plain `public_html` folder on shared hosting. Upload the
whole `saila-bhoomi-website` folder and point the domain at it.

---

## Design system

Everything is driven by CSS custom properties at the top of
`assets/css/style.css` — change a value there and it propagates site-wide.

| Token | Value | Role |
|---|---|---|
| `--forest-deep` | `#0d1f16` | Dark bands, headings, footer |
| `--forest` | `#1c3f2f` | Primary dark surface |
| `--gold` | `#b0803a` | Accent, CTAs, eyebrows |
| `--paper` | `#fbf9f4` | Page ground |
| `--paper-warm` | `#f4efe5` | Alternating band |
| `--display` | Cormorant Garamond | Headings |
| `--body` | Inter | Body text and UI |

All imagery is **inline SVG illustration** — no external image files, nothing to
break, nothing to optimise. Replace any `<svg>` inside a `.plate`,
`.project-art`, or `.shot` with an `<img>` when real photography is available.

---

## Built-in behaviour

- Sticky header that turns solid on scroll and hides on downward scroll
- Full-screen mobile nav with animated toggle
- `IntersectionObserver` scroll reveals and count-up statistics
- Single-open FAQ accordion with correct ARIA state
- Gallery lightbox (click, Enter/Space, Esc, backdrop, focus return)
- Project filter tabs with an empty state
- Client-side form validation, then hand-off to the visitor's mail client
- Back-to-top button, auto-updating copyright year
- Full `prefers-reduced-motion` support and a print stylesheet

---

## Things to wire up before going live

1. **Form backend.** The enquiry forms currently validate and then open the
   visitor's mail client via `mailto:`. Nothing is stored. Point them at a real
   endpoint (Formspree, Netlify Forms, or your own handler) — see `initForms()`
   in `assets/js/main.js`.
2. **Documents.** The Approvals section links out to the live site's PDFs. Drop
   the actual files into `assets/docs/` and update the `href`s.
3. **Photography.** Swap the SVG illustrations for real site photos.
4. **Pricing.** Deliberately left as "on request" — no figures were invented.
5. **Legal pages.** Privacy Policy and Terms links are placeholders (`#`).
6. **Map.** The Begumpet map is a schematic; embed a real Google Maps iframe if
   you want an interactive one.
7. **Analytics / RERA.** Add tracking and any required RERA registration
   disclosure before publishing.

---

## Content accuracy

All project names, locations, distances, approvals and contact details come from
Country Condo's own published pages. Nothing was invented:

- Plot size (150 sq. yd), DTCP approval, the ~20 min RRR and ~40 min Mucherla
  Pharma City drive times, and the conversion order numbers (Q228, Q229, Q232,
  Q233, Q5160, Q5161, Q5163) are as published.
- **Pricing is shown as "on request"** rather than guessed.
- The portfolio lists 25 new, 4 ongoing and 5 completed ventures. The source
  site's counts of 26 and 6 include duplicate spellings of the same venture
  (*Urban/Urben Treasure*, *Fairway Extension/Extention*), which are merged here.

A disclaimer in the homepage footer notes that images and maps are illustrative,
distances are approximate, and terms should be verified with the developer.
