import {
  Subject,
  Chapter,
  Note,
  MCQ,
  ModelTest,
  TestResult,
  PDFResource,
  BoardQuestion,
  BlogArticle,
  PlatformSettings,
  AdminAnalytics
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_NOTES,
  INITIAL_MCQS,
  INITIAL_TESTS,
  INITIAL_PDFS,
  INITIAL_BOARD_QUESTIONS,
  INITIAL_BLOGS,
  INITIAL_SETTINGS,
  INITIAL_ANALYTICS
} from '../data/initialData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

const STORAGE_KEYS = {
  SUBJECTS: 'edumaster_subjects_v1',
  CHAPTERS: 'edumaster_chapters_v1',
  NOTES: 'edumaster_notes_v1',
  MCQS: 'edumaster_mcqs_v1',
  TESTS: 'edumaster_tests_v1',
  TEST_RESULTS: 'edumaster_test_results_v1',
  PDFS: 'edumaster_pdfs_v1',
  BOARD_QUESTIONS: 'edumaster_board_questions_v1',
  BLOGS: 'edumaster_blogs_v1',
  SETTINGS: 'edumaster_settings_v1',
  ANALYTICS: 'edumaster_analytics_v1',
  BOOKMARKS: 'edumaster_bookmarks_v1',
  VIEW_HISTORY: 'edumaster_view_history_v1'
};

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.error('LocalStorage parse error for key:', key, e);
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

// ----------------- SUBJECTS -----------------
export const getSubjects = async (): Promise<Subject[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'subjects'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Subject);
      }
    } catch (e) {
      console.warn('Firestore fallback to local for subjects:', e);
    }
  }
  return getLocal<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
};

export const saveSubject = async (subject: Subject): Promise<Subject> => {
  const current = getLocal<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  const index = current.findIndex((s) => s.id === subject.id);
  let updated: Subject[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...subject, updatedAt: new Date().toISOString() };
  } else {
    updated = [...current, { ...subject, createdAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.SUBJECTS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'subjects', subject.id), subject);
    } catch (e) {
      console.error('Firestore saveSubject error:', e);
    }
  }
  return subject;
};

export const deleteSubject = async (subjectId: string): Promise<void> => {
  const current = getLocal<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  setLocal(
    STORAGE_KEYS.SUBJECTS,
    current.filter((s) => s.id !== subjectId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'subjects', subjectId));
    } catch (e) {
      console.error('Firestore deleteSubject error:', e);
    }
  }
};

// ----------------- CHAPTERS -----------------
export const getChapters = async (): Promise<Chapter[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'chapters'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Chapter);
      }
    } catch (e) {
      console.warn('Firestore fallback to local for chapters:', e);
    }
  }
  return getLocal<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
};

export const saveChapter = async (chapter: Chapter): Promise<Chapter> => {
  const current = getLocal<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  const index = current.findIndex((c) => c.id === chapter.id);
  let updated: Chapter[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = chapter;
  } else {
    updated = [...current, chapter];
  }
  setLocal(STORAGE_KEYS.CHAPTERS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'chapters', chapter.id), chapter);
    } catch (e) {
      console.error('Firestore saveChapter error:', e);
    }
  }
  return chapter;
};

export const deleteChapter = async (chapterId: string): Promise<void> => {
  const current = getLocal<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  setLocal(
    STORAGE_KEYS.CHAPTERS,
    current.filter((c) => c.id !== chapterId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'chapters', chapterId));
    } catch (e) {
      console.error('Firestore deleteChapter error:', e);
    }
  }
};

// ----------------- NOTES -----------------
export const getNotes = async (): Promise<Note[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'notes'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Note);
      }
    } catch (e) {
      console.warn('Firestore fallback to local for notes:', e);
    }
  }
  return getLocal<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
};

export const getNoteByIdOrSlug = async (idOrSlug: string): Promise<Note | undefined> => {
  const notes = await getNotes();
  return notes.find((n) => n.id === idOrSlug || n.slug === idOrSlug);
};

export const saveNote = async (note: Note): Promise<Note> => {
  const current = getLocal<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  const index = current.findIndex((n) => n.id === note.id);
  let updated: Note[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...note, updatedAt: new Date().toISOString() };
  } else {
    updated = [...current, { ...note, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.NOTES, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'notes', note.id), note);
    } catch (e) {
      console.error('Firestore saveNote error:', e);
    }
  }
  return note;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const current = getLocal<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  setLocal(
    STORAGE_KEYS.NOTES,
    current.filter((n) => n.id !== noteId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (e) {
      console.error('Firestore deleteNote error:', e);
    }
  }
};

export const incrementNoteViews = async (noteId: string): Promise<void> => {
  const current = getLocal<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  const index = current.findIndex((n) => n.id === noteId);
  if (index >= 0) {
    current[index].views = (current[index].views || 0) + 1;
    setLocal(STORAGE_KEYS.NOTES, current);
  }
};

// ----------------- MCQS -----------------
export const getMCQs = async (): Promise<MCQ[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'mcqs'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as MCQ);
      }
    } catch (e) {
      console.warn('Firestore fallback for mcqs:', e);
    }
  }
  return getLocal<MCQ[]>(STORAGE_KEYS.MCQS, INITIAL_MCQS);
};

export const saveMCQ = async (mcq: MCQ): Promise<MCQ> => {
  const current = getLocal<MCQ[]>(STORAGE_KEYS.MCQS, INITIAL_MCQS);
  const index = current.findIndex((m) => m.id === mcq.id);
  let updated: MCQ[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = mcq;
  } else {
    updated = [...current, { ...mcq, createdAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.MCQS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'mcqs', mcq.id), mcq);
    } catch (e) {
      console.error('Firestore saveMCQ error:', e);
    }
  }
  return mcq;
};

export const bulkSaveMCQs = async (newMcqs: MCQ[]): Promise<void> => {
  const current = getLocal<MCQ[]>(STORAGE_KEYS.MCQS, INITIAL_MCQS);
  const map = new Map(current.map((m) => [m.id, m]));
  newMcqs.forEach((m) => map.set(m.id, m));
  const updated = Array.from(map.values());
  setLocal(STORAGE_KEYS.MCQS, updated);

  if (isFirebaseConfigured && db) {
    try {
      for (const m of newMcqs) {
        await setDoc(doc(db, 'mcqs', m.id), m);
      }
    } catch (e) {
      console.error('Firestore bulkSaveMCQs error:', e);
    }
  }
};

export const deleteMCQ = async (mcqId: string): Promise<void> => {
  const current = getLocal<MCQ[]>(STORAGE_KEYS.MCQS, INITIAL_MCQS);
  setLocal(
    STORAGE_KEYS.MCQS,
    current.filter((m) => m.id !== mcqId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'mcqs', mcqId));
    } catch (e) {
      console.error('Firestore deleteMCQ error:', e);
    }
  }
};

// ----------------- MODEL TESTS -----------------
export const getModelTests = async (): Promise<ModelTest[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'tests'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as ModelTest);
      }
    } catch (e) {
      console.warn('Firestore fallback for tests:', e);
    }
  }
  return getLocal<ModelTest[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
};

export const getModelTestById = async (testId: string): Promise<ModelTest | undefined> => {
  const tests = await getModelTests();
  const test = tests.find((t) => t.id === testId);
  if (!test) return undefined;

  // Resolve questions
  const allMcqs = await getMCQs();
  const questions = (test.questionIds || [])
    .map((qid) => allMcqs.find((m) => m.id === qid))
    .filter(Boolean) as MCQ[];

  return { ...test, questions };
};

export const saveModelTest = async (test: ModelTest): Promise<ModelTest> => {
  const current = getLocal<ModelTest[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  const index = current.findIndex((t) => t.id === test.id);
  let updated: ModelTest[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = test;
  } else {
    updated = [...current, { ...test, createdAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.TESTS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'tests', test.id), test);
    } catch (e) {
      console.error('Firestore saveModelTest error:', e);
    }
  }
  return test;
};

export const deleteModelTest = async (testId: string): Promise<void> => {
  const current = getLocal<ModelTest[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  setLocal(
    STORAGE_KEYS.TESTS,
    current.filter((t) => t.id !== testId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'tests', testId));
    } catch (e) {
      console.error('Firestore deleteModelTest error:', e);
    }
  }
};

export const incrementTestAttempts = async (testId: string): Promise<void> => {
  const current = getLocal<ModelTest[]>(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  const index = current.findIndex((t) => t.id === testId);
  if (index >= 0) {
    current[index].attemptsCount = (current[index].attemptsCount || 0) + 1;
    setLocal(STORAGE_KEYS.TESTS, current);
  }
};

// ----------------- TEST RESULTS -----------------
export const saveTestResult = async (result: TestResult): Promise<TestResult> => {
  const current = getLocal<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
  setLocal(STORAGE_KEYS.TEST_RESULTS, [result, ...current]);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'testResults', result.id), result);
    } catch (e) {
      console.error('Firestore saveTestResult error:', e);
    }
  }
  return result;
};

export const getTestResultById = async (resultId: string): Promise<TestResult | undefined> => {
  const current = getLocal<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
  const found = current.find((r) => r.id === resultId);
  if (found) return found;

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'testResults', resultId));
      if (snap.exists()) {
        return snap.data() as TestResult;
      }
    } catch (e) {
      console.error('Firestore getTestResultById error:', e);
    }
  }
  return undefined;
};

export const getAllTestResults = async (): Promise<TestResult[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'testResults'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as TestResult);
      }
    } catch (e) {
      console.warn('Firestore fallback for testResults:', e);
    }
  }
  return getLocal<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
};

// ----------------- PDF RESOURCES -----------------
export const getPDFs = async (): Promise<PDFResource[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'pdfs'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as PDFResource);
      }
    } catch (e) {
      console.warn('Firestore fallback for pdfs:', e);
    }
  }
  return getLocal<PDFResource[]>(STORAGE_KEYS.PDFS, INITIAL_PDFS);
};

export const getPDFById = async (pdfId: string): Promise<PDFResource | undefined> => {
  const pdfs = await getPDFs();
  return pdfs.find((p) => p.id === pdfId);
};

export const savePDF = async (pdf: PDFResource): Promise<PDFResource> => {
  const current = getLocal<PDFResource[]>(STORAGE_KEYS.PDFS, INITIAL_PDFS);
  const index = current.findIndex((p) => p.id === pdf.id);
  let updated: PDFResource[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = pdf;
  } else {
    updated = [...current, { ...pdf, createdAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.PDFS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'pdfs', pdf.id), pdf);
    } catch (e) {
      console.error('Firestore savePDF error:', e);
    }
  }
  return pdf;
};

export const deletePDF = async (pdfId: string): Promise<void> => {
  const current = getLocal<PDFResource[]>(STORAGE_KEYS.PDFS, INITIAL_PDFS);
  setLocal(
    STORAGE_KEYS.PDFS,
    current.filter((p) => p.id !== pdfId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'pdfs', pdfId));
    } catch (e) {
      console.error('Firestore deletePDF error:', e);
    }
  }
};

export const incrementPDFDownloads = async (pdfId: string): Promise<void> => {
  const current = getLocal<PDFResource[]>(STORAGE_KEYS.PDFS, INITIAL_PDFS);
  const index = current.findIndex((p) => p.id === pdfId);
  if (index >= 0) {
    current[index].downloadCount = (current[index].downloadCount || 0) + 1;
    setLocal(STORAGE_KEYS.PDFS, current);
  }
};

// ----------------- BOARD QUESTIONS -----------------
export const getBoardQuestions = async (): Promise<BoardQuestion[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'boardQuestions'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as BoardQuestion);
      }
    } catch (e) {
      console.warn('Firestore fallback for boardQuestions:', e);
    }
  }
  return getLocal<BoardQuestion[]>(STORAGE_KEYS.BOARD_QUESTIONS, INITIAL_BOARD_QUESTIONS);
};

export const saveBoardQuestion = async (bq: BoardQuestion): Promise<BoardQuestion> => {
  const current = getLocal<BoardQuestion[]>(STORAGE_KEYS.BOARD_QUESTIONS, INITIAL_BOARD_QUESTIONS);
  const index = current.findIndex((b) => b.id === bq.id);
  let updated: BoardQuestion[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = bq;
  } else {
    updated = [...current, { ...bq, createdAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.BOARD_QUESTIONS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'boardQuestions', bq.id), bq);
    } catch (e) {
      console.error('Firestore saveBoardQuestion error:', e);
    }
  }
  return bq;
};

export const deleteBoardQuestion = async (bqId: string): Promise<void> => {
  const current = getLocal<BoardQuestion[]>(STORAGE_KEYS.BOARD_QUESTIONS, INITIAL_BOARD_QUESTIONS);
  setLocal(
    STORAGE_KEYS.BOARD_QUESTIONS,
    current.filter((b) => b.id !== bqId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'boardQuestions', bqId));
    } catch (e) {
      console.error('Firestore deleteBoardQuestion error:', e);
    }
  }
};

// ----------------- BLOGS -----------------
export const getBlogs = async (): Promise<BlogArticle[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'blogs'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as BlogArticle);
      }
    } catch (e) {
      console.warn('Firestore fallback for blogs:', e);
    }
  }
  return getLocal<BlogArticle[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
};

export const getBlogBySlugOrId = async (slugOrId: string): Promise<BlogArticle | undefined> => {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slugOrId || b.id === slugOrId);
};

export const saveBlog = async (blog: BlogArticle): Promise<BlogArticle> => {
  const current = getLocal<BlogArticle[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
  const index = current.findIndex((b) => b.id === blog.id);
  let updated: BlogArticle[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...blog, updatedAt: new Date().toISOString() };
  } else {
    updated = [...current, { ...blog, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
  }
  setLocal(STORAGE_KEYS.BLOGS, updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'blogs', blog.id), blog);
    } catch (e) {
      console.error('Firestore saveBlog error:', e);
    }
  }
  return blog;
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  const current = getLocal<BlogArticle[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
  setLocal(
    STORAGE_KEYS.BLOGS,
    current.filter((b) => b.id !== blogId)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'blogs', blogId));
    } catch (e) {
      console.error('Firestore deleteBlog error:', e);
    }
  }
};

// ----------------- SETTINGS & ANALYTICS -----------------
export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'general'));
      if (snap.exists()) {
        return snap.data() as PlatformSettings;
      }
    } catch (e) {
      console.warn('Firestore fallback for settings:', e);
    }
  }
  return getLocal<PlatformSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
};

export const savePlatformSettings = async (settings: PlatformSettings): Promise<PlatformSettings> => {
  setLocal(STORAGE_KEYS.SETTINGS, settings);
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
    } catch (e) {
      console.error('Firestore savePlatformSettings error:', e);
    }
  }
  return settings;
};

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const subjects = await getSubjects();
  const chapters = await getChapters();
  const notes = await getNotes();
  const mcqs = await getMCQs();
  const tests = await getModelTests();
  const pdfs = await getPDFs();
  const blogs = await getBlogs();
  const results = await getAllTestResults();

  const totalDownloads = pdfs.reduce((acc, p) => acc + (p.downloadCount || 0), 0);
  const totalAttempts = tests.reduce((acc, t) => acc + (t.attemptsCount || 0), 0) + results.length;

  const base = getLocal<AdminAnalytics>(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);

  return {
    ...base,
    totalSubjects: subjects.length,
    totalChapters: chapters.length,
    totalNotes: notes.length,
    totalPdfs: pdfs.length,
    totalMcqs: mcqs.length,
    totalTests: tests.length,
    totalBlogs: blogs.length,
    totalDownloads: Math.max(base.totalDownloads || 0, totalDownloads),
    totalQuizAttempts: Math.max(base.totalQuizAttempts || 0, totalAttempts)
  };
};

// Reset to sample data
export const resetToSampleData = (): void => {
  setLocal(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  setLocal(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  setLocal(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  setLocal(STORAGE_KEYS.MCQS, INITIAL_MCQS);
  setLocal(STORAGE_KEYS.TESTS, INITIAL_TESTS);
  setLocal(STORAGE_KEYS.PDFS, INITIAL_PDFS);
  setLocal(STORAGE_KEYS.BOARD_QUESTIONS, INITIAL_BOARD_QUESTIONS);
  setLocal(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
  setLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  setLocal(STORAGE_KEYS.ANALYTICS, INITIAL_ANALYTICS);
};

export const resetToDemoData = resetToSampleData;
export const getBlogBySlug = getBlogBySlugOrId;
export const getNoteBySlug = getNoteByIdOrSlug;
export const incrementPdfDownloads = incrementPDFDownloads;
