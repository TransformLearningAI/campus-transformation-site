import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import CampusNav from '@/components/CampusNav'

export const metadata = {
  metadataBase: new URL('https://campustransformation.org'),
  title: 'Campus Transformation — Start with one building.',
  description: 'Most colleges under financial pressure get handed two options: reinvent everything, or close. There is a third. Find one underused building, match it to something the region needs, and let somebody else pay to build it.',
  keywords: ['campus transformation', 'college closure', 'workforce development', 'community hub', 'WIOA', 'higher education crisis', 'campus reuse', 'one-pathway scan'],
  openGraph: {
    title: 'Campus Transformation — Start with one building.',
    description: 'Find one underused building, match it to something the region needs, and let somebody else pay to build it. No grand plan. One pathway. One signature.',
    url: 'https://campustransformation.org',
    siteName: 'Campus Transformation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Transformation — Start with one building.',
    description: 'Find one underused building, match it to something the region needs, and let somebody else pay to build it.',
  },
  alternates: {
    canonical: 'https://campustransformation.org',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Campus Transformation",
  "url": "https://campustransformation.org",
  "description": "Consulting practice that helps colleges find revenue in underused buildings and land — without closing, changing their mission, or spending capital.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <CampusNav />
        {children}
        <footer className="v2-footer">
          <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between', alignItems: 'center' }}>
            <div><b>Campus Transformation</b> — an initiative of Transform Learning</div>
            <div><a href="/market-context" style={{ color: '#7f92ab', textDecoration: 'none' }}>Market context</a> · jeff@transformlearning.ai</div>
          </div>
          <div className="wrap" style={{ marginTop: 12, fontSize: 12, color: '#6b7a8d', lineHeight: 1.6 }}>
            We use AI extensively in our research and verify what matters by hand and by phone. We never publish or share who reads, runs a report, or talks to us.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
