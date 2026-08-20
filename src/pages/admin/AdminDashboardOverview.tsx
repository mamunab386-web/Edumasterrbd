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

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onSelectTab('notes')}
          className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
            + নতুন হ্যান্ডনোট
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">নোট বা সামারি প্রকাশ করুন</span>
        </button>

        <button
          onClick={() => onSelectTab('mcqs')}
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
            + নতুন MCQ প্রশ্ন
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">প্রশ্নের ব্যাংক সমৃদ্ধ করুন</span>
        </button>

        <button
          onClick={() => onSelectTab('tests')}
          className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
            + নতুন মডেল টেস্ট
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">টাইমারযুক্ত টেস্ট বানান</span>
        </button>

        <button
          onClick={() => onSelectTab('pdfs')}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-left hover:scale-[1.02] transition"
        >
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
            + নতুন PDF আপলোড
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">শিট বা গাইডলাইন যুক্ত করুন</span>
        </button>
      </div>
    </div>
  );
};
