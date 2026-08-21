export interface Viewport {
  themeColor?: string;
  width?: string;
  initialScale?: number;
  maximumScale?: number;
  [key: string]: any;
}

export interface Metadata {
  metadataBase?: URL;
  title?: string | { default: string; template: string };
  description?: string;
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  robots?: any;
  openGraph?: any;
  twitter?: any;
  verification?: { google?: string; [key: string]: any };
  alternates?: { canonical?: string; [key: string]: any };
  manifest?: string;
  [key: string]: any;
}

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://edumasterbd.vercel.app'),
  title: {
    default: 'SSC & HSC Notes, MCQ, PDF Download Free | EduMaster BD',
    template: '%s | EduMaster BD'
  },
  description: 'বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য ফ্রি নোট, MCQ, PDF, মডেল টেস্ট এবং গুরুত্বপূর্ণ প্রশ্ন।',
  keywords: [
    'SSC Notes Bangladesh',
    'HSC Notes Bangladesh',
    'SSC MCQ',
    'HSC MCQ',
    'PDF Notes',
    'Board Questions',
    'Model Test',
    'EduMaster BD',
    'SSC 2025 Handnote',
    'HSC 2025 Suggestion',
    'Bangla Education'
  ],
  authors: [{ name: 'EduMaster BD Team', url: 'https://edumasterbd.vercel.app' }],
  creator: 'EduMaster BD',
  publisher: 'EduMaster BD Platform',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://edumasterbd.vercel.app',
    siteName: 'EduMaster BD',
    title: 'SSC & HSC Notes, MCQ, PDF Download Free | EduMaster BD',
    description: 'বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য ফ্রি নোট, MCQ, PDF, মডেল টেস্ট এবং গুরুত্বপূর্ণ প্রশ্ন।',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'EduMaster BD - Smart SSC & HSC Learning Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSC & HSC Notes, MCQ, PDF Download Free | EduMaster BD',
    description: 'বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য ফ্রি নোট, MCQ, PDF, মডেল টেস্ট এবং গুরুত্বপূর্ণ প্রশ্ন।',
    images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80'],
    creator: '@edumasterbd',
  },
  verification: {
    google: 'googleca963865ef8ae607',
  },
  alternates: {
    canonical: 'https://edumasterbd.vercel.app',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
