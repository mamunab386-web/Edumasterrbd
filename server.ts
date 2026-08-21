import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Google Search Console Site Verification File route
  app.get('/googleca963865ef8ae607.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('google-site-verification: googleca963865ef8ae607.html');
  });

  // Generic Google Search Console HTML verification handler
  app.get('/google:code.html', (req, res) => {
    const code = req.params.code;
    res.setHeader('Content-Type', 'text/html');
    res.send(`google-site-verification: google${code}.html`);
  });

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login
Disallow: /signup

Sitemap: https://edumasterbd.vercel.app/sitemap.xml
`);
  });

  // Sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    const baseUrl = 'https://edumasterbd.vercel.app';
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/mcq</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/test</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/model-tests</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/pdf</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/board-questions</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-physics</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-chemistry</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-biology</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-math</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-higher-math</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-ict</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-bangla-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ssc/ssc-english-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc/hsc-physics-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc/hsc-chem-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc/hsc-bio-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc/hsc-math-1</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hsc/hsc-ict</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes/ssc-physics-motion-summary-and-formulas</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes/hsc-physics-vector-dot-cross-product-handnote</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes/hsc-ict-c-programming-revision-guide</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/notes/ssc-chemistry-periodic-table-tricks-and-properties</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/how-to-get-gpa-5-in-ssc-study-strategy-and-routine</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/hsc-ict-c-programming-html-full-marks-guide</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>${baseUrl}/test/test-ssc-phy-final</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>${baseUrl}/test/test-hsc-phy-vec-final</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>${baseUrl}/test/test-hsc-ict-grand</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
</urlset>`;
    res.send(sitemapXml);
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini API Curriculum Content Generation Endpoint with Multi-Model Fallback & Retry
  app.post('/api/curriculum/generate', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on server',
        fallbackNeeded: true
      });
    }

    const {
      classLevel = 'ssc',
      subjectName = 'বিজ্ঞান',
      chapterTitle = 'সাধারণ অধ্যায়',
      contentType = 'hand_note',
      difficulty = 'medium',
      mcqCount = 10,
      language = 'bangla',
      customTopic = '',
      board = 'সকল বোর্ড স্পেশাল'
    } = req.body;

    const prompt = `You are a distinguished national academic author, professor, and NCTB curriculum specialist for Bangladeshi Secondary (SSC) and Higher Secondary (HSC) education.
Generate comprehensive, 100% accurate, highly educational content tailored specifically for Bangladeshi students.

ACADEMIC SPECIFICATIONS:
- Class / Academic Tier: ${classLevel.toUpperCase()} (Bangladeshi National Curriculum)
- Subject: ${subjectName}
- Target Chapter: ${chapterTitle}
- Content Format / Type: ${contentType}
- Difficulty Level: ${difficulty} (easy = basic foundation, medium = board standard, hard = advanced board topper & admission)
- Primary Language: ${language} (Natural, high-clarity Bengali with standard English scientific terms in brackets where helpful)
- MCQ Question Count (if applicable): ${mcqCount}
- Focus Topic / Sub-unit: ${customTopic || chapterTitle}
- Board Target / Exam Year: ${board} (SSC/HSC 2025-2026 Curriculum)

STRICT REQUIREMENTS BY CONTENT TYPE:
1. If content type is "hand_note" (পূর্ণাঙ্গ হ্যান্ডনোট):
   Structure your response with clear Markdown headers:
   # [Engaging & Formal Bangla Title matching ${subjectName}: ${chapterTitle}]
   > **শ্রেণী:** ${classLevel.toUpperCase()} | **বিষয়:** ${subjectName} | **অধ্যায়:** ${chapterTitle} | **বোর্ড টার্গেট:** ${board}

   ## ১. শিখনফল (Learning Outcomes)
   ## ২. ভূমিকা ও প্রাথমিক ধারণা (Introduction & Core Concepts)
   ## ৩. গুরুত্বপূর্ণ পরিভাষা ও সংজ্ঞা (Key Definitions with Scientific Precision)
   ## ৪. বিস্তারিত মূল পাঠ ও তাত্ত্বিক বিশ্লেষণ (Deep Dive & Subject-Specific Mechanics)
   ## ৫. প্রয়োজনীয় সূত্র, সমীকরণ ও নিয়মের তালিকা (Key Formulas, Chemical Reactions, Biological Processes or Grammar Rules with clear explanations and SI units)
   ## ৬. বাস্তব উদাহরণ, গাণিতিক/সৃজনশীল সমস্যা ও সমাধান (Real Examples with step-by-step solutions)
   ## ৭. সাধারণ ভুল ও সতর্কতা (Common Traps & Student Mistakes in Board Exams)
   ## ৮. বোর্ড পরীক্ষার টপ সিক্রেট টিপস ও শর্টকাট কৌশল (Exam Shortcuts & High-Scoring Tips)
   ## ৯. একনজরে দ্রুত রিভিশন চার্ট (Quick Revision Table/Summary)
   ## ১০. অধ্যায়ের সমাপ্তি ও চূড়ান্ত বার্তা (Key Takeaways)

2. If content type is "mcq_set" or "model_test" (MCQ প্রশ্ন ব্যাংক):
   Generate exactly ${mcqCount} unique, high-yield board standard multiple choice questions specifically for ${subjectName} - ${chapterTitle}.
   For EACH question:
   - Provide the question in clear Bengali.
   - Provide 4 distinct options: (ক), (খ), (গ), (ঘ).
   - Provide the Correct Answer (ক/খ/গ/ঘ).
   - Provide a detailed mathematical/scientific/logical explanation why that answer is correct.

3. If content type is "formula_sheet" (সূত্র শিট):
   Create a complete, beautifully structured Markdown table listing all laws, equations, reactions, or rules for ${subjectName} - ${chapterTitle}, with variables defined, SI units, and shortcut application tricks.

4. If content type is "important_questions" (সৃজনশীল ও ক/খ প্রশ্ন):
   Generate board-standard জ্ঞানমূলক (ক), অনুধাবনমূলক (খ), প্রয়োগমূলক (গ) ও উচ্চতর দক্ষতা (ঘ) questions with model solutions, past board exam citations, and 5-star importance ratings.

Please ensure the content strictly matches ${subjectName} and ${chapterTitle} and does not genericize into unrelated subjects. Return pristine Markdown.`;

    const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let generatedText = '';
    let lastError: any = null;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Try candidate models in order with resilience
    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt
        });

        if (response && response.text && response.text.trim().length > 30) {
          generatedText = response.text;
          break; // Success!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} temporarily unavailable (${err?.status || err?.message}), attempting fallback...`);
        // Brief pause before fallback attempt
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (generatedText) {
      return res.json({
        success: true,
        content: generatedText,
        title: customTopic || `${classLevel.toUpperCase()} ${subjectName}: ${chapterTitle} — বিশেষ প্রস্তুতি ও গাইড`,
        summary: `${classLevel.toUpperCase()} ${subjectName} বিষয়ের ${chapterTitle} অধ্যায়ের পূর্ণাঙ্গ প্রস্তুতি ও বিশ্লেষণ।`,
        tags: [classLevel.toUpperCase(), subjectName, chapterTitle, contentType]
      });
    }

    // Graceful fallback response so the client smoothly generates high-quality content without breaking
    console.warn('Gemini models temporarily busy, signaling client to use domain curriculum engine.');
    return res.status(200).json({
      success: false,
      error: lastError?.message || 'Gemini model is currently experiencing high demand',
      fallbackNeeded: true
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduMaster BD Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
