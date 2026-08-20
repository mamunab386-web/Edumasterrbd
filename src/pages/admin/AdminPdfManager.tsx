import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Download, FileText } from 'lucide-react';
import { getPDFs, getSubjects, savePDF, deletePDF } from '../../services/dataService';
import { PDFResource, Subject } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminPdfManager: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDFResource | null>(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<Partial<PDFResource>>({
    title: '',
    classLevel: 'ssc',
    subjectId: '',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSizeMB: 2.5,
    pageCount: 15,
    description: '',
    published: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
  });

  const load = async () => {
    const [pList, sList] = await Promise.all([getPDFs(), getSubjects()]);
    setPdfs(pList);
    setSubjects(sList);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingPdf(null);
    setFormData({
      id: 'pdf-' + Date.now(),
      title: '',
      classLevel: 'ssc',
      subjectId: subjects[0]?.id || '',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSizeMB: 2.5,
      pageCount: 15,
      description: '',
      published: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pdf: PDFResource) => {
    setEditingPdf(pdf);
    setFormData(pdf);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি এই PDF টি মুছে ফেলতে চান?')) return;
    await deletePDF(id);
    showToast('PDF মুছে ফেলা হয়েছে', 'info');
    load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      showToast('শিরোনাম ও ফাইল লিংক প্রদান করুন', 'error');
      return;
    }

    const pdfToSave: PDFResource = {
      id: editingPdf ? editingPdf.id : formData.id || 'pdf-' + Date.now(),
      title: formData.title || '',
      classLevel: formData.classLevel || 'ssc',
      subjectId: formData.subjectId || subjects[0]?.id || '',
      fileUrl: formData.fileUrl || '',
      fileSizeMB: Number(formData.fileSizeMB) || 1.5,
      pageCount: Number(formData.pageCount) || 10,
      description: formData.description || '',
      downloadCount: editingPdf?.downloadCount || 0,
      published: formData.published ?? true,
      uploadedAt: editingPdf?.uploadedAt || new Date().toISOString().split('T')[0],
      thumbnailUrl: formData.thumbnailUrl || ''
    };

    await savePDF(pdfToSave);
    showToast('PDF ফাইল সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    setIsModalOpen(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            PDF লাইব্রেরি ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">হ্যান্ডনোট, ফর্মুলা শিট ও সাজেশন ফাইল আপলোড করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন PDF যুক্ত করুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {pdfs.map((pdf) => (
          <GlassCard
            key={pdf.id}
            className="p-4 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {pdf.classLevel.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {pdf.fileSizeMB} MB • {pdf.pageCount} পৃষ্ঠা • {pdf.downloadCount} বার ডাউনলোড
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pdf.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenEdit(pdf)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(pdf.id)}
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
        maxWidth="lg"
        title={editingPdf ? 'PDF রিসোর্স সম্পাদনা' : 'নতুন PDF রিসোর্স যোগ করুন'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">ফাইলের শিরোনাম *</label>
            <input
              type="text"
              required
              placeholder="যেমন: পদার্থবিজ্ঞান ১ম পত্র সকল সূত্রের পিডিএফ শিট"
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

          <div>
            <label className="font-semibold block mb-1">সরাসরি ফাইল ডাউনলোড URL *</label>
            <input
              type="url"
              required
              placeholder="https://example.com/file.pdf"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">সাইজ (MB)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fileSizeMB}
                onChange={(e) => setFormData({ ...formData, fileSizeMB: parseFloat(e.target.value) || 1 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">পৃষ্ঠা সংখ্যা</label>
              <input
                type="number"
                min={1}
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) || 1 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">বিবরণ</label>
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
