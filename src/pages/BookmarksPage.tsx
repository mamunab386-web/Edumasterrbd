import React from 'react';
import { Bookmark, Trash2, ArrowRight, BookOpen, Zap } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';

interface BookmarksPageProps {
  navigate: (to: string) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ navigate }) => {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'সংরক্ষিত আইটেম ও বুকমার্ক' }]} navigate={navigate} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            বুকমার্ক ও সংরক্ষিত তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            আপনার পরবর্তীতে পড়ার জন্য সেভ করে রাখা হ্যান্ডনোট ও প্রশ্নসমূহ।
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={clearBookmarks}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>সব মুছে ফেলুন</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="কোনো বুকমার্ক সংরক্ষিত নেই"
          description="হ্যান্ডনোট পড়ার সময় বা MCQ সমাধান করার সময় বুকমার্ক আইকনে ক্লিক করে এখানে জমা রাখুন।"
          actionText="হ্যান্ডনোট ব্রাউজ করুন"
          onAction={() => navigate('/notes')}
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <GlassCard
              key={bm.id}
              onClick={() => navigate(bm.link)}
              className="p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  {bm.type === 'note' ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {bm.type === 'note' ? 'হ্যান্ডনোট' : 'MCQ প্রশ্ন'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {bm.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    সংরক্ষিত হয়েছে: {new Date(bm.savedAt).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(bm.itemId);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  title="বুকমার্ক মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
