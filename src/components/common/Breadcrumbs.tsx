import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigate: (to: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigate }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <div
        className="inline-flex items-center"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          itemProp="item"
        >
          <Home className="w-3.5 h-3.5" />
          <span itemProp="name">হোম</span>
        </button>
        <meta itemProp="position" content="1" />
      </div>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const position = index + 2;
        return (
          <div
            key={index}
            className="inline-flex items-center gap-1.5"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </button>
            ) : (
              <span
                itemProp="name"
                className={`font-semibold ${isLast ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={position.toString()} />
          </div>
        );
      })}
    </nav>
  );
};
