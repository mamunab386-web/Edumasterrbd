import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  gradient: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  gradient,
  trend
}) => {
  // Safe dynamic icon resolver
  const IconComponent = (Icons as any)[iconName] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
      />
    </motion.div>
  );
};
