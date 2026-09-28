# Jerome Tegrado — Portfolio

My personal portfolio. I built it with [Astro](https://astro.build), Tailwind CSS and a little vanilla TypeScript; it's statically generated and deployed on Cloudflare Workers.

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
| `site.ts` | Name, headline, intro, portrait, honour caption, email, resume, chat photo, socials |
| `experience.ts` | Journey timeline entries (shown in the hero) and their icons |
| `projects.ts` | Selected work: cover, category, year, title, description and tools per project |
| `skills.ts` | Skills by category: a category list beside a turning wheel of logos (in `public/images/skills` or a Font Awesome icon); empty list hides the section |
| `awards.ts` | Awards and honours (year, award, issuer, optional proof link); empty list hides the section |
| `testimonials.ts` | "Kind words" quotes — real ones only; empty list hides the section |
| `assistant.ts` | Facts the AI chat may use about you |

Also set your real domain as `site` in `astro.config.mjs`. It's used for canonical URLs, Open Graph, the sitemap, `robots.txt` and `llms.txt`.

Images go in `public/images/` and are referenced by path (e.g. `"/images/portrait.jpg"`). Favicons stay at the top of `public/`.

## Chat (AI version of Jerome)

The "Chat with me" panel talks to `POST /api/chat`, served by the Cloudflare Worker in `worker/`. The Gemini API key never reaches the browser.

1. Write facts about yourself in `src/data/assistant.ts`. The chat answers only from those facts and the site data; `[PLACEHOLDER]` lines are ignored.
2. Local testing: copy `.dev.vars.example` to `.dev.vars`, add your key, run `npm run dev:worker` and open http://localhost:8787.
3. Production: `npx wrangler secret put GEMINI_API_KEY`, set `ALLOWED_ORIGINS` in `wrangler.jsonc` to your domain, then `npm run deploy`.

The model is set by `GEMINI_MODEL` in `wrangler.jsonc`. Guardrails (system prompt rules, input limits, per-IP rate limit, safety settings) live in `worker/`.

## SEO / AEO / GEO

- Canonical, Open Graph and Twitter meta tags on every page
- schema.org JSON-LD (`Person`, `WebSite`, `ProfilePage`, `ItemList` of work), generated from the content data
- `/sitemap-index.xml`, `/robots.txt` (AI crawlers allowed) and `/llms.txt`

Placeholder values are never emitted in structured data or `llms.txt`.

## Branches

- `main`: the live design, a terminal UI (TUI).
- `design/editorial`: the earlier editorial design (serif, photo footer), kept for reference.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `type(scope): description`, then an extended body explaining what changed and why.
