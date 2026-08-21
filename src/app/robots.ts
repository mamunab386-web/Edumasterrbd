export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface Robots {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

export default function robots(): Robots {
  const baseUrl = 'https://edumasterbd.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/admin/login',
        '/login',
        '/signup'
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
