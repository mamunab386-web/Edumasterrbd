import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Check, Eye } from 'lucide-react';
import { getNotes, getSubjects, getChapters, saveNote, deleteNote } from '../../services/dataService';
import { Note, Subject, Chapter } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminNotesManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    slug: '',
    classLevel: 'ssc',
    subjectId: '',
    chapterId: '',
    content: '',
    summary: '',
    author: 'EduMaster Expert Teacher',
    readingTimeMinutes: 5,
    published: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80'
  });

  const load = async () => {
    const [nList, sList, cList] = await Promise.all([getNotes(), getSubjects(), getChapters()]);
    setNotes(nList);
    setSubjects(sList);
    setChapters(cList);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      id: 'note-' + Date.now(),
      title: '',
      slug: '',
      classLevel: 'ssc',
      subjectId: subjects[0]?.id || '',
      chapterId: chapters[0]?.id || '',
      content: '',
      summary: '',
      author: 'EduMaster Expert Teacher',
      readingTimeMinutes: 5,
      published: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setFormData(note);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই নোটটি মুছে ফেলতে চান?')) return;
    await deleteNote(id);
    showToast('নোটটি মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('শিরোনাম ও মূল বক্তব্য পূরণ করুন', 'error');
      return;
    }

    const noteToSave: Note = {
      id: editingNote ? editingNote.id : formData.id || 'note-' + Date.now(),
      title: formData.title || '',
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      classLevel: formData.classLevel || 'ssc',
      subjectId: formData.subjectId || subjects[0]?.id || '',
      chapterId: formData.chapterId || '',
      content: formData.content || '',
      summary: formData.summary || '',
      author: formData.author || 'EduMaster Expert',
      readingTimeMinutes: Number(formData.readingTimeMinutes) || 5,
      published: formData.published ?? true,
      thumbnailUrl: formData.thumbnailUrl || '',
      publishedAt: editingNote?.publishedAt || new Date().toISOString().split('T')[0]
    };

    await saveNote(noteToSave);
    showToast('নোট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            হ্যান্ডনোট ব্যবস্থাপনা (Notes)
          </h2>
          <p className="text-xs text-slate-500">অধ্যায়ভিত্তিক থিওরি ও নোটস প্রকাশ করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোট যোগ করুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => {
          const sub = subjects.find((s) => s.id === note.subjectId);
          return (
            <GlassCard
              key={note.id}
              className="p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {note.classLevel.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {sub?.banglaName || note.subjectId}
                  </span>
                  <span className="text-[10px] text-slate-400">• {note.readingTimeMinutes} মিনিট</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{note.title}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(note)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
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
        maxWidth="2xl"
        title={editingNote ? 'হ্যান্ডনোট সম্পাদনা করুন' : 'নতুন হ্যান্ডনোট লিখুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div>
              <label className="font-semibold block mb-1">বিষয়</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.banglaName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">অধ্যায়</label>
              <select
                value={formData.chapterId}
                onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="">নির্বাচন করুন</option>
                {chapters
                  .filter((c) => !formData.subjectId || c.subjectId === formData.subjectId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.banglaTitle}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">নোটের শিরোনাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: গতি সংক্রান্ত সমীকরণ ও গ্রাফিক্যাল বিশ্লেষণ"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">সংক্ষিপ্ত সামারি (Summary)</label>
            <textarea
              rows={2}
              placeholder="এই অধ্যায়ের মূল বিষয়বস্তু এক বা দুই লাইনে..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">মূল কনটেন্ট (Content / Formulas) *</label>
            <textarea
              rows={8}
              required
              placeholder="সম্পূর্ণ হ্যান্ডনোট বিস্তারিত লিখুন..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">লেখক / শিক্ষকের নাম</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">পড়ার আনুমানিক সময় (মিনিট)</label>
              <input
                type="number"
                min={1}
                value={formData.readingTimeMinutes}
                onChange={(e) => setFormData({ ...formData, readingTimeMinutes: parseInt(e.target.value) || 5 })}
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
