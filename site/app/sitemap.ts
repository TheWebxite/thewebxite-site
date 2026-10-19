import type { MetadataRoute } from "next";
import { CATEGORY_SLUGS } from "@/data/work-categories";
import { PROJECT_SLUGS } from "@/data/projects";
import { SERVICE_SLUGS } from "@/data/services";
import { NEWS_SLUGS } from "@/data/news";

const BASE = "https://thewebxite.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/services",
    "/about",
    "/contact",
    "/work",
    "/events",
    ...SERVICE_SLUGS.map((s) => `/services/${s}`),
    ...CATEGORY_SLUGS.map((s) => `/work/${s}`),
    ...PROJECT_SLUGS.map((s) => `/work/${s}`),
    // /news rejoins the sitemap once it has entries; NEWS_SLUGS is empty today.
    ...NEWS_SLUGS.map((s) => `/news/${s}`),
  ];
  return paths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    priority: p === "" ? 1 : p.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
