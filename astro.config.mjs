// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // The live address: used for canonical URLs, OG tags and the sitemap. Change it if you move to your own domain.
  site: "https://jerome-tegrado-portfolio.tegradojeromebrent.workers.dev",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
