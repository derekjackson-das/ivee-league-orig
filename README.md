# Ivee League Wedding Photography — demo site

A clickable demo website for a fictional wedding photography studio in Cambridge, Massachusetts. It shows how a small studio site can attract couples, show the work, and turn visitors into qualified inquiries while meeting WCAG 2.2 AA on a photo-heavy site.

**This is a demo site. Ivee League Wedding Photography is fictional.** No real bookings, payments, or client data. Testimonials, prices, and dates are samples.

## What's here

- Static site in plain HTML, CSS, and JavaScript. No framework, no build step.
- Pages: Home, Portfolio, About, Packages, Cost Calculator, FAQ, Inquiry (with date checker), Accessibility Statement.
- Sample booked dates and price rules live in `data/` so they're easy to change.
- Hosted on GitHub Pages.

## Where things live

```
ivee-league/
├── index.html          # Home
├── *.html              # one file per page
├── css/                # site styles
├── js/                 # small modules: date checker, calculator, filters, lightbox
├── data/               # sample dates and pricing (JSON)
├── images/             # photos, with SOURCES.md as the license log
└── CLAUDE.md           # build brief and conventions for Claude Code
```

## Two builds, side by side

Two phase 3 implementations were built in parallel from the same phase 2 base on 2026-10-22. They are kept in separate repositories so reviewers can compare them.

| Build | Repository | Site |
|---|---|---|
| This build | `derekjackson-das/ivee-league-orig` | https://derekjackson-das.github.io/ivee-league-orig/ |
| Team build | `derekjackson-das/ivee-league` | https://derekjackson-das.github.io/ivee-league/ |

Both pass axe with no violations on every page and share the same photos, palette, pages, and funnel. Where they differ against the brief:

- **Inquiry form fields.** This build has the brief's full list, including guest count band, package interest, and how you heard about us. The team build uses a guest number box and omits the last two.
- **Date checker.** This build has the "Inquire about this date" button that carries the date into the form. The team build fills the date automatically and links to the form.
- **Form without JavaScript.** This build posts, so nothing lands in the URL. The team build submits by GET, which would put the name and email in the address bar if scripts were off.
- **Error messages.** The team build prefixes inline messages with "Error:" and changes the page title on a failed submit. This build does not.
- **Stepper limits.** The team build keeps the hours buttons focusable at the limits with `aria-disabled`. This build clamps the value instead.

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Accessibility

Target: WCAG 2.2 AA on every page. Checked with axe DevTools and a keyboard-only pass. See the Accessibility Statement page for known issues and a feedback route.

## Credits

Fictional photographer: Steven Walker Junior. Photographs are AI-generated for this demo; see `images/SOURCES.md`.
