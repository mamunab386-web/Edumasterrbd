import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Zap,
  Download,
  FileCheck2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import * as Icons from 'lucide-react';
import {
  getSubjects,
  getChapters,
  getNotes,
  getMCQs,
  getPDFs,
  getBoardQuestions
} from '../services/dataService';
import { Subject, Chapter, Note, MCQ, PDFResource, BoardQuestion } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';
import { RelatedContentLinks } from '../components/common/RelatedContentLinks';

interface SubjectDetailPageProps {
  classLevel: 'ssc' | 'hsc';
  subjectId: string;
  navigate: (to: string) => void;
}

export const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({
  classLevel,
  subjectId,
  navigate
}) => {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [boardQuestions, setBoardQuestions] = useState<BoardQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'mcqs' | 'pdfs' | 'board'>('chapters');

  useEffect(() => {
    async function load() {
      const [subs, chaps, nts, mq, pf, bq] = await Promise.all([
        getSubjects(),
        getChapters(),
        getNotes(),
        getMCQs(),
        getPDFs(),
        getBoardQuestions()
      ]);

      const found = subs.find((s) => s.id === subjectId);
      setSubject(found || null);
      setChapters(chaps.filter((c) => c.subjectId === subjectId));
      setNotes(nts.filter((n) => n.subjectId === subjectId));
      setMcqs(mq.filter((m) => m.subjectId === subjectId));
      setPdfs(pf.filter((p) => p.subjectId === subjectId));
      setBoardQuestions(bq.filter((b) => b.subjectId === subjectId));
    }
    load();
  }, [subjectId, classLevel]);

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="বিষয়টি পাওয়া যায়নি"
          description="অনুগ্রহ করে বিষয় তালিকায় ফিরে যান এবং সঠিক বিষয় নির্বাচন করুন।"
          actionText="বিষয় তালিকা দেখুন"
          onAction={() => navigate(`/${classLevel}`)}
        />
      </div>
    );
  }

  const Icon = (Icons as any)[subject.icon] || Icons.BookOpen;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`${subject.banglaName} (${subject.name}) ${classLevel.toUpperCase()} সম্পূর্ণ নোট ও MCQ | EduMaster BD`}
        description={`${classLevel.toUpperCase()} ${subject.banglaName} বিষয়ের সকল অধ্যায়ভিত্তিক হ্যান্ডনোট, থিওরি সামারি, সূত্র তালিকা, MCQ প্র্যাকটিস ও বিগত বছরের বোর্ড প্রশ্ন সমাধান।`}
        keywords={[
          `${subject.banglaName} ${classLevel.toUpperCase()}`,
          `${subject.name} note Bangladesh`,
          `${subject.name} MCQ practice`,
          `${subject.name} PDF download`,
          `${classLevel.toUpperCase()} ${subject.name} suggestion`
        ]}
        canonicalUrl={`https://edumasterbd.vercel.app/${classLevel}/${subjectId}`}
        breadcrumbs={[
          { name: `${classLevel.toUpperCase()} বিভাগ`, url: `/${classLevel}` },
          { name: subject.banglaName, url: `/${classLevel}/${subjectId}` }
        ]}
        courseData={{
          name: `${classLevel.toUpperCase()} ${subject.banglaName} (${subject.name})`,
          description: subject.description,
          provider: 'EduMaster BD',
          educationalLevel: classLevel.toUpperCase()
        }}
      />

      <Breadcrumbs
        items={[
          { label: `${classLevel.toUpperCase()} বিভাগ`, path: `/${classLevel}` },
          { label: subject.banglaName }
        ]}
        navigate={navigate}
      />

      {/* Subject Hero Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${subject.color} flex items-center justify-center text-white shadow-lg`}
            >
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {classLevel.toUpperCase()} কোর্স কারিকুলাম
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {subject.banglaName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {subject.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/mcq?class=${classLevel}&subject=${subject.id}`)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>MCQ প্র্যাকটিস</span>
            </button>
            <button
              onClick={() => navigate(`/test?class=${classLevel}&subject=${subject.id}`)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>মডেল টেস্ট</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'chapters', label: `অধ্যায়সমূহ (${chapters.length})`, icon: Layers },
            { id: 'notes', label: `হ্যান্ডনোট (${notes.length})`, icon: BookOpen },
            { id: 'mcqs', label: `MCQ প্রশ্ন (${mcqs.length})`, icon: Zap },
            { id: 'pdfs', label: `PDF রিসোর্স (${pdfs.length})`, icon: Download },
            { id: 'board', label: `বোর্ড প্রশ্ন (${boardQuestions.length})`, icon: FileCheck2 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: CHAPTERS */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">অধ্যায়ভিত্তিক তালিকা</h3>
          {chapters.length === 0 ? (
            <EmptyState
              title="কোনো অধ্যায় এখনো যুক্ত করা হয়নি"
              description="শীঘ্রই এই বিষয়ের অধ্যায়সমূহ যুক্ত করা হবে।"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapters.map((chap) => {
                const chapNotes = notes.filter((n) => n.chapterId === chap.id);
                const chapMcqs = mcqs.filter((m) => m.chapterId === chap.id);

                return (
                  <GlassCard
                    key={chap.id}
                    onClick={() => navigate(`/${classLevel}/${subject.id}/${chap.id}`)}
                    className="p-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                          {chap.chapterNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {chap.banglaTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 pl-9">
                        {chapNotes.length} টি নোট • {chapMcqs.length} টি MCQ কুইজ
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">বিষয়ভিত্তিক সকল নোট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <GlassCard
                key={note.id}
                onClick={() => navigate(`/notes/${note.slug || note.id}`)}
                className="p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>{note.readingTimeMinutes} মিনিট পড়ার সময়</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{note.author}</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-2">{note.title}</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {note.summary}
                </p>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  নোট পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MCQS */}
      {activeTab === 'mcqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">MCQ প্র্যাকটিস ব্যাংক</h3>
            <button
              onClick={() => navigate(`/mcq?class=${classLevel}&subject=${subject.id}`)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              ইন্টারেক্টিভ কুইজ মোডে যান &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {mcqs.map((mcq, idx) => (
              <div
                key={mcq.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {mcq.question}
                  </h4>
                  {mcq.boardRef && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                      {mcq.boardRef}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {mcq.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border ${
                        oIdx === mcq.correctAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold mr-1.5">{['ক', 'খ', 'গ', 'ঘ'][oIdx]}.</span>
                      {opt}
                    </div>
                  ))}
                </div>
                {mcq.explanation && (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200">
                    <span className="font-bold">ব্যাখ্যা:</span> {mcq.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PDFS */}
      {activeTab === 'pdfs' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">PDF হ্যান্ডনোট ও শিট</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
              <GlassCard
                key={pdf.id}
                onClick={() => navigate(`/pdf/${pdf.id}`)}
                className="p-5 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{pdf.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{pdf.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{pdf.fileSizeMB} MB</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> ডাউনলোড
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BOARD QUESTIONS */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">বিগত বছরের বোর্ড প্রশ্ন</h3>
          <div className="space-y-3">
            {boardQuestions.map((bq) => (
              <div
                key={bq.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {bq.board} বোর্ড {bq.year}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{bq.examType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{bq.title}</h4>
                </div>
                <button
                  onClick={() => navigate('/board-questions')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  সমাধান দেখুন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Linking Widgets for SEO */}
      <RelatedContentLinks
        title={`${subject.banglaName} সম্পর্কিত অন্যান্য রিসোর্স`}
        relatedNotes={notes}
        relatedPdfs={pdfs}
        navigate={navigate}
      />
    </div>
  );
};
