# Jerome Tegrado — Portfolio

Personal portfolio built with [Astro](https://astro.build), Tailwind CSS and a small amount of vanilla TypeScript. Statically generated and deployed to Cloudflare Workers.

## Development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run deploy    # build and deploy with Wrangler
```

## Editing content

All content lives in `src/data/`. Replace every `[PLACEHOLDER]`:

| File | What it holds |
|---|---|
| `site.ts` | Name, headline, intro, about, contact, socials, capabilities, preloader, footer, archive, time zone |
| `experience.ts` | Timeline entries and their icons |
| `projects.ts` | Selected work (the first project is featured full-width) |

Also set your real domain as `site` in `astro.config.mjs`. It's used for canonical URLs, Open Graph, the sitemap, `robots.txt` and `llms.txt`.

Images go in `public/` and are referenced by path (e.g. `"/portrait.jpg"`).

## SEO / AEO / GEO

- Canonical, Open Graph and Twitter meta tags on every page
- schema.org JSON-LD (`Person`, `WebSite`, `ProfilePage`, `ItemList` of work), generated from the content data
- `/sitemap-index.xml`, `/robots.txt` (AI crawlers allowed) and `/llms.txt`

Placeholder values are never emitted in structured data or `llms.txt`.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, then an extended body explaining what changed and why.
