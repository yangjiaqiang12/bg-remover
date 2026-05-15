import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://bg-remover-beige-gamma.vercel.app/sitemap.xml",
  };
}
