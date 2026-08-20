import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Zap, CheckCircle2 } from 'lucide-react';
import { getMCQs, getSubjects, getChapters, saveMCQ, deleteMCQ } from '../../services/dataService';
import { MCQ, Subject, Chapter } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminMcqManager: React.FC = () => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMcq, setEditingMcq] = useState<MCQ | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<MCQ>>({
    classLevel: 'ssc',
    subjectId: '',
    chapterId: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    boardRef: ''
  });

  const load = async () => {
    const [mList, sList, cList] = await Promise.all([getMCQs(), getSubjects(), getChapters()]);
    setMcqs(mList);
    setSubjects(sList);
    setChapters(cList);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingMcq(null);
    setFormData({
      id: 'mcq-' + Date.now(),
      classLevel: 'ssc',
      subjectId: subjects[0]?.id || '',
      chapterId: chapters[0]?.id || '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium',
      boardRef: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mcq: MCQ) => {
    setEditingMcq(mcq);
    setFormData(mcq);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই MCQ প্রশ্নটি মুছে ফেলতে চান?')) return;
    await deleteMCQ(id);
    showToast('MCQ প্রশ্নটি মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleOptionChange = (index: number, val: string) => {
    const next = [...(formData.options || ['', '', '', ''])];
    next[index] = val;
    setFormData({ ...formData, options: next });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.options || formData.options.some((o) => !o.trim())) {
      showToast('প্রশ্ন ও ৪টি অপশন সঠিকভাবে লিখুন', 'error');
      return;
    }

    const mcqToSave: MCQ = {
      id: editingMcq ? editingMcq.id : formData.id || 'mcq-' + Date.now(),
      classLevel: formData.classLevel || 'ssc',
      subjectId: formData.subjectId || subjects[0]?.id || '',
      chapterId: formData.chapterId || '',
      question: formData.question || '',
      options: formData.options as [string, string, string, string],
      correctAnswer: Number(formData.correctAnswer) || 0,
      explanation: formData.explanation || '',
      difficulty: formData.difficulty || 'medium',
      boardRef: formData.boardRef || ''
    };

    await saveMCQ(mcqToSave);
    showToast('MCQ সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            MCQ প্রশ্ন ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">বহুনির্বাচনী প্রশ্ন, সঠিক উত্তর ও সমাধান ম্যানেজ করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন MCQ যোগ করুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {mcqs.map((mcq, idx) => {
          const sub = subjects.find((s) => s.id === mcq.subjectId);
          return (
            <GlassCard
              key={mcq.id}
              className="p-5 border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {mcq.classLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {sub?.banglaName || mcq.subjectId}
                    </span>
                    {mcq.boardRef && (
                      <span className="text-[10px] font-semibold text-amber-600">
                        • {mcq.boardRef}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {mcq.question}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(mcq)}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(mcq.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {mcq.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2 rounded-lg border ${
                      oIdx === mcq.correctAnswer
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold'
                        : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <span className="font-bold mr-1">{['ক', 'খ', 'গ', 'ঘ'][oIdx]}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xl"
        title={editingMcq ? 'MCQ প্রশ্ন সম্পাদনা' : 'নতুন MCQ প্রশ্ন যোগ করুন'}
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
              <label className="font-semibold block mb-1">কঠিনতার মাত্রা</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="easy">সহজ (Easy)</option>
                <option value="medium">মাঝারি (Medium)</option>
                <option value="hard">চ্যালেঞ্জিং (Hard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">প্রশ্ন *</label>
            <textarea
              rows={2}
              required
              placeholder="প্রশ্নটি লিখুন..."
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold block">৪টি অপশন ও সঠিক উত্তর নির্বাচন *</label>
            {(formData.options || ['', '', '', '']).map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={Number(formData.correctAnswer) === oIdx}
                  onChange={() => setFormData({ ...formData, correctAnswer: oIdx })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-xs w-4">{['ক', 'খ', 'গ', 'ঘ'][oIdx]}.</span>
                <input
                  type="text"
                  required
                  placeholder={`অপশন ${['ক', 'খ', 'গ', 'ঘ'][oIdx]}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="font-semibold block mb-1">বোর্ড রেফারেন্স (ঐচ্ছিক)</label>
            <input
              type="text"
              placeholder="যেমন: ঢাকা বোর্ড ২০২৪"
              value={formData.boardRef}
              onChange={(e) => setFormData({ ...formData, boardRef: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">সঠিক উত্তরের বাংলা ব্যাখ্যা</label>
            <textarea
              rows={2}
              placeholder="কেন এই উত্তরটি সঠিক তার সূত্র বা লজিক..."
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
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
