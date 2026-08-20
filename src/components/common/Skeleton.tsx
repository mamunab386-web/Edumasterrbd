import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-shimmer">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-2/3 h-4 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
        <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-16 h-6 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-xl p-4 flex items-center justify-between animate-shimmer"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
            <div className="space-y-1.5 w-3/4">
              <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-1/3 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="w-20 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
};
