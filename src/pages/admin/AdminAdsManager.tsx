import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  Image as ImageIcon,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Eye,
  DollarSign,
  TrendingUp,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { getAdSettings, saveAdSettings } from '../../services/dataService';
import { AdSettings, SingleAdPlacement, AdNetworkType } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';

export const AdminAdsManager: React.FC = () => {
  const [settings, setSettings] = useState<AdSettings | null>(null);
  const [activePlacementTab, setActivePlacementTab] = useState<keyof AdSettings['placements']>('headerTop');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    getAdSettings().then((data) => setSettings(data));
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveAdSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error('Failed to save ad settings:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const updateCurrentPlacement = (updated: Partial<SingleAdPlacement>) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        placements: {
          ...prev.placements,
          [activePlacementTab]: {
            ...prev.placements[activePlacementTab],
            ...updated
          }
        }
      };
    });
  };

  const currentPlacement = settings.placements[activePlacementTab];

  const placementTabs: { key: keyof AdSettings['placements']; label: string; size: string }[] = [
    { key: 'headerTop', label: 'হেডার টপ ব্যানার', size: '728x90 / Responsive' },
    { key: 'inNoteContent', label: 'হ্যান্ডনোটের মাঝে (In-Article)', size: '336x280 / Responsive' },
    { key: 'sidebar', label: 'সাইডবার ব্যানার', size: '300x250 / 300x600' },
    { key: 'testResult', label: 'মডেল টেস্ট রেজাল্ট পেজ', size: '728x90 / 336x280' },
    { key: 'stickyFooter', label: 'স্টিকি ফুটার ব্যানার', size: 'Responsive 728x90' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              বিজ্ঞাপন ও মনিটাইজেশন কন্ট্রোল
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              AdSense & Custom
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Google AdSense এবং নিজস্ব স্পন্সর ব্যানার বিজ্ঞাপনের প্লেসমেন্ট, কোড ও রেভিনিউ কনফিগারেশন
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>বিজ্ঞাপনের সকল সেটিংস ও প্লেসমেন্ট কনফিগারেশন সফলভাবে আপডেট হয়েছে!</span>
        </div>
      )}

      {/* 1. Global Ad Switches & Network Settings */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                মাস্টার মনিটাইজেশন কন্ট্রোল
              </h3>
              <p className="text-xs text-slate-500">
                সাইটের সকল বিজ্ঞাপনের কেন্দ্রীয় অন/অফ এবং Google AdSense প্রকাশক আইডি
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Master Ad Toggle */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                গ্লোবাল বিজ্ঞাপন চালু রাখুন
              </span>
              <span className="text-xs text-slate-500">
                এটি অফ করলে পুরো সাইটের সব বিজ্ঞাপন এক ক্লিকে হাইড হবে
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.globalEnabled}
                onChange={(e) => setSettings({ ...settings, globalEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Test / Preview Mode Toggle */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                টেস্ট ও প্রিভিউ মোড
              </span>
              <span className="text-xs text-slate-500">
                লাইভ করার আগে বিজ্ঞাপনের সাইজ ও পজিশন যাচাই করতে ট্যাগ শো করবে
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.testMode}
                onChange={(e) => setSettings({ ...settings, testMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* AdSense Publisher Client ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Google AdSense Publisher ID (Client ID)
            </label>
            <input
              type="text"
              value={settings.adsenseClientId}
              onChange={(e) => setSettings({ ...settings, adsenseClientId: e.target.value })}
              placeholder="e.g. ca-pub-9876543210123456"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Google AdSense ড্যাশবোর্ডের Settings &gt; Account Information থেকে আপনার Publisher ID কপি করুন।
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Custom Ad Network Header Script (Optional)
            </label>
            <input
              type="text"
              value={settings.customHeaderScript || ''}
              onChange={(e) => setSettings({ ...settings, customHeaderScript: e.target.value })}
              placeholder="<script async src='https://pagead2.googlesyndication.com...'></script>"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              অন্য কোনো অ্যাড নেটওয়ার্কের (যেমন Adsterra/Monetag) গ্লোবাল স্ক্রিপ্ট ট্যাগ।
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 2. Individual Placement Configuration */}
      <GlassCard className="p-6 space-y-6">
        <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                প্লেসমেন্ট অনুযায়ী বিজ্ঞাপন কনফিগারেশন
              </h3>
              <p className="text-xs text-slate-500">
                নির্দিষ্ট পজিশন অনুযায়ী বিজ্ঞাপন নেটওয়ার্ক ও ব্যানার নির্বাচন করুন
              </p>
            </div>
          </div>

          {/* Placement Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {placementTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivePlacementTab(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activePlacementTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {settings.placements[tab.key]?.enabled && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Placement Details Form */}
        <div className="space-y-6">
          {/* Header Info & Enable Switch */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {currentPlacement.banglaName}
                </h4>
                <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 text-[10px] font-bold font-mono">
                  {currentPlacement.recommendedSize}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentPlacement.locationDescription}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                এই প্লেসমেন্টে অ্যাড দেখান:
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPlacement.enabled}
                  onChange={(e) => updateCurrentPlacement({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Ad Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              বিজ্ঞাপনের ধরণ (Ad Network Type) নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updateCurrentPlacement({ type: 'custom_banner' })}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  currentPlacement.type === 'custom_banner'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">কাস্টম স্পন্সর ব্যানার</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    নিজস্ব কোর্স, মডেল টেস্ট বা স্পন্সরের ব্যানার ইমেজ ও লিংক
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateCurrentPlacement({ type: 'adsense' })}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  currentPlacement.type === 'adsense'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Google AdSense</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    রেসপনসিভ AdSense ইউনিট কোড ও স্লট আইডি
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateCurrentPlacement({ type: 'html_code' })}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  currentPlacement.type === 'html_code'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">HTML / JS কোড এম্বেড</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    যেকোনো তৃতীয় পক্ষ বিজ্ঞাপন এজেন্সির স্ক্রিপ্ট
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Inputs based on Type */}
          {currentPlacement.type === 'custom_banner' && (
            <div className="space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
              <h5 className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                কাস্টম ব্যানার বিবরণ:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্যানার ছবির লিংক (Image URL) *
                  </label>
                  <input
                    type="text"
                    value={currentPlacement.customBanner?.imageUrl || ''}
                    onChange={(e) =>
                      updateCurrentPlacement({
                        customBanner: {
                          ...currentPlacement.customBanner!,
                          imageUrl: e.target.value,
                          targetUrl: currentPlacement.customBanner?.targetUrl || '',
                          altText: currentPlacement.customBanner?.altText || ''
                        }
                      })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্লিক করলে যাওয়ার লিংক (Target URL) *
                  </label>
                  <input
                    type="text"
                    value={currentPlacement.customBanner?.targetUrl || ''}
                    onChange={(e) =>
                      updateCurrentPlacement({
                        customBanner: {
                          ...currentPlacement.customBanner!,
                          targetUrl: e.target.value,
                          imageUrl: currentPlacement.customBanner?.imageUrl || '',
                          altText: currentPlacement.customBanner?.altText || ''
                        }
                      })
                    }
                    placeholder="/test অথবা https://facebook.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিজ্ঞাপনের মূল শিরোনাম (Headline)
                  </label>
                  <input
                    type="text"
                    value={currentPlacement.customBanner?.altText || ''}
                    onChange={(e) =>
                      updateCurrentPlacement({
                        customBanner: {
                          ...currentPlacement.customBanner!,
                          altText: e.target.value,
                          imageUrl: currentPlacement.customBanner?.imageUrl || '',
                          targetUrl: currentPlacement.customBanner?.targetUrl || ''
                        }
                      })
                    }
                    placeholder="SSC ও HSC মেগা মডেল টেস্ট ২০২৫"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সাবটাইটেল বা ক্যাপশন (Caption)
                  </label>
                  <input
                    type="text"
                    value={currentPlacement.customBanner?.caption || ''}
                    onChange={(e) =>
                      updateCurrentPlacement({
                        customBanner: {
                          ...currentPlacement.customBanner!,
                          caption: e.target.value,
                          imageUrl: currentPlacement.customBanner?.imageUrl || '',
                          targetUrl: currentPlacement.customBanner?.targetUrl || '',
                          altText: currentPlacement.customBanner?.altText || ''
                        }
                      })
                    }
                    placeholder="স্পন্সরড: EduMaster মেগা মডেল টেস্টে অংশ নিন"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentPlacement.type === 'adsense' && (
            <div className="space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
              <h5 className="font-bold text-xs text-amber-600 dark:text-amber-400">
                Google AdSense ইউনিট বিবরণ:
              </h5>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  AdSense Slot ID (data-ad-slot) *
                </label>
                <input
                  type="text"
                  value={currentPlacement.adsenseSlotId || ''}
                  onChange={(e) => updateCurrentPlacement({ adsenseSlotId: e.target.value })}
                  placeholder="e.g. 1234567890"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  AdSense &gt; Ads &gt; By ad unit &gt; Display ads থেকে এই সাইজের ইউনিট তৈরি করে তার ১০ ডিজিটের Slot ID দিন।
                </p>
              </div>
            </div>
          )}

          {currentPlacement.type === 'html_code' && (
            <div className="space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
              <h5 className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                কাস্টম HTML / JavaScript কোড:
              </h5>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কোড পেস্ট করুন *
                </label>
                <textarea
                  rows={4}
                  value={currentPlacement.htmlCode || ''}
                  onChange={(e) => updateCurrentPlacement({ htmlCode: e.target.value })}
                  placeholder="<script type='text/javascript'>...</script> অথবা <div><a href='...'><img src='...'/></a></div>"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Placement Live Visual Preview */}
          <div>
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>লাইভ প্রিভিউ (বিজ্ঞাপনটি যেভাবে দেখাবে):</span>
            </h5>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60">
              {currentPlacement.type === 'custom_banner' && currentPlacement.customBanner?.imageUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-xl mx-auto shadow-md">
                  <div className="px-3 py-1 bg-slate-200/70 dark:bg-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>স্পন্সরড বিজ্ঞাপন ({currentPlacement.banglaName})</span>
                    <span className="font-mono">{currentPlacement.recommendedSize}</span>
                  </div>
                  <div className="relative h-28 w-full bg-slate-900">
                    <img
                      src={currentPlacement.customBanner.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-3 text-white">
                      <p className="text-xs font-bold leading-tight">
                        {currentPlacement.customBanner.altText || 'বিজ্ঞাপন শিরোনাম'}
                      </p>
                      <p className="text-[10px] text-indigo-200 mt-0.5">
                        {currentPlacement.customBanner.caption || 'ক্যাপশন টেক্সট'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : currentPlacement.type === 'adsense' ? (
                <div className="p-6 rounded-xl border-2 border-dashed border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/20 text-center max-w-xl mx-auto">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                    Google AdSense Preview
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">
                    {currentPlacement.banglaName} • {currentPlacement.recommendedSize}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Slot ID: {currentPlacement.adsenseSlotId || 'নট সেট'} | Client: {settings.adsenseClientId}
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  কোড দেওয়া হলে এখানে এম্বেড প্রিভিউ দেখতে পাবেন
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 3. STEP-BY-STEP BANGLA GUIDE: কীভাবে কোন অ্যাড বসাবেন? */}
      <GlassCard className="p-6 space-y-6 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-blue-950/20">
        <div className="flex items-center gap-3 border-b border-indigo-100 dark:border-indigo-900/50 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              কীভাবে কোন অ্যাড বসাবেন — পূর্ণাঙ্গ নির্দেশিকা (Bangla Ad Guide)
            </h3>
            <p className="text-xs text-slate-500">
              বিজ্ঞাপন দিয়ে সর্বোচ্চ আয় (High CPM & CTR) নিশ্চিত করার ধাপসমূহ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-xs">
              ১
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Google AdSense অনুমোদন ও কোড
            </h4>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              1. <strong>adsense.google.com</strong>-এ সাইন-ইন করে আপনার ডোমেইন অ্যাড করুন।
              <br />
              2. অনুমোদন পাওয়ার পর <strong>Publisher ID</strong> (যেমন: <code className="text-indigo-600 dark:text-indigo-400">ca-pub-XXXXXXXXXXXX</code>) উপরের বক্সে দিন।
              <br />
              3. প্রতিটি প্লেসমেন্টের জন্য <strong>Ad unit</strong> তৈরি করে সংশ্লিষ্ট <strong>Slot ID</strong> বসান।
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xs">
              ২
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              কোন প্লেসমেন্টে কত আয় হয়?
            </h4>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              ⭐ <strong>In-Article (হ্যান্ডনোটের মাঝে):</strong> এটি সবচেয়ে লাভজনক প্লেসমেন্ট। শিক্ষার্থীরা পড়ার সময় দীর্ঘক্ষণ দৃষ্টি দেয়ায় ৬০%-৮০% রেভিনিউ এখান থেকেই আসে।
              <br />
              ⭐ <strong>Header Top:</strong> ব্র্যান্ড সচেতনতার জন্য সেরা।
              <br />
              ⭐ <strong>Model Test Result:</strong> পরীক্ষার পর হাই ক্লিক রেট।
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xs">
              ৩
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              পলিসি সতর্কতা ও ইনভ্যালিড ক্লিক
            </h4>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              ⚠️ <strong>সতর্কতা:</strong> নিজের সাইটের বিজ্ঞাপনে নিজে কখনও ক্লিক করবেন না।
              <br />
              ⚠️ শিক্ষার্থীদের বিজ্ঞাপন ক্লিক করতে অনুরোধ বা প্রলুব্ধ করবেন না।
              <br />
              💡 পরিষ্কার ব্যানার ও মানসম্মত কনটেন্ট রাখলে Google স্বয়ংক্রিয়ভাবে হাই CPM অ্যাড সরবরাহ করবে।
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
