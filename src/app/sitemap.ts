import type { MetadataRoute } from "next";

const BASE = "https://aegus.digital";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/path", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/app", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
