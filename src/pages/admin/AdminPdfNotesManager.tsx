import React, { useState, useEffect } from 'react';
import {
  FileDown,
  Printer,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  BookOpen,
  Sparkles,
  Download,
  CheckCircle2,
  FileText,
  Layers
} from 'lucide-react';
import { PDFResource, Subject, Chapter } from '../../types';
import { getPDFs, savePDF, deletePDF, getSubjects, getChapters } from '../../services/dataService';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';

export const AdminPdfNotesManager: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Preview / Editor State
  const [activePreviewPdf, setActivePreviewPdf] = useState<PDFResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<Partial<PDFResource> | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pList, subList, chapList] = await Promise.all([
      getPDFs(),
      getSubjects(),
      getChapters()
    ]);
    setPdfs(pList);
    setSubjects(subList);
    setChapters(chapList);
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingPdf({
      title: '',
      description: '',
      classLevel: 'ssc',
      subjectId: subjects.find((s) => s.classLevel === 'ssc')?.id || '',
      chapterId: '',
      fileUrl: '#',
      fileSizeMB: 1.5,
      pageCount: 6,
      published: true,
      content: `# অধ্যায় পরিচিতি ও মূল শিখনফল\n\n## ভূমিকা\nএডুমাস্টার বিডি বিশেষ রিভিশন ও পূর্ণাঙ্গ হ্যান্ডনোট।\n\n## গুরুত্বপূর্ণ সূত্রাবলী ও বিশ্লেষণ\n- সূত্র ১: $v = u + at$\n- সূত্র ২: $s = ut + \\frac{1}{2}at^2$\n\n## বোর্ড পরীক্ষার সম্ভাব্য প্রশ্ন ও সমাধান\n১. **জ্ঞানমূলক:** সংজ্ঞা ও একক।\n২. **অনুধাবনমূলক:** কারণ ব্যাখ্যা ও গাণিতিক বিশ্লেষণ।\n\n--- \n*© EduMaster BD Editorial Board | Free Quality Education for Bangladesh*`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pdf: PDFResource) => {
    setEditingPdf({ ...pdf });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই PDF নোটটি মুছে ফেলতে চান?')) return;
    await deletePDF(id);
    await loadData();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPdf?.title || !editingPdf?.subjectId) return;

    setSaveLoading(true);
    const now = new Date().toISOString();
    const pdfToSave: PDFResource = {
      id: editingPdf.id || `pdf-${Date.now()}`,
      title: editingPdf.title,
      description: editingPdf.description || '',
      classLevel: (editingPdf.classLevel as any) || 'ssc',
      subjectId: editingPdf.subjectId,
      chapterId: editingPdf.chapterId || undefined,
      fileUrl: editingPdf.fileUrl || '#',
      fileSizeMB: Number(editingPdf.fileSizeMB) || 1.5,
      pageCount: Number(editingPdf.pageCount) || 8,
      downloadCount: editingPdf.downloadCount || 0,
      published: editingPdf.published ?? true,
      content: editingPdf.content || '',
      author: 'EduMaster Academic Panel',
      thumbnailUrl:
        editingPdf.thumbnailUrl ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      createdAt: editingPdf.createdAt || now,
      updatedAt: now
    };

    await savePDF(pdfToSave);
    setSaveLoading(false);
    setIsModalOpen(false);
    await loadData();
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPdfs = pdfs.filter((p) => {
    const matchClass = selectedClass === 'all' || p.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || p.subjectId === selectedSubject;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchClass && matchSub && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileDown className="w-5 h-5 text-indigo-600" />
            PDF হ্যান্ডনোট ও ডকুমেন্ট ম্যানেজার
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            প্রিন্ট ও ডাউনলোডের জন্য প্রস্তুত প্রফেশনাল A4 লেআউট হ্যান্ডনোট ও প্রশ্ন ব্যাংক তৈরি এবং পাবলিশ করুন।
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন PDF নোট তৈরি করুন</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PDF খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">লোড হচ্ছে...</div>
      ) : filteredPdfs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800">
          <FileDown className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">কোন PDF ডকুমেন্টস পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">উপরের বাটন দিয়ে নতুন PDF হ্যান্ডনোট তৈরি করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPdfs.map((pdf) => {
            const sub = subjects.find((s) => s.id === pdf.subjectId);
            return (
              <div
                key={pdf.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {pdf.classLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">{sub?.banglaName}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {pdf.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {pdf.description || 'এডুমাস্টার বিডি অফিসিয়াল কারিকুলাম PDF হ্যান্ডনোট'}
                  </p>

                  <div className="flex items-center gap-3 py-2 mt-3 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                    <span>📄 {pdf.pageCount} পৃষ্ঠা</span>
                    <span>💾 {pdf.fileSizeMB} MB</span>
                    <span>⬇️ {pdf.downloadCount || 0} ডাউনলোড</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <span
                    className={`text-[10px] font-bold ${
                      pdf.published ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {pdf.published ? '● প্রকাশিত' : '○ ড্রাফট'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActivePreviewPdf(pdf)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="A4 প্রিন্ট ভিউ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(pdf)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="সম্পাদনা"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pdf.id)}
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

      {/* A4 Print & Printable Document Preview Modal */}
      {activePreviewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto my-8 text-slate-900 dark:text-white">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-600 text-white">
                  PDF A4 Layout View
                </span>
                <span className="text-xs text-slate-500">{activePreviewPdf.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-indigo-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / Save PDF</span>
                </button>
                <button
                  onClick={() => setActivePreviewPdf(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

            {/* A4 Document Container */}
            <div className="p-8 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 shadow-inner">
              {/* Document Header Branding */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-indigo-600 mb-6">
                <div>
                  <h1 className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                    EduMaster BD
                  </h1>
                  <p className="text-[10px] text-slate-500">
                    বাংলাদেশ শিক্ষা বোর্ড অনুমোদিত কারিকুলাম সহায়িকা
                  </p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {activePreviewPdf.classLevel.toUpperCase()} স্পেশাল নোট
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {subjects.find((s) => s.id === activePreviewPdf.subjectId)?.banglaName}
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {activePreviewPdf.title}
                </h2>
                {activePreviewPdf.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {activePreviewPdf.description}
                  </p>
                )}
              </div>

              {/* Document Content */}
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed">
                {activePreviewPdf.content ? (
                  <MarkdownRenderer content={activePreviewPdf.content} />
                ) : (
                  <div className="text-slate-500 italic">
                    এই ডকুমেন্টে সরাসরি পাঠ্য যুক্ত নেই। ফাইল লিংক: {activePreviewPdf.fileUrl}
                  </div>
                )}
              </div>

              {/* Document Footer Branding */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>© EduMaster BD | edumasterbd.com</span>
                <span>Page 1 of {activePreviewPdf.pageCount || 1}</span>
                <span>For Educational Use Only</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-200 dark:border-slate-800 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingPdf?.id ? 'PDF নোট সম্পাদনা করুন' : 'নতুন PDF নোট তৈরি করুন'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-2 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিরোনাম (Title)
                </label>
                <input
                  type="text"
                  required
                  value={editingPdf?.title || ''}
                  onChange={(e) => setEditingPdf({ ...editingPdf, title: e.target.value })}
                  placeholder="যেমন: SSC পদার্থবিজ্ঞান গতি অধ্যায় A4 প্রিন্ট নোট"
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শ্রেণী
                  </label>
                  <select
                    value={editingPdf?.classLevel || 'ssc'}
                    onChange={(e) =>
                      setEditingPdf({ ...editingPdf, classLevel: e.target.value as any })
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
                    value={editingPdf?.subjectId || ''}
                    onChange={(e) => setEditingPdf({ ...editingPdf, subjectId: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                  >
                    {subjects
                      .filter((s) => s.classLevel === editingPdf?.classLevel)
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
                    পৃষ্ঠা সংখ্যা
                  </label>
                  <input
                    type="number"
                    value={editingPdf?.pageCount || 6}
                    onChange={(e) =>
                      setEditingPdf({ ...editingPdf, pageCount: Number(e.target.value) })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ফাইল সাইজ (MB)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPdf?.fileSizeMB || 1.5}
                    onChange={(e) =>
                      setEditingPdf({ ...editingPdf, fileSizeMB: Number(e.target.value) })
                    }
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <input
                  type="text"
                  value={editingPdf?.description || ''}
                  onChange={(e) => setEditingPdf({ ...editingPdf, description: e.target.value })}
                  placeholder="যেমন: গতি, বেগ, ত্বরণ ও গ্যালিলিওর সূত্রের প্রিন্ট রেডি নোট"
                  className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নোটের পূর্ণাঙ্গ পাঠ্য (Markdown / Text)
                </label>
                <textarea
                  rows={8}
                  value={editingPdf?.content || ''}
                  onChange={(e) => setEditingPdf({ ...editingPdf, content: e.target.value })}
                  placeholder="মার্কডাউন ফরম্যাটে নোট লিখুন..."
                  className="w-full font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-slate-900 dark:text-white outline-none"
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
