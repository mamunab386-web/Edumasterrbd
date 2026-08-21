import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminContentGenerator } from './AdminContentGenerator';
import { AdminSubjectsManager } from './AdminSubjectsManager';
import { AdminChaptersManager } from './AdminChaptersManager';
import { AdminNotesManager } from './AdminNotesManager';
import { AdminMcqManager } from './AdminMcqManager';
import { AdminMcqSetsManager } from './AdminMcqSetsManager';
import { AdminImportantQuestionsManager } from './AdminImportantQuestionsManager';
import { AdminModelTestManager } from './AdminModelTestManager';
import { AdminPdfManager } from './AdminPdfManager';
import { AdminPdfNotesManager } from './AdminPdfNotesManager';
import { AdminBoardQuestionManager } from './AdminBoardQuestionManager';
import { AdminBlogManager } from './AdminBlogManager';
import { AdminAdsManager } from './AdminAdsManager';
import { AdminSettings } from './AdminSettings';
import { AdminLoginPage } from './AdminLoginPage';

interface AdminDashboardProps {
  navigate: (to: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { isAdmin, user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  if (!isAdmin) {
    return <AdminLoginPage navigate={navigate} />;
  }

  return (
    <AdminLayout currentTab={currentTab} onSelectTab={setCurrentTab} navigate={navigate}>
      {currentTab === 'dashboard' && <AdminDashboardOverview onSelectTab={setCurrentTab} />}
      {currentTab === 'generator' && <AdminContentGenerator onNavigateTab={setCurrentTab} />}
      {currentTab === 'subjects' && <AdminSubjectsManager />}
      {currentTab === 'chapters' && <AdminChaptersManager />}
      {currentTab === 'notes' && <AdminNotesManager />}
      {currentTab === 'pdf-notes' && <AdminPdfNotesManager />}
      {currentTab === 'mcqs' && <AdminMcqManager />}
      {currentTab === 'mcq-sets' && <AdminMcqSetsManager />}
      {currentTab === 'tests' && <AdminModelTestManager />}
      {currentTab === 'important-questions' && <AdminImportantQuestionsManager />}
      {currentTab === 'pdfs' && <AdminPdfNotesManager />}
      {currentTab === 'board' && <AdminBoardQuestionManager />}
      {currentTab === 'blogs' && <AdminBlogManager />}
      {currentTab === 'ads' && <AdminAdsManager />}
      {currentTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};
