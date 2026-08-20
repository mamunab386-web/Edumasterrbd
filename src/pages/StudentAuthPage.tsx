import React, { useState } from 'react';
import {
  UserCircle2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GlassCard } from '../components/common/GlassCard';

interface StudentAuthPageProps {
  navigate: (to: string) => void;
}

export const StudentAuthPage: React.FC<StudentAuthPageProps> = ({ navigate }) => {
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classLevel, setClassLevel] = useState<'ssc' | 'hsc'>('ssc');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password, name, classLevel);
        showToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম।', 'success');
      } else {
        await login(email, password);
        showToast('সফলভাবে লগইন হয়েছে!', 'success');
      }
      navigate('/');
    } catch (err: any) {
      showToast(err?.message || 'লগইন ব্যর্থ হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudent = async (cls: 'ssc' | 'hsc') => {
    setLoading(true);
    await signup(`student.${cls}@edumasterbd.com`, '123456', `${cls.toUpperCase()} ডেমো শিক্ষার্থী`, cls);
    showToast(`${cls.toUpperCase()} শিক্ষার্থী হিসেবে প্রবেশ করা হয়েছে!`, 'success');
    navigate(cls === 'ssc' ? '/ssc' : '/hsc');
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isSignup ? 'EduMaster BD-তে অ্যাকাউন্ট তৈরি' : 'শিক্ষার্থী লগইন'}
          </h1>
          <p className="text-xs text-slate-500">
            আপনার প্রগ্রেস ট্র্যাকিং ও ফ্রি পরীক্ষা দেওয়ার সুবিধা
          </p>
        </div>

        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignup && (
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর আহমেদ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ইমেইল এড্রেস *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  আপনার শ্রেণি *
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <option value="ssc">SSC শিক্ষার্থী</option>
                  <option value="hsc">HSC শিক্ষার্থী</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'অপেক্ষা করুন...' : isSignup ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Student Access */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block text-center">
              বা সরাসরি ১-ক্লিকে টেস্ট একাউন্টে ঢুকুন:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickStudent('ssc')}
                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition text-center"
              >
                SSC ডেমো লগইন
              </button>
              <button
                onClick={() => handleQuickStudent('hsc')}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition text-center"
              >
                HSC ডেমো লগইন
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              {isSignup
                ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'
                : 'নতুন শিক্ষার্থী? ফ্রিতে সাইন আপ করুন'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
