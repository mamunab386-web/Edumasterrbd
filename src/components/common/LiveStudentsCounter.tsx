import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Radio,
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Atom,
  Flame
} from 'lucide-react';
import { LiveStudyRoom } from '../../types';

interface LiveStudentsCounterProps {
  navigate?: (to: string) => void;
  variant?: 'badge' | 'full' | 'floating' | 'banner';
  className?: string;
}

const STUDY_ROOMS: LiveStudyRoom[] = [
  {
    id: 'room-ssc-sci',
    name: 'SSC Physics & Chemistry Hub',
    banglaName: 'SSC বিজ্ঞান বিভাগ স্টাডি রুম',
    studentCount: 124,
    icon: 'Atom',
    category: 'ssc'
  },
  {
    id: 'room-hsc-ict',
    name: 'HSC ICT & Higher Math Lounge',
    banglaName: 'HSC আইসিটি ও গণিত লাউঞ্জ',
    studentCount: 148,
    icon: 'Zap',
    category: 'hsc'
  },
  {
    id: 'room-model-tests',
    name: 'Live Model Test Arena',
    banglaName: 'লাইভ মডেল টেস্ট অ্যারিনা',
    studentCount: 76,
    icon: 'Sparkles',
    category: 'general'
  },
  {
    id: 'room-handnotes',
    name: 'Handnotes Silent Library',
    banglaName: 'হ্যান্ডনোট সাইলেন্ট লাইব্রেরি',
    studentCount: 80,
    icon: 'BookOpen',
    category: 'general'
  }
];

const RECENT_STUDENT_EVENTS = [
  { name: 'তানজিম', location: 'ঢাকা', action: 'পদার্থবিজ্ঞান ভেক্টর হ্যান্ডনোট পড়ছে', time: 'এইমাত্র' },
  { name: 'সাবরিনা', location: 'চট্টগ্রাম', action: 'HSC ICT সি-প্রোগ্রামিং কুইজ শুরু করেছে', time: '১ মিনিট আগে' },
  { name: 'রাকিবুল', location: 'রাজশাহী', action: 'SSC মেগা মডেল টেস্টে ২০/২০ পেয়েছে', time: '২ মিনিট আগে' },
  { name: 'মাইশা', location: 'কুমিল্লা', action: 'রসায়ন পর্যায় সারণি PDF ডাউনলোড করেছে', time: '৩ মিনিট আগে' },
  { name: 'নাফিস', location: 'সিলেট', action: 'উচ্চতর গণিত ত্রিকোণমিতি হ্যান্ডনোট বুকমার্ক করেছে', time: '৪ মিনিট আগে' }
];

export const LiveStudentsCounter: React.FC<LiveStudentsCounterProps> = ({
  navigate,
  variant = 'badge',
  className = ''
}) => {
  const [totalCount, setTotalCount] = useState<number>(428);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);

  // Realistic dynamic fluctuation every 8-15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
      setTotalCount((prev) => Math.max(380, Math.min(520, prev + delta)));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Event ticker rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % RECENT_STUDENT_EVENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentEvent = RECENT_STUDENT_EVENTS[eventIndex];

  // Render variant: Simple top navbar badge
  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 hover:scale-105 transition-all shadow-sm ${className}`}
          title="লাইভ স্টাডি রুমের বিস্তারিত দেখুন"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono font-extrabold">{totalCount}</span>
          <span className="hidden sm:inline font-medium">শিক্ষার্থী লাইভ</span>
          <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Live Presence Details Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        লাইভ স্টাডি স্পেস
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
                        {totalCount} Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      সারা বাংলাদেশ থেকে শিক্ষার্থীরা এই মুহূর্তে প্রস্তুতি নিচ্ছে
                    </p>
                  </div>
                </div>

                {/* Live Activity Live Ticker */}
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 mb-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>রিয়েলটাইম স্টুডেন্ট অ্যাক্টিভিটি</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={eventIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span>
                        <strong className="text-slate-900 dark:text-white font-bold">{currentEvent.name}</strong> ({currentEvent.location}): {currentEvent.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{currentEvent.time}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Study Rooms Breakdown */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    সক্রিয় স্টাডি রুমসমূহ
                  </h4>
                  {STUDY_ROOMS.map((room) => (
                    <div
                      key={room.id}
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {room.category.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {room.banglaName}
                          </p>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            🟢 {room.studentCount} জন পড়ছে
                          </p>
                        </div>
                      </div>

                      {navigate && (
                        <button
                          onClick={() => {
                            setModalOpen(false);
                            if (room.category === 'ssc') navigate('/ssc');
                            else if (room.category === 'hsc') navigate('/hsc');
                            else if (room.id === 'room-model-tests') navigate('/test');
                            else navigate('/notes');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <span>যুক্ত হন</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Benefit */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>সহপাঠীদের সাথে প্রতিদিন ধারাবাহিক পড়ার অভ্যাস গড়ুন</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Variant: Full banner widget
  return (
    <div
      className={`glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-indigo-500/5 to-blue-500/5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                অনলাইন লাইভ স্টুডেন্ট হাব
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
                {totalCount} জন অনলাইন
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              SSC ও HSC শিক্ষার্থীরা এই মুহূর্তে পড়াশোনা ও কুইজ প্র্যাকটিস করছে
            </p>
          </div>
        </div>

        {navigate && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => navigate('/test')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition hover:scale-105"
            >
              লাইভ টেস্ট দিন
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              রুমসমূহ দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
