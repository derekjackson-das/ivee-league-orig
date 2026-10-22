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

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Accessibility

Target: WCAG 2.2 AA on every page. Checked with axe DevTools and a keyboard-only pass. See the Accessibility Statement page for known issues and a feedback route.

## Credits

Fictional photographer: Steven Walker Junior. Photographs are AI-generated for this demo; see `images/SOURCES.md`.
