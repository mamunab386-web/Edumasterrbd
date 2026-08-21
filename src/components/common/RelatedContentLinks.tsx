import React from 'react';
import { BookOpen, FileText, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Note, PDFResource, MCQSet, BlogArticle, Subject } from '../../types';

interface RelatedContentLinksProps {
  currentSubjectId?: string;
  classLevel?: 'ssc' | 'hsc' | 'general';
  relatedNotes?: Note[];
  relatedPdfs?: PDFResource[];
  relatedMcqs?: MCQSet[];
  relatedBlogs?: BlogArticle[];
  relatedSubjects?: Subject[];
  navigate: (to: string) => void;
  title?: string;
}

export const RelatedContentLinks: React.FC<RelatedContentLinksProps> = ({
  relatedNotes = [],
  relatedPdfs = [],
  relatedMcqs = [],
  relatedBlogs = [],
  relatedSubjects = [],
  navigate,
  title = 'সম্পর্কিত প্রয়োজনীয় রিসোর্স ও লিঙ্ক'
}) => {
  const hasItems =
    relatedNotes.length > 0 ||
    relatedPdfs.length > 0 ||
    relatedMcqs.length > 0 ||
    relatedBlogs.length > 0 ||
    relatedSubjects.length > 0;

  if (!hasItems) return null;

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Related Notes */}
        {relatedNotes.slice(0, 3).map((note) => (
          <div
            key={note.id}
            onClick={() => navigate(`/notes/${note.slug}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>হ্যান্ডনোট</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {note.title}
              </h4>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{note.readingTimeMinutes} মিনিট পাঠ</span>
              <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                পড়ুন <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {/* Related PDFs */}
        {relatedPdfs.slice(0, 3).map((pdf) => (
          <div
            key={pdf.id}
            onClick={() => navigate(`/pdf?id=${pdf.id}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF রিসোর্স</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {pdf.title}
              </h4>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{pdf.pageCount} পৃষ্ঠা • {pdf.fileSizeMB} MB</span>
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                ডাউনলোড <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {/* Related MCQs */}
        {relatedMcqs.slice(0, 3).map((set) => (
          <div
            key={set.id}
            onClick={() => navigate(`/mcq?subject=${set.subjectId}&chapter=${set.chapterId}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MCQ সেট</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                {set.title}
              </h4>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{set.durationMinutes} মিনিট • {set.totalQuestions} প্রশ্ন</span>
              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                অনুশীলন করুন <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {/* Related Blogs */}
        {relatedBlogs.slice(0, 3).map((blog) => (
          <div
            key={blog.id}
            onClick={() => navigate(`/blog/${blog.slug}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-purple-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ব্লগ ও গাইডলাইন</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                {blog.title}
              </h4>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{blog.readTimeMinutes} মিনিট পাঠ</span>
              <span className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400 font-semibold">
                পড়ুন <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {/* Related Subjects */}
        {relatedSubjects.slice(0, 3).map((subj) => (
          <div
            key={subj.id}
            onClick={() => navigate(`/${subj.classLevel}/${subj.id}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-sky-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{subj.classLevel.toUpperCase()} বিষয়</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                {subj.banglaName} ({subj.name})
              </h4>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>সকল অধ্যায় ও নোট</span>
              <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400 font-semibold">
                প্রবেশ করুন <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
