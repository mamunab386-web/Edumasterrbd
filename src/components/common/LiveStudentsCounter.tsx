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
  Flame,
  Globe2,
  Laptop
} from 'lucide-react';
import { presenceService, PresenceStats } from '../../services/presenceService';

interface LiveStudentsCounterProps {
  navigate?: (to: string) => void;
  variant?: 'badge' | 'full' | 'floating' | 'banner';
  className?: string;
}

export const LiveStudentsCounter: React.FC<LiveStudentsCounterProps> = ({
  navigate,
  variant = 'badge',
  className = ''
}) => {
  const [stats, setStats] = useState<PresenceStats>({
    totalActive: 1,
    sscCount: 0,
    hscCount: 0,
    testCount: 0,
    notesCount: 0,
    generalCount: 1
  });
  const [modalOpen, setModalOpen] = useState(false);

  // Initialize and track real presence
  useEffect(() => {
    presenceService.startTracking(window.location.pathname);
    const unsubscribe = presenceService.subscribe((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const studyRooms = [
    {
      id: 'room-ssc',
      name: 'SSC বিজ্ঞান ও সাধারণ বিভাগ',
      banglaName: 'SSC স্টাডি স্পেস',
      studentCount: stats.sscCount,
      category: 'ssc',
      path: '/ssc'
    },
    {
      id: 'room-hsc',
      name: 'HSC আইসিটি ও বিজ্ঞান লাউঞ্জ',
      banglaName: 'HSC স্টাডি স্পেস',
      studentCount: stats.hscCount,
      category: 'hsc',
      path: '/hsc'
    },
    {
      id: 'room-test',
      name: 'লাইভ মডেল টেস্ট অ্যারিনা',
      banglaName: 'মডেল টেস্ট ও কুইজ প্র্যাকটিস',
      studentCount: stats.testCount,
      category: 'test',
      path: '/test'
    },
    {
      id: 'room-notes',
      name: 'হ্যান্ডনোট ও PDF লাইব্রেরি',
      banglaName: 'হ্যান্ডনোট রিডিং রুম',
      studentCount: stats.notesCount + stats.generalCount,
      category: 'notes',
      path: '/notes'
    }
  ];

  // Render variant: Simple top navbar badge
  if (variant === 'badge') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 hover:scale-105 transition-all shadow-sm ${className}`}
          title="রিয়েলটাইম সক্রিয় শিক্ষার্থীর বিবরণ দেখুন"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono font-extrabold">{stats.totalActive}</span>
          <span className="hidden sm:inline font-medium">অনলাইন</span>
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
                        রিয়েলটাইম সক্রিয় শিক্ষার্থী
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-extrabold">
                        {stats.totalActive} Active Now
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      এই মুহূর্তে সরাসরি প্ল্যাটফর্মে যুক্ত থাকা সক্রিয় শিক্ষার্থী
                    </p>
                  </div>
                </div>

                {/* Live Activity Live Ticker */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-200">
                    <p className="font-bold text-slate-900 dark:text-white">
                      রিয়েলটাইম সেশন ট্র্যাকিং সক্রিয়
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      আপনি সহ মোট {stats.totalActive} জন শিক্ষার্থী বর্তমানে ওয়েবসাইটটি ব্যবহার করছেন।
                    </p>
                  </div>
                </div>

                {/* Study Rooms Breakdown */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    বিভাগ অনুযায়ী সক্রিয় উপস্থিতি
                  </h4>
                  {studyRooms.map((room) => (
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
                            🟢 {room.studentCount} জন এই সেকশনে
                          </p>
                        </div>
                      </div>

                      {navigate && (
                        <button
                          onClick={() => {
                            setModalOpen(false);
                            navigate(room.path);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <span>ব্রাউজ করুন</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Benefit */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>প্রকৃত লাইভ সেশন ডেটা রিয়েলটাইমে আপডেট হচ্ছে</span>
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
                {stats.totalActive} জন অনলাইন
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              সরাসরি সংযুক্ত সক্রিয় শিক্ষার্থীদের সাথে পড়াশোনা ও প্রস্তুতি নিন
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
              বিস্তারিত দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

