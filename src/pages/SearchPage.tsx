import React, { useEffect, useState } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  Download,
  FileCheck2,
  ArrowRight,
  Layers
} from 'lucide-react';
import {
  getSubjects,
  getNotes,
  getMCQs,
  getModelTests,
  getPDFs
} from '../services/dataService';
import { Subject, Note, MCQ, ModelTest, PDFResource } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';

interface SearchPageProps {
  initialQuery?: string;
  navigate: (to: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', navigate }) => {
  const [query, setQuery] = useState(initialQuery);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [tests, setTests] = useState<ModelTest[]>([]);
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);

  useEffect(() => {
    async function load() {
      const [s, n, m, t, p] = await Promise.all([
        getSubjects(),
        getNotes(),
        getMCQs(),
        getModelTests(),
        getPDFs()
      ]);
      setSubjects(s);
      setNotes(n);
      setMcqs(m);
      setTests(t);
      setPdfs(p);
    }
    load();
  }, []);

  const q = query.trim().toLowerCase();

  const matchedSubjects = q
    ? subjects.filter((s) => s.banglaName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    : [];

  const matchedNotes = q
    ? notes.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q))
    : [];

  const matchedMcqs = q
    ? mcqs.filter((m) => m.question.toLowerCase().includes(q))
    : [];

  const matchedTests = q
    ? tests.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    : [];

  const matchedPdfs = q
    ? pdfs.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    : [];

  const totalResults =
    matchedSubjects.length +
    matchedNotes.length +
    matchedMcqs.length +
    matchedTests.length +
    matchedPdfs.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'গ্লোবাল সার্চ' }]} navigate={navigate} />

      {/* Search Input Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          সার্চ করুন পুরো প্ল্যাটফর্মে
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          যেকোনো বিষয়, অধ্যায়, সূত্রের নোট, MCQ প্রশ্ন বা মডেল টেস্ট তাৎক্ষণিক খুঁজুন।
        </p>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="সার্চ করুন (যেমন: গতি, ভেক্টর, রসায়ন)..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {q && (
        <div className="space-y-8">
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            &ldquo;{query}&rdquo; এর জন্য <span className="font-bold text-indigo-600">{totalResults}</span> টি ফলাফল পাওয়া গেছে:
          </div>

          {totalResults === 0 ? (
            <EmptyState
              title="কোনো ফলাফল পাওয়া যায়নি"
              description="অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।"
            />
          ) : (
            <div className="space-y-8">
              {/* Subjects */}
              {matchedSubjects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>বিষয়সমূহ ({matchedSubjects.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchedSubjects.map((s) => (
                      <GlassCard
                        key={s.id}
                        onClick={() => navigate(`/${s.classLevel === 'hsc' ? 'hsc' : 'ssc'}/${s.id}`)}
                        className="p-4 flex items-center justify-between border border-slate-200 dark:border-slate-800"
                      >
                        <span className="text-sm font-bold">{s.banglaName}</span>
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {matchedNotes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>হ্যান্ডনোট ({matchedNotes.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchedNotes.map((n) => (
                      <GlassCard
                        key={n.id}
                        onClick={() => navigate(`/notes/${n.slug || n.id}`)}
                        className="p-5 border border-slate-200 dark:border-slate-800"
                      >
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">
                          {n.classLevel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-1">
                          {n.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{n.summary}</p>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* MCQs */}
              {matchedMcqs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>MCQ প্রশ্ন ({matchedMcqs.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {matchedMcqs.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => navigate(`/mcq`)}
                        className="glass-card rounded-xl p-4 cursor-pointer hover:border-amber-400 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase">
                            {m.classLevel} MCQ
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                            {m.question}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
