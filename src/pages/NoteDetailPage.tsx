import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Clock,
  User,
  Calendar,
  Bookmark,
  Share2,
  Zap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Download,
  HelpCircle
} from 'lucide-react';
import { getNoteBySlug, getNotes, getSubjects } from '../services/dataService';
import { Note, Subject } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

interface NoteDetailPageProps {
  slug: string;
  navigate: (to: string) => void;
}

export const NoteDetailPage: React.FC<NoteDetailPageProps> = ({ slug, navigate }) => {
  const [note, setNote] = useState<Note | null>(null);
  const [relatedNotes, setRelatedNotes] = useState<Note[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);

  const { addBookmark, isBookmarked } = useBookmarks();
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const found = await getNoteBySlug(slug);
      if (found) {
        setNote(found);
        const allNotes = await getNotes();
        setRelatedNotes(
          allNotes.filter((n) => n.id !== found.id && n.classLevel === found.classLevel).slice(0, 2)
        );
        const subjects = await getSubjects();
        setSubject(subjects.find((s) => s.id === found.subjectId) || null);
      }
    }
    load();
  }, [slug]);

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="হ্যান্ডনোটটি পাওয়া যায়নি"
          description="অনুগ্রহ করে নোট তালিকায় ফিরে যান।"
          actionText="সকল নোট"
          onAction={() => navigate('/notes')}
        />
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('নোটের লিংক কপি করা হয়েছে!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: `${note.classLevel.toUpperCase()} নোটস`, path: '/notes' },
          { label: note.title }
        ]}
        navigate={navigate}
      />

      {/* Note Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase">
            {note.classLevel.toUpperCase()} হ্যান্ডনোট
          </span>
          {subject && (
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              {subject.banglaName}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {note.title}
        </h1>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>{note.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{note.readingTimeMinutes} মিনিট পড়ার সময়</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{note.publishedAt}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                addBookmark({
                  itemId: note.id,
                  type: 'note',
                  title: note.title,
                  link: `/notes/${note.slug || note.id}`
                })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isBookmarked(note.id)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isBookmarked(note.id) ? 'সংরক্ষিত' : 'বুকমার্ক'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Thumbnail if present */}
      {note.thumbnailUrl && (
        <div className="rounded-3xl overflow-hidden shadow-xl max-h-96 w-full relative">
          <img
            src={note.thumbnailUrl}
            alt={note.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Quick Summary / Formula Callout */}
      {note.summary && (
        <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-sm text-indigo-900 dark:text-indigo-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>এক নজরে অধ্যায়ের মূল বিষয়বস্তু:</span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200/90 leading-relaxed">
            {note.summary}
          </p>
        </div>
      )}

      {/* Main Content Body */}
      <article className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed">
        <div className="whitespace-pre-line text-sm sm:text-base font-normal space-y-4">
          {note.content}
        </div>
      </article>

      {/* Next Practice Step CTA */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h4 className="font-bold text-base">পড়া শেষ? এবার প্রস্তুতি পরীক্ষা করুন!</h4>
          <p className="text-xs font-medium text-slate-900/80 mt-0.5">
            এই অধ্যায়ের ওপর তৈরি বহুনির্বাচনী কুইজ দিয়ে যাচাই করুন আপনি কতটা শিখেছেন।
          </p>
        </div>
        <button
          onClick={() => navigate(`/mcq?class=${note.classLevel}&subject=${note.subjectId}`)}
          className="px-5 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold shadow-md transition flex items-center gap-1.5 flex-shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>MCQ প্র্যাকটিসে যান</span>
        </button>
      </div>

      {/* Related Notes */}
      {relatedNotes.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">সম্পর্কিত অন্যান্য নোট</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedNotes.map((rn) => (
              <GlassCard
                key={rn.id}
                onClick={() => navigate(`/notes/${rn.slug || rn.id}`)}
                className="p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">
                    {rn.classLevel}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {rn.title}
                  </h4>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
