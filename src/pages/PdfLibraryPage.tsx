import React, { useEffect, useState } from 'react';
import {
  Download,
  FileText,
  Search,
  ExternalLink,
  Sparkles,
  Share2,
  CheckCircle2,
  Eye,
  Filter
} from 'lucide-react';
import { getPDFs, getSubjects, incrementPdfDownloads } from '../services/dataService';
import { PDFResource, Subject } from '../types';
import { GlassCard } from '../components/common/GlassCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

interface PdfLibraryPageProps {
  pdfId?: string;
  navigate: (to: string) => void;
  initialClass?: 'ssc' | 'hsc';
}

export const PdfLibraryPage: React.FC<PdfLibraryPageProps> = ({
  pdfId,
  navigate,
  initialClass
}) => {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<'all' | 'ssc' | 'hsc'>(initialClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const [pList, sList] = await Promise.all([getPDFs(), getSubjects()]);
      setPdfs(pList.filter((p) => p.published));
      setSubjects(sList);
    }
    load();
  }, []);

  const handleDownload = async (pdf: PDFResource) => {
    await incrementPdfDownloads(pdf.id);
    showToast(`"${pdf.title}" ডাউনলোড শুরু হয়েছে!`, 'success');
    window.open(pdf.fileUrl, '_blank');
  };

  const filteredPdfs = pdfs.filter((p) => {
    const matchClass = selectedClass === 'all' || p.classLevel === selectedClass;
    const matchSub = selectedSubject === 'all' || p.subjectId === selectedSubject;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSub && matchSearch;
  });

  const selectedPdf = pdfId ? pdfs.find((p) => p.id === pdfId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'PDF রিসোর্স লাইব্রেরি' }]} navigate={navigate} />

      {/* Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider inline-block">
            ডিজিটাল লাইব্রেরি
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ফ্রি PDF হ্যান্ডনোট, ফর্মুলা শিট ও সাজেশন
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            পরীক্ষার আগের রাতের রিভিশনের জন্য প্রিন্ট ও সেভ উপযোগী এইচডি কোয়ালিটির পিডিএফ ফাইল।
            এক ক্লিকেই ডাউনলোড করুন সরাসরি আপনার ডিভাইসে।
          </p>
        </div>
      </div>

      {/* Single PDF Detailed Modal/View if pdfId exists */}
      {selectedPdf && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold uppercase">
                {selectedPdf.classLevel.toUpperCase()} PDF
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedPdf.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {selectedPdf.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(selectedPdf)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>সরাসরি ডাউনলোড ({selectedPdf.fileSizeMB} MB)</span>
              </button>
              <button
                onClick={() => navigate('/pdf')}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">ফাইল সাইজ</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedPdf.fileSizeMB} MB
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">পৃষ্ঠা সংখ্যা</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedPdf.pageCount} পৃষ্ঠা
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">মোট ডাউনলোড</span>
              <span className="font-bold text-emerald-600">
                {selectedPdf.downloadCount} বার
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">আপলোড তারিখ</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedPdf.uploadedAt}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PDF খুঁজুন (যেমন: সূত্র, সাজেশন)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
            {[
              { id: 'all', label: 'সকল ক্লাস' },
              { id: 'ssc', label: 'SSC' },
              { id: 'hsc', label: 'HSC' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedClass(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedClass === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
          >
            <option value="all">সকল বিষয়</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.banglaName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PDF List Grid */}
      {filteredPdfs.length === 0 ? (
        <EmptyState
          title="কোনো PDF ফাইল পাওয়া যায়নি"
          description="অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করুন।"
          actionText="ফিল্টার রিসেট করুন"
          onAction={() => {
            setSelectedClass('all');
            setSelectedSubject('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map((pdf) => (
            <GlassCard
              key={pdf.id}
              className="border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-emerald-400"
            >
              <div>
                <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative mb-4">
                  {pdf.thumbnailUrl ? (
                    <img
                      src={pdf.thumbnailUrl}
                      alt={pdf.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    {pdf.classLevel.toUpperCase()} PDF
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                  {pdf.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {pdf.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 py-3 border-t border-slate-100 dark:border-slate-800 mb-3">
                  <span>{pdf.fileSizeMB} MB • {pdf.pageCount} পৃষ্ঠা</span>
                  <span className="text-emerald-600 font-semibold">{pdf.downloadCount} ডাউনলোড</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/pdf/${pdf.id}`)}
                    className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিবরণ</span>
                  </button>

                  <button
                    onClick={() => handleDownload(pdf)}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ডাউনলোড</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
