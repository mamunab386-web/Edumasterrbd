import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth, PRIMARY_SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GlassCard } from '../../components/common/GlassCard';

interface AdminLoginPageProps {
  navigate: (to: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { loginAsAdminSecure } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(PRIMARY_SUPER_ADMIN_EMAIL);
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginAsAdminSecure(email, password);
      showToast('এডমিন প্যানেলে সফলভাবে লগইন হয়েছে!', 'success');
      navigate('/admin');
    } catch (err: any) {
      setError(
        err?.message ||
          'অননুমোদিত প্রবেশাধিকার! শুধুমাত্র অনুমোদিত এডমিন অ্যাকাউন্ট দ্বারা প্রবেশ সম্ভব।'
      );
      showToast('লগইন ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsLoading(false);
    }
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
            নিরাপদ এডমিনিস্ট্রেটর কনসোল (শুধুমাত্র অনুমোদিত ওনার অ্যাক্সেস)
          </p>
        </div>

        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>এডমিন প্যানেল শুধুমাত্র <strong>{PRIMARY_SUPER_ADMIN_EMAIL}</strong> এর জন্য সংরক্ষিত।</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                এডমিন ইমেইল (Admin Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mamunab386@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                মাস্টার পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'নিরাপদে প্রবেশ করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            ডিফল্ট পাসওয়ার্ড: <span className="font-mono text-slate-600 dark:text-slate-300">admin123456</span> (এডমিন সেটিংস থেকে যেকোনো সময় পরিবর্তনযোগ্য)
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
