import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileCheck2 } from 'lucide-react';
import { getBoardQuestions, getSubjects, saveBoardQuestion, deleteBoardQuestion } from '../../services/dataService';
import { BoardQuestion, Subject } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminBoardQuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<BoardQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<BoardQuestion | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<BoardQuestion>>({
    title: '',
    classLevel: 'ssc',
    subjectId: '',
    board: 'ঢাকা',
    year: 2024,
    examType: 'cq',
    questionsText: '',
    solutionText: '',
    pdfUrl: ''
  });

  const load = async () => {
    const [qList, sList] = await Promise.all([getBoardQuestions(), getSubjects()]);
    setQuestions(qList);
    setSubjects(sList);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      id: 'bq-' + Date.now(),
      title: '',
      classLevel: 'ssc',
      subjectId: subjects[0]?.id || '',
      board: 'ঢাকা',
      year: 2024,
      examType: 'cq',
      questionsText: '',
      solutionText: '',
      pdfUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bq: BoardQuestion) => {
    setEditingQuestion(bq);
    setFormData(bq);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই বোর্ড প্রশ্নটি মুছে ফেলতে চান?')) return;
    await deleteBoardQuestion(id);
    showToast('বোর্ড প্রশ্ন মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.solutionText) {
      showToast('শিরোনাম ও সমাধান পূরণ করুন', 'error');
      return;
    }

    const bqToSave: BoardQuestion = {
      id: editingQuestion ? editingQuestion.id : formData.id || 'bq-' + Date.now(),
      title: formData.title || '',
      classLevel: formData.classLevel || 'ssc',
      subjectId: formData.subjectId || subjects[0]?.id || '',
      board: formData.board || 'ঢাকা',
      year: Number(formData.year) || 2024,
      examType: formData.examType || 'cq',
      questionsText: formData.questionsText || '',
      solutionText: formData.solutionText || '',
      pdfUrl: formData.pdfUrl || ''
    };

    await saveBoardQuestion(bqToSave);
    showToast('বোর্ড প্রশ্ন সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            বোর্ড প্রশ্ন ও সমাধান আর্কাইভ
          </h2>
          <p className="text-xs text-slate-500">বিগত বছরের বোর্ড প্রশ্ন এবং স্ট্যান্ডার্ড সমাধান ম্যানেজ করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বোর্ড প্রশ্ন যোগ করুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <GlassCard
            key={q.id}
            className="p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {q.classLevel.toUpperCase()}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {q.board} বোর্ড {q.year}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.title}</h4>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenEdit(q)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(q.id)}
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
        maxWidth="xl"
        title={editingQuestion ? 'বোর্ড প্রশ্ন সম্পাদনা' : 'নতুন বোর্ড প্রশ্ন যুক্ত করুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">শিরোনাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: ঢাকা বোর্ড ২০২৪ পদার্থবিজ্ঞান সৃজনশীল সমাধান"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              <label className="font-semibold block mb-1">শিক্ষা বোর্ড</label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                {['ঢাকা', 'রাজশাহী', 'চট্টগ্রাম', 'কুমিল্লা', 'যশোর', 'বরিশাল', 'সিলেট', 'দিনাজপুর', 'ময়মনসিংহ'].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">পরীক্ষার সাল</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">প্রকারভেদ</label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="cq">সৃজনশীল (CQ)</option>
                <option value="mcq">বহুনির্বাচনী (MCQ)</option>
                <option value="both">উভয়</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">উদ্দীপক ও প্রশ্নপত্র টেক্সট</label>
            <textarea
              rows={3}
              value={formData.questionsText}
              onChange={(e) => setFormData({ ...formData, questionsText: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">আদর্শ সমাধান (Solution) *</label>
            <textarea
              rows={6}
              required
              value={formData.solutionText}
              onChange={(e) => setFormData({ ...formData, solutionText: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">পিডিএফ ডাউনলোড লিংক (ঐচ্ছিক)</label>
            <input
              type="url"
              placeholder="https://example.com/question.pdf"
              value={formData.pdfUrl}
              onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
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
