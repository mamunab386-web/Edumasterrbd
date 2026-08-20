import React, { useState } from 'react';
import {
  RotateCcw,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sparkles
} from 'lucide-react';
import { resetToDemoData } from '../../services/dataService';
import { GlassCard } from '../../components/common/GlassCard';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (
      !window.confirm(
        'সতর্কতা: আপনি কি সমস্ত ডেটা রিসেট করে ডিফল্ট ডেমো ডেটায় ফিরে যেতে চান?'
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      await resetToDemoData();
      showToast('ডেটাবেজ সফলভাবে রিসেট করা হয়েছে!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      showToast('রিসেট করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          সিস্টেম ও ডেটাবেজ সেটিংস
        </h2>
        <p className="text-xs text-slate-500">
          ক্লাউড ডেটাবেজ সিঙ্ক, ব্যাকআপ এবং স্টোরেজ কনফিগারেশন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage status */}
        <GlassCard className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ডেটা স্টোরেজ মোড
              </h3>
              <p className="text-xs text-slate-400">Firebase Firestore / Local Storage Hybrid</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>সিস্টেম সম্পূর্ণ সক্রিয় ও ডেটা স্বয়ংক্রিয়ভাবে সিঙ্ক হচ্ছে।</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            এডমিন প্যানেলে করা যেকোনো পরিবর্তন সাথে সাথে শিক্ষার্থীদের পোর্টালে দৃশ্যমান হবে।
          </p>
        </GlassCard>

        {/* Database reset card */}
        <GlassCard className="p-6 border border-rose-200 dark:border-rose-900/60 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                ডিফল্ট ডেমো ডেটা রিস্টোর
              </h3>
              <p className="text-xs text-slate-400">স্ট্যান্ডার্ড এসএসসি ও এইচএসসি ডেটাসেট</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            প্রয়োজন হলে সকল বিষয়, অধ্যায়, হ্যান্ডনোট ও MCQ প্রশ্নাবলিকে মূল প্রাথমিক অবস্থায় ফিরিয়ে নিতে পারেন।
          </p>

          <button
            onClick={handleReset}
            disabled={isResetting}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'রিসেট হচ্ছে...' : 'সকল ডেটা ডিফল্ট করুন'}</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
