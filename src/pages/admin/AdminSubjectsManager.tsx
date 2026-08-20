import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Layers
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { getSubjects, saveSubject, deleteSubject } from '../../services/dataService';
import { Subject } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminSubjectsManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Subject>>({
    name: '',
    banglaName: '',
    classLevel: 'ssc',
    category: 'science',
    icon: 'BookOpen',
    color: 'from-blue-600 to-indigo-600',
    description: ''
  });

  const load = async () => {
    const list = await getSubjects();
    setSubjects(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      id: 'sub-' + Date.now(),
      name: '',
      banglaName: '',
      classLevel: 'ssc',
      category: 'science',
      icon: 'BookOpen',
      color: 'from-blue-600 to-indigo-600',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData(subject);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই বিষয়টি মুছে ফেলতে চান?')) return;
    await deleteSubject(id);
    showToast('বিষয়টি মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.banglaName) {
      showToast('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    const subToSave: Subject = {
      id: editingSubject ? editingSubject.id : formData.id || 'sub-' + Date.now(),
      name: formData.name || '',
      banglaName: formData.banglaName || '',
      classLevel: formData.classLevel || 'ssc',
      category: formData.category || 'science',
      icon: formData.icon || 'BookOpen',
      color: formData.color || 'from-indigo-600 to-blue-600',
      description: formData.description || '',
      order: formData.order || subjects.length + 1
    };

    await saveSubject(subToSave);
    showToast('বিষয় সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            বিষয় ব্যবস্থাপনা (Subjects)
          </h2>
          <p className="text-xs text-slate-500">এসএসসি ও এইচএসসির পাঠ্যবিষয় পরিচালনা করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিষয় যোগ করুন</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const Icon = (Icons as any)[sub.icon] || Icons.BookOpen;
          return (
            <GlassCard
              key={sub.id}
              className="p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sub.classLevel.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {sub.banglaName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{sub.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(sub)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'বিষয় সম্পাদনা করুন' : 'নতুন বিষয় যোগ করুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">বাংলা নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: পদার্থবিজ্ঞান"
                value={formData.banglaName}
                onChange={(e) => setFormData({ ...formData, banglaName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">ইংরেজি নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: Physics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">শ্রেণি</label>
              <select
                value={formData.classLevel}
                onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="ssc">SSC</option>
                <option value="hsc">HSC</option>
                <option value="both">Both (উভয়)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">বিভাগ</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="science">বিজ্ঞান (Science)</option>
                <option value="general">সাধারণ (General)</option>
                <option value="humanities">মানবিক (Humanities)</option>
                <option value="business">ব্যবসায় শিক্ষা (Business)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">সংক্ষিপ্ত বিবরণ</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
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
