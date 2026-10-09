import type { MetadataRoute } from "next";
import { tools } from "@/components/site/tools";
import { BORTLE_GUIDE_PATH } from "@/lib/dark-sky-window/constants";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/utilities`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  for (const tool of tools) {
    pages.push({
      url: `${SITE_URL}/utilities/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  pages.push({
    url: `${SITE_URL}${BORTLE_GUIDE_PATH}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  return pages;
}
