import React, { useEffect, useState } from 'react';
import {
  Layers,
  BookOpen,
  Zap,
  Sparkles,
  Download,
  FileCheck2,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getAdminAnalytics } from '../../services/dataService';
import { AdminAnalytics } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { GlassCard } from '../../components/common/GlassCard';

interface AdminDashboardOverviewProps {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({ onSelectTab }) => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    async function load() {
      const stats = await getAdminAnalytics();
      setAnalytics(stats);
    }
    load();
  }, []);

  const chartData = [
    { name: 'বিষয়', count: analytics?.totalSubjects || 0 },
    { name: 'অধ্যায়', count: analytics?.totalChapters || 0 },
    { name: 'নোটস', count: analytics?.totalNotes || 0 },
    { name: 'MCQ', count: analytics?.totalMcqs || 0 },
    { name: 'মডেল টেস্ট', count: analytics?.totalTests || 0 },
    { name: 'PDF', count: analytics?.totalPdfs || 0 }
  ];

  return (
    <div className="space-y-8">
      {/* Top Stat Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="মোট বিষয়"
          value={analytics?.totalSubjects || 0}
          iconName="Layers"
          gradient="from-indigo-600 to-blue-600"
        />
        <StatCard
          title="মোট অধ্যায়"
          value={analytics?.totalChapters || 0}
          iconName="BookOpen"
          gradient="from-blue-600 to-cyan-600"
        />
        <StatCard
          title="মোট হ্যান্ডনোট"
          value={analytics?.totalNotes || 0}
          iconName="FileText"
          gradient="from-emerald-600 to-teal-600"
        />
        <StatCard
          title="MCQ প্রশ্ন সংখ্যা"
          value={analytics?.totalMcqs || 0}
          iconName="Zap"
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="মডেল টেস্ট"
          value={analytics?.totalTests || 0}
          iconName="Sparkles"
          gradient="from-purple-600 to-pink-600"
        />
        <StatCard
          title="PDF রিসোর্স"
          value={analytics?.totalPdfs || 0}
          iconName="Download"
          gradient="from-teal-600 to-emerald-600"
        />
        <StatCard
          title="পরীক্ষার অংশগ্রহণ"
          value={analytics?.totalQuizAttempts || 0}
          iconName="Award"
          gradient="from-rose-600 to-orange-600"
        />
        <StatCard
          title="ডাউনলোড সম্পন্ন"
          value={analytics?.totalDownloads || 0}
          iconName="TrendingUp"
          gradient="from-blue-700 to-indigo-800"
        />
      </div>

      {/* Analytics Chart */}
      <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          কন্টেন্ট ভলিউম ওভারভিউ (ক্যাটেগরি ভিত্তিক)
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* AI Generator Mega Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অটোমেটেড কনটেন্ট স্টুডিও</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            কারিকুলাম হ্যান্ডনোট ও MCQ জেনারেটর
          </h2>
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            এনসিটিবি (NCTB) সিলেবাস অনুসারে এসএসসি ও এইচএসসি সকল বিষয়ের ১০০% মৌলিক ও নির্ভুল হ্যান্ডনোট, বহুনির্বাচনী প্রশ্ন, সূত্র শিট ও বোর্ড সাজেশন তাৎক্ষণিক তৈরি ও প্রকাশ করুন।
          </p>
        </div>

        <button
          onClick={() => onSelectTab('generator')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>জেনারেটর ওপেন করুন</span>
        </button>
      </div>

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => onSelectTab('generator')}
          className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
            ✨ AI জেনারেটর
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">নোট ও MCQ মেকার</span>
        </button>

        <button
          onClick={() => onSelectTab('notes')}
          className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">
            + হ্যান্ডনোট
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">নোট প্রকাশ করুন</span>
        </button>

        <button
          onClick={() => onSelectTab('mcq-sets')}
          className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
            + MCQ সেট
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">প্র্যাকটিস প্যাকেজ</span>
        </button>

        <button
          onClick={() => onSelectTab('tests')}
          className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
            + মডেল টেস্ট
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">টাইমারযুক্ত পরীক্ষা</span>
        </button>

        <button
          onClick={() => onSelectTab('important-questions')}
          className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
            + গুরুত্বপূর্ণ CQ
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">বোর্ড ক/খ সাজেশন</span>
        </button>

        <button
          onClick={() => onSelectTab('pdf-notes')}
          className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
            + PDF ডকুমেন্টস
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">A4 প্রিন্ট ফাইল</span>
        </button>
      </div>
    </div>
  );
};
