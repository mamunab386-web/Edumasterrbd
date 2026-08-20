import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Clock } from 'lucide-react';
import { getModelTests, getSubjects, getMCQs, saveModelTest, deleteModelTest } from '../../services/dataService';
import { ModelTest, Subject, MCQ } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminModelTestManager: React.FC = () => {
  const [tests, setTests] = useState<ModelTest[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allMcqs, setAllMcqs] = useState<MCQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<ModelTest | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<ModelTest>>({
    title: '',
    classLevel: 'ssc',
    subjectId: '',
    durationMinutes: 15,
    totalMarks: 25,
    passingMarks: 10,
    description: '',
    published: true,
    questions: []
  });

  const load = async () => {
    const [tList, sList, mList] = await Promise.all([getModelTests(), getSubjects(), getMCQs()]);
    setTests(tList);
    setSubjects(sList);
    setAllMcqs(mList);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingTest(null);
    const initialQuestions = allMcqs.filter((m) => m.classLevel === 'ssc').slice(0, 10);
    setFormData({
      id: 'test-' + Date.now(),
      title: '',
      classLevel: 'ssc',
      subjectId: subjects[0]?.id || '',
      durationMinutes: 15,
      totalMarks: 25,
      passingMarks: 10,
      description: '',
      published: true,
      questions: initialQuestions
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (test: ModelTest) => {
    setEditingTest(test);
    setFormData(test);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই মডেল টেস্টটি মুছে ফেলতে চান?')) return;
    await deleteModelTest(id);
    showToast('মডেল টেস্ট মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('টেস্টের শিরোনাম পূরণ করুন', 'error');
      return;
    }

    // Filter questions matching current class and subject if questions empty
    let finalQuestions = formData.questions || [];
    if (finalQuestions.length === 0) {
      finalQuestions = allMcqs.filter(
        (m) =>
          m.classLevel === formData.classLevel &&
          (!formData.subjectId || m.subjectId === formData.subjectId)
      );
      if (finalQuestions.length === 0) {
        finalQuestions = allMcqs.slice(0, 5);
      }
    }

    const testToSave: ModelTest = {
      id: editingTest ? editingTest.id : formData.id || 'test-' + Date.now(),
      title: formData.title || '',
      classLevel: formData.classLevel || 'ssc',
      subjectId: formData.subjectId || subjects[0]?.id || '',
      durationMinutes: Number(formData.durationMinutes) || 15,
      totalMarks: Number(formData.totalMarks) || 25,
      passingMarks: Number(formData.passingMarks) || 10,
      description: formData.description || '',
      questions: finalQuestions,
      published: formData.published ?? true,
      attemptsCount: editingTest?.attemptsCount || 0
    };

    await saveModelTest(testToSave);
    showToast('মডেল টেস্ট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            মডেল টেস্ট ব্যবস্থাপনা (Model Tests)
          </h2>
          <p className="text-xs text-slate-500">টাইমার ও প্রশ্নযুক্ত পরীক্ষা পরিচালনা করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন টেস্ট তৈরি করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((t) => (
          <GlassCard
            key={t.id}
            className="p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {t.classLevel.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {t.durationMinutes} মিনিট
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                পূর্ণমান: {t.totalMarks} | প্রশ্ন: {t.questions?.length || 0}টি
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingTest ? 'মডেল টেস্ট সম্পাদনা' : 'নতুন মডেল টেস্ট তৈরি'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">টেস্টের শিরোনাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: SSC পদার্থবিজ্ঞান ১ম গ্র্যান্ড টেস্ট"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">সময় (মিনিট)</label>
              <input
                type="number"
                min={1}
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 15 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">পূর্ণমান</label>
              <input
                type="number"
                min={1}
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 25 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">পাস মার্কস</label>
              <input
                type="number"
                min={1}
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 10 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
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
