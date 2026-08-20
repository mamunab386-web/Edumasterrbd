import React from 'react';
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Zap,
  Sparkles,
  Download,
  FileCheck2,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  navigate: (to: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  navigate,
  children
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'subjects', label: 'বিষয়সমূহ (Subjects)', icon: Layers },
    { id: 'chapters', label: 'অধ্যায়সমূহ (Chapters)', icon: BookOpen },
    { id: 'notes', label: 'হ্যান্ডনোট (Notes)', icon: FileText },
    { id: 'mcqs', label: 'MCQ প্রশ্ন ব্যাংক', icon: Zap },
    { id: 'tests', label: 'মডেল টেস্ট (Tests)', icon: Sparkles },
    { id: 'pdfs', label: 'PDF লাইব্রেরি', icon: Download },
    { id: 'board', label: 'বোর্ড প্রশ্ন আর্কাইভ', icon: FileCheck2 },
    { id: 'blogs', label: 'ব্লগ ও গাইডলাইন', icon: BookOpen },
    { id: 'settings', label: 'সেটিংস ও ডেটাবেজ', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Admin Status Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                এডমিন প্যানেল
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                সক্রিয়
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email || 'admin@edumasterbd.com'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে যান</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1">
          <div className="glass-card rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Admin View */}
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
};
