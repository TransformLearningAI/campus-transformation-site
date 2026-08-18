'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CampusNav() {
  const pathname = usePathname()

  return (
    <header style={{ background: '#12294a', borderBottom: '3px solid #e0a02e', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 28, height: 74 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flex: '0 0 auto' }}>
          <svg width="23" height="30" viewBox="0 0 24 32" fill="none" aria-hidden="true">
            <path d="M2 30V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v26" stroke="#e0a02e" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M17 4l5 4v22" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="13.5" cy="17" r="1.4" fill="#ffffff"/>
          </svg>
          <span style={{ fontWeight: 800, letterSpacing: '-0.025em', fontSize: 19, lineHeight: 1.05, color: '#fff' }}>
            Campus Transformation
            <span style={{ display: 'block', fontWeight: 400, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#e0a02e', marginTop: 2 }}>A Transform Learning initiative</span>
          </span>
        </Link>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 24, alignItems: 'center', fontSize: 14.5 }}>
          <Link href="/about" className="nav-link" style={{ color: '#cfd8e6', textDecoration: 'none' }}>About</Link>
          <Link href="/blog" className="nav-link" style={{ color: '#cfd8e6', textDecoration: 'none' }}>Blog</Link>
          <Link href="/cases" className="nav-link" style={{ color: '#cfd8e6', textDecoration: 'none' }}>Case Studies</Link>
          <Link href="/lookup" className="nav-link" style={{ color: '#cfd8e6', textDecoration: 'none' }}>Look Up Your School</Link>
          <Link href="/sample-report.html" className="nav-link" style={{ color: '#cfd8e6', textDecoration: 'none' }}>Sample Report</Link>
          <Link href="/inquiry" style={{ background: '#e0a02e', color: '#0b1c34', fontWeight: 700, padding: '9px 17px', borderRadius: 3, textDecoration: 'none', fontSize: 14.5 }}>
            One-Pathway Scan
          </Link>
        </nav>
      </div>
      <style jsx global>{`
        @media(max-width:860px){ .nav-link { display: none !important; } }
      `}</style>
    </header>
  )
}
