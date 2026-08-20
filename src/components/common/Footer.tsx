import React from 'react';
import {
  GraduationCap,
  Heart,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Mail,
  Phone,
  Send,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  navigate: (to: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 pt-14 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                EduMaster <span className="text-indigo-400">BD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              বাংলাদেশের সকল এসএসসি ও এইচএসসি শিক্ষার্থীর জন্য উন্মুক্ত, আধুনিক ও সম্পূর্ণ ফ্রি
              লার্নিং প্ল্যাটফর্ম। অধ্যায়ভিত্তিক হ্যান্ডনোট, বোর্ড প্রশ্ন ও মডেল টেস্ট এর সেরা সংগ্রহশালা।
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ১০০% ফ্রি উন্মুক্ত রিসোর্স
              </span>
            </div>
          </div>

          {/* SSC Hub */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              SSC সেকশন
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/ssc')} className="hover:text-indigo-400 transition">
                  SSC বিষয়ভিত্তিক নোট
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mcq?class=ssc')} className="hover:text-indigo-400 transition">
                  SSC অধ্যায়ভিত্তিক MCQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/test?class=ssc')} className="hover:text-indigo-400 transition">
                  অনলাইন মডেল টেস্ট
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/board-questions?class=ssc')} className="hover:text-indigo-400 transition">
                  বিগত বছরের বোর্ড প্রশ্ন
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pdf?class=ssc')} className="hover:text-indigo-400 transition">
                  SSC সাজেশন ও PDF
                </button>
              </li>
            </ul>
          </div>

          {/* HSC Hub */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              HSC সেকশন
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/hsc')} className="hover:text-indigo-400 transition">
                  HSC বিজ্ঞান ও সাধারণ বিভাগ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/mcq?class=hsc')} className="hover:text-indigo-400 transition">
                  HSC MCQ প্র্যাকটিস
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/test?class=hsc')} className="hover:text-indigo-400 transition">
                  মেগা মডেল টেস্ট
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/board-questions?class=hsc')} className="hover:text-indigo-400 transition">
                  HSC বোর্ড প্রশ্ন ব্যাংক
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pdf?class=hsc')} className="hover:text-indigo-400 transition">
                  হ্যান্ডনোট ও ফর্মুলা শিট
                </button>
              </li>
            </ul>
          </div>

          {/* Quick & Admin Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              সহযোগিতা ও তথ্য
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-indigo-400 transition">
                  পড়াশোনার গাইডলাইন ও ব্লগ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-indigo-400 transition">
                  আমাদের লক্ষ্য ও পরিচিতি
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-indigo-400 transition">
                  যোগাযোগ ও ফিডব্যাক
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/login')} className="hover:text-amber-400 transition flex items-center gap-1">
                  <span>এডমিন পোর্টাল</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EduMaster BD. সর্বস্বত্ব সংরক্ষিত। দেশব্যাপী শিক্ষার্থীদের জন্য নিবেদিত।</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Bangladeshi Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
