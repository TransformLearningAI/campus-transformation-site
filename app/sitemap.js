export default function sitemap() {
  const base = 'https://campustransformation.org'

  return [
    { url: base, lastModified: '2026-07-08', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/process`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/cases`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/inquiry`, lastModified: '2026-07-08', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/simulation`, lastModified: '2026-07-08', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/game`, lastModified: '2026-07-08', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: '2026-07-16', changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/its-never-the-carburetor`, lastModified: '2026-07-16', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/ten-questions-before-any-irreversible-vote`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/the-ones-who-turned-marygrove`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/anatomy-of-a-closure-iowa-wesleyan`, lastModified: '2026-07-11', changeFrequency: 'monthly', priority: 0.9 },
  ]
}
