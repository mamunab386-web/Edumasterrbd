import { INITIAL_SUBJECTS, INITIAL_CHAPTERS, INITIAL_NOTES, INITIAL_BLOGS, INITIAL_TESTS, INITIAL_PDFS, INITIAL_BOARD_QUESTIONS } from '../data/initialData';

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

  // 1. Core Public Pages
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
      priority: 0.95
    },
    {
      url: `${baseUrl}/hsc`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95
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
      priority: 0.9
    },
    {
      url: `${baseUrl}/test`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85
    },
    {
      url: `${baseUrl}/model-tests`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${baseUrl}/pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${baseUrl}/board-questions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85
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

  // 2. Dynamic Subject Routes (/ssc/[subjectId] & /hsc/[subjectId])
  const subjectRoutes: SitemapItem[] = INITIAL_SUBJECTS.map((subject) => ({
    url: `${baseUrl}/${subject.classLevel}/${subject.id}`,
    lastModified: subject.createdAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.85
  }));

  // 3. Dynamic Chapter Routes (/ssc/[subjectId]/[chapterId] or query filter)
  const chapterRoutes: SitemapItem[] = INITIAL_CHAPTERS.map((ch) => ({
    url: `${baseUrl}/${ch.classLevel}/${ch.subjectId}?chapter=${ch.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 4. Dynamic Notes Articles (/notes/[slug])
  const noteRoutes: SitemapItem[] = INITIAL_NOTES.filter(n => n.published).map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: note.updatedAt || note.createdAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  // 5. Dynamic Blog Articles (/blog/[slug])
  const blogRoutes: SitemapItem[] = INITIAL_BLOGS.filter(b => b.published).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // 6. Dynamic Model Tests (/test/[id])
  const testRoutes: SitemapItem[] = INITIAL_TESTS.filter(t => t.published).map((test) => ({
    url: `${baseUrl}/test/${test.id}`,
    lastModified: test.createdAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.75
  }));

  // 7. Dynamic PDF Resources (/pdf?id=[id])
  const pdfRoutes: SitemapItem[] = INITIAL_PDFS.filter(p => p.published).map((pdf) => ({
    url: `${baseUrl}/pdf?id=${pdf.id}`,
    lastModified: pdf.createdAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.75
  }));

  // 8. Dynamic Board Question Routes
  const boardQuestionRoutes: SitemapItem[] = INITIAL_BOARD_QUESTIONS.map((bq) => ({
    url: `${baseUrl}/board-questions?id=${bq.id}`,
    lastModified: bq.createdAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [
    ...staticRoutes,
    ...subjectRoutes,
    ...chapterRoutes,
    ...noteRoutes,
    ...blogRoutes,
    ...testRoutes,
    ...pdfRoutes,
    ...boardQuestionRoutes
  ];
}
