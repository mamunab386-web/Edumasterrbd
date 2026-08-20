import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  Flag
} from 'lucide-react';
import { getModelTestById, saveTestResult, incrementTestAttempts } from '../services/dataService';
import { ModelTest, MCQ, TestResult } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

interface LiveTestPageProps {
  testId: string;
  navigate: (to: string) => void;
}

export const LiveTestPage: React.FC<LiveTestPageProps> = ({ testId, navigate }) => {
  const { user } = useAuth();
  const [test, setTest] = useState<ModelTest | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({}); // mcqId -> selectedOption
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Submit confirmation modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const found = await getModelTestById(testId);
      if (found) {
        setTest(found);
        setQuestions(found.questions || []);
        setTimeLeft(found.durationMinutes * 60);
      }
    }
    load();
  }, [testId]);

  useEffect(() => {
    if (timeLeft <= 0 && test) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [test]);

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSelectOption = (mcqId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [mcqId]: optionIndex
    }));
  };

  const toggleMarkForReview = (mcqId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [mcqId]: !prev[mcqId]
    }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (!test || isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;
    let unattempted = 0;

    const totalQuestions = questions.length;
    const marksPerQuestion = test.totalMarks / (totalQuestions || 1);

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const score = Math.max(0, Math.round(correctCount * marksPerQuestion));
    const percentage = totalQuestions > 0 ? Math.round((score / test.totalMarks) * 100) : 0;
    const passed = score >= test.passingMarks;
    const timeTaken = test.durationMinutes * 60 - timeLeft;

    const resultId = 'res-' + Date.now();
    const testResult: TestResult = {
      id: resultId,
      testId: test.id,
      testTitle: test.title,
      classLevel: test.classLevel,
      subjectId: test.subjectId,
      userId: user?.uid || 'guest-' + Date.now(),
      userName: user?.displayName || 'পরীক্ষার্থী',
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattempted,
      score,
      totalMarks: test.totalMarks,
      percentage,
      passed,
      userAnswers,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toISOString()
    };

    await saveTestResult(testResult);
    await incrementTestAttempts(test.id);

    navigate(`/results/${resultId}`);
  };

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="মডেল টেস্ট লোড হচ্ছে বা পাওয়া যায়নি"
          description="অনুগ্রহ করে টেস্ট তালিকায় ফিরে যান।"
          actionText="টেস্ট তালিকা"
          onAction={() => navigate('/test')}
        />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeUrgent = timeLeft < 120; // less than 2 minutes

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Test Header Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-30 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {test.classLevel.toUpperCase()} লাইভ এক্সাম
            </span>
            <span className="text-xs text-slate-400">পূর্ণমান: {test.totalMarks} মার্কস</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-lg">
            {test.title}
          </h1>
        </div>

        {/* Real-time Countdown Timer */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-sm ${
              isTimeUrgent
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>সাবমিট করুন</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Question Area */}
        <div className="lg:col-span-8 space-y-4">
          {currentQ && (
            <GlassCard className="p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    প্রশ্ন {currentIndex + 1} / {questions.length}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentIndex + 1}. {currentQ.question}
                  </h2>
                </div>

                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500'
                  }`}
                  title="রিভিউয়ের জন্য মার্ক করুন"
                >
                  <Flag className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {markedForReview[currentQ.id] ? 'মার্ক করা আছে' : 'রিভিউ মার্ক'}
                  </span>
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-sm font-medium ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
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
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs disabled:opacity-40 flex items-center gap-1 shadow-md shadow-indigo-500/20"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Question Palette Drawer */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              প্রশ্ন নেভিগেটর ও স্ট্যাটাস
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                উত্তর দেওয়া হয়েছে: <span className="font-bold">{answeredCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                বাকি আছে: <span className="font-bold">{unansweredCount}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                প্রশ্নসমূহের তালিকা:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  const isCurrent = idx === currentIndex;

                  let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                  if (isMarked) {
                    btnClass = 'bg-amber-500 text-white font-bold';
                  } else if (isAnswered) {
                    btnClass = 'bg-emerald-500 text-white font-bold';
                  }

                  if (isCurrent) {
                    btnClass += ' ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl text-xs transition flex items-center justify-center font-semibold ${btnClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>সবুজ: উত্তর সম্পন্ন</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>হলুদ: রিভিউয়ের জন্য চিহ্নিত</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <span>ধূসর: উত্তর দেওয়া হয়নি</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="মডেল টেস্ট জমা দিতে চান?"
      >
        <div className="space-y-4">
          {unansweredCount > 0 ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-bold text-sm">সতর্কবার্তা: {unansweredCount}টি প্রশ্নের উত্তর এখনও দেননি!</p>
                <p className="mt-0.5">আপনি চাইলে ফিরে গিয়ে বাকি প্রশ্নগুলোর উত্তর দিতে পারেন।</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              আপনি সকল প্রশ্নের উত্তর সম্পন্ন করেছেন। নিশ্চিত হয়ে সাবমিট বাটনে ক্লিক করুন।
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              ফিরে যান
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
            >
              নিশ্চিত সাবমিট
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
