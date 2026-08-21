import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Bookmark,
  Award,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSubjects, getChapters, getMCQs } from '../services/dataService';
import { Subject, Chapter, MCQ } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useBookmarks } from '../context/BookmarkContext';
import { SEOHead } from '../components/common/SEOHead';

interface McqPracticePageProps {
  navigate: (to: string) => void;
  initialClass?: 'ssc' | 'hsc';
  initialSubject?: string;
  initialSubjectId?: string;
  initialChapterId?: string;
}

export const McqPracticePage: React.FC<McqPracticePageProps> = ({
  navigate,
  initialClass,
  initialSubject,
  initialSubjectId,
  initialChapterId
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [allMcqs, setAllMcqs] = useState<MCQ[]>([]);

  const [selectedClass, setSelectedClass] = useState<'all' | 'ssc' | 'hsc'>(initialClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || initialSubject || 'all');
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Practice state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // qIndex -> optionIndex
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const { addBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    async function load() {
      const [subs, chaps, mcqs] = await Promise.all([
        getSubjects(),
        getChapters(),
        getMCQs()
      ]);
      setSubjects(subs);
      setChapters(chaps);
      setAllMcqs(mcqs);
    }
    load();
  }, []);

  // Filter questions
  const filteredMcqs = allMcqs.filter((m) => {
    const matchClass = selectedClass === 'all' || m.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || m.subjectId === selectedSubject;
    const matchChap = selectedChapter === 'all' || m.chapterId === selectedChapter;
    const matchDiff = selectedDifficulty === 'all' || m.difficulty === selectedDifficulty;
    return matchClass && matchSub && matchChap && matchDiff;
  });

  const availableChapters = chapters.filter(
    (c) => selectedSubject === 'all' || c.subjectId === selectedSubject
  );

  const currentQuestion = filteredMcqs[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentIndex] !== undefined) return; // already answered

    const updated = { ...userAnswers, [currentIndex]: optionIndex };
    setUserAnswers(updated);
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));

    // Check if correct and trigger micro confetti
    if (currentQuestion && optionIndex === currentQuestion.correctAnswer) {
      // Correct!
    }

    if (Object.keys(updated).length === filteredMcqs.length && filteredMcqs.length > 0) {
      setIsCompleted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Stats calculation
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([idxStr, optIdx]) => filteredMcqs[parseInt(idxStr)]?.correctAnswer === optIdx
  ).length;
  const wrongCount = totalAnswered - correctCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="SSC ও HSC অধ্যায়ভিত্তিক MCQ প্র্যাকটিস ও কুইজ সমাধান | EduMaster BD"
        description="পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও ICT সহ এসএসসি ও এইচএসসি পরীক্ষার সকল বিষয়ের অধ্যায়ভিত্তিক বহুনির্বাচনী প্রশ্ন (MCQ) অনুশীলন করুন এবং তাৎক্ষণিক বাংলা ব্যাখ্যা দেখুন।"
        keywords={[
          'SSC MCQ Practice',
          'HSC MCQ Practice',
          'Online Quiz Bangladesh',
          'MCQ with explanation',
          'Physics MCQ',
          'Chemistry MCQ'
        ]}
        canonicalUrl="https://edumasterbd.vercel.app/mcq"
        breadcrumbs={[{ name: 'MCQ অনুশীলন', url: '/mcq' }]}
        quizData={{
          name: 'SSC & HSC Interactive Chapterwise MCQ Assessment',
          description: 'Practice board standard multiple choice questions with instant explanations and analytics.',
          timeRequired: 'PT15M'
        }}
        faqs={[
          {
            question: 'MCQ উত্তর সাবমিট করার পর কি সঠিক উত্তরের ব্যাখ্যা পাওয়া যাবে?',
            answer: 'হ্যাঁ, প্রতিটি MCQ প্রশ্নের সাথে সাথে বিস্তারিত সমাধান ও সূত্রের প্রয়োগ ব্যাখ্যা হিসেবে দেওয়া থাকে।'
          }
        ]}
      />

      <Breadcrumbs items={[{ label: 'MCQ প্র্যাকটিস হাব' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>স্মার্ট কুইজ ও সেলফ অ্যাসেসমেন্ট</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            অধ্যায়ভিত্তিক MCQ প্র্যাকটিস ও তাৎক্ষণিক ব্যাখ্যা
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-900/80 leading-relaxed">
            সঠিক ও ভুল উত্তরের সাথে সাথে বিস্তারিত সমাধান দেখুন এবং প্রতিটি বিষয়ের দুর্বলতা কাটিয়ে উঠুন।
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>ফিল্টার ও বিষয় নির্বাচন করুন</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">শ্রেণি / বিভাগ</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value as any);
                setSelectedSubject('all');
                setSelectedChapter('all');
                handleRestart();
              }}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">সকল শ্রেণি (SSC & HSC)</option>
              <option value="ssc">SSC (৯ম-১০ম)</option>
              <option value="hsc">HSC (১১শ-১২শ)</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">বিষয়</label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedChapter('all');
                handleRestart();
              }}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">সকল বিষয়</option>
              {subjects
                .filter((s) => selectedClass === 'all' || s.classLevel === selectedClass || s.classLevel === 'both')
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.banglaName}
                  </option>
                ))}
            </select>
          </div>

          {/* Chapter Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">অধ্যায়</label>
            <select
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                handleRestart();
              }}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">সকল অধ্যায়</option>
              {availableChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.banglaTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">কঠিনতার মাত্রা</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value as any);
                handleRestart();
              }}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">সব ধরনের প্রশ্ন</option>
              <option value="easy">সহজ (Easy)</option>
              <option value="medium">মাঝারি (Medium)</option>
              <option value="hard">চ্যালেঞ্জিং (Hard)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredMcqs.length === 0 ? (
        <EmptyState
          title="কোনো MCQ প্রশ্ন পাওয়া যায়নি"
          description="নির্বাচিত ফিল্টারের অধীনে কোনো প্রশ্ন নেই। অনুগ্রহ করে অন্য বিষয় বা অধ্যায় নির্বাচন করুন।"
          actionText="ফিল্টার রিসেট করুন"
          onAction={() => {
            setSelectedClass('all');
            setSelectedSubject('all');
            setSelectedChapter('all');
            setSelectedDifficulty('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Question Card Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                প্রশ্ন {currentIndex + 1} / {filteredMcqs.length}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                অগ্রগতি: {Math.round(((currentIndex + 1) / filteredMcqs.length) * 100)}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredMcqs.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <GlassCard className="p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {currentQuestion.classLevel.toUpperCase()}
                      </span>
                      {currentQuestion.boardRef && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                          {currentQuestion.boardRef}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                      {currentIndex + 1}. {currentQuestion.question}
                    </h2>
                  </div>

                  <button
                    onClick={() =>
                      addBookmark({
                        itemId: currentQuestion.id,
                        type: 'mcq',
                        title: currentQuestion.question,
                        link: `/mcq`
                      })
                    }
                    className={`p-2 rounded-xl transition ${
                      isBookmarked(currentQuestion.id)
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950'
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                    title="প্রশ্নটি বুকমার্ক করুন"
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optIdx) => {
                    const isAnswered = userAnswers[currentIndex] !== undefined;
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    const isCorrect = optIdx === currentQuestion.correctAnswer;

                    let optionClass =
                      'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-amber-400';

                    if (isAnswered) {
                      if (isCorrect) {
                        optionClass =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        optionClass =
                          'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 font-semibold';
                      } else {
                        optionClass = 'border-slate-200 dark:border-slate-800 opacity-60';
                      }
                    }

                    return (
                      <motion.button
                        key={optIdx}
                        whileTap={!isAnswered ? { scale: 0.99 } : undefined}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between text-sm font-medium ${optionClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isAnswered && isCorrect
                                ? 'bg-emerald-500 text-white'
                                : isAnswered && isSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {showExplanation[currentIndex] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 space-y-2 text-xs text-indigo-950 dark:text-indigo-200"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                      <HelpCircle className="w-4 h-4" />
                      <span>বিস্তারিত সঠিক ব্যাখ্যা:</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      {currentQuestion.explanation ||
                        `সঠিক উত্তর হলো অপশন ${['ক', 'খ', 'গ', 'ঘ'][currentQuestion.correctAnswer]}: ${currentQuestion.options[currentQuestion.correctAnswer]}।`}
                    </p>
                  </motion.div>
                )}

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী</span>
                  </button>

                  <button
                    onClick={() =>
                      setShowExplanation((prev) => ({
                        ...prev,
                        [currentIndex]: !prev[currentIndex]
                      }))
                    }
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {showExplanation[currentIndex] ? 'ব্যাখ্যা লুকান' : 'ব্যাখ্যা দেখুন'}
                  </button>

                  <button
                    disabled={currentIndex === filteredMcqs.length - 1}
                    onClick={() => setCurrentIndex((prev) => Math.min(filteredMcqs.length - 1, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs disabled:opacity-40 flex items-center gap-1 shadow-md shadow-indigo-500/20"
                  >
                    <span>পরবর্তী</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Live Score & Question Matrix Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scorecard Widget */}
            <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>লাইভ প্র্যাকটিস স্কোর</span>
                </h3>
                <button
                  onClick={handleRestart}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1"
                  title="পুনরায় শুরু করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিস্টার্ট</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {correctCount}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block mt-0.5">
                    সঠিক
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                  <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                    {wrongCount}
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 block mt-0.5">
                    ভুল
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {accuracy}%
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 block mt-0.5">
                    সঠিকতার হার
                  </span>
                </div>
              </div>

              {/* Question Navigator Grid */}
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  সকল প্রশ্নের তালিকা:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {filteredMcqs.map((m, idx) => {
                    const ans = userAnswers[idx];
                    let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
                    if (ans !== undefined) {
                      if (ans === m.correctAnswer) {
                        btnClass = 'bg-emerald-500 text-white font-bold';
                      } else {
                        btnClass = 'bg-rose-500 text-white font-bold';
                      }
                    } else if (idx === currentIndex) {
                      btnClass = 'border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-xl text-xs transition flex items-center justify-center ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
