import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Share2,
  HelpCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getTestResultById, getModelTestById } from '../services/dataService';
import { TestResult, ModelTest } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import { AdBanner } from '../components/common/AdBanner';

interface TestResultPageProps {
  resultId: string;
  navigate: (to: string) => void;
}

export const TestResultPage: React.FC<TestResultPageProps> = ({ resultId, navigate }) => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [test, setTest] = useState<ModelTest | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const res = await getTestResultById(resultId);
      if (res) {
        setResult(res);
        const t = await getModelTestById(res.testId);
        setTest(t);

        if (res.passed) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
        }
      }
    }
    load();
  }, [resultId]);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="ফলাফল পাওয়া যায়নি"
          description="অনুগ্রহ করে নতুন করে টেস্ট সম্পন্ন করুন।"
          actionText="মডেল টেস্ট পেজ"
          onAction={() => navigate('/test')}
        />
      </div>
    );
  }

  const chartData = [
    { name: 'সঠিক উত্তর', value: result.correctAnswers, color: '#10b981' },
    { name: 'ভুল উত্তর', value: result.wrongAnswers, color: '#f43f5e' },
    { name: 'উত্তরহীন', value: result.unattempted, color: '#94a3b8' }
  ].filter((d) => d.value > 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} মিনিট ${s} সেকেন্ড`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('রেজাল্ট লিংক কপি করা হয়েছে!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'মডেল টেস্ট', path: '/test' },
          { label: 'ফলাফল ও মূল্যায়ন' }
        ]}
        navigate={navigate}
      />

      {/* Main Scorecard Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{result.passed ? 'অভিনন্দন! আপনি পাস করেছেন 🎉' : 'আরও অনুশীলনের প্রয়োজন'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {result.testTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {result.percentage >= 80
                ? 'দারুণ পারফরম্যান্স! আপনি বিষয়টির মৌলিক ও অ্যাডভান্সড কনসেপ্টে চমৎকার দক্ষতা দেখিয়েছেন।'
                : result.percentage >= 50
                ? 'ভালো প্রচেষ্টা! ভুল উত্তরগুলোর সমাধান দেখে নিলে আপনার আত্মবিশ্বাস আরও বৃদ্ধি পাবে।'
                : 'চিন্তার কিছু নেই! অধ্যায়ভিত্তিক হ্যান্ডনোট রিভিশন দিয়ে আবারও টেস্টটিতে অংশ নিন।'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <button
                onClick={() => navigate(`/test/${result.testId}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আবার টেস্ট দিন</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>লিংক শেয়ার করুন</span>
              </button>
            </div>
          </div>

          {/* Big Score Box */}
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800/80 dark:to-indigo-950/60 border border-indigo-100 dark:border-indigo-900 w-64 flex-shrink-0 shadow-lg">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              প্রাপ্ত স্কোর
            </span>
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {result.score} <span className="text-2xl text-slate-400">/ {result.totalMarks}</span>
            </div>
            <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm">
              পারসেন্টেজ: {result.percentage}%
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>সময় লেগেছে: {formatTime(result.timeTakenSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Answers Distribution */}
        <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">উত্তরের বিভাজন</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>সঠিক উত্তর</span>
              </div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {result.correctAnswers} টি
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>ভুল উত্তর</span>
              </div>
              <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">
                {result.wrongAnswers} টি
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span>উত্তর দেওয়া হয়নি</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {result.unattempted} টি
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Metric 2: Visual Donut Chart */}
        <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 self-start">
            সঠিকতা গ্রাফ
          </h3>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>সঠিক</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>ভুল</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span>বাদ পড়া</span>
            </div>
          </div>
        </GlassCard>

        {/* Metric 3: Learning Suggestions */}
        <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>পরামর্শ ও প্রস্তুতি</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              ভুল ত্রুটি সংশোধনের গাইডলাইন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              নিচে প্রতিটি প্রশ্নের সঠিক উত্তর এবং ব্যাখ্যা বিস্তারিত দেওয়া আছে।
              বিশেষ করে যে প্রশ্নে ভুল হয়েছে সেটির ব্যাখ্যা মনোযোগ দিয়ে পড়ুন।
            </p>
          </div>

          <button
            onClick={() => navigate('/mcq')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>MCQ প্র্যাকটিসে যান</span>
          </button>
        </GlassCard>
      </div>

      {/* Test Result Ad Banner Placement */}
      <AdBanner placement="testResult" navigate={navigate} />

      {/* Question-by-Question Detailed Review */}
      {test?.questions && test.questions.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              প্রশ্নোত্তর ও ব্যাখ্যা রিভিউ
            </h2>
            <span className="text-xs text-slate-500">মোট {test.questions.length}টি প্রশ্ন</span>
          </div>

          <div className="space-y-4">
            {test.questions.map((q, idx) => {
              const userAns = result.userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const isUnanswered = userAns === undefined;

              return (
                <GlassCard
                  key={q.id}
                  className={`p-6 border ${
                    isCorrect
                      ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20'
                      : isUnanswered
                      ? 'border-slate-200 dark:border-slate-800'
                      : 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20'
                  } space-y-4`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {idx + 1}. {q.question}
                    </h4>

                    {isCorrect ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সঠিক</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                        <span>উত্তরহীন</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 flex-shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ভুল</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAns === optIdx;
                      const isRightOption = optIdx === q.correctAnswer;

                      let optClass =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                      if (isRightOption) {
                        optClass =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isRightOption) {
                        optClass =
                          'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 font-semibold line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center justify-between ${optClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{['ক', 'খ', 'গ', 'ঘ'][optIdx]}.</span>
                            <span>{opt}</span>
                          </div>
                          {isRightOption && (
                            <span className="text-[10px] text-emerald-600 font-bold">সঠিক উত্তর</span>
                          )}
                          {isSelected && !isRightOption && (
                            <span className="text-[10px] text-rose-600 font-bold">আপনার পছন্দ</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                        ব্যাখ্যা ও সমাধান:
                      </span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
