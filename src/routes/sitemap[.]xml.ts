import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", ...Object.keys(TOOLS).map((slug) => `/${slug}`)];
        const seen = new Set<string>();

        const urls = paths
          .filter((p) => (seen.has(p) ? false : (seen.add(p), true)))
          .map((p) =>
            [
              `  <url>`,
              `    <loc>${SITE_URL}${p === "/" ? "/" : p}</loc>`,
              `    <changefreq>monthly</changefreq>`,
              `    <priority>${p === "/" ? "1.0" : "0.7"}</priority>`,
              `  </url>`,
            ].join("\n"),
          );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
