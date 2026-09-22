export default function sitemap() {
  const base = 'https://campustransformation.org'

  return [
    // Core pages
    { url: base, lastModified: '2026-09-08', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/process`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cases`, lastModified: '2026-09-08', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/inquiry`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/lookup`, lastModified: '2026-07-08', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/simulation`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/game`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/market-context`, lastModified: '2026-09-08', changeFrequency: 'weekly', priority: 0.8 },

    // Blog index
    { url: `${base}/blog`, lastModified: '2026-09-08', changeFrequency: 'weekly', priority: 0.9 },

    // Blog posts
    { url: `${base}/blog/my-college-is-closing`, lastModified: '2026-09-15', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/the-ones-who-made-it`, lastModified: '2026-09-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/its-not-just-the-small-ones`, lastModified: '2026-09-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/whose-job-is-this`, lastModified: '2026-08-20', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/its-never-the-carburetor`, lastModified: '2026-07-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/ten-questions-before-any-irreversible-vote`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/the-ones-who-turned-marygrove`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/anatomy-of-a-closure-iowa-wesleyan`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/when-colleges-close-communities-dont-have-to`, lastModified: '2026-06-15', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/the-math-nobody-talks-about`, lastModified: '2026-05-26', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/oakland-city-doesnt-have-to-die`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/cake-ai-and-the-cliff`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/the-buildings-are-trying-to-tell-us-something`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/beyond-the-college`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog/what-your-board-isnt-hearing`, lastModified: '2026-05-21', changeFrequency: 'monthly', priority: 0.7 },
  ]
}
