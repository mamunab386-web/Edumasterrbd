import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Filter,
  Search,
  Download,
  ChevronDown,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { getBoardQuestions, getSubjects } from '../services/dataService';
import { BoardQuestion, Subject } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';

interface BoardQuestionsPageProps {
  navigate: (to: string) => void;
  initialClass?: 'ssc' | 'hsc';
}

const BOARDS = [
  'সকল বোর্ড',
  'ঢাকা',
  'রাজশাহী',
  'চট্টগ্রাম',
  'কুমিল্লা',
  'যশোর',
  'বরিশাল',
  'সিলেট',
  'দিনাজপুর',
  'ময়মনসিংহ'
];

const YEARS = ['সকল বছর', 2024, 2023, 2022, 2021, 2020];

export const BoardQuestionsPage: React.FC<BoardQuestionsPageProps> = ({
  navigate,
  initialClass
}) => {
  const [questions, setQuestions] = useState<BoardQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<'all' | 'ssc' | 'hsc'>(initialClass || 'all');
  const [selectedBoard, setSelectedBoard] = useState<string>('সকল বোর্ড');
  const [selectedYear, setSelectedYear] = useState<string | number>('সকল বছর');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [qList, sList] = await Promise.all([getBoardQuestions(), getSubjects()]);
      setQuestions(qList);
      setSubjects(sList);
    }
    load();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchClass = selectedClass === 'all' || q.classLevel === selectedClass;
    const matchBoard = selectedBoard === 'সকল বোর্ড' || q.board === selectedBoard;
    const matchYear = selectedYear === 'সকল বছর' || q.year === Number(selectedYear);
    const matchSub = selectedSubject === 'all' || q.subjectId === selectedSubject;
    return matchClass && matchBoard && matchYear && matchSub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="SSC ও HSC বিগত বছরের সকল বোর্ড প্রশ্ন ও উত্তর সমাধান | EduMaster BD"
        description="ঢাকা, রাজশাহী, কুমিল্লা, চট্টগ্রাম, যশোর, বরিশাল, সিলেট ও দিনাজপুর বোর্ডের এসএসসি ও এইচএসসি পরীক্ষার বিগত বছরের সৃজনশীল ও বহুনির্বাচনী প্রশ্ন এবং সমাধান।"
        keywords={[
          'SSC Board Questions',
          'HSC Board Question Solution',
          'Dhaka Board Question',
          'Board Question Bank Bangladesh',
          'Previous Year Exam Papers'
        ]}
        canonicalUrl="https://edumasterbd.vercel.app/board-questions"
        breadcrumbs={[{ name: 'বোর্ড প্রশ্ন ব্যাংক', url: '/board-questions' }]}
        courseData={{
          name: 'SSC & HSC All Education Boards Question Bank Archive',
          description: 'Access previous years examination question papers with model answers for all Bangladesh education boards.',
          provider: 'EduMaster BD',
          educationalLevel: 'SSC & HSC'
        }}
      />

      <Breadcrumbs items={[{ label: 'বোর্ড প্রশ্ন ব্যাংক' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            বিগত বছরের বোর্ড আর্কাইভ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            এসএসসি ও এইচএসসি বোর্ড প্রশ্ন ও নিখুঁত সমাধান
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            ঢাকা, রাজশাহী, চট্টগ্রামসহ সকল শিক্ষা বোর্ডের বিগত ৫ বছরের প্রশ্নপত্র ও স্ট্যান্ডার্ড বাংলা সমাধান।
          </p>
        </div>
      </div>

      {/* Multi Filter Bar */}
      <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>বোর্ড ও বছর ফিল্টার করুন</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">শ্রেণি</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">উভয় শ্রেণি (SSC & HSC)</option>
              <option value="ssc">SSC</option>
              <option value="hsc">HSC</option>
            </select>
          </div>

          {/* Board */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">শিক্ষা বোর্ড</label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {BOARDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">পরীক্ষার সাল</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">বিষয়</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
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
      </div>

      {/* Question List */}
      {filteredQuestions.length === 0 ? (
        <EmptyState
          title="কোনো বোর্ড প্রশ্ন পাওয়া যায়নি"
          description="অন্য কোনো বোর্ড বা বছর নির্বাচন করে চেষ্টা করুন।"
          actionText="ফিল্টার রিসেট করুন"
          onAction={() => {
            setSelectedClass('all');
            setSelectedBoard('সকল বোর্ড');
            setSelectedYear('সকল বছর');
            setSelectedSubject('all');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <GlassCard
                key={q.id}
                className="p-6 border border-slate-200/80 dark:border-slate-800 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold uppercase">
                        {q.classLevel.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        {q.board} বোর্ড {q.year}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        {q.examType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {q.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {q.pdfUrl && (
                      <a
                        href={q.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                    >
                      <span>{isExpanded ? 'সমাধান বন্ধ করুন' : 'সমাধান দেখুন'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expandable Solution / Question Text */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {q.questionsText && (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">
                          মূল উদ্দীপক ও প্রশ্নপত্র:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                          {q.questionsText}
                        </p>
                      </div>
                    )}

                    {q.solutionText && (
                      <div className="p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-2 text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-sm">
                          <Award className="w-4 h-4 text-emerald-600" />
                          বোর্ড স্ট্যান্ডার্ড আদর্শ সমাধান:
                        </span>
                        <div className="whitespace-pre-line leading-relaxed font-medium">
                          {q.solutionText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
