import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'book' | 'profile';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  articleData?: {
    headline: string;
    description: string;
    image: string;
    datePublished?: string;
    dateModified?: string;
    authorName?: string;
    section?: string;
  };
  courseData?: {
    name: string;
    description: string;
    provider: string;
    educationalLevel: string;
  };
  quizData?: {
    name: string;
    description: string;
    timeRequired?: string;
  };
}

const DEFAULT_TITLE = 'SSC & HSC Notes, MCQ, PDF Download Free | EduMaster BD';
const DEFAULT_DESC = 'বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য ফ্রি নোট, MCQ, PDF, মডেল টেস্ট এবং গুরুত্বপূর্ণ প্রশ্ন।';
const DEFAULT_KEYWORDS = [
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
  'Free Online Learning Bangladesh'
];
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=630&q=80';
const BASE_URL = 'https://edumasterbd.vercel.app';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogType = 'website',
  ogImage,
  publishedTime,
  modifiedTime,
  author,
  breadcrumbs,
  faqs,
  articleData,
  courseData,
  quizData
}) => {
  const fullTitle = title
    ? title.includes('EduMaster BD')
      ? title
      : `${title} | EduMaster BD`
    : DEFAULT_TITLE;

  const fullDescription = description || DEFAULT_DESC;
  const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])].join(', ');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const fullCanonical = canonicalUrl || `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;
  const fullImage = ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to create or update meta tags
    const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMeta('name', 'description', fullDescription);
    setMeta('name', 'keywords', allKeywords);
    setMeta('name', 'author', author || 'EduMaster BD Team');
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. OpenGraph Meta
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', fullDescription);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:image', fullImage);
    setMeta('property', 'og:site_name', 'EduMaster BD');
    setMeta('property', 'og:locale', 'bn_BD');

    if (publishedTime) {
      setMeta('property', 'article:published_time', publishedTime);
    }
    if (modifiedTime) {
      setMeta('property', 'article:modified_time', modifiedTime);
    }
    if (author) {
      setMeta('property', 'article:author', author);
    }

    // 4. Twitter Cards
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', fullDescription);
    setMeta('name', 'twitter:image', fullImage);
    setMeta('name', 'twitter:creator', '@edumasterbd');

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonical);

    // 6. JSON-LD Schemas injection
    const scriptId = 'edumaster-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: any[] = [
      // Base Organization Schema
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'EduMaster BD',
        url: BASE_URL,
        logo: `${BASE_URL}/icon-512.png`,
        description: DEFAULT_DESC,
        sameAs: [
          'https://facebook.com/groups/edumasterbd',
          'https://youtube.com/@edumasterbd',
          'https://t.me/edumasterbd'
        ]
      },
      // Base WebSite with SearchAction
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'EduMaster BD',
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ];

    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL
          },
          ...breadcrumbs.map((b, index) => ({
            '@type': 'ListItem',
            position: index + 2,
            name: b.name,
            item: b.url.startsWith('http') ? b.url : `${BASE_URL}${b.url}`
          }))
        ]
      });
    }

    // FAQ Schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }

    // Article Schema
    if (articleData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: articleData.headline,
        description: articleData.description,
        image: articleData.image || fullImage,
        datePublished: articleData.datePublished || new Date().toISOString(),
        dateModified: articleData.dateModified || articleData.datePublished || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: articleData.authorName || 'EduMaster Editorial Mentor'
        },
        publisher: {
          '@type': 'Organization',
          name: 'EduMaster BD',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/icon-512.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullCanonical
        }
      });
    }

    // Course / Educational Subject Schema
    if (courseData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: courseData.name,
        description: courseData.description,
        provider: {
          '@type': 'Organization',
          name: courseData.provider || 'EduMaster BD',
          sameAs: BASE_URL
        },
        educationalLevel: courseData.educationalLevel,
        isAccessibleForFree: true
      });
    }

    // Quiz Schema
    if (quizData) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: quizData.name,
        description: quizData.description,
        timeRequired: quizData.timeRequired || 'PT15M',
        isAccessibleForFree: true,
        educationalUse: 'assessment'
      });
    }

    scriptTag.textContent = JSON.stringify(schemas);

  }, [
    fullTitle,
    fullDescription,
    allKeywords,
    fullCanonical,
    fullImage,
    ogType,
    publishedTime,
    modifiedTime,
    author,
    breadcrumbs,
    faqs,
    articleData,
    courseData,
    quizData
  ]);

  return null;
};
