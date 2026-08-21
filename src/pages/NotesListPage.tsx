import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Bookmark,
  ArrowRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { getNotes, getSubjects } from '../services/dataService';
import { Note, Subject } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useBookmarks } from '../context/BookmarkContext';
import { SEOHead } from '../components/common/SEOHead';

interface NotesListPageProps {
  navigate: (to: string) => void;
  initialClass?: 'ssc' | 'hsc';
  initialSubjectId?: string;
}

export const NotesListPage: React.FC<NotesListPageProps> = ({
  navigate,
  initialClass,
  initialSubjectId
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<'all' | 'ssc' | 'hsc'>(initialClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const { addBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    async function load() {
      const [nList, sList] = await Promise.all([getNotes(), getSubjects()]);
      setNotes(nList.filter((n) => n.published));
      setSubjects(sList);
    }
    load();
  }, []);

  const filteredNotes = notes.filter((n) => {
    const matchClass = selectedClass === 'all' || n.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || n.subjectId === selectedSubject;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSub && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="SSC ও HSC সকল বিষয়ের অধ্যায়ভিত্তিক হ্যান্ডনোট ও শর্টকাট | EduMaster BD"
        description="পদার্থবিজ্ঞান, রসায়ন, গণিত ও ICT সহ SSC ও HSC এর সকল বিষয়ের অধ্যায়ভিত্তিক স্পেশাল হ্যান্ডনোট, সূত্র ও সামারি ফ্রিতে পড়ুন।"
        keywords={[
          'SSC Handnotes',
          'HSC Handnotes',
          'Bangla study notes',
          'Physics formula sheet',
          'Chemistry short note',
          'Higher math formulas'
        ]}
        canonicalUrl="https://edumasterbd.vercel.app/notes"
        breadcrumbs={[{ name: 'হ্যান্ডনোট লাইব্রেরি', url: '/notes' }]}
        courseData={{
          name: 'SSC & HSC Free Study Notes Repository',
          description: 'Access curated study notes, summaries, and formula sheets for SSC and HSC students in Bangladesh.',
          provider: 'EduMaster BD',
          educationalLevel: 'Secondary and Higher Secondary'
        }}
        faqs={[
          {
            question: 'হ্যান্ডনোটগুলো কি অফলাইনে পড়া যাবে?',
            answer: 'হ্যাঁ, আপনি প্রতিটি নোট ব্রাউজারে বুকমার্ক করে রাখতে পারেন এবং প্রিন্ট বা PDF ডাউনলোড করার সুবিধাও রয়েছে।'
          },
          {
            question: 'নোটগুলোতে কি বিগত বছরের বোর্ড প্রশ্নের সমাধান আছে?',
            answer: 'হ্যাঁ, প্রতিটি নোটে বোর্ড পরীক্ষায় আসা বহুনির্বাচনী ও সৃজনশীল প্রশ্নের শর্টকাট টেকনিক ও থিওরি সংকলিত রয়েছে।'
          }
        ]}
      />

      <Breadcrumbs items={[{ label: 'অধ্যায়ভিত্তিক হ্যান্ডনোট' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            স্মার্ট রিভিশন নোট
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            অধ্যায়ভিত্তিক হ্যান্ডনোট ও সামারি
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            এসএসসি ও এইচএসসি শিক্ষার্থীদের জটিল সূত্র ও তত্ত্ব সহজে বুঝতে অভিজ্ঞ শিক্ষকদের তৈরি সহজবোধ্য হ্যান্ডনোট।
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নোট খুঁজুন (যেমন: গতি, ভেক্টর)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
            {[
              { id: 'all', label: 'সকল ক্লাস' },
              { id: 'ssc', label: 'SSC' },
              { id: 'hsc', label: 'HSC' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedClass(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedClass === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
          >
            <option value="all">সকল বিষয়</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.banglaName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          title="কোনো হ্যান্ডনোট পাওয়া যায়নি"
          description="অন্য কোনো বিষয় বা সার্চ কি-ওয়ার্ড ব্যবহার করে চেষ্টা করুন।"
          actionText="ফিল্টার রিসেট করুন"
          onAction={() => {
            setSelectedClass('all');
            setSelectedSubject('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <GlassCard
              key={note.id}
              onClick={() => navigate(`/notes/${note.slug || note.id}`)}
              className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-indigo-400"
            >
              <div>
                {note.thumbnailUrl && (
                  <div className="h-40 rounded-xl overflow-hidden mb-4 relative">
                    <img
                      src={note.thumbnailUrl}
                      alt={note.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold uppercase">
                      {note.classLevel.toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {note.readingTimeMinutes} মিনিট পড়ার সময়
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addBookmark({
                        itemId: note.id,
                        type: 'note',
                        title: note.title,
                        link: `/notes/${note.slug || note.id}`
                      });
                    }}
                    className={`p-1 rounded-md transition ${
                      isBookmarked(note.id)
                        ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                  {note.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {note.summary}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{note.author}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  নোট পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
