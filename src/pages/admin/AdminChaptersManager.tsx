import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { getChapters, getSubjects, saveChapter, deleteChapter } from '../../services/dataService';
import { Chapter, Subject } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminChaptersManager: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Chapter>>({
    subjectId: '',
    chapterNumber: 1,
    title: '',
    banglaTitle: '',
    classLevel: 'ssc'
  });

  const load = async () => {
    const [cList, sList] = await Promise.all([getChapters(), getSubjects()]);
    setChapters(cList);
    setSubjects(sList);
    if (sList.length > 0 && !formData.subjectId) {
      setFormData((prev) => ({ ...prev, subjectId: sList[0].id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingChapter(null);
    setFormData({
      id: 'chap-' + Date.now(),
      subjectId: subjects[0]?.id || '',
      chapterNumber: chapters.length + 1,
      title: '',
      banglaTitle: '',
      classLevel: 'ssc'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData(chapter);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই অধ্যায়টি মুছে ফেলতে চান?')) return;
    await deleteChapter(id);
    showToast('অধ্যায়টি মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.banglaTitle || !formData.subjectId) {
      showToast('সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    const chapToSave: Chapter = {
      id: editingChapter ? editingChapter.id : formData.id || 'chap-' + Date.now(),
      subjectId: formData.subjectId || '',
      chapterNumber: Number(formData.chapterNumber) || 1,
      title: formData.title || formData.banglaTitle || '',
      banglaTitle: formData.banglaTitle || '',
      classLevel: formData.classLevel || 'ssc',
      order: Number(formData.chapterNumber) || 1
    };

    await saveChapter(chapToSave);
    showToast('অধ্যায় সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            অধ্যায় ব্যবস্থাপনা (Chapters)
          </h2>
          <p className="text-xs text-slate-500">বিষয়ভিত্তিক অধ্যায় তালিকা পরিচালনা করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অধ্যায় যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chap) => {
          const sub = subjects.find((s) => s.id === chap.subjectId);
          return (
            <GlassCard
              key={chap.id}
              className="p-5 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                  {chap.chapterNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {sub?.banglaName || chap.subjectId}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {chap.classLevel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {chap.banglaTitle}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(chap)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(chap.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingChapter ? 'অধ্যায় সম্পাদনা করুন' : 'নতুন অধ্যায় যোগ করুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">বিষয় নির্বাচন করুন *</label>
            <select
              required
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.banglaName} ({s.classLevel.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">অধ্যায় নম্বর *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.chapterNumber}
                onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">শ্রেণি</label>
              <select
                value={formData.classLevel}
                onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="ssc">SSC</option>
                <option value="hsc">HSC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">অধ্যায়ের বাংলা নাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: গতি (Motion)"
              value={formData.banglaTitle}
              onChange={(e) => setFormData({ ...formData, banglaTitle: e.target.value })}
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
