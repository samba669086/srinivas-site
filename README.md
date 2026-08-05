# A. Srinivas — Enterprise Architect · Landing Site

A polished, single-page personal site for **A. Srinivas**, Enterprise Architect.  
Light theme · Responsive · Accessible · No frameworks.

---

## Quick preview

Open `index.html` directly in any modern browser — no build step needed.

```
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

---

## Deploy to GitHub Pages

1. Push the repository to GitHub (see the release for the ready-to-use ZIP).
2. Go to **Settings → Pages**.
3. Under *Source*, select `Deploy from a branch`, choose `main` / `root`.
4. If you have a custom domain, add it in the *Custom domain* field and upload your `CNAME` file (already included, just update the value).
5. After a minute the site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## Placeholders to replace

| File | What to replace | Where |
|------|----------------|-------|
| `headshot.jpg` | Replace with your real headshot (square or portrait, ≥ 600 px wide) | Project root |
| `index.html` | `YOUR_FORMSPREE_ID` in the `<form action>` | Line with `formspree.io/f/` |
| `CNAME` | `www.yourdomain.com` → your real domain | Entire file |
| `index.html` | LinkedIn URL `linkedin.com/in/srinivas` | Two `<a>` tags in hero + nav |

The email address **contact.srinivas.consulting@gmail.com** is already set throughout — update it if you want a different address.

---

## Setting up Formspree (contact form)

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and copy the ID (looks like `xpzgvkrq`).
3. In `index.html`, replace `YOUR_FORMSPREE_ID` in the `<form action>` attribute:
   ```html
   action="https://formspree.io/f/YOUR_FORMSPREE_ID"
   ```
4. Test by submitting the form — you'll receive an email confirmation from Formspree first.

> **Local testing note:** Formspree blocks submissions from `file://` URLs.  
> To test the form locally serve the site with a local server:
> ```
> npx serve .
> # or
> python -m http.server 8000
> ```

---

## File structure

```
srinivas-site/
├── index.html      # Single page — all sections
├── styles.css      # All styles — no frameworks
├── script.js       # Interactions: toggle, parallax, animations, form
├── headshot.jpg    # Replace with real photo
├── CNAME           # Custom domain (GitHub Pages)
└── README.md       # This file
```

---

## Editing copy

All visible text is in `index.html`.  
Key sections and their approximate locations:

- **Hero** — `<section id="about">` — name, subtitle, lead sentence
- **Stat cards** — `<section id="expertise">` — numbers and labels
- **Skills chips** — `<ul class="chip-list">` — add / remove `<li>` items
- **Contact intro** — `<div class="contact-intro">` — intro paragraph, email

---

## Licence

Personal use. All rights reserved — A. Srinivas.
