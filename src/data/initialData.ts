import {
  Subject,
  Chapter,
  Note,
  MCQ,
  ModelTest,
  PDFResource,
  BoardQuestion,
  BlogArticle,
  PlatformSettings,
  AdminAnalytics
} from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  // SSC Subjects
  {
    id: 'ssc-physics',
    name: 'Physics',
    banglaName: 'পদার্থবিজ্ঞান',
    classLevel: 'ssc',
    category: 'science',
    description: 'গতি, বল, কাজ-শক্তি, আলো, বিদ্যুৎ ও আধুনিক পদার্থবিজ্ঞানের পূর্ণাঙ্গ প্রস্তুতি।',
    icon: 'Atom',
    color: 'from-blue-600 to-indigo-600',
    order: 1,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-chemistry',
    name: 'Chemistry',
    banglaName: 'রসায়ন',
    classLevel: 'ssc',
    category: 'science',
    description: 'পর্যায় সারণি, রাসায়নিক বন্ধন, অ্যাসিড-ক্ষারক ও জৈব যৌগের বিস্তারিত নোট ও MCQ।',
    icon: 'FlaskConical',
    color: 'from-emerald-600 to-teal-600',
    order: 2,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-biology',
    name: 'Biology',
    banglaName: 'জীববিজ্ঞান',
    classLevel: 'ssc',
    category: 'science',
    description: 'কোষ বিভাজন, জীবপ্রযুক্তি, জিনতত্ত্ব ও মানবদেহের শারীরবৃত্তীয় প্রক্রিয়া।',
    icon: 'Dna',
    color: 'from-green-600 to-emerald-700',
    order: 3,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-math',
    name: 'General Math',
    banglaName: 'সাধারণ গণিত',
    classLevel: 'ssc',
    category: 'general',
    description: 'বীজগণিত, জ্যামিতি, ত্রিকোণমিতি, পরিমিতি ও পরিসংখ্যানের সূত্র ও বোর্ড সমাধান।',
    icon: 'Calculator',
    color: 'from-amber-600 to-orange-600',
    order: 4,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-higher-math',
    name: 'Higher Math',
    banglaName: 'উচ্চতর গণিত',
    classLevel: 'ssc',
    category: 'science',
    description: 'সেট ও ফাংশন, বীজগণিতীয় রাশি, স্থানাঙ্ক জ্যামিতি ও সম্ভাবনা।',
    icon: 'Sigma',
    color: 'from-purple-600 to-pink-600',
    order: 5,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-ict',
    name: 'ICT',
    banglaName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    classLevel: 'ssc',
    category: 'general',
    description: 'ডিজিটাল কনটেন্ট, ই-লার্নিং, স্প্রেডশিট ও ইন্টারনেটের নিরাপদ ব্যবহার।',
    icon: 'Laptop',
    color: 'from-cyan-600 to-blue-600',
    order: 6,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-bangla',
    name: 'Bangla',
    banglaName: 'বাংলা (১ম ও ২য় পত্র)',
    classLevel: 'ssc',
    category: 'general',
    description: 'গদ্য, পদ্য, ব্যাকরণ, নির্মিতি ও বোর্ড মডেল প্রশ্নের নির্ভুল সমাধান।',
    icon: 'BookOpen',
    color: 'from-rose-600 to-red-600',
    order: 7,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'ssc-english',
    name: 'English',
    banglaName: 'English (1st & 2nd)',
    classLevel: 'ssc',
    category: 'general',
    description: 'Grammar rules, passage comprehension, writing part and vocabulary.',
    icon: 'Languages',
    color: 'from-violet-600 to-indigo-600',
    order: 8,
    createdAt: '2025-01-10T00:00:00.000Z'
  },

  // HSC Subjects
  {
    id: 'hsc-physics',
    name: 'Physics',
    banglaName: 'পদার্থবিজ্ঞান (১ম ও ২য় পত্র)',
    classLevel: 'hsc',
    category: 'science',
    description: 'ভেক্টর, গতিবিদ্যা, তাপগতিবিদ্যা, চলতড়িৎ, স্থিরতড়িৎ ও আধুনিক পদার্থবিজ্ঞান।',
    icon: 'Zap',
    color: 'from-blue-600 to-cyan-600',
    order: 9,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'hsc-chemistry',
    name: 'Chemistry',
    banglaName: 'রসায়ন (১ম ও ২য় পত্র)',
    classLevel: 'hsc',
    category: 'science',
    description: 'গুণগত রসায়ন, রাসায়নিক পরিবর্তন, জৈব যৌগ ও পরিমাণগত রসায়ন।',
    icon: 'TestTube2',
    color: 'from-teal-600 to-green-600',
    order: 10,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'hsc-biology',
    name: 'Biology',
    banglaName: 'জীববিজ্ঞান (১ম ও ২য় পত্র)',
    classLevel: 'hsc',
    category: 'science',
    description: 'উদ্ভিদবিজ্ঞান ও প্রাণিবিজ্ঞান: কোষ ও এর গঠন, জিনতত্ত্ব ও রক্ত সংবহন।',
    icon: 'Microscope',
    color: 'from-emerald-600 to-lime-600',
    order: 11,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'hsc-higher-math',
    name: 'Higher Math',
    banglaName: 'উচ্চতর গণিত (১ম ও ২য় পত্র)',
    classLevel: 'hsc',
    category: 'science',
    description: 'ম্যাট্রিক্স, সরলরেখা, অন্তরীকরণ, যৌগিকরণ, জটিল সংখ্যা ও কণিক।',
    icon: 'Binary',
    color: 'from-fuchsia-600 to-purple-600',
    order: 12,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'hsc-ict',
    name: 'ICT',
    banglaName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    classLevel: 'hsc',
    category: 'general',
    description: 'সংখ্যা পদ্ধতি, ডিজিটাল ডিভাইস, ওয়েব ডিজাইন (HTML) ও সি প্রোগ্রামিং।',
    icon: 'Cpu',
    color: 'from-sky-600 to-indigo-600',
    order: 13,
    createdAt: '2025-01-10T00:00:00.000Z'
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // SSC Physics
  { id: 'ch-ssc-phy-1', title: 'Physical Quantities & Measurement', banglaTitle: '১ম অধ্যায়: ভৌত রাশি ও পরিমাপ', chapterNumber: 1, subjectId: 'ssc-physics', classLevel: 'ssc', order: 1 },
  { id: 'ch-ssc-phy-2', title: 'Motion', banglaTitle: '২য় অধ্যায়: গতি (Motion)', chapterNumber: 2, subjectId: 'ssc-physics', classLevel: 'ssc', order: 2 },
  { id: 'ch-ssc-phy-3', title: 'Force', banglaTitle: '৩য় অধ্যায়: বল (Force)', chapterNumber: 3, subjectId: 'ssc-physics', classLevel: 'ssc', order: 3 },
  { id: 'ch-ssc-phy-4', title: 'Work, Power & Energy', banglaTitle: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি', chapterNumber: 4, subjectId: 'ssc-physics', classLevel: 'ssc', order: 4 },
  { id: 'ch-ssc-phy-5', title: 'State of Matter & Pressure', banglaTitle: '৫ম অধ্যায়: পদার্থের অবস্থা ও চাপ', chapterNumber: 5, subjectId: 'ssc-physics', classLevel: 'ssc', order: 5 },
  { id: 'ch-ssc-phy-11', title: 'Current Electricity', banglaTitle: '১১তম অধ্যায়: চলবিদ্যুৎ (Current Electricity)', chapterNumber: 11, subjectId: 'ssc-physics', classLevel: 'ssc', order: 6 },

  // SSC Chemistry
  { id: 'ch-ssc-chem-3', title: 'Structure of Matter', banglaTitle: '৩য় অধ্যায়: পদার্থের গঠন', chapterNumber: 3, subjectId: 'ssc-chemistry', classLevel: 'ssc', order: 1 },
  { id: 'ch-ssc-chem-4', title: 'Periodic Table', banglaTitle: '৪র্থ অধ্যায়: পর্যায় সারণি', chapterNumber: 4, subjectId: 'ssc-chemistry', classLevel: 'ssc', order: 2 },
  { id: 'ch-ssc-chem-5', title: 'Chemical Bonds', banglaTitle: '৫ম অধ্যায়: রাসায়নিক বন্ধন', chapterNumber: 5, subjectId: 'ssc-chemistry', classLevel: 'ssc', order: 3 },

  // SSC Math
  { id: 'ch-ssc-math-2', title: 'Sets & Functions', banglaTitle: '২য় অধ্যায়: সেট ও ফাংশন', chapterNumber: 2, subjectId: 'ssc-math', classLevel: 'ssc', order: 1 },
  { id: 'ch-ssc-math-3', title: 'Algebraic Expressions', banglaTitle: '৩য় অধ্যায়: বীজগাণিতিক রাশি', chapterNumber: 3, subjectId: 'ssc-math', classLevel: 'ssc', order: 2 },
  { id: 'ch-ssc-math-9', title: 'Trigonometry Ratio', banglaTitle: '৯ম অধ্যায়: ত্রিকোণমিতিক অনুপাত', chapterNumber: 9, subjectId: 'ssc-math', classLevel: 'ssc', order: 3 },

  // HSC Physics
  { id: 'ch-hsc-phy-vec', title: 'Vectors', banglaTitle: '২য় অধ্যায়: ভেক্টর (Vectors)', chapterNumber: 2, subjectId: 'hsc-physics', classLevel: 'hsc', order: 1 },
  { id: 'ch-hsc-phy-newton', title: 'Newtonian Mechanics', banglaTitle: '৪র্থ অধ্যায়: নিউটনিয়ান বলবিদ্যা', chapterNumber: 4, subjectId: 'hsc-physics', classLevel: 'hsc', order: 2 },
  { id: 'ch-hsc-phy-work', title: 'Work, Energy & Power', banglaTitle: '৫ম অধ্যায়: কাজ, শক্তি ও ক্ষমতা', chapterNumber: 5, subjectId: 'hsc-physics', classLevel: 'hsc', order: 3 },
  { id: 'ch-hsc-phy-thermo', title: 'Thermodynamics', banglaTitle: '১ম অধ্যায় (২য় পত্র): তাপগতিবিদ্যা', chapterNumber: 1, subjectId: 'hsc-physics', classLevel: 'hsc', order: 4 },
  { id: 'ch-hsc-phy-curr', title: 'Current Electricity', banglaTitle: '৩য় অধ্যায় (২য় পত্র): চল তড়িৎ', chapterNumber: 3, subjectId: 'hsc-physics', classLevel: 'hsc', order: 5 },

  // HSC ICT
  { id: 'ch-hsc-ict-3', title: 'Number Systems & Digital Logic', banglaTitle: '৩য় অধ্যায়: সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', chapterNumber: 3, subjectId: 'hsc-ict', classLevel: 'hsc', order: 1 },
  { id: 'ch-hsc-ict-4', title: 'Web Design & HTML', banglaTitle: '৪র্থ অধ্যায়: ওয়েব ডিজাইন পরিচিতি এবং HTML', chapterNumber: 4, subjectId: 'hsc-ict', classLevel: 'hsc', order: 2 },
  { id: 'ch-hsc-ict-5', title: 'C Programming', banglaTitle: '৫ম অধ্যায়: প্রোগ্রামিং ভাষা (C Programming)', chapterNumber: 5, subjectId: 'hsc-ict', classLevel: 'hsc', order: 3 }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-ssc-phy-motion',
    title: 'গতি (Motion) অধ্যায়ের সকল গুরুত্বপূর্ণ সূত্র ও থিওরি সামারি',
    slug: 'ssc-physics-motion-summary-and-formulas',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    chapterId: 'ch-ssc-phy-2',
    author: 'প্রকৌ. নাজমুল হাসান',
    authorRole: 'BUET (ECE), সিনিয়র ফিজিক্স মেন্টর',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    views: 1420,
    readingTimeMinutes: 8,
    tags: ['Motion', 'Formulas', 'SSC 2025', 'Physics Note'],
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
    summary: 'গতির ৪টি মৌলিক সমীকরণ, লেখচিত্র বিশ্লেষণ, অভিকর্ষজ ত্বরণের প্রভাব এবং গাণিতিক সমস্যার শর্টকাট টেকনিক।',
    content: `# গতি (Motion) — মাস্টার রিভিশন নোট

## ১. মৌলিক রাশি ও একক
* **দূরত্ব (Distance):** স্কেলার রাশি, দিকবিহীন অতিক্রান্ত পথ। একক: $m$
* **সরণ (Displacement):** ভেক্টর রাশি, নির্দিষ্ট দিকে আদি ও শেষ বিন্দুর সরলরৈখিক দূরত্ব। একক: $m$
* **দ্রুতি (Speed):** সময়ের সাথে দূরত্বের পরিবর্তনের হার ($v = s / t$)
* **বেগ (Velocity):** সময়ের সাথে সরণের পরিবর্তনের হার। মাত্রা: $[LT^{-1}]$
* **ত্বরণ (Acceleration):** বেগ বৃদ্ধির হার $a = \\frac{v - u}{t}$, মাত্রা: $[LT^{-2}]$
* **মন্দন (Deceleration):** ঋণাত্মক ত্বরণ বা বেগ হ্রাসের হার।

---

## ২. গতির চারটি মৌলিক সমীকরণ
সুসম ত্বরণে চলমান কোনো বস্তুর জন্য:
1. $v = u + at$
2. $s = \\left( \\frac{u + v}{2} \\right) t$
3. $s = ut + \\frac{1}{2}at^2$
4. $v^2 = u^2 + 2as$

> **টিপস:** যদি বস্তুটি স্থির অবস্থান থেকে শুরু করে, তবে $u = 0$ হবে। তখন $s \\propto t^2$ এবং $v \\propto t$ সম্পর্ক মেনে চলে।

---

## ৩. পরন্ত বস্তুর সূত্র (Galileo's Laws)
নির্দিষ্ট উচ্চতা থেকে বিনা বাধায় মুক্তভাবে পড়ন্ত বস্তুর ক্ষেত্রে ($a = g = 9.8 \\text{ m/s}^2$):
1. $v = u + gt$
2. $h = ut + \\frac{1}{2}gt^2$
3. $v^2 = u^2 + 2gh$

**খাড়া উপরের দিকে নিক্ষিপ্ত বস্তুর ক্ষেত্রে:**
* সর্বোচ্চ উচ্চতায় বেগ $v = 0$
* সর্বোচ্চ উচ্চতা $H = \\frac{u^2}{2g}$
* সর্বোচ্চ উচ্চতায় ওঠার সময় $t = \\frac{u}{g}$
* মোট বিচরণকাল (উত্থান ও পতন) $T = \\frac{2u}{g}$`
  },
  {
    id: 'note-hsc-phy-vectors',
    title: 'ভেক্টর (Vectors) — ডট গুণন ও ক্রস গুণনের পূর্ণাঙ্গ হ্যান্ডনোট',
    slug: 'hsc-physics-vector-dot-cross-product-handnote',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    chapterId: 'ch-hsc-phy-vec',
    author: 'রাকিবুল ইসলাম',
    authorRole: 'ঢাকা বিশ্ববিদ্যালয় (পদার্থবিজ্ঞান বিভাগ)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    views: 2850,
    readingTimeMinutes: 12,
    tags: ['HSC Physics', 'Vector', 'Dot Product', 'Cross Product'],
    createdAt: '2025-01-18T10:00:00.000Z',
    updatedAt: '2025-01-18T10:00:00.000Z',
    summary: 'লব্ধির মান ও দিক, সামান্তরিক সূত্র, স্কেলার ও ভেক্টর গুণন এবং নদী-নৌকা সংক্রান্ত জটিল গাণিতিক সমস্যার শর্টকাট।',
    content: `# ভেক্টর (Vectors) — সম্পূর্ণ মাস্টার নোট

## ১. সামান্তরিকের সূত্র (Parallelogram Law)
যদি কোনো বিন্দুতে ক্রিয়ারত দুটি ভেক্টর $\\vec{P}$ এবং $\\vec{Q}$ এর মধ্যবর্তী কোণ $\\alpha$ হয়:

* **লব্ধির মান (Magnitude of Resultant):**
  $$R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\alpha}$$
* **লব্ধির দিক (Direction):**
  $$\\tan\\theta = \\frac{Q\\sin\\alpha}{P + Q\\cos\\alpha}$$

### বিশেষ ক্ষেত্রসমূহ:
* যখন $\\alpha = 0^\\circ$: $R_{max} = P + Q$ (একই দিকে)
* যখন $\\alpha = 180^\\circ$: $R_{min} = |P - Q|$ (বিপরীত দিকে)
* যখন $\\alpha = 90^\\circ$: $R = \\sqrt{P^2 + Q^2}$

---

## ২. ডট গুণন (Scalar / Dot Product)
$$\\vec{A} \\cdot \\vec{B} = |A||B|\\cos\\theta = A_x B_x + A_y B_y + A_z B_z$$

* **লম্ব হওয়ার শর্ত:** $\\vec{A} \\cdot \\vec{B} = 0$ হলে ভেক্টরদ্বয় পরস্পরের ওপর লম্ব ($\theta = 90^\\circ$)
* **কোণ নির্ণয়:** $\\cos\\theta = \\frac{\\vec{A} \\cdot \\vec{B}}{|A||B|}$

---

## ৩. ক্রস গুণন (Vector / Cross Product)
$$\\vec{A} \\times \\vec{B} = |A||B|\\sin\\theta \\; \\hat{\\eta}$$

* **সমান্তরাল হওয়ার শর্ত:** $\\vec{A} \\times \\vec{B} = 0$ হলে ভেক্টরদ্বয় পরস্পর সমান্তরাল ($\theta = 0^\\circ$ বা $180^\\circ$)
* **সামান্তরিকের ক্ষেত্রফল:** $|\vec{A} \\times \\vec{B}|$ (যদি বাহুদ্বয় নির্দেশ করে)`
  },
  {
    id: 'note-hsc-ict-c-programming',
    title: 'এইচএসসি আইসিটি: সি প্রোগ্রামিং (C Programming) অধ্যায় রিভিশন নোট',
    slug: 'hsc-ict-c-programming-revision-guide',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    chapterId: 'ch-hsc-ict-5',
    author: 'তানভীর আহমেদ',
    authorRole: 'সফটওয়্যার ইঞ্জিনিয়ার ও আইসিটি ট্রেইনার',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    featured: true,
    published: true,
    views: 1980,
    readingTimeMinutes: 10,
    tags: ['HSC ICT', 'C Language', 'Coding', 'Board Note'],
    createdAt: '2025-01-20T12:00:00.000Z',
    updatedAt: '2025-01-20T12:00:00.000Z',
    summary: 'ভেরিয়েবল, ডেটা টাইপ, কন্ট্রোল স্টেটমেন্ট (if-else, loops), অ্যারে ও ফাংশন সম্পর্কিত বোর্ড পরীক্ষার প্রশ্নোত্তর।',
    content: `# সি প্রোগ্রামিং (C Programming) — অধ্যায় ৫

## ১. ডেটা টাইপ ও ফরমেট স্পেসিফায়ার
* **int:** পূর্ণসংখ্যা (২ বা ৪ বাইট) — স্পেসিফায়ার: \`%d\`
* **float:** ভগ্নাংশ বা দশমিক সংখ্যা (৪ বাইট) — স্পেসিফায়ার: \`%f\`
* **double:** দ্বিগুণ সূক্ষ্ম দশমিক সংখ্যা (৮ বাইট) — স্পেসিফায়ার: \`%lf\`
* **char:** একক বর্ণ বা অক্ষর (১ বাইট) — স্পেসিফায়ার: \`%c\`

---

## ২. লুপ কন্ট্রোল স্টেটমেন্ট
লুপ ৩ প্রকার:
1. **for loop:** নির্দিষ্ট সংখ্যক পুনরাবৃত্তির জন্য সর্বাধিক ব্যবহৃত।
2. **while loop:** শর্ত সত্য থাকা পর্যন্ত চলে (Entry Controlled)।
3. **do-while loop:** অন্তত একবার এক্সিকিউট হবেই (Exit Controlled)।`
  },
  {
    id: 'note-ssc-chem-periodic',
    title: 'পর্যায় সারণি (Periodic Table) মুখস্থ রাখার ম্যাজিক টেকনিক ও বৈশিষ্ট্য',
    slug: 'ssc-chemistry-periodic-table-tricks-and-properties',
    classLevel: 'ssc',
    subjectId: 'ssc-chemistry',
    chapterId: 'ch-ssc-chem-4',
    author: 'ফারহানা আকতার',
    authorRole: 'রসায়ন বিভাগ, জাহাঙ্গীরনগর বিশ্ববিদ্যালয়',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    featured: false,
    published: true,
    views: 1120,
    readingTimeMinutes: 7,
    tags: ['SSC Chemistry', 'Periodic Table', 'Shortcuts'],
    createdAt: '2025-01-22T10:00:00.000Z',
    updatedAt: '2025-01-22T10:00:00.000Z',
    summary: 'পর্যায়ভিত্তিক ধর্ম যেমন পারমাণবিক ব্যাসার্ধ, আয়নিকরণ শক্তি, তড়িৎ ঋণাত্মকতা ও ইলেকট্রন আসক্তির পরিবর্তনশীলতা।',
    content: `# পর্যায় সারণি — বৈশিষ্ট্য ও পর্যায়বৃত্ত ধর্ম

## ১. পর্যায়বৃত্ত ধর্মসমূহের পরিবর্তন (বামে থেকে ডানে ও উপর থেকে নিচে)
1. **পারমাণবিক আকার / ব্যাসার্ধ:**
   * একই পর্যায়ে বাম থেকে ডানে গেলে **হ্রাস পায়**।
   * একই গ্রুপে উপর থেকে নিচে গেলে **বৃদ্ধি পায়**।

2. **আয়নিকরণ শক্তি (Ionization Energy):**
   * একই পর্যায়ে বাম থেকে ডানে গেলে **বৃদ্ধি পায়**।
   * একই গ্রুপে উপর থেকে নিচে নামলে **হ্রাস পায়**।

3. **ইলেকট্রন আসক্তি (Electron Affinity):**
   * বাম থেকে ডানে গেলে বাড়ে, উপর থেকে নিচে কমলে কমে।
   * *ব্যতিক্রম:* ক্লোরিনের ($Cl$) ইলেকট্রন আসক্তি ফ্লোরিনের ($F$) চেয়ে বেশি।`
  }
];

export const INITIAL_MCQS: MCQ[] = [
  // SSC Physics MCQs
  {
    id: 'mcq-phy-1',
    question: 'মুক্তভাবে পড়ন্ত কোনো বস্তু ১ম সেকেন্ডে ৪ মিটার অতিক্রম করলে ৩য় সেকেন্ডের শেষে মোট কত দূরত্ব অতিক্রম করবে?',
    options: ['১২ মিটার', '১৬ মিটার', '৩৬ মিটার', '৪৮ মিটার'],
    correctAnswer: 2, // ৩৬ মিটার (s proportional to t^2: s = 4 * 3^2 = 36m)
    explanation: 'স্থির অবস্থান থেকে মুক্তভাবে পড়ন্ত বস্তুর অতিক্রান্ত দূরত্ব সময়ের বর্গের সমানুপাতিক ($h \\propto t^2$)। ১ম সেকেন্ডে $h_1 = 4$ মিটার হলে, ৩য় সেকেন্ডের শেষে অতিক্রান্ত মোট দূরত্ব $h_3 = 4 \\times 3^2 = 4 \\times 9 = 36$ মিটার।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    chapterId: 'ch-ssc-phy-2',
    difficulty: 'medium',
    boardRef: 'ঢাকা বোর্ড ২০২৩',
    tags: ['Motion', 'Falling Body'],
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'mcq-phy-2',
    question: 'নিচের কোনটি স্কেলার রাশি?',
    options: ['বেগ', 'তড়িৎ তীব্রতা', 'কাজ', 'সরণ'],
    correctAnswer: 2,
    explanation: 'কাজের কেবল মান আছে, কোনো নির্দিষ্ট দিক নেই। কাজ = বল $\\times$ সরণ $\\times \\cos\\theta$ যা দুটি ভেক্টর রাশির ডট গুণনের ফলে একটি স্কেলার রাশি তৈরি করে।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    chapterId: 'ch-ssc-phy-4',
    difficulty: 'easy',
    boardRef: 'রাজশাহী বোর্ড ২০২২',
    tags: ['Work', 'Scalars'],
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'mcq-phy-3',
    question: 'একটি গাড়ির বেগ ১০ সেকেন্ডে ২০ m/s থেকে বৃদ্ধি পেয়ে ৫০ m/s হলে গাড়িটির ত্বরণ কত?',
    options: ['২ m/s²', '৩ m/s²', '৪ m/s²', '৫ m/s²'],
    correctAnswer: 1,
    explanation: 'ত্বরণ $a = \\frac{v - u}{t} = \\frac{50 - 20}{10} = \\frac{30}{10} = 3 \\text{ m/s}^2$।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    chapterId: 'ch-ssc-phy-2',
    difficulty: 'easy',
    boardRef: 'চট্টগ্রাম বোর্ড ২০২৪',
    tags: ['Acceleration'],
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'mcq-phy-4',
    question: 'প্যাসকেলের সূত্র অনুযায়ী আবদ্ধ তরলে চাপ প্রয়োগ করলে তা কীভাবে সঞ্চালিত হয়?',
    options: ['শুধু নিচের দিকে', 'শুধু উপরের দিকে', 'সবদিকে সমানভাবে ও পাত্রের গায়ে লম্বভাবে', 'কোনোটিই নয়'],
    correctAnswer: 2,
    explanation: 'আবদ্ধ পাত্রে তরল বা বায়বীয় পদার্থের কোনো অংশের ওপর বাইরে থেকে চাপ প্রয়োগ করলে সেই চাপ কিছুমাত্র না কমে সবদিকে সমানভাবে সঞ্চালিত হয় এবং পাত্রের গায়ে লম্বভাবে ক্রিয়া করে।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    chapterId: 'ch-ssc-phy-5',
    difficulty: 'easy',
    boardRef: 'কুমিল্লা বোর্ড ২০২৩',
    tags: ['Pressure', 'Pascals Law'],
    createdAt: '2025-01-15T00:00:00.000Z'
  },

  // HSC Physics MCQs
  {
    id: 'mcq-hsc-phy-1',
    question: 'দুটি একক ভেক্টরের যোগফল একটি একক ভেক্টর হলে, এদের মধ্যবর্তী কোণ কত?',
    options: ['৬০°', '৯০°', '১২০°', '১৮০°'],
    correctAnswer: 2,
    explanation: 'ধরি $|P|=1, |Q|=1$ এবং লব্ধি $R=1$। আমরা জানি $R^2 = P^2 + Q^2 + 2PQ\\cos\\alpha$ => $1^2 = 1^2 + 1^2 + 2(1)(1)\\cos\\alpha$ => $1 = 2 + 2\\cos\\alpha$ => $\\cos\\alpha = -\\frac{1}{2}$ => $\\alpha = 120^\\circ$।',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    chapterId: 'ch-hsc-phy-vec',
    difficulty: 'hard',
    boardRef: 'ঢাকা বোর্ড ২০২৩',
    tags: ['Vector', 'Resultant'],
    createdAt: '2025-01-18T00:00:00.000Z'
  },
  {
    id: 'mcq-hsc-phy-2',
    question: 'যদি $\\vec{A} = 2\\hat{i} + 3\\hat{j} - \\hat{k}$ এবং $\\vec{B} = m\\hat{i} - 2\\hat{j} + 4\\hat{k}$ পরস্পর লম্ব হয়, তবে $m$ এর মান কত?',
    options: ['২', '৩', '৫', '১০'],
    correctAnswer: 2,
    explanation: 'ভেক্টরদ্বয় লম্ব হওয়ার শর্ত হলো $\\vec{A} \\cdot \\vec{B} = 0$। অর্থাৎ $(2)(m) + (3)(-2) + (-1)(4) = 0 \\implies 2m - 6 - 4 = 0 \\implies 2m = 10 \\implies m = 5$।',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    chapterId: 'ch-hsc-phy-vec',
    difficulty: 'medium',
    boardRef: 'যশোর বোর্ড ২০২৪',
    tags: ['Dot Product'],
    createdAt: '2025-01-18T00:00:00.000Z'
  },
  {
    id: 'mcq-hsc-ict-1',
    question: '$(11011)_2$ বাইনারি সংখ্যার সমকক্ষ ডেসিমাল (দশমিক) মান কত?',
    options: ['২৩', '২৫', '২৭', '২৯'],
    correctAnswer: 2,
    explanation: '$1 \\times 2^4 + 1 \\times 2^3 + 0 \\times 2^2 + 1 \\times 2^1 + 1 \\times 2^0 = 16 + 8 + 0 + 2 + 1 = 27$।',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    chapterId: 'ch-hsc-ict-3',
    difficulty: 'easy',
    boardRef: 'সিলেট বোর্ড ২০২৩',
    tags: ['Number System'],
    createdAt: '2025-01-20T00:00:00.000Z'
  },
  {
    id: 'mcq-hsc-ict-2',
    question: 'C ভাষায় নিচের কোনটি সঠিক চলক (Variable) নাম?',
    options: ['2total', 'total_score', 'float', 'my score'],
    correctAnswer: 1,
    explanation: 'C ভাষায় ভেরিয়েবলের নাম কোনো সংখ্যা দিয়ে শুরু হতে পারে না, কীওয়ার্ড (যেমন float) হতে পারে না এবং মাঝে স্পেস গ্রহণযোগ্য নয়। তাই `total_score` সঠিক ভেরিয়েবল নাম।',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    chapterId: 'ch-hsc-ict-5',
    difficulty: 'easy',
    boardRef: 'দিনাজপুর বোর্ড ২০২২',
    tags: ['C Programming'],
    createdAt: '2025-01-20T00:00:00.000Z'
  }
];

export const INITIAL_TESTS: ModelTest[] = [
  {
    id: 'test-ssc-phy-final',
    title: 'SSC পদার্থবিজ্ঞান: পূর্ণাঙ্গ অধ্যায়ভিত্তিক মডেল টেস্ট ১',
    description: 'গতি, বল এবং কাজ-ক্ষমতা-শক্তি অধ্যায়ের বোর্ড স্ট্যান্ডার্ড স্পেশাল মডেল টেস্ট।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    durationMinutes: 15,
    totalMarks: 20,
    passingMarks: 12,
    questionIds: ['mcq-phy-1', 'mcq-phy-2', 'mcq-phy-3', 'mcq-phy-4'],
    published: true,
    attemptsCount: 384,
    createdAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'test-hsc-phy-vec-final',
    title: 'HSC পদার্থবিজ্ঞান ১ম পত্র: ভেক্টর ও নিউটনীয় বলবিদ্যা স্পেশাল টেস্ট',
    description: 'উচ্চ মাধ্যমিক পদার্থবিজ্ঞান ১ম পত্রের ভেক্টর ও বলবিদ্যা অংশের চ্যালেঞ্জিং কুইজ।',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    durationMinutes: 20,
    totalMarks: 25,
    passingMarks: 15,
    questionIds: ['mcq-hsc-phy-1', 'mcq-hsc-phy-2'],
    published: true,
    attemptsCount: 612,
    createdAt: '2025-01-12T00:00:00.000Z'
  },
  {
    id: 'test-hsc-ict-grand',
    title: 'HSC ICT সংখ্যা পদ্ধতি ও সি প্রোগ্রামিং মেগা টেস্ট',
    description: 'এইচএসসি আইসিটি ৩য় ও ৫ম অধ্যায়ের সমন্বিত বোর্ড স্ট্যান্ডার্ড টেস্ট।',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    durationMinutes: 15,
    totalMarks: 20,
    passingMarks: 12,
    questionIds: ['mcq-hsc-ict-1', 'mcq-hsc-ict-2'],
    published: true,
    attemptsCount: 520,
    createdAt: '2025-01-15T00:00:00.000Z'
  }
];

export const INITIAL_PDFS: PDFResource[] = [
  {
    id: 'pdf-ssc-phy-formula-sheet',
    title: 'SSC পদার্থবিজ্ঞান সম্পূর্ণ বইয়ের সকল সূত্র ও একক এক নজরে (Formula Sheet)',
    description: 'বোর্ড পরীক্ষা ও রিভিশনের জন্য SSC Physics এর সকল সূত্রের পরিচ্ছন্ন রঙিন চার্ট।',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSizeMB: 3.4,
    pageCount: 12,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    downloadCount: 3420,
    viewCount: 7850,
    tags: ['Formula Sheet', 'SSC 2025', 'Physics Hand Note'],
    published: true,
    createdAt: '2025-01-08T00:00:00.000Z'
  },
  {
    id: 'pdf-hsc-ict-c-cheatsheet',
    title: 'HSC ICT সি প্রোগ্রামিং (C Programming) শর্ট সাজেশন ও কোডিং হ্যান্ডনোট',
    description: 'এইচএসসি পরীক্ষায় আসার মতো গুরুত্বপূর্ণ ২০টি সি প্রোগ্রাম ও আউটপুট বিশ্লেষণ।',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSizeMB: 2.1,
    pageCount: 16,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    downloadCount: 4890,
    viewCount: 9400,
    tags: ['HSC ICT', 'C Code', 'Suggestions', 'PDF Book'],
    published: true,
    createdAt: '2025-01-11T00:00:00.000Z'
  },
  {
    id: 'pdf-ssc-math-geometry-note',
    title: 'SSC সাধারণ গণিত: সকল উপপাদ্য ও সম্পাদ্য প্রমাণ সংক্ষেপিত গাইড',
    description: 'জ্যামিতির ভয় দূর করতে সবচেয়ে সহজ উপায়ে বৃত্ত ও ত্রিভুজের উপপাদ্য ব্যাখ্যা।',
    classLevel: 'ssc',
    subjectId: 'ssc-math',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSizeMB: 4.8,
    pageCount: 24,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    downloadCount: 2950,
    viewCount: 6100,
    tags: ['Math', 'Geometry', 'Theorems', 'SSC'],
    published: true,
    createdAt: '2025-01-14T00:00:00.000Z'
  },
  {
    id: 'pdf-hsc-phy-vectors-handnote',
    title: 'HSC পদার্থবিজ্ঞান ভেক্টর অধ্যায়ের সম্পূর্ণ টপিকভিত্তিক হ্যান্ডনোট',
    description: 'নদী-নৌকা, বৃষ্টির বেগ, ছাতা ধরার কোণ এবং ত্রিমাত্রিক স্থানাঙ্ক ব্যবস্থার সমাধান।',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSizeMB: 5.2,
    pageCount: 28,
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    downloadCount: 5120,
    viewCount: 11200,
    tags: ['Vectors', 'HSC Physics', 'Handnote'],
    published: true,
    createdAt: '2025-01-16T00:00:00.000Z'
  }
];

export const INITIAL_BOARD_QUESTIONS: BoardQuestion[] = [
  {
    id: 'bq-ssc-phy-dhaka-2024',
    title: 'SSC পদার্থবিজ্ঞান — ঢাকা বোর্ড ২০২৪ (সৃজনশীল ও বহুনির্বাচনী প্রশ্ন সমাধান)',
    classLevel: 'ssc',
    subjectId: 'ssc-physics',
    board: 'Dhaka',
    year: 2024,
    examType: 'Combined',
    views: 4500,
    questionPaperUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    solutionContent: 'ঢাকা বোর্ড ২০২৪ এর পদার্থবিজ্ঞান সৃজনশীল ১ থেকে ৮ নং প্রশ্নের পুঙ্খানুপুঙ্খ ব্যাখ্যা ও আদর্শ উত্তর প্রদান করা হয়েছে।',
    createdAt: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 'bq-ssc-math-raj-2024',
    title: 'SSC সাধারণ গণিত — রাজশাহী বোর্ড ২০২৪ সম্পূর্ণ প্রশ্ন সমাধান',
    classLevel: 'ssc',
    subjectId: 'ssc-math',
    board: 'Rajshahi',
    year: 2024,
    examType: 'CQ',
    views: 3890,
    questionPaperUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    solutionContent: 'বীজগণিত, জ্যামিতি ও ত্রিকোণমিতি অংশের প্রতিটি সৃজনশীল প্রশ্নের স্টেপ-বাই-স্টেপ সমাধান।',
    createdAt: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 'bq-hsc-phy-ctg-2024',
    title: 'HSC পদার্থবিজ্ঞান ১ম পত্র — চট্টগ্রাম বোর্ড ২০২৪ প্রশ্ন ও নির্ভুল উত্তরমালা',
    classLevel: 'hsc',
    subjectId: 'hsc-physics',
    board: 'Chattogram',
    year: 2024,
    examType: 'Combined',
    views: 5200,
    questionPaperUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    solutionContent: 'ভেক্টর, নিউটনীয় বলবিদ্যা ও কাজ-শক্তি অধ্যায় হতে আগত সিকিউ এবং ২৫টি এমসিকিউ এর বিস্তারিত সমাধান।',
    createdAt: '2025-01-06T00:00:00.000Z'
  },
  {
    id: 'bq-hsc-ict-dhaka-2023',
    title: 'HSC ICT — ঢাকা বোর্ড ২০২৩ বহুনির্বাচনী ও সৃজনশীল প্রশ্ন সমাধান',
    classLevel: 'hsc',
    subjectId: 'hsc-ict',
    board: 'Dhaka',
    year: 2023,
    examType: 'Combined',
    views: 6100,
    questionPaperUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    solutionContent: 'সি প্রোগ্রামিং, এইচটিএমএল কোড ও বাইনারি রূপান্তর সংক্রান্ত প্রতিটি প্রশ্নের সঠিক বিশ্লেষণ।',
    createdAt: '2025-01-07T00:00:00.000Z'
  }
];

export const INITIAL_BLOGS: BlogArticle[] = [
  {
    id: 'blog-ssc-a-plus-strategy',
    title: 'SSC পরীক্ষায় জিপিএ ৫ (GPA 5.00) নিশ্চিত করার বৈজ্ঞানিক রুটিন ও রিভিশন স্ট্র্যাটেজি',
    slug: 'how-to-get-gpa-5-in-ssc-study-strategy-and-routine',
    excerpt: 'পরীক্ষার শেষ ৩ মাসে কীভাবে প্রতিটি বিষয়ের অধ্যায়ভিত্তিক সময় ভাগ করবেন এবং টেস্ট পেপার প্র্যাকটিস করবেন।',
    content: `# SSC পরীক্ষায় জিপিএ ৫ পাওয়ার পূর্ণাঙ্গ গাইডলাইন

এসএসসি পরীক্ষা শিক্ষার্থীদের জীবনের অন্যতম গুরুত্বপূর্ণ একটি মাইলফলক। সঠিক পরিকল্পনা ও নিয়মানুবর্তিতা থাকলে বিজ্ঞান, মানবিক কিংবা ব্যবসায় শিক্ষা যে কোনো বিভাগ থেকেই গোল্ডেন জিপিএ ৫ অর্জন সম্ভব।

---

## ১. ৩-ফেজ রিভিশন মেথড (3-Phase Revision)
* **ফেজ ১ (প্রথম ৩০ দিন):** পাঠ্যবইয়ের গুরুত্বপূর্ণ অধ্যায়সমূহের বেসিক ক্লিয়ার করা ও নিজস্ব হ্যান্ডনোট তৈরি করা।
* **ফেজ ২ (দ্বিতীয় ৩০ দিন):** বিগত ৫ বছরের সকল শিক্ষা বোর্ডের সৃজনশীল ও বহুনির্বাচনী প্রশ্ন সময় ধরে সমাধান করা।
* **ফেজ ৩ (শেষ ৩০ দিন):** শীর্ষস্থানীয় স্কুলগুলোর টেস্ট পেপার প্রশ্ন নিয়ে পূর্ণাঙ্গ সময়ের মডেল টেস্ট দেওয়া এবং ভুলগুলো সংশোধন করা।

---

## ২. MCQ তে ৩০ এ ৩০ পাওয়ার ট্রিকস
* পাঠ্যবই খুঁটিয়ে পড়ুন এবং গুরুত্বপূর্ণ লাইন হাইলাইট করুন।
* দৈনিক অন্তত ৫০টি অধ্যায়ভিত্তিক MCQ প্র্যাকটিস করুন।
* আমাদের EduMaster BD এর অনলাইন MCQ মডিউল ব্যবহার করে তাৎক্ষণিক ফলাফল ও ব্যাখ্যা দেখে নিন।

---

## ৩. পরীক্ষার আগের রাতের প্রস্তুতি
রাত জেগে অতিরিক্ত না পড়ে অন্তত ৭ ঘণ্টা ভালো ঘুম দিন। পরীক্ষার জন্য প্রয়োজনীয় প্রবেশপত্র, কলম, ক্যালকুলেটর আগের রাতেই গুছিয়ে রাখুন। শুভকামনা!`,
    coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    category: 'এক্সাম টিপস',
    author: 'এডুমাস্টার মেন্টরিং টিম',
    tags: ['SSC', 'GPA 5', 'Study Routine', 'Exam Strategy'],
    seoTitle: 'SSC GPA 5 পাওয়ার বৈজ্ঞানিক রুটিন ও টিপস | EduMaster BD',
    metaDescription: 'এসএসসি পরীক্ষায় কীভাবে সকল বিষয়ে জিপিএ ৫ পাবেন তার বিস্তারিত রুটিন ও প্রস্তুতি কৌশল।',
    published: true,
    views: 4890,
    readTimeMinutes: 5,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 'blog-hsc-ict-preparation',
    title: 'এইচএসসি আইসিটি: সি প্রোগ্রামিং ও এইচটিএমএল-এ ফুল মার্কস তোলার গোপন কৌশল',
    slug: 'hsc-ict-c-programming-html-full-marks-guide',
    excerpt: 'অধ্যায় ৩, ৪ এবং ৫ এর জটিল বিষয়গুলো সহজ নিয়মে আয়ত্ত করার নিয়মাবলি।',
    content: `# এইচএসসি আইসিটি প্রস্তুতি: ফুল মার্কস তোলার কৌশল

এইচএসসি আইসিটি পরীক্ষায় ভালো নম্বর তোলা খুব কঠিন নয় যদি সঠিক অধ্যায়গুলো সঠিকভাবে পরিকল্পনা করে পড়া হয়।

---

## গুরুত্বপূর্ণ অধ্যায় ভিত্তিক ফোকাস:
1. **অধ্যায় ৩ (সংখ্যা পদ্ধতি ও ডিজিটাল লজিক):**
   * ডেসিমাল, বাইনারি, অক্টাল ও হেক্সাডেসিমালের পারস্পরিক রূপান্তর।
   * ২-এর পরিপূরক (2's complement) ব্যবহার করে যোগ ও বিয়োগ।
   * লজিক গেট (NAND, NOR সার্বজনীন গেট প্রমাণ) ও ডিকোডারের সত্যক সারণি।

2. **অধ্যায় ৪ (ওয়েব ডিজাইন ও HTML):**
   * টেবিল ট্যাগ (\`<table>\`, \`<tr>\`, \`<td>\`, \`rowspan\`, \`colspan\`)
   * হাইপারলিংক (\`<a>\`) ও ইমেজ (\`<img>\`) ট্যাগ যুক্ত করা।

3. **অধ্যায় ৫ (C প্রোগ্রামিং):**
   * লিপ ইয়ার (Leap Year) নির্ণয়ের কোড।
   * মৌলিক সংখ্যা (Prime Number) এবং ফিবোনাচ্চি সিরিজ।
   * ত্রিভুজের ক্ষেত্রফল ও তাপমাত্রা রূপান্তর।`,
    coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: 'বিষয়ভিত্তিক গাইড',
    author: 'প্রকৌ. রিফাত মাহমুদ',
    tags: ['HSC ICT', 'C Programming', 'HTML', 'Suggestions'],
    seoTitle: 'HSC ICT সম্পূর্ণ প্রস্তুতি গাইডলাইন | EduMaster BD',
    metaDescription: 'এইচএসসি আইসিটি পরীক্ষায় এ প্লাস পাওয়ার জন্য অধ্যায়ভিত্তিক সাজেশন্স ও সিকিউ ট্রিকস।',
    published: true,
    views: 3540,
    readTimeMinutes: 6,
    createdAt: '2025-01-14T00:00:00.000Z',
    updatedAt: '2025-01-14T00:00:00.000Z'
  }
];

export const INITIAL_SETTINGS: PlatformSettings = {
  siteName: 'EduMaster BD',
  siteTagline: 'বাংলাদেশের শিক্ষার্থীদের জন্য স্মার্ট ও ফ্রি লার্নিং প্ল্যাটফর্ম',
  announcementBanner: {
    active: true,
    text: '🎉 এসএসসি ও এইচএসসি ২০২৫ শিক্ষার্থীদের জন্য নতুন অধ্যায়ভিত্তিক হ্যান্ডনোট ও মেগা মডেল টেস্ট উন্মুক্ত করা হয়েছে!',
    linkText: 'মডেল টেস্ট দিন',
    linkUrl: '/test'
  },
  contactEmail: 'support@edumasterbd.com',
  supportPhone: '+880 1700-000000',
  facebookGroupUrl: 'https://facebook.com/groups/edumasterbd',
  youtubeChannelUrl: 'https://youtube.com/@edumasterbd',
  telegramGroupUrl: 'https://t.me/edumasterbd'
};

export const INITIAL_ANALYTICS: AdminAnalytics = {
  totalNotes: 24,
  totalPdfs: 18,
  totalMcqs: 140,
  totalTests: 12,
  totalBlogs: 15,
  totalUsers: 8420,
  totalDownloads: 16380,
  totalQuizAttempts: 12890,
  visitorTrends: [
    { date: '১৪ ফেব্রু', visitors: 1240, views: 3820 },
    { date: '১৫ ফেব্রু', visitors: 1480, views: 4210 },
    { date: '১৬ ফেব্রু', visitors: 1620, views: 4980 },
    { date: '১৭ ফেব্রু', visitors: 1890, views: 5640 },
    { date: '১৮ ফেব্রু', visitors: 2150, views: 6810 },
    { date: '১৯ ফেব্রু', visitors: 2420, views: 7450 },
    { date: '২০ ফেব্রু', visitors: 2780, views: 8920 }
  ],
  quizAttemptsTrends: [
    { date: '১৪ ফেব্রু', attempts: 320, avgScore: 74 },
    { date: '১৫ ফেব্রু', attempts: 410, avgScore: 78 },
    { date: '১৬ ফেব্রু', attempts: 390, avgScore: 82 },
    { date: '১৭ ফেব্রু', attempts: 520, avgScore: 79 },
    { date: '১৮ ফেব্রু', attempts: 640, avgScore: 85 },
    { date: '১৯ ফেব্রু', attempts: 780, avgScore: 88 },
    { date: '২০ ফেব্রু', attempts: 920, avgScore: 86 }
  ],
  subjectPopularity: [
    { name: 'SSC Physics', count: 3840, color: '#3b82f6' },
    { name: 'HSC Physics', count: 3210, color: '#6366f1' },
    { name: 'HSC ICT', count: 2890, color: '#06b6d4' },
    { name: 'SSC Math', count: 2450, color: '#f59e0b' },
    { name: 'SSC Chemistry', count: 2100, color: '#10b981' }
  ],
  recentActivities: [
    { id: 'act-1', type: 'note', description: 'নতুন হ্যান্ডনোট প্রকাশিত হয়েছে: ভেক্টর অধ্যায়', timestamp: '১০ মিনিট আগে' },
    { id: 'act-2', type: 'test', description: 'মডেল টেস্ট সম্পন্ন করেছে: তানজিম আহমেদ (স্কোর: ২০/২০)', timestamp: '২৫ মিনিট আগে' },
    { id: 'act-3', type: 'pdf', description: 'PDF ডাউনলোড সংখ্যা ৫০০০ অতিক্রম করেছে (HSC ICT Code)', timestamp: '১ ঘণ্টা আগে' },
    { id: 'act-4', type: 'user', description: 'নতুন শিক্ষার্থী যুক্ত হয়েছেন চট্টগ্রাম থেকে', timestamp: '২ ঘণ্টা আগে' },
    { id: 'act-5', type: 'blog', description: 'ব্লগ প্রকাশিত হয়েছে: SSC পরীক্ষায় জিপিএ ৫ পাওয়ার রুটিন', timestamp: '৫ ঘণ্টা আগে' }
  ]
};
