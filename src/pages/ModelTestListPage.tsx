import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Clock,
  Award,
  Zap,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getModelTests, getSubjects } from '../services/dataService';
import { ModelTest, Subject } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';

interface ModelTestListPageProps {
  navigate: (to: string) => void;
  initialClass?: 'ssc' | 'hsc';
}

export const ModelTestListPage: React.FC<ModelTestListPageProps> = ({
  navigate,
  initialClass
}) => {
  const [tests, setTests] = useState<ModelTest[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<'all' | 'ssc' | 'hsc'>(initialClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const [tList, sList] = await Promise.all([getModelTests(), getSubjects()]);
      setTests(tList.filter((t) => t.published));
      setSubjects(sList);
    }
    load();
  }, []);

  const filteredTests = tests.filter((t) => {
    const matchClass = selectedClass === 'all' || t.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || t.subjectId === selectedSubject;
    return matchClass && matchSub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="SSC ও HSC অনলাইন লাইভ মডেল টেস্ট ও মেধা তালিকা | EduMaster BD"
        description="বোর্ড পরীক্ষার অনুরূপ টাইমড মডেল টেস্ট দিন, নেগেটিভ মার্কিং সহ তাৎক্ষণিক ফলাফল ও বিস্তারিত সমাধান দেখে প্রস্তুতি যাচাই করুন।"
        keywords={[
          'Online Model Test Bangladesh',
          'SSC Model Test 2025',
          'HSC Model Test 2025',
          'Live Exam Bangladesh',
          'Board Standard Exam'
        ]}
        canonicalUrl="https://edumasterbd.vercel.app/model-tests"
        breadcrumbs={[{ name: 'অনলাইন মডেল টেস্ট', url: '/model-tests' }]}
        quizData={{
          name: 'SSC & HSC Timed Model Examination',
          description: 'Full-length and chapter-wise timed mock tests for SSC and HSC students.',
          timeRequired: 'PT30M'
        }}
      />

      <Breadcrumbs items={[{ label: 'অনলাইন মডেল টেস্ট' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            বোর্ড স্ট্যান্ডার্ড এক্সাম হল
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            অনলাইন মডেল টেস্ট ও তাৎক্ষণিক রেজাল্ট
          </h1>
          <p className="text-sm text-indigo-100 leading-relaxed">
            নির্দিষ্ট সময়সীমার মধ্যে প্রশ্ন সমাধান করে নিজের সার্বিক প্রস্তুতি যাচাই করুন।
            টেস্ট শেষে নির্ভুল স্কোর, গ্রাফ ও বিস্তারিত উত্তরমালা প্রদান করা হবে।
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">শ্রেণি ফিল্টার:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'all', label: 'সকল টেস্ট' },
              { id: 'ssc', label: 'SSC' },
              { id: 'hsc', label: 'HSC' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedClass(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedClass === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">সকল বিষয়</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.banglaName}
            </option>
          ))}
        </select>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <EmptyState
          title="কোনো মডেল টেস্ট পাওয়া যায়নি"
          description="নির্বাচিত ফিল্টারের অধীনে কোনো টেস্ট পাওয়া যায়নি।"
          actionText="সকল টেস্ট দেখুন"
          onAction={() => {
            setSelectedClass('all');
            setSelectedSubject('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <GlassCard
              key={test.id}
              className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-purple-400"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {test.classLevel.toUpperCase()} স্পেশাল
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.durationMinutes} মিনিট
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {test.description}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">পূর্ণমান</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{test.totalMarks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">পাস নম্বর</span>
                    <span className="font-bold text-emerald-600">{test.passingMarks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">পরীক্ষার্থী</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{test.attemptsCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/test/${test.id}`)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>টেস্ট শুরু করুন</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
