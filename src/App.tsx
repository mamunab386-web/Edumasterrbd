import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { SscHscPortalPage } from './pages/SscHscPortalPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { NotesListPage } from './pages/NotesListPage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { McqPracticePage } from './pages/McqPracticePage';
import { ModelTestListPage } from './pages/ModelTestListPage';
import { LiveTestPage } from './pages/LiveTestPage';
import { TestResultPage } from './pages/TestResultPage';
import { PdfLibraryPage } from './pages/PdfLibraryPage';
import { BoardQuestionsPage } from './pages/BoardQuestionsPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SearchPage } from './pages/SearchPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { StudentAuthPage } from './pages/StudentAuthPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse path and query params
  const [pathOnly, searchOnly] = currentPath.split('?');
  const searchParams = new URLSearchParams(searchOnly || '');
  const segments = pathOnly.split('/').filter(Boolean);

  const renderRoute = () => {
    // Root
    if (segments.length === 0) {
      return <HomePage navigate={navigate} />;
    }

    const first = segments[0];
    const second = segments[1];

    // SSC Portal / Detail
    if (first === 'ssc') {
      if (second) {
        return <SubjectDetailPage subjectId={second} classLevel="ssc" navigate={navigate} />;
      }
      return <SscHscPortalPage classLevel="ssc" navigate={navigate} />;
    }

    // HSC Portal / Detail
    if (first === 'hsc') {
      if (second) {
        return <SubjectDetailPage subjectId={second} classLevel="hsc" navigate={navigate} />;
      }
      return <SscHscPortalPage classLevel="hsc" navigate={navigate} />;
    }

    // Notes
    if (first === 'notes') {
      if (second) {
        return <NoteDetailPage slug={second} navigate={navigate} />;
      }
      return (
        <NotesListPage
          navigate={navigate}
          initialSubjectId={searchParams.get('subject') || undefined}
        />
      );
    }

    // MCQ Practice
    if (first === 'mcq') {
      return (
        <McqPracticePage
          navigate={navigate}
          initialSubjectId={searchParams.get('subject') || undefined}
          initialChapterId={searchParams.get('chapter') || undefined}
        />
      );
    }

    // Model Tests
    if (first === 'test' || first === 'model-tests') {
      if (second) {
        return <LiveTestPage testId={second} navigate={navigate} />;
      }
      return <ModelTestListPage navigate={navigate} />;
    }

    // Test Result
    if (first === 'test-result' && second) {
      return <TestResultPage resultId={second} navigate={navigate} />;
    }

    // PDF Resources
    if (first === 'pdf') {
      return <PdfLibraryPage pdfId={second} navigate={navigate} />;
    }

    // Board Questions
    if (first === 'board-questions') {
      return <BoardQuestionsPage navigate={navigate} />;
    }

    // Blog
    if (first === 'blog') {
      if (second) {
        return <BlogDetailPage slug={second} navigate={navigate} />;
      }
      return <BlogListPage navigate={navigate} />;
    }

    // Bookmarks
    if (first === 'bookmarks') {
      return <BookmarksPage navigate={navigate} />;
    }

    // Search
    if (first === 'search') {
      return <SearchPage initialQuery={searchParams.get('q') || ''} navigate={navigate} />;
    }

    // About & Contact
    if (first === 'about' || first === 'contact') {
      return <AboutContactPage navigate={navigate} />;
    }

    // Admin
    if (first === 'admin') {
      if (second === 'login') {
        return <AdminLoginPage navigate={navigate} />;
      }
      return <AdminDashboard navigate={navigate} />;
    }

    // Student Auth
    if (first === 'login' || first === 'signup') {
      return <StudentAuthPage navigate={navigate} />;
    }

    // Fallback to Home
    return <HomePage navigate={navigate} />;
  };

  const isAdminView = segments[0] === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar currentPath={pathOnly} navigate={navigate} />
      <main className="flex-1 w-full">{renderRoute()}</main>
      {!isAdminView && <Footer navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BookmarkProvider>
            <AppContent />
          </BookmarkProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
