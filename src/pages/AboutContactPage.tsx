import React, { useState } from 'react';
import {
  GraduationCap,
  Heart,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useToast } from '../context/ToastContext';

interface AboutContactPageProps {
  navigate: (to: string) => void;
}

export const AboutContactPage: React.FC<AboutContactPageProps> = ({ navigate }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('অনুগ্রহ করে সকল ফিল্ড পূরণ করুন', 'error');
      return;
    }
    setSubmitted(true);
    showToast('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! শীঘ্রই যোগাযোগ করা হবে।', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'আমাদের পরিচিতি ও যোগাযোগ' }]} navigate={navigate} />

      {/* Hero */}
      <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          EduMaster BD এর লক্ষ্য ও পরিচিতি
        </h1>
        <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto leading-relaxed">
          বাংলাদেশের প্রতিটি কোণে এসএসসি ও এইচএসসি শিক্ষার্থীদের জন্য সহজলভ্য, মানসম্মত ও ১০০% উন্মুক্ত ডিজিটাল শিক্ষা সেবা নিশ্চিত করাই আমাদের একমাত্র লক্ষ্য।
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">উন্মুক্ত শিক্ষা সবার জন্য</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            কোনো আর্থিক সীমাবদ্ধতা যেন কোনো শিক্ষার্থীর পড়াশোনার বাধা না হয়। আমাদের নোট ও টেস্ট সম্পূর্ণ ফ্রি।
          </p>
        </GlassCard>

        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">বোর্ড মানসম্পন্ন কনটেন্ট</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            এনসিটিবি পাঠ্যক্রমের আলোকে নির্ভুল ব্যাখ্যা, সূত্র ও বিগত বোর্ড পরীক্ষার প্রশ্নের কাঠামোগত উপস্থাপন।
          </p>
        </GlassCard>

        <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">শিক্ষার্থীবান্ধব ইন্টারফেস</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            মোবাইল বা কম্পিউটার — যেকোনো ডিভাইসে অত্যন্ত দ্রুতগতিতে লোড হয় এমন আধুনিক ও পরিচ্ছন্ন ডিজাইন।
          </p>
        </GlassCard>
      </div>

      {/* Contact Form & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              আমাদের সাথে যোগাযোগ
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              যেকোনো জিজ্ঞাসা বা পরামর্শে আমরা পাশে আছি
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">ইমেইল</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">contact@edumasterbd.com</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">হেল্পলাইন</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">+৮৮০ ১৭১২-৩৪৫৬৭৮</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">ঠিকানা</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              সরাসরি বার্তা পাঠান
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="নাম লিখুন"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    ইমেইল এড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  বিষয়
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="যেমন: কোনো প্রশ্ন বা পরামর্শ"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  আপনার বার্তা *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="বিস্তারিত লিখুন..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা প্রেরণ করুন</span>
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
