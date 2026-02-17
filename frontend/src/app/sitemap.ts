import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pic-me.net";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://picme-production-52fa.up.railway.app";

interface SitemapUser {
  username: string;
  updatedAt: string | null;
}

async function getSitemapUsers(): Promise<SitemapUser[]> {
  try {
    const response = await fetch(`${API_URL}/api/users/sitemap`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date("2026-02-17"),
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: new Date("2026-02-17"),
    },
    {
      url: `${SITE_URL}/features`,
      lastModified: new Date("2026-02-17"),
    },
  ];

  const users = await getSitemapUsers();
  const userPages: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${SITE_URL}/${user.username}`,
    lastModified: user.updatedAt ? new Date(user.updatedAt) : new Date(),
  }));

  return [...staticPages, ...userPages];
}

export const revalidate = 3600;
