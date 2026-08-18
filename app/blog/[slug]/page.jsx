import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CT_POSTS } from '../posts'

export function generateStaticParams() {
  return CT_POSTS.map(post => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  const post = CT_POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Blog — Campus Transformation' }
  return {
    title: `${post.title} — Campus Transformation`,
    description: post.summary,
    alternates: { canonical: `https://campustransformation.org/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: 'Campus Transformation',
      type: 'article',
      authors: [post.author],
    },
  }
}

export default function BlogPost({ params }) {
  const post = CT_POSTS.find(p => p.slug === params.slug)
  if (!post) notFound()

  const renderBody = (text) => {
    return text.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return <h2 key={i} style={{ fontWeight: 800, fontSize: 19, color: 'var(--navy)', marginTop: 32, marginBottom: 12 }}>{paragraph.replace(/\*\*/g, '')}</h2>
      }
      let html = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--amber-deep);font-weight:600">$1</a>')
      if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.startsWith('**')) {
        return <p key={i} style={{ fontSize: 14, color: 'var(--ink-2)', fontStyle: 'italic', marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--rule)' }} dangerouslySetInnerHTML={{ __html: html }} />
      }
      if (paragraph.startsWith('>')) {
        return <blockquote key={i} dangerouslySetInnerHTML={{ __html: html.replace(/^>\s*/, '') }} />
      }
      return <p key={i} style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.62 }} dangerouslySetInnerHTML={{ __html: html }} />
    })
  }

  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Link href="/blog" style={{ fontSize: 14, color: 'var(--amber)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>&larr; All Posts</Link>
          <p style={{ fontSize: 12, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8fa2bd', marginBottom: 12 }}>{post.date} &middot; {post.author}</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.025em', fontWeight: 800, margin: 0 }}>{post.title}</h1>
        </div>
      </div>

      <section style={{ padding: '48px 0 74px', background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {renderBody(post.body)}
          </div>

          <div style={{ marginTop: 48, padding: 32, background: 'var(--navy)', borderRadius: 3, textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: '#c2cfe0', marginBottom: 16 }}>
              Facing a closure decision? The first conversation is free and confidential.
            </p>
            <Link href="/inquiry" className="v2-btn v2-btn-a">Request a One-Pathway Scan</Link>
          </div>
        </div>
      </section>
    </>
  )
}
