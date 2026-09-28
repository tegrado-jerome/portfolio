// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // The live address: used for canonical URLs, OG tags and the sitemap. Change it if you move to your own domain.
  site: "https://jerome-tegrado-portfolio.tegradojeromebrent.workers.dev",
  // lastmod tells search and AI engines when the page last changed (the build date).
  integrations: [sitemap({ lastmod: new Date() })],
  vite: {
    plugins: [tailwindcss()],
  },
});
