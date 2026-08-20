import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
}

// Helper to format raw latex math strings into readable math representations
function preprocessMarkdown(text: string): string {
  if (!text) return '';
  return text
    // Replace block math $$...$$ with blockquotes or styled code
    .replace(/\$\$(.*?)\$\$/gs, (_, math) => {
      const clean = math
        .trim()
        .replace(/\\vec{([A-Za-z]+)}/g, '$1⃗')
        .replace(/\\hat{([a-z]+)}/g, '$1̂')
        .replace(/\\sqrt{(.*?)}/g, '√($1)')
        .replace(/\\frac{(.*?)}{(.*?)}/g, '($1 / $2)')
        .replace(/\\cos/g, 'cos')
        .replace(/\\sin/g, 'sin')
        .replace(/\\tan/g, 'tan')
        .replace(/\\alpha/g, 'α')
        .replace(/\\theta/g, 'θ')
        .replace(/\\eta/g, 'η')
        .replace(/\\cdot/g, ' • ')
        .replace(/\\times/g, ' × ')
        .replace(/\\;/g, ' ')
        .replace(/\\text{(.*?)}/g, '$1');
      return `\n\n> 📐 **সূত্র:** \`${clean}\`\n\n`;
    })
    // Replace inline math $...$ with inline clean code
    .replace(/\$(.*?)\$/g, (_, math) => {
      const clean = math
        .trim()
        .replace(/\\vec{([A-Za-z]+)}/g, '$1⃗')
        .replace(/\\hat{([a-z]+)}/g, '$1̂')
        .replace(/\\sqrt{(.*?)}/g, '√($1)')
        .replace(/\\frac{(.*?)}{(.*?)}/g, '($1 / $2)')
        .replace(/\\cos/g, 'cos')
        .replace(/\\sin/g, 'sin')
        .replace(/\\tan/g, 'tan')
        .replace(/\\alpha/g, 'α')
        .replace(/\\theta/g, 'θ')
        .replace(/\\eta/g, 'η')
        .replace(/\\cdot/g, ' • ')
        .replace(/\\times/g, ' × ')
        .replace(/\\propto/g, '∝')
        .replace(/\\left\(/g, '(')
        .replace(/\\right\)/g, ')')
        .replace(/\\text{(.*?)}/g, '$1')
        .replace(/\\/g, '');
      return `\`${clean}\``;
    });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  fontSize = 'base'
}) => {
  const processed = preprocessMarkdown(content);

  const textSizeClass =
    fontSize === 'sm'
      ? 'text-sm'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl'
      : fontSize === 'xl'
      ? 'text-xl sm:text-2xl'
      : 'text-base sm:text-lg';

  return (
    <div
      className={`markdown-body text-slate-900 dark:text-slate-100 font-normal leading-relaxed ${textSizeClass} ${className}`}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-8 mb-4 pb-3 border-b-2 border-indigo-100 dark:border-slate-800 flex items-center gap-2.5">
              <span className="w-2.5 h-7 rounded-full bg-indigo-600 inline-block flex-shrink-0"></span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-950 dark:text-indigo-200 mt-8 mb-3.5 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-indigo-500 inline-block flex-shrink-0"></span>
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mt-6 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-bold text-indigo-900 dark:text-indigo-300 mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-800 dark:text-slate-200 my-3.5 leading-relaxed font-normal">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-950 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-indigo-950 dark:text-indigo-200 font-medium">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2.5 my-4 pl-6 list-disc marker:text-indigo-600 text-slate-800 dark:text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 my-4 pl-6 list-decimal marker:text-indigo-600 marker:font-bold text-slate-800 dark:text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-800 dark:text-slate-200 pl-1 leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 p-4 sm:p-5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border-l-4 border-indigo-600 text-slate-950 dark:text-indigo-100 shadow-sm not-italic">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-8 border-slate-200 dark:border-slate-800" />
          ),
          pre: ({ children, ...props }: any) => (
            <pre
              className="my-5 rounded-2xl p-4 sm:p-5 bg-slate-950 text-emerald-400 font-mono text-sm sm:text-base overflow-x-auto leading-relaxed border border-slate-800 shadow-md"
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ className: codeClass, children, ...props }: any) => {
            const isCodeBlock = codeClass && codeClass.includes('language-');
            if (isCodeBlock) {
              return (
                <code className={codeClass} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="px-2 py-0.5 mx-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-mono text-sm font-bold border border-indigo-200/80 dark:border-indigo-800 inline-block"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-indigo-50 dark:bg-indigo-950 border-b border-indigo-100 dark:border-indigo-900 text-slate-950 dark:text-white font-bold">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="p-3.5 font-bold text-slate-950 dark:text-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="p-3.5 text-slate-800 dark:text-slate-200">{children}</td>
          )
        }}
      >
        {processed}
      </Markdown>
    </div>
  );
};
