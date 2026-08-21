import React, { useState } from 'react';
import {
  RotateCcw,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sparkles,
  Download,
  Upload,
  FileJson,
  ShieldCheck,
  KeyRound,
  Lock,
  UserCheck
} from 'lucide-react';
import {
  resetToDemoData,
  exportDatabaseAsJSON,
  importDatabaseFromJSON
} from '../../services/dataService';
import { GlassCard } from '../../components/common/GlassCard';
import { useToast } from '../../context/ToastContext';
import { useAuth, PRIMARY_SUPER_ADMIN_EMAIL } from '../../context/AuthContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const { updateAdminPassword } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Admin security credentials form state
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass || newAdminPass.length < 6) {
      showToast('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে', 'error');
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      showToast('উভয় পাসওয়ার্ড মেলেনি', 'error');
      return;
    }
    const success = updateAdminPassword(newAdminPass);
    if (success) {
      showToast('এডমিন পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!', 'success');
      setNewAdminPass('');
      setConfirmAdminPass('');
    } else {
      showToast('পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const jsonString = await exportDatabaseAsJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edumaster_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('সম্পূর্ণ ডেটাবেজ ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!', 'success');
    } catch (e) {
      showToast('ব্যাকআপ ডাউনলোড করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) return;
    try {
      const success = await importDatabaseFromJSON(importJsonText);
      if (success) {
        showToast('ডেটাবেজ সফলভাবে ইমপোর্ট ও আপডেট হয়েছে!', 'success');
        setIsImportModalOpen(false);
        setImportJsonText('');
        setTimeout(() => window.location.reload(), 800);
      } else {
        showToast('ইমপোর্টে সমস্যা হয়েছে। সঠিক JSON ফরম্যাট প্রদান করুন।', 'error');
      }
    } catch (e: any) {
      showToast('ভুল JSON ফরম্যাট', 'error');
    }
  };

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
          সিস্টেম, নিরাপত্তা ও ডেটাবেজ সেটিংস
        </h2>
        <p className="text-xs text-slate-500">
          ওনার সিকিউরিটি কনফিগারেশন, ক্লাউড ডেটাবেজ সিঙ্ক, ব্যাকআপ ও স্টোরেজ ম্যানেজমেন্ট
        </p>
      </div>

      {/* Admin Access & Security Section */}
      <GlassCard className="p-6 border border-amber-300 dark:border-amber-900/60 space-y-5 bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                এডমিন অ্যাক্সেস নিয়ন্ত্রণ ও নিরাপত্তা
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  সুরক্ষিত ওনার মোড
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                এডমিনিস্ট্রেশন প্যানেল শুধুমাত্র নির্ধারিত ওনার ইমেইলের জন্য সীমাবদ্ধ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>প্রধান ওনার: <strong>{PRIMARY_SUPER_ADMIN_EMAIL}</strong></span>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              নতুন এডমিন পাসওয়ার্ড
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                value={newAdminPass}
                onChange={(e) => setNewAdminPass(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="আবার লিখুন"
                value={confirmAdminPass}
                onChange={(e) => setConfirmAdminPass(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            </button>
          </div>
        </form>
      </GlassCard>

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
            এডমিন প্যানেলে তৈরি করা সকল নতুন হ্যান্ডনোট, MCQ এবং PDF মেটাডেটা সাথে সাথে শিক্ষার্থীদের লাইভ পোর্টালে দৃশ্যমান হবে।
          </p>
        </GlassCard>

        {/* Database Export / Import Backup Card */}
        <GlassCard className="p-6 border border-indigo-200 dark:border-indigo-900/60 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                সম্পূর্ণ ডেটাবেজ ব্যাকআপ ও মাইগ্রেশন
              </h3>
              <p className="text-xs text-slate-400">JSON ফরম্যাটে ডাউনলোড অথবা ইমপোর্ট করুন</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার সকল তৈরি করা হ্যান্ডনোট, MCQ ও পরীক্ষার ডেটা এক ক্লিকে ডাউনলোড বা নতুন সাইটে স্থানান্তর করুন।
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleExport}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ব্যাকআপ ডাউনলোড</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="py-2.5 px-3 rounded-xl border border-indigo-300 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>JSON ইমপোর্ট</span>
            </button>
          </div>
        </GlassCard>

        {/* Database reset card */}
        <GlassCard className="p-6 border border-rose-200 dark:border-rose-900/60 space-y-4 md:col-span-2">
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
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'রিসেট হচ্ছে...' : 'সকল ডেটা ডিফল্ট করুন'}</span>
          </button>
        </GlassCard>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              JSON ব্যাকআপ ডেটা ইমপোর্ট করুন
            </h3>
            <p className="text-xs text-slate-500">
              পূর্বে ডাউনলোডকৃত JSON ফাইলের কোড নিচে পেস্ট করুন:
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-slate-900 dark:text-white outline-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition cursor-pointer"
              >
                ইমপোর্ট ও সিঙ্ক সম্পন্ন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
