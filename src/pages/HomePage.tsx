import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Download,
  Zap,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  FileCheck2,
  TrendingUp,
  Award,
  Users,
  Search,
  Bookmark
} from 'lucide-react';
import * as Icons from 'lucide-react';
import {
  getSubjects,
  getNotes,
  getModelTests,
  getPDFs,
  getAdminAnalytics
} from '../services/dataService';
import { Subject, Note, ModelTest, PDFResource, AdminAnalytics } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { useBookmarks } from '../context/BookmarkContext';
import { StudyingBoyAnimation } from '../components/common/StudyingBoyAnimation';
import { LiveStudentsCounter } from '../components/common/LiveStudentsCounter';
import { AdBanner } from '../components/common/AdBanner';

interface HomePageProps {
  navigate: (to: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [featuredNotes, setFeaturedNotes] = useState<Note[]>([]);
  const [popularTests, setPopularTests] = useState<ModelTest[]>([]);
  const [latestPdfs, setLatestPdfs] = useState<PDFResource[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { isBookmarked, addBookmark } = useBookmarks();

  useEffect(() => {
    async function loadData() {
      const [subs, notes, tests, pdfs, stats] = await Promise.all([
        getSubjects(),
        getNotes(),
        getModelTests(),
        getPDFs(),
        getAdminAnalytics()
      ]);
      setSubjects(subs);
      setFeaturedNotes(notes.filter((n) => n.published).slice(0, 4));
      setPopularTests(tests.filter((t) => t.published).slice(0, 3));
      setLatestPdfs(pdfs.filter((p) => p.published).slice(0, 4));
      setAnalytics(stats);
    }
    loadData();
  }, []);

  const sscSubjects = subjects.filter((s) => s.classLevel === 'ssc' || s.classLevel === 'both');
  const hscSubjects = subjects.filter((s) => s.classLevel === 'hsc' || s.classLevel === 'both');

  const faqs = [
    {
      q: 'EduMaster BD কি সম্পূর্ণ বিনামূল্যে ব্যবহার করা যায়?',
      a: 'হ্যাঁ, প্ল্যাটফর্মের সকল অধ্যায়ভিত্তিক হ্যান্ডনোট, বহুনির্বাচনী (MCQ) প্র্যাকটিস, মডেল টেস্ট, বোর্ড প্রশ্ন এবং PDF রিসোর্স সম্পূর্ণ ফ্রি।'
    },
    {
      q: 'এখানে কি এসএসসি এবং এইচএসসি উভয় ক্লাসের কনটেন্ট রয়েছে?',
      a: 'অবশ্যই! আমাদের ডেটাবেজে SSC (৯ম-১০ম শ্রেণি) এবং HSC (একাদশ-দ্বাদশ শ্রেণি) বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার সকল মূল বিষয়ের পরিচ্ছন্ন কনটেন্ট রয়েছে।'
    },
    {
      q: 'মডেল টেস্ট দেয়ার পর কি তাৎক্ষণিক রেজাল্ট ও সঠিক সমাধান দেখা যায়?',
      a: 'হ্যাঁ, আমাদের ইন্টারেক্টিভ কুইজ ইঞ্জিনে টেস্ট সাবমিট করার সাথে সাথেই আপনি প্রাপ্ত নম্বর, পারসেন্টাইল, নির্ভুল উত্তর ও প্রতিটি প্রশ্নের বিস্তারিত বাংলা ব্যাখ্যা দেখতে পাবেন।'
    },
    {
      q: 'PDF হ্যান্ডনোট ও ফর্মুলা শিট কীভাবে ডাউনলোড করব?',
      a: 'PDF লাইব্রেরি সেকশনে গিয়ে যে কোনো শিটের ওপর ক্লিক করলেই প্রিভিউ দেখার পাশাপাশি সরাসরি এক ক্লিকে ডাউনলোড করার সুবিধা পাবেন।'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Top Header Ad Placement */}
      <AdBanner placement="headerTop" navigate={navigate} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2" />

      {/* 1. HERO SECTION WITH STUDYING BOY ANIMATION */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:pt-12 lg:pb-16">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>SSC ও HSC ২০২৫ এর জন্য বিশেষায়িত ডিজিটাল প্ল্যাটফর্ম</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
                বাংলাদেশের শিক্ষার্থীদের জন্য <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 dark:from-indigo-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  স্মার্ট ও ফ্রি
                </span>{' '}
                লার্নিং প্ল্যাটফর্ম
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                SSC ও HSC-এর Notes, MCQ, Model Test, PDF এবং গুরুত্বপূর্ণ প্রশ্ন এক জায়গায়।
                কোনো অপ্রয়োজনীয় জটিলতা ছাড়াই অনলাইনে প্রস্তুতি নিন শতভাগ নিশ্চিত।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/ssc')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>শেখা শুরু করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/mcq')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>MCQ Practice করুন</span>
                </button>
              </div>

              {/* Quick Perks */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>সম্পূর্ণ ফ্রি ও আনলিমিটেড</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>বোর্ড স্ট্যান্ডার্ড প্রশ্নব্যাংক</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>মোবাইল ও ট্যাবে অপ্টিমাইজড</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Dynamic Interactive Animated Studying Boy Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <StudyingBoyAnimation onExploreClick={() => navigate('/notes')} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Online Students Ticker & Hub Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveStudentsCounter navigate={navigate} variant="full" />
      </section>

      {/* 2. POPULAR SUBJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>জনপ্রিয় বিষয়সমূহ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              যে বিষয়গুলো সবচেয়ে বেশি পড়া হচ্ছে
            </h2>
          </div>
          <button
            onClick={() => navigate('/ssc/subjects')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সকল বিষয় দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.slice(0, 4).map((sub) => {
            const Icon = (Icons as any)[sub.icon] || Icons.BookOpen;
            return (
              <GlassCard
                key={sub.id}
                onClick={() => navigate(`/${sub.classLevel === 'hsc' ? 'hsc' : 'ssc'}/${sub.id}`)}
                className="group border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 relative overflow-hidden"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {sub.classLevel.toUpperCase()}
                  </span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                    প্রবেশ করুন &rarr;
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                  {sub.banglaName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* 3. SSC & HSC TWO-COLUMN LEARNING HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SSC HUB CARD */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <GraduationCap className="w-48 h-48" />
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider inline-block mb-4">
              SSC প্রস্তুতি জোন (৯ম-১০ম)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              এসএসসি স্পেশাল রিভিশন ও প্র্যাকটিস
            </h3>
            <p className="text-indigo-200/80 text-sm mb-6 leading-relaxed">
              পদার্থবিজ্ঞান, রসায়ন, সাধারণ গণিত, উচ্চতর গণিত, জীববিজ্ঞান ও আইসিটির অধ্যায়ভিত্তিক
              হ্যান্ডনোট ও বিগত ৫ বছরের বোর্ড সমাধান।
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => navigate('/ssc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">বিষয়ভিত্তিক নোট</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>
              <button
                onClick={() => navigate('/mcq?class=ssc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">SSC MCQ কুইজ</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>
              <button
                onClick={() => navigate('/test?class=ssc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">অনলাইন মডেল টেস্ট</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>
              <button
                onClick={() => navigate('/board-questions?class=ssc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">বোর্ড প্রশ্ন ব্যাংক</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>
            </div>

            <button
              onClick={() => navigate('/ssc')}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold text-center shadow-lg transition"
            >
              SSC সম্পূর্ণ সেকশনে প্রবেশ করুন &rarr;
            </button>
          </div>

          {/* HSC HUB CARD */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Layers className="w-48 h-48" />
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider inline-block mb-4">
              HSC প্রস্তুতি জোন (একাদশ-দ্বাদশ)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              এইচএসসি স্পেশাল রিভিশন ও প্র্যাকটিস
            </h3>
            <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
              উচ্চ মাধ্যমিক পদার্থবিজ্ঞান ১ম ও ২য় পত্র, রসায়ন, জীববিজ্ঞান, উচ্চতর গণিত এবং আইসিটির
              এডভান্সড কনসেপ্ট ও বোর্ড প্রশ্নের শর্টকাট টেকনিক।
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => navigate('/hsc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">বিষয়ভিত্তিক নোট</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => navigate('/mcq?class=hsc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">HSC MCQ কুইজ</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => navigate('/test?class=hsc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">মেগা মডেল টেস্ট</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
              <button
                onClick={() => navigate('/board-questions?class=hsc')}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center justify-between"
              >
                <span className="text-xs font-semibold">বোর্ড প্রশ্ন ব্যাংক</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300" />
              </button>
            </div>

            <button
              onClick={() => navigate('/hsc')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-lg transition"
            >
              HSC সম্পূর্ণ সেকশনে প্রবেশ করুন &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 4. FEATURED NOTES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>হ্যান্ডনোট কালেকশন</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              সেরা শিক্ষকদের তৈরি বিশেষ হ্যান্ডনোট
            </h2>
          </div>
          <button
            onClick={() => navigate('/notes')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সকল নোট পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredNotes.map((note) => (
            <GlassCard
              key={note.id}
              onClick={() => navigate(`/notes/${note.slug || note.id}`)}
              className="group flex flex-col sm:flex-row gap-5 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400"
            >
              {note.thumbnailUrl && (
                <div className="sm:w-40 h-36 rounded-xl overflow-hidden flex-shrink-0 relative">
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

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
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
                    {note.summary || 'সম্পূর্ণ নোট পড়তে ক্লিক করুন...'}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{note.author}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    নোট পড়ুন &rarr;
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* In-Content Middle Sponsor Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="inNoteContent" navigate={navigate} />
      </section>

      {/* 5. POPULAR MCQ & MODEL TESTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>অনলাইন পরীক্ষা ও কুইজ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              টাইমারযুক্ত মডেল টেস্ট ও লাইভ রেজাল্ট
            </h2>
          </div>
          <button
            onClick={() => navigate('/test')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সকল টেস্ট দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularTests.map((test) => (
            <GlassCard
              key={test.id}
              className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between relative group hover:border-amber-400 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 uppercase">
                    {test.classLevel.toUpperCase()} মডেল টেস্ট
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.durationMinutes} মিনিট
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {test.description}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">মোট নম্বর</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{test.totalMarks} মার্কস</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">অংশগ্রহণকারী</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{test.attemptsCount} জন</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/test/${test.id}`)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>এখনই পরীক্ষা শুরু করুন</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 6. LATEST PDF RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Download className="w-4 h-4" />
              <span>PDF লাইব্রেরি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              গুরুত্বপূর্ণ শিট ও বই ডাউনলোড করুন
            </h2>
          </div>
          <button
            onClick={() => navigate('/pdf')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সকল PDF দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPdfs.map((pdf) => (
            <GlassCard
              key={pdf.id}
              onClick={() => navigate(`/pdf/${pdf.id}`)}
              className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-emerald-400"
            >
              <div>
                <div className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative mb-4">
                  {pdf.thumbnailUrl ? (
                    <img
                      src={pdf.thumbnailUrl}
                      alt={pdf.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FileText className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    {pdf.classLevel.toUpperCase()} PDF
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                  {pdf.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {pdf.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{pdf.fileSizeMB} MB • {pdf.pageCount} পৃষ্ঠা</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  ডাউনলোড
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 7. LEARNING STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            আমাদের প্রভাব ও পরিসংখ্যান
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            হাজারো শিক্ষার্থীর বিশ্বস্ত সঙ্গী EduMaster BD
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="মোট হ্যান্ডনোট ও আর্টিকেল"
            value={(analytics?.totalNotes || 24) + '+'}
            subtitle="অধ্যায়ভিত্তিক সম্পূর্ণ তৈরি"
            iconName="BookOpen"
            gradient="from-indigo-600 to-blue-600"
            trend="+৫ নতুন নোট যুক্ত হয়েছে"
          />
          <StatCard
            title="MCQ প্রশ্ন ব্যাংক"
            value={(analytics?.totalMcqs || 150) + '+'}
            subtitle="বিস্তারিত বাংলা সমাধানসহ"
            iconName="Zap"
            gradient="from-amber-500 to-orange-600"
            trend="১০০% বোর্ড স্ট্যান্ডার্ড"
          />
          <StatCard
            title="PDF রিসোর্স ও সাজেশন"
            value={(analytics?.totalDownloads || 16000).toLocaleString('bn-BD') + '+'}
            subtitle="সরাসরি ডাউনলোড সম্পন্ন"
            iconName="Download"
            gradient="from-emerald-600 to-teal-600"
            trend="সর্বাধিক ডাউনলোড"
          />
          <StatCard
            title="কুইজ ও মডেল টেস্ট সম্পন্ন"
            value={(analytics?.totalQuizAttempts || 12800).toLocaleString('bn-BD') + '+'}
            subtitle="শিক্ষার্থীদের আত্মমূল্যায়ন"
            iconName="Award"
            gradient="from-purple-600 to-pink-600"
            trend="সক্রিয় পাঠক সম্প্রদায়"
          />
        </div>
      </section>

      {/* 8. WHY EDUMASTER BD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              কেন আমাদের বেছে নেবেন?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              বাংলাদেশের সেরা ডিজিটাল স্টাডি প্ল্যাটফর্ম
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">১০০% ফ্রি ও সহজলভ্য</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                কোনো হিডেন সাবস্ক্রিপশন বা ফি ছাড়া দেশের যে কোনো প্রান্তের শিক্ষার্থী যে কোনো সময় প্রস্তুতি নিতে পারবে।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">যাচাইকৃত মানসম্পন্ন কনটেন্ট</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                বুয়েট, ঢাকা বিশ্ববিদ্যালয় ও অভিজ্ঞ শিক্ষক মণ্ডলী দ্বারা প্রতিটি বিষয়ের অধ্যায়ভিত্তিক নোট ও প্রশ্ন যাচাইকৃত।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">তাৎক্ষণিক ফলাফল ও প্রগ্রেস ট্র্যাকিং</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                মডেল টেস্ট দিয়ে সাথে সাথে গ্রাফিক্যাল রেজাল্ট, সঠিক উত্তর ও ভুলের কারণ দেখে নিজের ভুল শুধরে নিন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            সাধারণ জিজ্ঞাসা
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              আজই শুরু হোক তোমার সেরা বোর্ড পরীক্ষার প্রস্তুতি!
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
              হাজারো শিক্ষার্থীর সাথে যোগ দিন। সম্পূর্ণ বিনামূল্যে অধ্যায়ভিত্তিক কুইজ দিন এবং হ্যান্ডনোট পড়ুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/mcq')}
                className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-indigo-50 transition"
              >
                ফ্রি MCQ কুইজ শুরু করুন
              </button>
              <button
                onClick={() => navigate('/ssc')}
                className="px-6 py-3.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-sm border border-indigo-400/40 transition"
              >
                বিষয়সমূহ ব্রাউজ করুন
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
