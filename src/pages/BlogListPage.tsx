import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { getBlogs } from '../services/dataService';
import { BlogPost } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface BlogListPageProps {
  navigate: (to: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ navigate }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const bList = await getBlogs();
      setBlogs(bList.filter((b) => b.published));
    }
    load();
  }, []);

  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags || [])));

  const filteredBlogs = blogs.filter((b) => {
    if (selectedTag === 'all') return true;
    return b.tags?.includes(selectedTag);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'ব্লগ ও গাইডলাইন' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            স্টাডি গাইড ও পরামর্শ
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            পড়াশোনার টিপস, রুটিন ও বোর্ড পরীক্ষার স্ট্র্যাটেজি
          </h1>
          <p className="text-sm text-purple-100 leading-relaxed">
            স্মার্ট উপায়ে পড়ালেখা, সময় ব্যবস্থাপনা এবং বোর্ড পরীক্ষায় সর্বোচ্চ নম্বর পাওয়ার কার্যকর টিপস ও ট্রিকস।
          </p>
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            সকল পোস্ট
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <GlassCard
            key={blog.id}
            onClick={() => navigate(`/blog/${blog.slug || blog.id}`)}
            className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-purple-400"
          >
            <div>
              {blog.coverImageUrl && (
                <div className="h-44 rounded-xl overflow-hidden mb-4 relative">
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold">
                    {blog.category}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{blog.readTimeMinutes} মিনিট পড়ার সময়</span>
                <span>{blog.publishedAt}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {blog.summary}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{blog.author}</span>
              <span className="font-bold text-indigo-600 flex items-center gap-1">
                সম্পূর্ণ পড়ুন <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
