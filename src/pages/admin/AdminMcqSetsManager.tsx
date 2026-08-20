import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Sparkles,
  FileDown,
  Printer,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MCQSet, MCQ, Subject, Chapter, MCQDifficulty } from '../../types';
import {
  getMCQSets,
  saveMCQSet,
  deleteMCQSet,
  getMCQs,
  getSubjects,
  getChapters
} from '../../services/dataService';

export const AdminMcqSetsManager: React.FC = () => {
  const [sets, setSets] = useState<MCQSet[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Modal / Editing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<Partial<MCQSet> | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [setsList, mcqList, subList, chapList] = await Promise.all([
      getMCQSets(),
      getMCQs(),
      getSubjects(),
      getChapters()
    ]);
    setSets(setsList);
    setMcqs(mcqList);
    setSubjects(subList);
    setChapters(chapList);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingSet({
      title: '',
      description: '',
      classLevel: 'ssc',
      subjectId: subjects.find((s) => s.classLevel === 'ssc')?.id || '',
      chapterId: '',
      difficulty: 'medium',
      durationMinutes: 15,
      totalQuestions: 10,
      totalMarks: 10,
      passingMarks: 7,
      published: true
    });
    setSelectedQuestionIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (set: MCQSet) => {
    setEditingSet({ ...set });
    setSelectedQuestionIds(set.questionIds || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই MCQ সেটটি মুছে ফেলতে চান?')) return;
    await deleteMCQSet(id);
    await loadData();
  };

  const handleToggleQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qid) => qid !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSet?.title || !editingSet?.subjectId) return;

    setSaveLoading(true);
    const setObj: MCQSet = {
      id: editingSet.id || `set-${Date.now()}`,
      title: editingSet.title,
      description: editingSet.description || '',
      classLevel: (editingSet.classLevel as any) || 'ssc',
      subjectId: editingSet.subjectId,
      chapterId: editingSet.chapterId || undefined,
      difficulty: (editingSet.difficulty as any) || 'medium',
      durationMinutes: Number(editingSet.durationMinutes) || 15,
      totalQuestions: selectedQuestionIds.length,
      totalMarks: selectedQuestionIds.length,
      passingMarks: Number(editingSet.passingMarks) || Math.ceil(selectedQuestionIds.length * 0.7),
      questionIds: selectedQuestionIds,
      published: editingSet.published ?? true,
      attemptsCount: editingSet.attemptsCount || 0,
      tags: editingSet.tags || ['MCQ Set'],
      createdAt: editingSet.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveMCQSet(setObj);
    setSaveLoading(false);
    setIsModalOpen(false);
    await loadData();
  };

  // Filtered sets
  const filteredSets = sets.filter((s) => {
    const matchClass = selectedClass === 'all' || s.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || s.subjectId === selectedSubject;
    const matchSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchClass && matchSub && matchSearch;
  });

  // Filtered MCQs for the picker modal based on editing subject/class
  const availableMcqs = mcqs.filter((m) => {
    if (editingSet?.subjectId && m.subjectId !== editingSet.subjectId) return false;
    if (editingSet?.classLevel && m.classLevel !== editingSet.classLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            MCQ সেট ও প্র্যাকটিস প্যাকেজ বিল্ডার
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            অধ্যায়ভিত্তিক অথবা একাধিক অধ্যায়ের সমন্বয়ে শিক্ষার্থীদের জন্য স্পেশাল MCQ প্যাকেজ ও কুইজ তৈরি করুন।
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন MCQ সেট তৈরি করুন</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="MCQ সেট খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">সকল শ্রেণী (SSC + HSC)</option>
            <option value="ssc">এসএসসি (SSC)</option>
            <option value="hsc">এইচএসসি (HSC)</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white outline-none"
          >
            <option value="all">সকল বিষয়</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.banglaName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sets List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">লোড হচ্ছে...</div>
      ) : filteredSets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <Zap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">কোন MCQ সেট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">উপরের "নতুন MCQ সেট তৈরি করুন" বাটনে চাপুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSets.map((s) => {
            const sub = subjects.find((sb) => sb.id === s.subjectId);
            return (
              <div
                key={s.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {s.classLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{sub?.banglaName}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {s.title}
                  </h3>

                  {s.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{s.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-100 dark:border-slate-800/80 text-center">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {s.questionIds?.length || s.totalQuestions}
                      </div>
                      <div className="text-[10px] text-slate-500">প্রশ্ন</div>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {s.durationMinutes} মি.
                      </div>
                      <div className="text-[10px] text-slate-500">সময়</div>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {s.passingMarks}/{s.totalMarks}
                      </div>
                      <div className="text-[10px] text-slate-500">পাস মার্ক</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s.published ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    <span className="text-[10px] font-semibold text-slate-500">
                      {s.published ? 'প্রকাশিত' : 'ড্রাফট'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="এডিট"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col my-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingSet?.id ? 'MCQ সেট সম্পাদনা করুন' : 'নতুন MCQ সেট তৈরি করুন'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সেটের শিরোনাম (Title)
                </label>
                <input
                  type="text"
                  required
                  value={editingSet?.title || ''}
                  onChange={(e) => setEditingSet({ ...editingSet, title: e.target.value })}
                  placeholder="যেমন: SSC পদার্থবিজ্ঞান: গতি ও বল স্পেশাল MCQ সেট"
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণী
                  </label>
                  <select
                    value={editingSet?.classLevel || 'ssc'}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, classLevel: e.target.value as any })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="ssc">এসএসসি (SSC)</option>
                    <option value="hsc">এইচএসসি (HSC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিষয়
                  </label>
                  <select
                    value={editingSet?.subjectId || ''}
                    onChange={(e) => setEditingSet({ ...editingSet, subjectId: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {subjects
                      .filter((s) => s.classLevel === editingSet?.classLevel)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.banglaName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সময় (মিনিট)
                  </label>
                  <input
                    type="number"
                    value={editingSet?.durationMinutes || 15}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পাস মার্ক
                  </label>
                  <input
                    type="number"
                    value={editingSet?.passingMarks || 7}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, passingMarks: Number(e.target.value) })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কঠিনতা
                  </label>
                  <select
                    value={editingSet?.difficulty || 'medium'}
                    onChange={(e) =>
                      setEditingSet({ ...editingSet, difficulty: e.target.value as any })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white"
                  >
                    <option value="easy">সহজ</option>
                    <option value="medium">মাঝারি</option>
                    <option value="hard">কঠিন</option>
                  </select>
                </div>
              </div>

              {/* Question Picker */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    প্রশ্ন নির্বাচন ({selectedQuestionIds.length}টি নির্বাচিত)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedQuestionIds.length === availableMcqs.length) {
                        setSelectedQuestionIds([]);
                      } else {
                        setSelectedQuestionIds(availableMcqs.map((m) => m.id));
                      }
                    }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    {selectedQuestionIds.length === availableMcqs.length
                      ? 'সবগুলো বাতিল'
                      : 'সবগুলো সিলেক্ট করুন'}
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/50">
                  {availableMcqs.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      এই বিষয়ের জন্য কোন সংরক্ষিত MCQ পাওয়া যায়নি।
                    </div>
                  ) : (
                    availableMcqs.map((m) => {
                      const isChecked = selectedQuestionIds.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition text-xs border ${
                            isChecked
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleQuestion(m.id)}
                            className="mt-0.5 rounded text-indigo-600"
                          />
                          <div className="flex-1">
                            <span className="font-medium">{m.question}</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              সঠিক: {m.options[m.correctAnswer]} | {m.boardRef || 'বোর্ড প্র্যাকটিস'}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition disabled:opacity-50"
                >
                  {saveLoading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
