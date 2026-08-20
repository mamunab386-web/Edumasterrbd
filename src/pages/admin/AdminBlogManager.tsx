import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Clock, Tag } from 'lucide-react';
import { getBlogs, saveBlog, deleteBlog } from '../../services/dataService';
import { BlogPost } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminBlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Study Tips',
    summary: '',
    content: '',
    author: 'EduMaster Team',
    readTimeMinutes: 5,
    published: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    tags: ['SSC', 'HSC', 'Preparation']
  });

  const [tagsInput, setTagsInput] = useState('SSC, HSC, Tips');

  const load = async () => {
    const list = await getBlogs();
    setBlogs(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({
      id: 'blog-' + Date.now(),
      title: '',
      slug: '',
      category: 'Study Tips',
      summary: '',
      content: '',
      author: 'EduMaster Team',
      readTimeMinutes: 5,
      published: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      tags: ['SSC', 'HSC', 'Tips']
    });
    setTagsInput('SSC, HSC, Tips');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData(blog);
    setTagsInput(blog.tags ? blog.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই আর্টিকেলটি মুছে ফেলতে চান?')) return;
    await deleteBlog(id);
    showToast('আর্টিকেল মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('শিরোনাম ও মূল কনটেন্ট লিখুন', 'error');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const blogToSave: BlogPost = {
      id: editingBlog ? editingBlog.id : formData.id || 'blog-' + Date.now(),
      title: formData.title || '',
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category || 'Study Tips',
      summary: formData.summary || '',
      content: formData.content || '',
      author: formData.author || 'EduMaster Team',
      publishedAt: editingBlog?.publishedAt || new Date().toISOString().split('T')[0],
      readTimeMinutes: Number(formData.readTimeMinutes) || 5,
      coverImageUrl: formData.coverImageUrl || '',
      tags: tagsArray,
      published: formData.published ?? true
    };

    await saveBlog(blogToSave);
    showToast('ব্লগ পোস্ট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            ব্লগ ও গাইডলাইন ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">পড়াশোনার টিপস, রুটিন ও পরীক্ষার আর্টিকেলের তালিকা</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পোস্ট লিখুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {blogs.map((b) => (
          <GlassCard
            key={b.id}
            className="p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {b.category}
                </span>
                <span className="text-xs text-slate-400">
                  {b.readTimeMinutes} মিনিট • {b.publishedAt}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</h4>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
        title={editingBlog ? 'ব্লগ পোস্ট সম্পাদনা' : 'নতুন আর্টিকেল লিখুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">শিরোনাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: শেষ ৩০ দিনে কিভাবে SSC পরীক্ষার চূড়ান্ত প্রস্তুতি নেবেন"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">ক্যাটেগরি</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">সংক্ষিপ্ত সামারি</label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">মূল কনটেন্ট *</label>
            <textarea
              rows={8}
              required
              placeholder="বিস্তারিত আর্টিকেল লিখুন..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">ট্যাগস (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="SSC, HSC, Tips, Routine"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">কভার ইমেজ URL</label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
