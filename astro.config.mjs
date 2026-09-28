// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // TODO: replace with your real domain — used for canonical URLs, OG tags and the sitemap.
  site: "https://example.com",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
