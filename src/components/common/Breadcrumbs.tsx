import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigate: (to: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <Home className="w-3.5 h-3.5" />
        <span>হোম</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
              >
                {item.label}
              </button>
            ) : (
              <span className={`font-semibold ${isLast ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
