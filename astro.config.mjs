import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://www.qiuqfang.top",
  integrations: [
    sitemap(),
    tailwind({
      config: { path: "./tailwind.config.cjs", applyBaseStyles: false },
    }),
  ],
});
