import React, { useEffect, useState } from 'react';
import {
  Calendar,
  User,
  Clock,
  Share2,
  Tag,
  ArrowRight
} from 'lucide-react';
import { getBlogBySlug, getBlogs } from '../services/dataService';
import { BlogPost } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { useToast } from '../context/ToastContext';
import { SEOHead } from '../components/common/SEOHead';

interface BlogDetailPageProps {
  slug: string;
  navigate: (to: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, navigate }) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const found = await getBlogBySlug(slug);
      if (found) {
        setBlog(found);
        const all = await getBlogs();
        setRecentBlogs(all.filter((b) => b.id !== found.id).slice(0, 2));
      }
    }
    load();
  }, [slug]);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="ব্লগ আর্টিকেলটি পাওয়া যায়নি"
          description="অনুগ্রহ করে ব্লগ তালিকায় ফিরে যান।"
          actionText="সকল ব্লগ"
          onAction={() => navigate('/blog')}
        />
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('আর্টিকেলের লিংক কপি করা হয়েছে!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={blog.seoTitle || `${blog.title} | EduMaster BD`}
        description={blog.metaDescription || blog.excerpt || blog.title}
        keywords={[...(blog.tags || []), 'SSC Blog', 'HSC Routine', 'Exam Strategy']}
        canonicalUrl={`https://edumasterbd.vercel.app/blog/${blog.slug}`}
        ogType="article"
        ogImage={blog.coverImageUrl}
        publishedTime={blog.createdAt}
        modifiedTime={blog.updatedAt || blog.createdAt}
        author={blog.author}
        breadcrumbs={[
          { name: 'ব্লগ ও গাইডলাইন', url: '/blog' },
          { name: blog.title, url: `/blog/${blog.slug}` }
        ]}
        articleData={{
          headline: blog.title,
          description: blog.excerpt || blog.metaDescription || blog.title,
          image: blog.coverImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80',
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt || blog.createdAt,
          authorName: blog.author,
          section: blog.category
        }}
      />

      <Breadcrumbs
        items={[
          { label: 'ব্লগ ও গাইডলাইন', path: '/blog' },
          { label: blog.title }
        ]}
        navigate={navigate}
      />

      {/* Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase">
          {blog.category}
        </span>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600" />
              <span className="text-slate-900 dark:text-slate-200 font-semibold">{blog.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>{blog.readTimeMinutes} মিনিট পড়ার সময়</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{blog.publishedAt}</span>
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>শেয়ার</span>
          </button>
        </div>
      </div>

      {blog.coverImageUrl && (
        <div className="rounded-3xl overflow-hidden shadow-xl max-h-96 w-full">
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <article className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
        <MarkdownRenderer content={blog.content} />
      </article>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {blog.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
