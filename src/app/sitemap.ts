export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export type Sitemap = SitemapItem[];

export default async function sitemap(): Promise<Sitemap> {
  const baseUrl = 'https://edumasterbd.vercel.app';
  const currentDate = new Date().toISOString();

  // Core Static & Landing Pages
  const staticRoutes: SitemapItem[] = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/ssc`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/hsc`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/mcq`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/test`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/model-tests`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/board-questions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6
    }
  ];

  // SSC Subjects
  const sscSubjects = [
    'ssc-physics',
    'ssc-chemistry',
    'ssc-biology',
    'ssc-math',
    'ssc-higher-math',
    'ssc-ict',
    'ssc-bangla-1',
    'ssc-bangla-2',
    'ssc-english-1',
    'ssc-english-2',
    'ssc-bgs',
    'ssc-islam'
  ];

  const sscSubjectRoutes: SitemapItem[] = sscSubjects.map((subId) => ({
    url: `${baseUrl}/ssc/${subId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // HSC Subjects
  const hscSubjects = [
    'hsc-physics-1',
    'hsc-physics-2',
    'hsc-chem-1',
    'hsc-chem-2',
    'hsc-bio-1',
    'hsc-bio-2',
    'hsc-math-1',
    'hsc-math-2',
    'hsc-ict',
    'hsc-bangla-1',
    'hsc-bangla-2',
    'hsc-english-1',
    'hsc-english-2'
  ];

  const hscSubjectRoutes: SitemapItem[] = hscSubjects.map((subId) => ({
    url: `${baseUrl}/hsc/${subId}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Handnote Articles & Guides
  const noteSlugs = [
    'ssc-physics-motion-summary-and-formulas',
    'hsc-physics-vector-dot-cross-product-handnote',
    'hsc-ict-c-programming-revision-guide',
    'ssc-chemistry-periodic-table-tricks-and-properties'
  ];

  const noteRoutes: SitemapItem[] = noteSlugs.map((slug) => ({
    url: `${baseUrl}/notes/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  // Blog Articles
  const blogSlugs = [
    'how-to-get-gpa-5-in-ssc-study-strategy-and-routine',
    'hsc-ict-c-programming-html-full-marks-guide'
  ];

  const blogRoutes: SitemapItem[] = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.75
  }));

  // Model Tests
  const testIds = [
    'test-ssc-phy-final',
    'test-hsc-phy-vec-final',
    'test-hsc-ict-grand'
  ];

  const testRoutes: SitemapItem[] = testIds.map((id) => ({
    url: `${baseUrl}/test/${id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.75
  }));

  return [
    ...staticRoutes,
    ...sscSubjectRoutes,
    ...hscSubjectRoutes,
    ...noteRoutes,
    ...blogRoutes,
    ...testRoutes
  ];
}
