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

      <section className="v2-section v2-alt">
        <div className="wrap">
          <h2 className="v2-h2">Who we are</h2>
          <p className="v2-lede">
            Professors, administrators, business strategists, workforce developers, and community builders. People who watched campuses close from the inside and decided to do something about it.
          </p>
          <div className="v2-req">
            <div>
              <span className="no">Education</span>
              <p>25+ years in higher education. Curriculum design, accreditation navigation, faculty transition planning. We understand the institutional culture because we lived in it.</p>
            </div>
            <div>
              <span className="no">Workforce</span>
              <p>Workforce program design, employer partnership development, industry certification pathways. We know what employers actually pay for, because we ask them.</p>
            </div>
            <div>
              <span className="no">Finance</span>
              <p>Grant writing, bond restructuring strategy, revenue modeling, federal funding navigation. WIOA, EDA, USDA Rural Development, New Markets Tax Credits &mdash; we know the programs and the application processes.</p>
            </div>
            <div>
              <span className="no">Community</span>
              <p>Municipal partnership development, community visioning, stakeholder engagement. A campus transformation that ignores the community around it will fail. We start there.</p>
            </div>
          </div>
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
