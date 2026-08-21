import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Flame,
  Award,
  Users,
  Lightbulb,
  Atom,
  Clock,
  Coffee
} from 'lucide-react';

interface StudyingBoyAnimationProps {
  liveStudentCount?: number;
  className?: string;
  onExploreClick?: () => void;
}

export const StudyingBoyAnimation: React.FC<StudyingBoyAnimationProps> = ({
  liveStudentCount = 428,
  className = '',
  onExploreClick
}) => {
  const [isNightMode, setIsNightMode] = useState(true);
  const [isLampOn, setIsLampOn] = useState(true);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'lofi' | 'waves'>('rain');
  
  // Pomodoro Mini Study Timer
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [studyStreakMinutes, setStudyStreakMinutes] = useState(38);

  // Audio Context Ref for synthetic soothing study sounds
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<{ source: AudioNode; gain: GainNode }[]>([]);

  // Pomodoro Timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pomodoroRunning && pomodoroSeconds > 0) {
      timer = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            setPomodoroRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroSeconds]);

  // Ambient Study Sound Generator using Web Audio API (safe, no external mp3 dependency)
  const toggleAmbientSound = () => {
    if (isPlayingSound) {
      // Stop
      oscillatorNodesRef.current.forEach(({ source, gain }) => {
        try {
          gain.gain.linearRampToValueAtTime(0.001, (audioCtxRef.current?.currentTime || 0) + 0.5);
          setTimeout(() => {
            if ('stop' in source && typeof (source as any).stop === 'function') {
              (source as any).stop();
            }
            source.disconnect();
          }, 600);
        } catch (e) {
          // ignore
        }
      });
      oscillatorNodesRef.current = [];
      setIsPlayingSound(false);
    } else {
      // Start soothing study ambient tone (Brown noise / warm hum)
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm for cozy study ambiance
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Filter for cozy deep rain sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();
        oscillatorNodesRef.current = [{ source: whiteNoise, gain }];
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('Audio play error:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup audio on unmount
      oscillatorNodesRef.current.forEach(({ source }) => {
        try {
          if ('stop' in source && typeof (source as any).stop === 'function') {
            (source as any).stop();
          }
          source.disconnect();
        } catch (e) {}
      });
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const academicFloatingSymbols = [
    { label: 'E = mc²', x: '10%', y: '18%', delay: 0, color: 'text-amber-400 dark:text-amber-300' },
    { label: '∫ f(x)dx', x: '82%', y: '16%', delay: 1.2, color: 'text-indigo-400 dark:text-indigo-300' },
    { label: 'H₂O', x: '6%', y: '58%', delay: 0.6, color: 'text-cyan-400 dark:text-cyan-300' },
    { label: 'π ≈ 3.14', x: '86%', y: '48%', delay: 1.8, color: 'text-emerald-400 dark:text-emerald-300' },
    { label: 'F = ma', x: '18%', y: '82%', delay: 0.9, color: 'text-rose-400 dark:text-rose-300' },
    { label: 'a² + b² = c²', x: '78%', y: '78%', delay: 2.1, color: 'text-purple-400 dark:text-purple-300' }
  ];

  return (
    <div
      id="studying-boy-interactive-hub"
      className={`relative overflow-hidden rounded-3xl border transition-all duration-700 shadow-2xl ${
        isNightMode
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90 border-indigo-500/30 text-white shadow-indigo-950/50'
          : 'bg-gradient-to-b from-blue-50/90 via-indigo-50/70 to-white border-indigo-200/80 text-slate-900 shadow-indigo-100'
      } ${className}`}
    >
      {/* Top Header / Mode Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-indigo-500/10 dark:border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>লাইভ স্টাডি স্পেস</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-extrabold">
              {liveStudentCount} জন শিক্ষার্থী যুক্ত
            </span>
          </div>
        </div>

        {/* Action Controls (Day/Night, Lamp, Lo-Fi Audio) */}
        <div className="flex items-center gap-2">
          {/* Day / Night Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isNightMode
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-indigo-700 hover:bg-indigo-50 shadow-sm'
            }`}
            title={isNightMode ? 'দিনের মোড চালু করুন' : 'রাতের স্টাডি মোড চালু করুন'}
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden sm:inline text-[11px]">{isNightMode ? 'রাত' : 'দিন'}</span>
          </button>

          {/* Desk Lamp Switch */}
          <button
            onClick={() => setIsLampOn(!isLampOn)}
            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isLampOn
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 dark:text-amber-300'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-400'
            }`}
            title="স্টাডি ল্যাম্প অন/অফ"
          >
            <Lightbulb className={`w-3.5 h-3.5 ${isLampOn ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline text-[11px]">ল্যাম্প</span>
          </button>

          {/* Ambient Study Sound Switch */}
          <button
            onClick={toggleAmbientSound}
            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isPlayingSound
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/30 animate-pulse'
                : isNightMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="মনোযোগ বৃদ্ধির অ্যাম্বিয়েন্ট সাউন্ড (Focus Rain)"
          >
            {isPlayingSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{isPlayingSound ? 'শব্দ চলছে' : 'ফোকাস সাউন্ড'}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Stage: Animated Boy at Study Desk */}
      <div className="relative w-full h-[320px] sm:h-[360px] flex items-center justify-center select-none overflow-hidden">
        {/* Floating Academic Formula Bubbles */}
        {academicFloatingSymbols.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: [0.35, 0.9, 0.4],
              y: [0, -12, 0],
              x: [0, idx % 2 === 0 ? 6 : -6, 0]
            }}
            transition={{
              duration: 4 + idx,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay
            }}
            style={{ left: item.x, top: item.y }}
            className={`absolute px-2.5 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md border border-white/10 shadow-lg pointer-events-none ${
              isNightMode ? 'bg-slate-900/60' : 'bg-white/80'
            } ${item.color}`}
          >
            {item.label}
          </motion.div>
        ))}

        {/* Ambient Room Glow from window & lamp */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isNightMode
              ? isLampOn
                ? 'bg-[radial-gradient(ellipse_at_50%_65%,rgba(245,158,11,0.15),rgba(99,102,241,0.08)_45%,transparent_75%)]'
                : 'bg-[radial-gradient(ellipse_at_50%_65%,rgba(99,102,241,0.08),transparent_70%)]'
              : 'bg-[radial-gradient(ellipse_at_50%_65%,rgba(59,130,246,0.1),transparent_70%)]'
          }`}
        />

        {/* SVG ARTWORK: Boy Studying with Animated Layers */}
        <svg
          viewBox="0 0 600 420"
          className="w-full h-full max-w-[540px] drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Lamp Light Cone Gradient */}
            <radialGradient id="lampGlow" cx="440" cy="140" r="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            
            {/* Laptop Screen Glow */}
            <linearGradient id="laptopScreen" x1="280" y1="210" x2="340" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Boy Shirt Gradient */}
            <linearGradient id="hoodieGrad" x1="240" y1="180" x2="330" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>

            {/* Desk Wood Gradient */}
            <linearGradient id="deskWood" x1="100" y1="280" x2="500" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={isNightMode ? '#1e293b' : '#cbd5e1'} />
              <stop offset="100%" stopColor={isNightMode ? '#0f172a' : '#94a3b8'} />
            </linearGradient>
          </defs>

          {/* Wall Clock in Background */}
          <g transform="translate(140, 70)">
            <circle cx="20" cy="20" r="18" fill={isNightMode ? '#1e293b' : '#ffffff'} stroke="#64748b" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="2" fill="#ef4444" />
            <line x1="20" y1="20" x2="20" y2="10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            {/* Rotating Minute Hand Animation */}
            <motion.line
              x1="20"
              y1="20"
              x2="28"
              y2="20"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '20px', originY: '20px' }}
            />
          </g>

          {/* Bookshelf / Wall Frame in Background */}
          <rect x="230" y="50" width="140" height="70" rx="6" fill={isNightMode ? '#1e293b' : '#f1f5f9'} stroke={isNightMode ? '#334155' : '#cbd5e1'} strokeWidth="2" />
          <text x="300" y="85" textAnchor="middle" fill="#6366f1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            SSC & HSC ২০২৫
          </text>
          <text x="300" y="102" textAnchor="middle" fill={isNightMode ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="sans-serif">
            স্বপ্ন জয়ের প্রস্তুতি 🎯
          </text>

          {/* Ergonomic Chair Back */}
          <path
            d="M200 160 C200 140 270 140 270 160 L265 290 L195 290 Z"
            fill={isNightMode ? '#090d16' : '#64748b'}
            opacity="0.9"
          />

          {/* Lamp Light Projection (Beam) onto Desk */}
          {isLampOn && (
            <motion.polygon
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.75, 0.9, 0.75] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              points="435,135 210,320 480,320"
              fill="url(#lampGlow)"
              className="pointer-events-none"
            />
          )}

          {/* ================= BOY BODY & ANIMATIONS ================= */}
          {/* Torso / Hoodie */}
          <motion.path
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            d="M210 210 C210 180 290 175 300 210 L310 295 C310 305 200 305 200 295 Z"
            fill="url(#hoodieGrad)"
          />

          {/* Left Arm resting on table & holding notebook */}
          <path
            d="M225 215 L245 285 L290 285"
            stroke="#4338ca"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Hand on book */}
          <circle cx="290" cy="285" r="7" fill="#fcd34d" />

          {/* Head & Hair with Concentrated Nodding Animation */}
          <motion.g
            animate={{
              rotate: [0, -3.5, 0, -2, 0],
              y: [0, 2, 0]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ originX: '255px', originY: '185px' }}
          >
            {/* Neck */}
            <rect x="247" y="170" width="16" height="20" rx="4" fill="#fcd34d" />
            {/* Face / Head */}
            <circle cx="255" cy="155" r="23" fill="#fcd34d" />
            {/* Hair (Trendy Boy Haircut) */}
            <path
              d="M232 152 C232 128 278 126 278 148 C278 152 274 156 268 145 C260 142 245 140 238 152 Z"
              fill="#18181b"
            />
            {/* Ear & Headphone */}
            <circle cx="233" cy="157" r="5" fill="#fcd34d" />
            <path d="M230 148 C228 140 245 132 260 134" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
            <rect x="227" y="150" width="6" height="14" rx="3" fill="#6366f1" />

            {/* Glasses / Eyes looking down in study concentration */}
            <ellipse cx="260" cy="157" rx="4.5" ry="4" fill="none" stroke="#1e293b" strokeWidth="1.8" />
            <ellipse cx="260" cy="158" rx="2" ry="1.5" fill="#0f172a" />
            <line x1="255.5" y1="157" x2="251" y2="157" stroke="#1e293b" strokeWidth="1.5" />
            {/* Focused Smile / Lip */}
            <path d="M260 167 Q263 169 266 167" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Right Arm & Active Pen Writing Animation */}
          <g>
            <motion.path
              animate={{
                d: [
                  "M285 220 L315 260 L335 285",
                  "M285 220 L318 260 L338 285",
                  "M285 220 L315 260 L335 285"
                ]
              }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              stroke="#4338ca"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Hand */}
            <circle cx="335" cy="285" r="7" fill="#fcd34d" />
            {/* Pen actively writing back and forth */}
            <motion.g
              animate={{
                x: [-3, 4, -2, 3, -3],
                y: [0, -1, 1, 0, 0]
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <line x1="334" y1="284" x2="344" y2="295" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="344" cy="295" r="1.5" fill="#2563eb" />
            </motion.g>
          </g>

          {/* ================= DESK & STUDY ITEMS ================= */}
          {/* Main Study Desk Surface */}
          <rect x="110" y="288" width="380" height="18" rx="5" fill="url(#deskWood)" />
          <rect x="130" y="306" width="340" height="6" fill="#0f172a" opacity="0.3" />
          {/* Desk Legs */}
          <rect x="135" y="306" width="12" height="90" rx="3" fill={isNightMode ? '#1e293b' : '#64748b'} />
          <rect x="450" y="306" width="12" height="90" rx="3" fill={isNightMode ? '#1e293b' : '#64748b'} />

          {/* Open Notebook on Desk with Written Equations */}
          <g transform="translate(300, 280)">
            <rect x="0" y="0" width="55" height="18" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="27" y1="0" x2="27" y2="18" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1" />
            {/* Faux Notes lines */}
            <line x1="5" y1="5" x2="22" y2="5" stroke="#3b82f6" strokeWidth="1.2" />
            <line x1="5" y1="9" x2="20" y2="9" stroke="#64748b" strokeWidth="1" />
            <line x1="5" y1="13" x2="18" y2="13" stroke="#64748b" strokeWidth="1" />
            <line x1="32" y1="5" x2="48" y2="5" stroke="#ef4444" strokeWidth="1" />
            <line x1="32" y1="9" x2="50" y2="9" stroke="#64748b" strokeWidth="1" />
            <line x1="32" y1="13" x2="44" y2="13" stroke="#64748b" strokeWidth="1" />
          </g>

          {/* Modern Slim Laptop */}
          <g transform="translate(170, 248)">
            {/* Screen Back & Border */}
            <polygon points="0,40 10,0 55,0 45,40" fill="#334155" />
            {/* Glowing Screen Content with typing cursor */}
            <polygon points="4,38 13,3 52,3 43,38" fill="url(#laptopScreen)" />
            {/* Laptop Base */}
            <polygon points="-5,40 50,40 58,43 -12,43" fill="#64748b" />
            {/* Typing code lines on screen */}
            <line x1="15" y1="10" x2="42" y2="10" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            <line x1="13" y1="16" x2="38" y2="16" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="11" y1="22" x2="32" y2="22" stroke="#fef08a" strokeWidth="1.5" opacity="0.9" />
          </g>

          {/* Steaming Coffee/Tea Mug */}
          <g transform="translate(370, 272)">
            <rect x="0" y="6" width="16" height="18" rx="3" fill="#f43f5e" />
            {/* Mug Handle */}
            <path d="M16 9 C20 9 20 17 16 17" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
            {/* Steam rising particles */}
            <motion.path
              d="M5 4 Q7 0 5 -4"
              stroke={isNightMode ? '#ffffff' : '#94a3b8'}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              animate={{
                d: [
                  "M5 4 Q7 0 5 -4",
                  "M5 4 Q3 0 5 -4",
                  "M5 4 Q7 0 5 -4"
                ],
                opacity: [0.2, 0.8, 0.1],
                y: [0, -8, -14]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>

          {/* Modern Desk Lamp */}
          <g transform="translate(420, 130)">
            {/* Lamp Base on table */}
            <rect x="15" y="152" width="30" height="6" rx="3" fill="#475569" />
            {/* Lamp Rod Stand */}
            <path d="M30 152 L35 70 L20 15" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
            {/* Lamp Bulb / Hood */}
            <polygon points="10,5 35,5 45,25 0,25" fill="#eab308" />
            {isLampOn && (
              <circle cx="22" cy="22" r="7" fill="#fef08a" filter="drop-shadow(0 0 8px #f59e0b)" />
            )}
          </g>

          {/* Stack of Reference Books (Physics, ICT, Math) */}
          <g transform="translate(130, 258)">
            <rect x="0" y="22" width="35" height="8" rx="2" fill="#3b82f6" />
            <rect x="2" y="14" width="32" height="8" rx="2" fill="#10b981" />
            <rect x="4" y="6" width="28" height="8" rx="2" fill="#f59e0b" />
          </g>
        </svg>

        {/* Floating Focus Badge */}
        <div className="absolute bottom-3 left-4 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 dark:bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md shadow-lg text-xs font-semibold text-white">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>দৈনিক ফোকাস স্ট্রিক: {studyStreakMinutes} মিনিট</span>
        </div>

        {/* Action Button: 'তোমার প্রস্তুতি শুরু করো' */}
        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="absolute bottom-3 right-4 sm:right-6 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>পড়াশোনা শুরু করো</span>
          </button>
        )}
      </div>

      {/* Bottom Live Study Space Toolbar (Pomodoro & Quick stats) */}
      <div className="px-5 py-3 border-t border-indigo-500/10 dark:border-white/10 bg-indigo-950/40 dark:bg-slate-950/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Pomodoro Focus Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>পোমোডোরো স্টাডি টাইমার:</span>
          </div>
          <span className="font-mono font-bold text-sm text-indigo-400 dark:text-indigo-300">
            {formatTime(pomodoroSeconds)}
          </span>
          <button
            onClick={() => setPomodoroRunning(!pomodoroRunning)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
              pomodoroRunning
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {pomodoroRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{pomodoroRunning ? 'পজ' : 'শুরু করুন'}</span>
          </button>
          <button
            onClick={() => {
              setPomodoroRunning(false);
              setPomodoroSeconds(25 * 60);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            title="রিসেট"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Active Study Tip */}
        <div className="hidden md:flex items-center gap-1.5 text-slate-400 dark:text-slate-300 text-[11px]">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>টিপস: প্রতিদিন ২৫ মিনিট করে 집중 দিয়ে পড়লে পড়া ৩ গুণ দ্রুত মনে থাকে।</span>
        </div>
      </div>
    </div>
  );
};
