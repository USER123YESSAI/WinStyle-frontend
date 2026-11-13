import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://winstyle-agency.vercel.app').replace(/\/$/, '');
  const routes = ['', '/about', '/services', '/formations', '/realisations', '/galerie', '/blog', '/candidature', '/contact'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' || route === '/realisations' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/services' || route === '/formations' ? 0.9 : 0.8,
  }));
}
