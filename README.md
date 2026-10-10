# The Growth Engine website

This repository contains the exact static source of the reviewed website currently published at [the-growth-engine-website.vercel.app](https://the-growth-engine-website.vercel.app/).

It includes the homepage, About page, blog archive and all 100 article routes, local media and fonts, the testimonial placeholder section, and the Vercel configuration used for the October 2026 release.

## Local preview

Serve this directory as a static website. For example:

```powershell
python -m http.server 4192
```

Then open `http://127.0.0.1:4192/`.

## Important notes

- This is a self-contained static release. It is the source currently served to visitors, rather than a CMS export.
- The testimonial clips are temporary demo footage. Replace them with approved client videos before treating that section as client testimony.
- The contact flow prepares an email draft. It does not send or store enquiries on a backend.
- The `.vercel` project-link folder is intentionally excluded. Linking this repository to a Vercel project is a separate decision and does not happen merely by pushing commits here.

## Main routes

- `/` — homepage
- `/about/` — About page
- `/blogs/` — blog archive
- `/blogs/<article-slug>/` — 100 static article pages

## Deploying

Vercel detects this as a static site using `vercel.json`. Before connecting a GitHub integration or making a production deployment, review the changes and test the relevant routes locally. The current public production deployment remains independent of this repository until it is deliberately linked and deployed.
