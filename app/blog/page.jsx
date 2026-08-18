import Link from 'next/link'
import { CT_POSTS } from './posts'

export const metadata = {
  title: 'Blog — Campus Transformation',
  description: 'Thought leadership on campus transformation, college closures, and reimagining higher education for boards, presidents, and community leaders.',
  alternates: { canonical: 'https://campustransformation.org/blog' },
}

export default function BlogPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">Blog</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 20px', maxWidth: '24ch' }}>
            Thinking out loud about what comes next.
          </h1>
          <p style={{ fontSize: 18, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Honest writing about campus closures, community transformation, and the future of small colleges &mdash; for the people making the hardest decisions.
          </p>
        </div>
      </div>

      <section style={{ padding: '60px 0', background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div style={{ display: 'grid', gap: 24 }}>
            {CT_POSTS.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.slug}
                    style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid var(--rule)', borderTop: '4px solid var(--navy)', padding: '26px 24px', transition: 'transform .15s, border-color .15s' }}
                    className="card-lift">
                <p style={{ fontSize: 12, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8b9099', margin: '0 0 8px' }}>{post.date} &middot; {post.author}</p>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: 'var(--navy)', letterSpacing: '-0.015em', margin: '0 0 8px' }}>{post.title}</h2>
                <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.58, margin: '0 0 12px' }}>{post.summary}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--amber-deep)', margin: 0 }}>Read &rarr;</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
