export type ClassLevel = 'ssc' | 'hsc' | 'both';

export type SubjectCategory = 'science' | 'commerce' | 'arts' | 'general';

export type MCQDifficulty = 'easy' | 'medium' | 'hard';

export type BoardName =
  | 'Dhaka'
  | 'Chattogram'
  | 'Rajshahi'
  | 'Cumilla'
  | 'Khulna'
  | 'Barishal'
  | 'Sylhet'
  | 'Rangpur'
  | 'Mymensingh'
  | 'Madrasah'
  | 'Technical'
  | 'All Boards';

export interface Subject {
  id: string;
  name: string;
  banglaName: string;
  classLevel: 'ssc' | 'hsc' | 'both';
  category?: SubjectCategory;
  description: string;
  icon: string; // Lucide icon identifier
  color: string; // Tailwind color theme or gradient
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  banglaTitle: string;
  chapterNumber: number;
  subjectId: string;
  classLevel: 'ssc' | 'hsc';
  description?: string;
  order: number;
}

export interface Note {
  id: string;
  title: string;
  slug: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  chapterId: string;
  content: string; // Rich Markdown/HTML formatted text
  summary?: string;
  author: string;
  authorRole?: string;
  thumbnailUrl?: string;
  featured?: boolean;
  published: boolean;
  views?: number;
  readingTimeMinutes: number;
  tags?: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[]; // typically 4 options
  correctAnswer: number; // 0-indexed option index
  explanation: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  chapterId: string;
  difficulty: MCQDifficulty;
  boardRef?: string; // e.g. "ঢাকা বোর্ড ২০২৩"
  tags?: string[];
  createdAt?: string;
}

export interface ModelTest {
  id: string;
  title: string;
  description: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  chapterId?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questionIds?: string[];
  questions?: MCQ[];
  published: boolean;
  attemptsCount?: number;
  createdAt?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  userId?: string;
  userName?: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  userAnswers: Record<string, number>; // mcqId -> selectedIndex
  timeTakenSeconds: number;
  completedAt: string;
}

export interface PDFResource {
  id: string;
  title: string;
  description: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  chapterId?: string;
  fileUrl: string;
  fileSizeMB: number;
  pageCount: number;
  thumbnailUrl?: string;
  downloadCount: number;
  viewCount?: number;
  tags?: string[];
  published: boolean;
  uploadedAt?: string;
  createdAt?: string;
}

export interface BoardQuestion {
  id: string;
  title: string;
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  chapterId?: string;
  board: string | BoardName;
  year: number;
  examType: 'CQ' | 'MCQ' | 'Combined' | 'cq' | 'mcq' | 'both';
  questionPaperUrl?: string;
  questionsText?: string;
  solutionContent?: string;
  solutionText?: string;
  solutionPdfUrl?: string;
  pdfUrl?: string;
  views?: number;
  createdAt?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  summary?: string;
  content: string;
  coverImageUrl: string;
  category: string;
  author: string;
  authorAvatar?: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  published: boolean;
  publishedAt?: string;
  views?: number;
  readTimeMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export type BlogPost = BlogArticle;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'student';
  classLevel?: 'ssc' | 'hsc';
  targetBoard?: BoardName;
  completedQuizzesCount: number;
  totalScore: number;
  joinedAt: string;
}

export interface AdminAnalytics {
  totalSubjects: number;
  totalChapters: number;
  totalNotes: number;
  totalPdfs: number;
  totalMcqs: number;
  totalTests: number;
  totalBlogs: number;
  totalUsers: number;
  totalDownloads: number;
  totalQuizAttempts: number;
  visitorTrends: { date: string; visitors: number; views: number }[];
  quizAttemptsTrends: { date: string; attempts: number; avgScore: number }[];
  subjectPopularity: { name: string; count: number; color: string }[];
  recentActivities: {
    id: string;
    type: 'note' | 'mcq' | 'test' | 'pdf' | 'blog' | 'user';
    description: string;
    timestamp: string;
  }[];
}

export interface PlatformSettings {
  siteName: string;
  siteTagline: string;
  announcementBanner: {
    active: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  contactEmail: string;
  supportPhone?: string;
  facebookGroupUrl?: string;
  youtubeChannelUrl?: string;
  telegramGroupUrl?: string;
}

export interface BookmarkItem {
  id: string;
  itemId: string;
  type: 'note' | 'mcq' | 'pdf' | 'test' | 'blog' | 'boardQuestion';
  title: string;
  subtitle?: string;
  link: string;
  savedAt: string;
}
