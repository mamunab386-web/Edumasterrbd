import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Zap,
  Download,
  FileCheck2,
  Layers,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { getSubjects, getChapters, getNotes, getMCQs, getPDFs } from '../services/dataService';
import { Subject, Chapter, Note, MCQ, PDFResource } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SEOHead } from '../components/common/SEOHead';

interface SscHscPortalPageProps {
  classLevel: 'ssc' | 'hsc';
  navigate: (to: string) => void;
}

export const SscHscPortalPage: React.FC<SscHscPortalPageProps> = ({ classLevel, navigate }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const [subs, chaps, nts, mq, pf] = await Promise.all([
        getSubjects(),
        getChapters(),
        getNotes(),
        getMCQs(),
        getPDFs()
      ]);
      setSubjects(subs.filter((s) => s.classLevel === classLevel || s.classLevel === 'both'));
      setChapters(chaps.filter((c) => c.classLevel === classLevel));
      setNotes(nts.filter((n) => n.classLevel === classLevel));
      setMcqs(mq.filter((m) => m.classLevel === classLevel));
      setPdfs(pf.filter((p) => p.classLevel === classLevel));
    }
    load();
  }, [classLevel]);

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const isSsc = classLevel === 'ssc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEOHead
        title={`${classLevel.toUpperCase()} সকল বিষয়ের নোট, MCQ ও হ্যান্ডনোট | EduMaster BD`}
        description={`এসএসসি ও এইচএসসি ${classLevel.toUpperCase()} শিক্ষার্থীদের জন্য পদার্থ, রসায়ন, গণিত, জীববিজ্ঞান ও ICT সহ সকল বিষয়ের অধ্যায়ভিত্তিক নোট, MCQ কুইজ এবং PDF ডাউনলোড।`}
        keywords={[
          `${classLevel.toUpperCase()} Notes Bangladesh`,
          `${classLevel.toUpperCase()} All Subjects`,
          `${classLevel.toUpperCase()} MCQ Practice`,
          `${classLevel.toUpperCase()} Physics Note`,
          `${classLevel.toUpperCase()} Chemistry Handnote`,
          `${classLevel.toUpperCase()} Math Formula`
        ]}
        canonicalUrl={`https://edumasterbd.vercel.app/${classLevel}`}
        breadcrumbs={[{ name: `${classLevel.toUpperCase()} বিভাগ`, url: `/${classLevel}` }]}
        courseData={{
          name: `${classLevel.toUpperCase()} Comprehensive Online Study Hub`,
          description: `Complete study notes, chapter summaries, formula sheets and MCQ bank for Bangladesh ${classLevel.toUpperCase()} examination.`,
          provider: 'EduMaster BD',
          educationalLevel: classLevel.toUpperCase()
        }}
        faqs={[
          {
            question: `${classLevel.toUpperCase()} বিভাগের কোন কোন বিষয়ের নোট পাওয়া যাবে?`,
            answer: `বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখার পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, সাধারণ ও উচ্চতর গণিত, ICT, বাংলা এবং ইংরেজি বিষয়ের পূর্ণাঙ্গ নোট পাওয়া যাবে।`
          },
          {
            question: `এখানে কি অধ্যায়ভিত্তিক MCQ টেস্ট দেওয়ার সুযোগ আছে?`,
            answer: `হ্যাঁ, প্রতিটি বিষয়ের প্রতিটি অধ্যায়ের জন্য আলাদা আলাদা বোর্ড স্ট্যান্ডার্ড বহুনির্বাচনী প্র্যাকটিস সেট রয়েছে।`
          }
        ]}
      />

      <Breadcrumbs
        items={[{ label: `${classLevel.toUpperCase()} বিভাগ` }]}
        navigate={navigate}
      />

      {/* Header Banner */}
      <div
        className={`rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl bg-gradient-to-r ${
          isSsc
            ? 'from-indigo-700 via-indigo-800 to-blue-900'
            : 'from-blue-700 via-indigo-900 to-slate-900'
        }`}
      >
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            {classLevel.toUpperCase()} স্পেশাল স্টাডি হাব
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isSsc
              ? 'এসএসসি (SSC) প্রস্তুতি ও বিষয়ভিত্তিক সংকলন'
              : 'এইচএসসি (HSC) প্রস্তুতি ও এডভান্সড কনসেপ্ট'}
          </h1>
          <p className="text-sm text-indigo-100 leading-relaxed">
            {isSsc
              ? '৯ম ও ১০ম শ্রেণির সকল বিষয়ের অধ্যায়ভিত্তিক হ্যান্ডনোট, বহুনির্বাচনী কুইজ, মডেল টেস্ট এবং বিগত বছরের বোর্ড পরীক্ষার সমাধান।'
              : 'একাদশ ও দ্বাদশ শ্রেণির বিজ্ঞান, মানবিক ও বাণিজ্য বিভাগের সকল পত্রের বিস্তারিত নোট, সূত্র এবং শর্ট সাজেশন।'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-black/20 font-medium">
              📚 {subjects.length} টি বিষয়
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-black/20 font-medium">
              📝 {notes.length} টি হ্যান্ডনোট
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-black/20 font-medium">
              ⚡ {mcqs.length}+ MCQ কুইজ
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-black/20 font-medium">
              📥 {pdfs.length} টি ফ্রি PDF
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="বিষয় খুঁজুন (যেমন: পদার্থবিজ্ঞান)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'সকল বিষয়' },
            { id: 'science', label: 'বিজ্ঞান বিভাগ' },
            { id: 'general', label: 'সাধারণ বিষয়' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((sub) => {
          const Icon = (Icons as any)[sub.icon] || Icons.BookOpen;
          const subChapters = chapters.filter((c) => c.subjectId === sub.id);
          const subNotes = notes.filter((n) => n.subjectId === sub.id);
          const subMcqs = mcqs.filter((m) => m.subjectId === sub.id);

          return (
            <GlassCard
              key={sub.id}
              onClick={() => navigate(`/${classLevel}/${sub.id}`)}
              className="group border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {subChapters.length > 0 ? `${subChapters.length} টি অধ্যায়` : 'অধ্যায় তালিকা'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {sub.banglaName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6">
                  {sub.description}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">নোট</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{subNotes.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">MCQ</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{subMcqs.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ক্লাস</span>
                    <span className="font-bold text-indigo-600 uppercase">{classLevel}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/${classLevel}/${sub.id}`)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 text-slate-800 dark:text-slate-200 group-hover:text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>অধ্যায় ও রিসোর্স দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
