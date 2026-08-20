import React from 'react';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'FileQuestion',
  actionText,
  onAction
}) => {
  const IconComponent = (Icons as any)[iconName] || Icons.Inbox;

  return (
    <div className="glass-card rounded-2xl p-10 sm:p-14 text-center max-w-md mx-auto my-8 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        <IconComponent className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1.5">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
