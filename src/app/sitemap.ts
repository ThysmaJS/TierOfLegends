import type { MetadataRoute } from 'next';
import { getCollection } from '@/lib/mongodb';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/tier-lists',
    '/tier-lists/new',
    '/profil',
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly', priority: path === '' ? 1 : 0.6 }));

  // Include some dynamic tier lists for SEO. Keep it light to avoid heavy DB work.
  try {
    const col = await getCollection<{ _id: import('mongodb').ObjectId; title?: string }>('tierlists');
    const recent = await col
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .limit(50)
      .toArray();
    const dynamicRoutes: MetadataRoute.Sitemap = recent.map((d) => ({
      url: `${base}/tier-lists/${d._id.toString()}`,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    // If DB is not reachable at build time, just return statics
    return staticRoutes;
  }
}
