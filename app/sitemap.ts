import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kordycontracting.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('published', true);

  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages];
}
