import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  Bookmark,
  Sun,
  Moon,
  ShieldAlert,
  Menu,
  X,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  FileCheck2,
  ChevronDown,
  UserCircle2,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useBookmarks } from '../../context/BookmarkContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentPath: string;
  navigate: (to: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'হোম', path: '/' },
    { label: 'SSC বিভাগ', path: '/ssc' },
    { label: 'HSC বিভাগ', path: '/hsc' },
    { label: 'হ্যান্ডনোট', path: '/notes' },
    { label: 'MCQ প্র্যাকটিস', path: '/mcq' },
    { label: 'মডেল টেস্ট', path: '/test' },
    { label: 'PDF লাইব্রেরি', path: '/pdf' },
    { label: 'বোর্ড প্রশ্ন', path: '/board-questions' },
    { label: 'ব্লগ ও গাইড', path: '/blog' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      {/* Top Notification / Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>SSC ও HSC ২০২৫ এর সকল নতুন হ্যান্ডনোট ও মডেল টেস্ট সম্পূর্ণ ফ্রি!</span>
        <button
          onClick={() => navigate('/test')}
          className="underline hover:text-amber-200 font-semibold transition ml-1"
        >
          টেস্ট দিন &rarr;
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    EduMaster
                  </span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    BD
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-0.5">
                  SSC & HSC লার্নিং হাব
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Tools (Search, Bookmarks, Theme, Auth, Admin) */}
          <div className="flex items-center gap-2">
            {/* Global Search Button */}
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 text-xs transition"
              title="অনুসন্ধান করুন"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">খুঁজুন...</span>
              <kbd className="hidden lg:inline text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
                /
              </kbd>
            </button>

            {/* Bookmarks Counter */}
            <button
              onClick={() => navigate('/bookmarks')}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              title="সংরক্ষিত বুকমার্ক"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              title={isDark ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Admin Panel Direct Button */}
            {isAdmin ? (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>এডমিন প্যানেল</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/login')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition"
                title="এডমিন লগইন"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden md:inline">এডমিন</span>
              </button>
            )}

            {/* User Account dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline text-slate-700 dark:text-slate-300 text-xs max-w-[90px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px]">
                          {user.role === 'admin' ? 'এডমিনিস্ট্রেটর' : `${user.classLevel ? user.classLevel.toUpperCase() : 'SSC/HSC'} শিক্ষার্থী`}
                        </span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-rose-600 font-medium"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          এডমিন ড্যাশবোর্ড
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate('/bookmarks');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        সংরক্ষিত নোট ও প্রশ্ন
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        লগআউট
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
              >
                <UserCircle2 className="w-4 h-4" />
                <span>লগইন</span>
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/ssc');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
              >
                <GraduationCap className="w-4 h-4" />
                <span>SSC সেকশন</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/hsc');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold"
              >
                <Layers className="w-4 h-4" />
                <span>HSC সেকশন</span>
              </button>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(link.path);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>এডমিন ড্যাশবোর্ড</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/search');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-semibold"
              >
                <Search className="w-4 h-4" />
                <span>গ্লোবাল সার্চ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
