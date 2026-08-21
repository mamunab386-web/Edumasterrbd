import React, { useEffect, useState } from 'react';
import { getAdSettings } from '../../services/dataService';
import { AdSettings, SingleAdPlacement } from '../../types';
import { ExternalLink, Info, Sparkles, X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdBannerProps {
  placement: 'headerTop' | 'sidebar' | 'inNoteContent' | 'testResult' | 'stickyFooter';
  className?: string;
  navigate?: (to: string) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '', navigate }) => {
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAdSettings().then((settings) => {
      if (mounted) setAdSettings(settings);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!adSettings || !adSettings.globalEnabled || dismissed) {
    return null;
  }

  const slot: SingleAdPlacement | undefined = adSettings.placements[placement];
  if (!slot || !slot.enabled) {
    return null;
  }

  const isTestMode = adSettings.testMode;

  // 1. Sticky Footer Special Layout
  if (placement === 'stickyFooter') {
    return (
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 text-white border-t border-indigo-500/30 backdrop-blur-xl shadow-2xl px-4 py-2.5"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="shrink-0 px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase">
                  Ad / স্পন্সর
                </span>
                <p className="text-xs sm:text-sm font-semibold truncate text-slate-100">
                  {slot.customBanner?.caption || slot.customBanner?.altText || 'EduMaster স্পেশাল মডেল টেস্ট ও হ্যান্ডনোট প্যাকেজ'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {slot.customBanner?.targetUrl && (
                  <button
                    onClick={() => {
                      if (slot.customBanner?.targetUrl.startsWith('http')) {
                        window.open(slot.customBanner.targetUrl, '_blank', 'noopener,noreferrer');
                      } else if (navigate) {
                        navigate(slot.customBanner.targetUrl);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>দেখুন</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="বিজ্ঞাপন বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // 2. Custom Banner Type
  if (slot.type === 'custom_banner' && slot.customBanner?.imageUrl) {
    const handleBannerClick = () => {
      const url = slot.customBanner?.targetUrl;
      if (!url) return;
      if (url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (navigate) {
        navigate(url);
      }
    };

    return (
      <div
        className={`ad-container overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 relative group transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600 ${className}`}
      >
        {/* Sponsored Label */}
        <div className="flex items-center justify-between px-3 py-1 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-amber-500" />
            <span>স্পন্সরড বিজ্ঞাপন ({slot.banglaName})</span>
          </div>
          {isTestMode && (
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold">
              টেস্ট মোড • {slot.recommendedSize}
            </span>
          )}
        </div>

        {/* Clickable Banner Image & Caption */}
        <div
          onClick={handleBannerClick}
          className="cursor-pointer block relative overflow-hidden group"
        >
          <div className="relative h-28 sm:h-36 w-full overflow-hidden bg-slate-900">
            <img
              src={slot.customBanner.imageUrl}
              alt={slot.customBanner.altText || 'বিজ্ঞাপন ব্যানার'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow-md">
                {slot.customBanner.altText}
              </p>
              {slot.customBanner.caption && (
                <p className="text-[11px] text-indigo-200 font-medium mt-0.5 truncate drop-shadow">
                  {slot.customBanner.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. HTML / JavaScript Code Embed Type
  if (slot.type === 'html_code' && slot.htmlCode) {
    return (
      <div className={`ad-code-embed my-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-2 text-center ${className}`}>
        <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>বিজ্ঞাপন ({slot.banglaName})</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: slot.htmlCode }} />
      </div>
    );
  }

  // 4. Google AdSense Responsive Unit
  if (slot.type === 'adsense') {
    return (
      <div
        className={`ad-adsense-unit my-4 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800/60 p-4 bg-indigo-50/30 dark:bg-indigo-950/20 text-center ${className}`}
      >
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-2">
          <span>Google AdSense • {slot.banglaName}</span>
          <span className="font-mono">{slot.recommendedSize}</span>
        </div>

        {/* AdSense ins tag */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={adSettings.adsenseClientId || 'ca-pub-0000000000000000'}
          data-ad-slot={slot.adsenseSlotId || '0000000000'}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {isTestMode && (
          <div className="mt-2 py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
            <p className="font-bold">Google AdSense প্লেসমেন্ট প্রস্তুত</p>
            <p className="text-[11px] opacity-80 mt-0.5">
              Client: {adSettings.adsenseClientId || 'ca-pub-XXXXXXXXXXXX'} | Slot: {slot.adsenseSlotId || 'XXXXXXXXXX'}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};
