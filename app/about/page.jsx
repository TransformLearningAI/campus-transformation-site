import Link from 'next/link'

export const metadata = {
  title: 'About — Campus Transformation',
  description: 'Educators, strategists, and community developers who help colleges find revenue in underused buildings — without closing.',
}

export default function AboutPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">About</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 20px', maxWidth: '20ch' }}>
            Built from the inside.
          </h1>
          <p style={{ fontSize: 18, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Our team spent decades inside the institutions now facing closure. We built Campus Transformation because we believe campuses should outlive their accreditation.
          </p>
        </div>
      </div>

      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">What we do</h2>
          <p className="v2-lede">
            We help colleges find revenue in underused buildings and land &mdash; without closing, changing their mission, or spending capital. We read your delegation-of-authority policy, your accreditor&rsquo;s rules, and your region&rsquo;s workforce data before we recommend anything.
          </p>
          <p style={{ color: 'var(--ink-2)', maxWidth: '66ch', marginBottom: 32 }}>
            Most consulting firms start with a grand plan. We start with one building. The right first move is almost always the one requiring the fewest signatures, the least capital, and the shortest path to revenue. If that works, everything else gets easier.
          </p>
        </div>
      </section>

      {/* Team — anonymized for now */}
      <section className="v2-section v2-alt">
        <div className="wrap">
          <h2 className="v2-h2">Not a consulting report. A crew.</h2>
          <p className="v2-lede">We don&rsquo;t hand your school a binder and a bill. We make the calls, knock on the doors, find the money, and sit in the rooms until something gets signed.</p>
          <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '16px 20px' }}>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>A 25-year professor turned builder. AI tools deployed in multiple countries. The one on the phone.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '16px 20px' }}>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>An associate academic dean at a major research university. Sees the whole board: what a faculty will accept, what a president can carry, what a plan needs to survive a meeting.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '16px 20px' }}>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>A former superintendent who ran a $137M school system and oversaw 108 schools. Knows how to move a large, proud, worried institution.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '16px 20px' }}>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>A founder and builder who started his own company and built one of the largest academic programs on a college campus from scratch.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '16px 20px' }}>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>A Peace Corps veteran who delivered projects for global development firms in places where nothing is easy. Process, follow-through, and the calls that get returned.</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: '62ch', marginTop: 24, lineHeight: 1.6 }}>More than a group of academic executives: a team that&rsquo;s run the institutions, built the programs, and knows the people. The deal work &mdash; leases, bonds, land &mdash; happens with specialized higher-ed counsel and development partners we bring to your side of the table.</p>
        </div>
      </section>

      {/* Fix 14 — Track record honesty */}
      <section className="v2-section">
        <div className="wrap">
          <p style={{ fontSize: 15.5, color: 'var(--ink-2)', maxWidth: '64ch', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--navy)' }}>A note on our track record, because you&rsquo;ll ask.</strong> Campus Transformation is a young practice built by people with long careers inside these institutions. We don&rsquo;t yet have a list of completed client engagements to hand you &mdash; what we have is our published research, our case files on colleges that did this successfully, the sample report you can read right now, and a working method we&rsquo;ll demonstrate on your campus for free. We&rsquo;d rather show you than assure you. And when you&rsquo;re ready to check us out, we&rsquo;ll gladly connect you with people who know our work.
          </p>
        </div>
      </section>

      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">What we believe</h2>
          <blockquote style={{ marginBottom: 32 }}>A college with three good years left has options a college with three good months does not.</blockquote>
          <p style={{ color: 'var(--ink-2)', maxWidth: '66ch', marginBottom: 20 }}>
            We believe campuses are community infrastructure &mdash; as important as libraries, hospitals, and town halls. Selling them to developers is the last option, not the first. Every campus we work with gets an honest assessment: if transformation doesn&rsquo;t fit, we say so.
          </p>
          <p style={{ color: 'var(--ink-2)', maxWidth: '66ch' }}>
            Campus Transformation is an initiative of <a href="https://transformlearning.ai" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Transform Learning</a>.
          </p>
        </div>
      </section>

      {/* Fix 15a — Disclosure */}
      <section style={{ padding: '20px 0', background: 'var(--paper)' }}>
        <div className="wrap">
          <p style={{ fontSize: 12.5, color: '#8b9099', maxWidth: '64ch', margin: 0, lineHeight: 1.6 }}>This is general information, not legal or financial advice. Decisions about debt, accreditation, and property belong with your counsel and advisors &mdash; we work alongside them, not in place of them.</p>
        </div>
      </section>

      <div className="v2-offer">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h2 className="v2-h2" style={{ maxWidth: 'none' }}>Ready to talk?</h2>
          <p style={{ color: '#c2cfe0', marginBottom: 30, maxWidth: '50ch', marginLeft: 'auto', marginRight: 'auto' }}>
            The first conversation is free, confidential, and comes with no obligation.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, justifyContent: 'center' }}>
            <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
            <a className="v2-btn v2-btn-b" href="mailto:jeff@transformlearning.ai">Email Jeff directly</a>
          </div>
        </div>
      </div>
    </>
  )
}
