# digiailabs.com

Website for **Digital AI Labs**, hosted on GitHub Pages at https://digiailabs.com.

## Pages
- `/` – home
- `/smart-notes/`, `/family-tree/`, `/gravito/`, `/pursehold/` – product pages
- `/smart-notes/privacy/`, `/family-tree/privacy/`, `/gravito/privacy/`, `/pursehold/privacy/` – app privacy policies

- `/privacy/`, `/about/`, `/support/`

## Files
- `assets/css/site.css` – all styles
- `assets/js/site.js` – mobile menu, gallery, scroll reveals
- `assets/fonts/` – self-hosted Inter (SIL Open Font License)
- `assets/img/` – app screenshots, icons, brand and share images
- `app-ads.txt`, `CNAME`, `robots.txt`, `sitemap.xml`

## Brand
The digi.ai logo: a navy and orange ribbon chevron with the `digi.ai` wordmark.
- Colours: navy `#012357`, orange `#FF7300` (tokens `--navy`, `--orange` in `site.css`).
  Orange on white is only 2.7:1, so orange text uses `--orange-ink` / `--grad-text` (large text only)
  and body-size links use `--link`.
- `assets/img/brand/logo.svg`, `logo-dark.svg` (for dark backgrounds): the full logo, vectorised from the master PNG.
- `mark.svg`, `mark-dark.svg`, `favicon.svg`: the chevron mark on its own.
- `hero-mark.svg`: the home and Solutions hero art.
- `logo.png`, `logo-dark.png`, `logo-large.png`, `logo-512.png`, `apple-touch-icon.png`, `favicon-32.png`:
  PNG renders of the same artwork for places that need a bitmap.
- `assets/img/og/*.png`: share images. After changing one, bump its `?v=` in the page's `og:image` so social sites fetch it again.

Pushing to `main` republishes the site automatically.
