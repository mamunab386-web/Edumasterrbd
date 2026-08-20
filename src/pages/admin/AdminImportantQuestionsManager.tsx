import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  Edit,
  Search,
  Star,
  BookOpen,
  Filter,
  CheckCircle2,
  Sparkles,
  Eye,
  Layers
} from 'lucide-react';
import { ImportantQuestion, QuestionCategory, Subject, Chapter } from '../../types';
import {
  getImportantQuestions,
  saveImportantQuestion,
  deleteImportantQuestion,
  getSubjects,
  getChapters
} from '../../services/dataService';

export const AdminImportantQuestionsManager: React.FC = () => {
  const [questions, setQuestions] = useState<ImportantQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<Partial<ImportantQuestion> | null>(null);
  const [previewQ, setPreviewQ] = useState<ImportantQuestion | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const categories: QuestionCategory[] = [
    'জ্ঞানমূলক (Knowledge)',
    'অনুধাবনমূলক (Comprehension)',
    'প্রয়োগমূলক (Application)',
    'উচ্চতর দক্ষতা (Higher Ability)',
    'CQ সৃজনশীল',
    'সাজেশন'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [qList, subList, chapList] = await Promise.all([
      getImportantQuestions(),
      getSubjects(),
      getChapters()
    ]);
    setQuestions(qList);
    setSubjects(subList);
    setChapters(chapList);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingQ({
      title: '',
      questionText: '',
      answerText: '',
      classLevel: 'ssc',
      subjectId: subjects.find((s) => s.classLevel === 'ssc')?.id || '',
      chapterId: '',
      category: 'জ্ঞানমূলক (Knowledge)',
      board: 'সকল বোর্ড স্পেশাল',
      year: 2024,
      importantRating: 5,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: ImportantQuestion) => {
    setEditingQ({ ...q });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?')) return;
    await deleteImportantQuestion(id);
    await loadData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQ?.questionText || !editingQ?.answerText || !editingQ?.subjectId) return;

    setSaveLoading(true);
    const iq: ImportantQuestion = {
      id: editingQ.id || `iq-${Date.now()}`,
      title: editingQ.title || editingQ.questionText.slice(0, 50),
      questionText: editingQ.questionText,
      answerText: editingQ.answerText,
      classLevel: (editingQ.classLevel as any) || 'ssc',
      subjectId: editingQ.subjectId,
      chapterId: editingQ.chapterId || undefined,
      category: (editingQ.category as any) || 'জ্ঞানমূলক (Knowledge)',
      board: editingQ.board || 'সকল বোর্ড',
      year: Number(editingQ.year) || 2024,
      importantRating: Number(editingQ.importantRating) || 5,
      tags: editingQ.tags || ['Important'],
      published: editingQ.published ?? true,
      createdAt: editingQ.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveImportantQuestion(iq);
    setSaveLoading(false);
    setIsModalOpen(false);
    await loadData();
  };

  // Filtered
  const filteredQuestions = questions.filter((q) => {
    const matchClass = selectedClass === 'all' || q.classLevel === selectedClass;
    const matchCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchSub = selectedSubject === 'all' || q.subjectId === selectedSubject;
    const matchSearch =
      !searchQuery ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.board && q.board.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchClass && matchCategory && matchSub && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            গুরুত্বপূর্ণ প্রশ্ন ও বোর্ড সাজেশন ব্যাংক (CQ/ক/খ)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            এসএসসি ও এইচএসসি পরীক্ষার কমন উপযোগী জ্ঞানমূলক, অনুধাবনমূলক ও সৃজনশীল প্রশ্ন-উত্তর ডাটাবেজ।
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রশ্ন যোগ করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রশ্ন বা বিষয় খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white outline-none"
        >
          <option value="all">সকল শ্রেণী</option>
          <option value="ssc">এসএসসি (SSC)</option>
          <option value="hsc">এইচএসসি (HSC)</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white outline-none"
        >
          <option value="all">সকল ক্যাটাগরি (ক, খ, গ, ঘ)</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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

      {/* Question Table / Cards */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">লোড হচ্ছে...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <FileCheck2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">কোন প্রশ্ন পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            কারিকুলাম জেনারেটর অথবা উপরের বাটন ব্যবহার করে প্রশ্ন যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const sub = subjects.find((s) => s.id === q.subjectId);
            return (
              <div
                key={q.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.classLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{sub?.banglaName}</span>
                    {q.board && (
                      <span className="text-xs text-slate-400">
                        • {q.board} ({q.year})
                      </span>
                    )}
                    <div className="flex items-center text-amber-500 ml-auto sm:ml-0">
                      {Array.from({ length: q.importantRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {q.questionText}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <span className="font-bold text-slate-700 dark:text-slate-300">উত্তর: </span>
                    {q.answerText}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setPreviewQ(q)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="সম্পূর্ণ দেখুন"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="এডিট"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 max-w-2xl w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600">{previewQ.category}</span>
              <button
                onClick={() => setPreviewQ(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                বন্ধ করুন
              </button>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              প্রশ্ন: {previewQ.questionText}
            </h3>
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আদর্শ ও নির্ভুল উত্তর:
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {previewQ.answerText}
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>রেফারেন্স: {previewQ.board} ({previewQ.year})</span>
              <span>গুরুত্ব রেটিং: {previewQ.importantRating || 5} স্টার</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 my-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingQ?.id ? 'প্রশ্ন সম্পাদনা করুন' : 'নতুন গুরুত্বপূর্ণ প্রশ্ন যোগ করুন'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণী
                  </label>
                  <select
                    value={editingQ?.classLevel || 'ssc'}
                    onChange={(e) =>
                      setEditingQ({ ...editingQ, classLevel: e.target.value as any })
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
                    value={editingQ?.subjectId || ''}
                    onChange={(e) => setEditingQ({ ...editingQ, subjectId: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {subjects
                      .filter((s) => s.classLevel === editingQ?.classLevel)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.banglaName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingQ?.category || 'জ্ঞানমূলক (Knowledge)'}
                    onChange={(e) => setEditingQ({ ...editingQ, category: e.target.value as any })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বোর্ড রেফারেন্স
                  </label>
                  <input
                    type="text"
                    value={editingQ?.board || ''}
                    onChange={(e) => setEditingQ({ ...editingQ, board: e.target.value })}
                    placeholder="যেমন: ঢাকা বোর্ড ২০২৪"
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রশ্নটি লিখুন (Question)
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingQ?.questionText || ''}
                  onChange={(e) => setEditingQ({ ...editingQ, questionText: e.target.value })}
                  placeholder="যেমন: স্থির অবস্থান থেকে মুক্তভাবে পড়ন্ত বস্তুর বেগ সময়ের সমানুপাতিক—ব্যাখ্যা কর।"
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আদর্শ উত্তর (Model Answer)
                </label>
                <textarea
                  required
                  rows={5}
                  value={editingQ?.answerText || ''}
                  onChange={(e) => setEditingQ({ ...editingQ, answerText: e.target.value })}
                  placeholder="বোর্ড স্ট্যান্ডার্ড পূর্ণাঙ্গ উত্তর লিখুন..."
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                />
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
