import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminSubjectsManager } from './AdminSubjectsManager';
import { AdminChaptersManager } from './AdminChaptersManager';
import { AdminNotesManager } from './AdminNotesManager';
import { AdminMcqManager } from './AdminMcqManager';
import { AdminModelTestManager } from './AdminModelTestManager';
import { AdminPdfManager } from './AdminPdfManager';
import { AdminBoardQuestionManager } from './AdminBoardQuestionManager';
import { AdminBlogManager } from './AdminBlogManager';
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
      {currentTab === 'subjects' && <AdminSubjectsManager />}
      {currentTab === 'chapters' && <AdminChaptersManager />}
      {currentTab === 'notes' && <AdminNotesManager />}
      {currentTab === 'mcqs' && <AdminMcqManager />}
      {currentTab === 'tests' && <AdminModelTestManager />}
      {currentTab === 'pdfs' && <AdminPdfManager />}
      {currentTab === 'board' && <AdminBoardQuestionManager />}
      {currentTab === 'blogs' && <AdminBlogManager />}
      {currentTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};
