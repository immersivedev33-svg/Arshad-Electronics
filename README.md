# Arshad site · draft 1 (dark)

A static, self-contained draft of the new Arshad Electronics website, built from the Arshad Site Lab picks of 9 October 2026. It is for client review and is not the live site.

## What's in this folder

- 13 pages, each in a folder at the same address as on arshadelectronics.com:
  - `index.html`: homepage
  - `corona-discharge-treaters/`: Fluxomatic, with `blown-cast-films/`, `woven-fabric/` and `3d-objects/`
  - `induction-cap-sealers/`: Fluxosealer, with `fluxosealer-brezo-series/` and `fluxosealer-aurae-series/`
  - `simco-ion-static-eliminators/`, `about-us/`, `clients/` (new), `faq/` and `contact-us/`
- `assets/`: the site's scripts and styles
- `img/` and `models/`: photos, logos and the 3D models
- `404.html` and `robots.txt`

Every link is relative, so the site works at that sub-address, on a custom domain, or opened from any web server. It needs a web server: opening `index.html` straight from disk will not load the 3D models.

## Things to know

- **Forms are not connected.** The contact form and the product enquiry forms thank the visitor and say the draft's forms are not connected yet. Nothing is sent. Call, email and WhatsApp links work.
- **Hidden from search engines.** Every page carries `noindex, nofollow`, so this copy does not compete with arshadelectronics.com. (`robots.txt` only takes effect at a domain root; the page tags do the work on GitHub Pages.)
- **Content.** Only figures published on arshadelectronics.com are shown. Specs that the live site does not give are left out, rather than shown as "On request".
- **Languages.** English, Spanish and Russian, switched with the flags at the top right of every page; the choice is remembered on that device. A link can open a language directly by adding `?lang=es` or `?lang=ru`. The translations have not yet been checked by a native speaker.
- **3D.** The 3D engine (three.js) loads from cdnjs, and the fonts from Google Fonts, so the draft needs an internet connection.


