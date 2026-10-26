# CLAUDE.md — Ivee League Wedding Photography

This file provides guidance to Claude Code when working with code in this repository.

**Mission:** A clickable, WCAG 2.2 AA demo site for a fictional Cambridge, Massachusetts wedding photography studio, built to show how a photo-heavy small-business site can be accessible and still convert visitors into inquiries.

---

## Before making any changes

Investigating never needs approval. Creating, editing, deleting, or moving files does, every time, until Derek says go. Propose what will change and why, then wait. Approval for one step is not approval for the next. See the global `~/.claude/CLAUDE.md` for the full protocol.

---

## Tone

Big Claude, as defined in `~/Documents/CCode/CLAUDE.md`: business first, dry, matter-of-fact. Lead with the work.

---

## Project Overview

- **Status:** Demo only. No real bookings, payments, email, or client data. Every page carries the notice "This is a demo site. Ivee League Wedding Photography is fictional."
- **Studio:** Ivee League Wedding Photography, Cambridge, Massachusetts. Wedding photography only.
- **Photographer (fictional):** Steven Walker Junior.
- **Site audience:** Engaged couples 6 to 18 months out, mostly on phones.
- **Demo audience:** Reviewers and stakeholders judging design, flow, and accessibility at a hackathon.
- **Build brief:** The project plan dated 2026-10-22 ("Ivee League Wedding Photography: Project Plan and Requirements"). Its page table, feature requirements, and accessibility acceptance criteria are the spec. Where this file and the brief disagree, ask.

### Success criteria

1. Home page to submitted inquiry, with an estimate attached, in under 3 minutes.
2. Every page passes axe and a keyboard-only pass with no critical or serious issues.
3. Clearly marked as a demo everywhere.

---

## Architecture

### Pages (static HTML, one file each)
Home, Portfolio, About, Packages, Cost Calculator, FAQ, Inquiry (with date checker), Confirmation, Accessibility Statement, Client Login (out-of-scope explainer). Real Weddings and Privacy Policy are deferred.

### Funnel
Portfolio → date checker → cost calculator → inquiry form. The date and the estimate are passed to the inquiry form through URL parameters, with sessionStorage as a second channel and plain manual entry as the fallback. The form pre-fills but stays editable.

### JavaScript modules (`js/`)
One small module each: date checker, calculator, portfolio filters, lightbox, inquiry form validation and pre-fill. Plain ES modules, no framework, no bundler. Each must degrade to usable HTML if JS fails.

### Data (`data/`)
Sample booked dates and price rules in JSON. Prices are labeled "Sample pricing for demo purposes" wherever shown.

---

## Stack

- **Languages:** HTML, CSS, JavaScript (ES modules). No build step.
- **Frameworks:** None, on purpose. Plain HTML is the accessibility reference.
- **Hosting:** GitHub Pages. All links and asset paths must be relative so the site works under a repo subpath.
- **Scanner:** axe only. Do not propose Lighthouse.

---

## Project Structure

```
ivee-league/
├── CLAUDE.md
├── README.md
├── index.html, portfolio.html, about.html, packages.html,
│   calculator.html, faq.html, inquire.html, confirmation.html,
│   accessibility.html, client-login.html
├── css/
├── js/
├── data/           # sample-dates.json, pricing.json
└── images/         # photos + SOURCES.md license log
```

---

## Conventions

- **Accessibility is built in, not bolted on.** Semantic HTML first. One h1 per page, landmarks, skip link, visible focus on everything, 24×24 minimum targets, `prefers-reduced-motion` respected, no autoplay anything.
- **Alt text** describes the moment and the people, not "wedding photo." Decorative images get `alt=""`.
- **Hero text over images** must meet 4.5:1 against the darkest and lightest parts of the image; use an overlay.
- **Live regions** for the date checker and calculator are `aria-live="polite"` and announce the result, not every keystroke. Focus does not move.
- **Lightbox** is a modal dialog: focus moves in, is trapped, Escape closes, focus returns to the thumbnail. Arrow keys are a bonus, never the only way.
- **Forms:** visible labels, required marked in text, autocomplete on name, email, phone, error summary at the top with links to fields plus inline messages.
- **Images:** lazy-loaded, responsive sizes. Every image is logged in `images/SOURCES.md` with source and license before it ships.
- **Sample content** is labeled as such on the page: "Sample testimonial," "Sample pricing for demo purposes."
- **Visual direction:** classic and formal. Serif headings, readable sans body, ivory / charcoal / muted gold palette that passes contrast, generous white space, thin rules instead of heavy decoration.
- Comments explain why, not what.

---

## Common Commands

```
# Serve locally
python3 -m http.server 8000

# Check
# axe DevTools in the browser on every page, then a keyboard-only pass.
```

---

## What Does NOT Belong Here

- Real payments, contracts, deposits, or email sending.
- A real client gallery or proofing system (a "Client login" link goes to an explainer page).
- A public month-view availability calendar. The date checker replaces it.
- A CMS. Content is hard-coded.
- Any framework, bundler, or CSS utility library.

---

## Repositories

`origin` is `derekjackson-das/ivee-league-orig` (this build). `team` is `derekjackson-das/ivee-league`, the team's parallel build. Keep them separate; the README explains why and lists the differences. Fetch from `team` to borrow commits, never push to it from here without Derek's say-so.

---

*Last updated: 2026-10-26*
