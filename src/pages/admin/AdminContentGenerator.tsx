import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  FileText,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  Save,
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
  Printer,
  FileDown
} from 'lucide-react';
import {
  Subject,
  Chapter,
  ContentGeneratorType,
  MCQDifficulty,
  GeneratedContentPayload,
  GeneratedContentResult,
  Note,
  MCQ,
  ImportantQuestion
} from '../../types';
import {
  getSubjects,
  getChapters,
  saveNote,
  saveMCQ,
  saveImportantQuestion,
  saveMCQSet,
  checkDuplicateContent,
  saveDraftLocally,
  getDraftLocally,
  clearDraftLocally
} from '../../services/dataService';
import { generateCurriculumContent } from '../../services/aiContentGenerator';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';

interface AdminContentGeneratorProps {
  onNavigateTab?: (tab: string) => void;
}

export const AdminContentGenerator: React.FC<AdminContentGeneratorProps> = ({ onNavigateTab }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [classLevel, setClassLevel] = useState<'ssc' | 'hsc'>('ssc');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [contentType, setContentType] = useState<ContentGeneratorType>('hand_note');
  const [difficulty, setDifficulty] = useState<MCQDifficulty>('medium');
  const [mcqCount, setMcqCount] = useState<number>(10);
  const [language, setLanguage] = useState<'bangla' | 'english' | 'both'>('bangla');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [board, setBoard] = useState<string>('সকল বোর্ড স্পেশাল');

  // Generation & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedContentResult | null>(null);
  const [activeView, setActiveView] = useState<'preview' | 'raw'>('preview');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingInitial(true);
    const [subList, chapList] = await Promise.all([getSubjects(), getChapters()]);
    setSubjects(subList);
    setChapters(chapList);

    const sscSubs = subList.filter((s) => s.classLevel === 'ssc');
    if (sscSubs.length > 0) {
      setSelectedSubjectId(sscSubs[0].id);
      const chaps = chapList.filter((c) => c.subjectId === sscSubs[0].id);
      if (chaps.length > 0) {
        setSelectedChapterId(chaps[0].id);
      }
    }

    // Check for autosaved generator draft
    const draft = getDraftLocally<GeneratedContentResult>('content_generator_last');
    if (draft && draft.data) {
      setResult(draft.data);
    }

    setLoadingInitial(false);
  };

  const handleClassChange = (lvl: 'ssc' | 'hsc') => {
    setClassLevel(lvl);
    const filteredSubs = subjects.filter((s) => s.classLevel === lvl);
    if (filteredSubs.length > 0) {
      setSelectedSubjectId(filteredSubs[0].id);
      const chaps = chapters.filter((c) => c.subjectId === filteredSubs[0].id);
      setSelectedChapterId(chaps.length > 0 ? chaps[0].id : '');
    } else {
      setSelectedSubjectId('');
      setSelectedChapterId('');
    }
  };

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    const chaps = chapters.filter((c) => c.subjectId === subId);
    setSelectedChapterId(chaps.length > 0 ? chaps[0].id : '');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveStatus(null);
    setDuplicateWarning(null);

    const currentSub = subjects.find((s) => s.id === selectedSubjectId);
    const currentChap = chapters.find((c) => c.id === selectedChapterId);

    const payload: GeneratedContentPayload = {
      classLevel,
      subjectId: selectedSubjectId,
      chapterId: selectedChapterId || undefined,
      contentType,
      difficulty,
      mcqCount,
      language,
      customTopicOrTitle: customTopic.trim() || undefined,
      board
    };

    try {
      const generated = await generateCurriculumContent(payload, currentSub, currentChap);
      setResult(generated);
      saveDraftLocally('content_generator_last', generated);

      // Check if duplicate already exists in DB
      if (contentType === 'hand_note' || contentType === 'short_note' || contentType === 'revision_note') {
        const dupCheck = await checkDuplicateContent('note', generated.title);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(dupCheck.reason || 'সতর্কতা: একই শিরোনামের নোট ইতিমধ্যে সংরক্ষিত রয়েছে।');
        }
      }
    } catch (e) {
      console.error('Generation failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!result) return;
    setSaveStatus('সংরক্ষণ হচ্ছে...');

    try {
      const currentSub = subjects.find((s) => s.id === selectedSubjectId);
      const currentChap = chapters.find((c) => c.id === selectedChapterId);
      const now = new Date().toISOString();

      if (
        result.contentType === 'hand_note' ||
        result.contentType === 'short_note' ||
        result.contentType === 'revision_note' ||
        result.contentType === 'formula_sheet'
      ) {
        const slug = `${classLevel}-${(currentSub?.name || 'sub').toLowerCase()}-${Date.now().toString(36)}`;
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title: result.title,
          slug,
          classLevel,
          subjectId: selectedSubjectId,
          chapterId: selectedChapterId || 'general',
          content: result.content,
          summary: result.summary || 'এডুমাস্টার বিডি কারিকুলাম নোট',
          author: 'EduMaster BD Academic Editorial',
          isPremium: false,
          published: true,
          views: 1,
          readingTimeMinutes: Math.max(3, Math.ceil(result.content.split(/\s+/).length / 150)),
          tags: result.tags || [classLevel.toUpperCase(), currentSub?.name || 'Academic'],
          publishedAt: now,
          createdAt: now,
          updatedAt: now
        };
        await saveNote(newNote);
        setSaveStatus('✅ সফলভাবে হ্যান্ডনোট ডেটাবেজে প্রকাশিত হয়েছে!');
      } else if (result.contentType === 'mcq' || result.contentType === 'mcq_set') {
        if (result.mcqs && result.mcqs.length > 0) {
          const mcqIds: string[] = [];
          for (const m of result.mcqs) {
            const mcqObj: MCQ = {
              id: m.id || `mcq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              question: m.question || 'প্রশ্ন',
              options: m.options || ['ক', 'খ', 'গ', 'ঘ'],
              correctAnswer: m.correctAnswer ?? 0,
              explanation: m.explanation || '',
              classLevel,
              subjectId: selectedSubjectId,
              chapterId: selectedChapterId || 'general',
              difficulty: m.difficulty || difficulty,
              boardRef: m.boardRef || `${board} স্পেশাল`,
              tags: result.tags || [classLevel.toUpperCase()],
              createdAt: now
            };
            await saveMCQ(mcqObj);
            mcqIds.push(mcqObj.id);
          }

          // Also save as MCQ Set
          await saveMCQSet({
            id: `set-${Date.now()}`,
            title: result.title,
            description: result.summary,
            classLevel,
            subjectId: selectedSubjectId,
            chapterId: selectedChapterId,
            difficulty,
            durationMinutes: Math.ceil(mcqIds.length * 1.2),
            totalQuestions: mcqIds.length,
            totalMarks: mcqIds.length,
            passingMarks: Math.ceil(mcqIds.length * 0.7),
            questionIds: mcqIds,
            published: true,
            attemptsCount: 0,
            tags: result.tags,
            createdAt: now,
            updatedAt: now
          });
          setSaveStatus(`✅ সফলভাবে ${mcqIds.length}টি MCQ ও নতুন সেট সংরক্ষণ করা হয়েছে!`);
        }
      } else if (result.contentType === 'important_questions') {
        if (result.importantQuestions && result.importantQuestions.length > 0) {
          for (const q of result.importantQuestions) {
            const iqObj: ImportantQuestion = {
              id: `iq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              title: q.title || result.title,
              questionText: q.questionText || '',
              answerText: q.answerText || '',
              classLevel,
              subjectId: selectedSubjectId,
              chapterId: selectedChapterId,
              category: q.category || 'অনুধাবনমূলক (Comprehension)',
              board: q.board || board,
              year: q.year || 2024,
              importantRating: q.importantRating || 5,
              tags: result.tags,
              published: true,
              createdAt: now,
              updatedAt: now
            };
            await saveImportantQuestion(iqObj);
          }
          setSaveStatus(`✅ সফলভাবে ${result.importantQuestions.length}টি গুরুত্বপূর্ণ প্রশ্ন সংরক্ষণ করা হয়েছে!`);
        }
      }
    } catch (e) {
      console.error('Save to DB error:', e);
      setSaveStatus('❌ সংরক্ষণে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।');
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/[^\w\u0980-\u09FF]+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSubjects = subjects.filter((s) => s.classLevel === classLevel);
  const filteredChapters = chapters.filter((c) => c.subjectId === selectedSubjectId);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>EduMaster BD Curriculum & AI Content Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            অটোমেটেড কারিকুলাম ও নোট জেনারেটর
          </h1>
          <p className="mt-2 text-sm text-indigo-100/80 leading-relaxed">
            জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) এর সিলেবাস অনুসারে এসএসসি ও এইচএসসি সকল বিষয়ের ১০০% মৌলিক হ্যান্ডনোট, বহুনির্বাচনী প্রশ্ন (MCQ), মডেল টেস্ট, গুরুত্বপূর্ণ সৃজনশীল প্রশ্ন ও সূত্রের শিট তৈরি ও সরাসরি পাবলিশ করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Generator Configuration Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                কনটেন্ট কনফিগারেশন
              </h2>
              <span className="text-xs text-slate-500">বোর্ড স্ট্যান্ডার্ড</span>
            </div>

            {/* Class Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                শ্রেণী নির্বাচন (Class Level)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleClassChange('ssc')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    classLevel === 'ssc'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  এসএসসি (SSC - 9 & 10)
                </button>
                <button
                  type="button"
                  onClick={() => handleClassChange('hsc')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                    classLevel === 'hsc'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  এইচএসসি (HSC - 11 & 12)
                </button>
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                বিষয় (Subject)
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {filteredSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.banglaName} ({s.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                অধ্যায় (Chapter)
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {filteredChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.banglaTitle || c.title}
                  </option>
                ))}
                {filteredChapters.length === 0 && <option value="">কোন অধ্যায় পাওয়া যায়নি (কাস্টম টপিক দিন)</option>}
              </select>
            </div>

            {/* Content Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                কনটেন্টের ধরণ (Content Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hand_note', label: 'হ্যান্ডনোট (Full Hand Note)', icon: FileText },
                  { id: 'short_note', label: 'শর্ট নোট (Short Summary)', icon: BookOpen },
                  { id: 'revision_note', label: 'রিভিশন শিট (Revision Note)', icon: RefreshCw },
                  { id: 'formula_sheet', label: 'সূত্র শিট (Formula Sheet)', icon: Zap },
                  { id: 'mcq_set', label: 'MCQ প্রশ্ন ব্যাংক', icon: Zap },
                  { id: 'model_test', label: 'মডেল টেস্ট (Model Test)', icon: Sparkles },
                  { id: 'important_questions', label: 'সৃজনশীল ও ক/খ প্রশ্ন', icon: FileCheck2 }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = contentType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setContentType(item.id as ContentGeneratorType)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold transition border flex items-center gap-2 ${
                        active
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MCQ or Model Test specifics */}
            {(contentType === 'mcq_set' || contentType === 'model_test') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  প্রশ্ন সংখ্যা (Questions Count)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 25].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setMcqCount(cnt)}
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        mcqCount === cnt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cnt} টি
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty & Board */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  কঠিনতার মাত্রা
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as MCQDifficulty)}
                  className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                >
                  <option value="easy">সহজ (Easy - Basic)</option>
                  <option value="medium">মাঝারি (Medium - Board Standard)</option>
                  <option value="hard">কঠিন (Hard - Advanced / CQ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  বোর্ড ফোকাস
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                >
                  <option value="সকল বোর্ড স্পেশাল">সকল বোর্ড (জাতীয়)</option>
                  <option value="ঢাকা বোর্ড">ঢাকা বোর্ড</option>
                  <option value="চট্টগ্রাম বোর্ড">চট্টগ্রাম বোর্ড</option>
                  <option value="রাজশাহী বোর্ড">রাজশাহী বোর্ড</option>
                  <option value="যশোর বোর্ড">যশোর বোর্ড</option>
                  <option value="দিনাজপুর বোর্ড">দিনাজপুর বোর্ড</option>
                  <option value="কুমিল্লা বোর্ড">কুমিল্লা বোর্ড</option>
                </select>
              </div>
            </div>

            {/* Custom Topic/Focus */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                কাস্টম টপিক বা শিরোনাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="যেমন: গতি সমীকরণ ও গ্রাফিক্যাল বিশ্লেষণ"
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>কারিকুলাম কনটেন্ট জেনারেট হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>কনটেন্ট জেনারেট করুন (Generate Now)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Preview & Action Hub */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col">
              {/* Preview Action Header */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-md">
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {result.contentType.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {result.content.split(/\s+/).length} শব্দ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView(activeView === 'preview' ? 'raw' : 'preview')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{activeView === 'preview' ? 'Markdown কোড' : 'রিচ ভিউ'}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ডাউনলোড</span>
                  </button>
                </div>
              </div>

              {/* Duplicate Warning if any */}
              {duplicateWarning && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Live Render Area */}
              <div className="p-6 max-h-[600px] overflow-y-auto bg-white dark:bg-slate-950">
                {activeView === 'preview' ? (
                  <MarkdownRenderer content={result.content} />
                ) : (
                  <textarea
                    value={result.content}
                    onChange={(e) => setResult({ ...result, content: e.target.value })}
                    rows={20}
                    className="w-full font-mono text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none"
                  />
                )}
              </div>

              {/* Bottom Publishing Bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {saveStatus ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{saveStatus}</span>
                  ) : (
                    <span>এই কনটেন্ট সরাসরি ওয়েবসাইটে পাবলিশ করতে ডানদিকের বাটনে চাপুন।</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToDatabase}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>ডেটাবেজে প্রকাশ করুন (Publish Now)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                কোন কনটেন্ট এখনো জেনারেট করা হয়নি
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                বামদিকের প্যানেল থেকে বিষয়, অধ্যায় ও কনটেন্টের ধরণ নির্বাচন করে "কনটেন্ট জেনারেট করুন" বাটনে ক্লিক করুন।
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition"
              >
                নমুনা হ্যান্ডনোট তৈরি করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
