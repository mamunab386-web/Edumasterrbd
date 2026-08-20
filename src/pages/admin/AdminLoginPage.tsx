import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GlassCard } from '../../components/common/GlassCard';

interface AdminLoginPageProps {
  navigate: (to: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login, isAdmin, loginWithDemoAdmin } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@edumasterbd.com');
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      showToast('এডমিন প্যানেলে সফলভাবে লগইন হয়েছে!', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      showToast('লগইন ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    await loginWithDemoAdmin();
    showToast('ডেমো এডমিন অ্যাকাউন্টে প্রবেশ করা হয়েছে', 'info');
    navigate('/admin');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            EduMaster BD এডমিন পোর্টাল
          </h1>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের সকল কনটেন্ট ও ডেটাবেজ ম্যানেজমেন্ট সিস্টেম
          </p>
        </div>

        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                এডমিন ইমেইল
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Instant Demo Admin Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={handleQuickDemo}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>১-ক্লিক ডেমো এডমিন মোডে প্রবেশ করুন</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
