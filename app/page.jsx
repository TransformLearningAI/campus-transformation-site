import Link from 'next/link'

export const metadata = {
  title: 'Campus Transformation — Start with one building.',
  description: 'Most colleges under financial pressure get handed two options: reinvent everything, or close. There is a third. One building. One pathway. One signature.',
  alternates: { canonical: 'https://campustransformation.org' },
}

const CASES = [
  { school: 'Cheyney University', where: 'Pennsylvania', desc: 'Had close to 400,000 square feet of building space sitting unoccupied or underused, and opened it to private tenants. Eight companies are on campus now — agribusiness, cancer research, solar manufacturing, additive manufacturing — alongside stadium and auditorium rentals.', result: 'A $7.4M deficit became a $2.1M surplus. First balanced budget in eight years.' },
  { school: 'Purchase College, SUNY', where: 'New York', desc: 'Ground-leased 40 acres to a life-plan senior living community, financed with public bonds. No college capital at risk at any point.', result: '$2 million a year in rent, directed by statute to student scholarships and new faculty lines.' },
  { school: 'Warren Wilson College', where: 'North Carolina', desc: 'Sold 191 of its 1,100 acres to a land conservancy — with a cooperative management agreement that keeps the college grazing the pasture and teaching in the forest.', result: '$4.7 million, against a $5.5 million deficit. They sold the asset without losing the use of it.' },
  { school: 'Goucher College', where: 'Maryland', desc: 'Ground-leased three acres out of 287 to a neighboring senior living operator for 127 independent-living apartments.', result: 'Zero construction capital from the college. Three acres is a proposal a president can carry into a room.' },
  { school: "D'Youville University", where: 'New York', desc: 'Built a health professions building in which a regional health system staffs and operates a community clinic, alongside student simulation space and workforce retraining.', result: 'The health system raised $5.07 million toward the project. It is the tenant and the operator.' },
  { school: 'Lackawanna College', where: 'Pennsylvania', desc: 'A $10 million technology center in a former factory, funded by state money, the Appalachian Regional Commission, and a private energy company. Separately, employers pay tuition directly for their own staff.', result: 'The college built it without spending its own capital.' },
  { school: 'Dakota Wesleyan University', where: 'South Dakota', desc: 'A regional health system funds nursing students\u2019 junior and senior years in exchange for a three-year work commitment after graduation.', result: '$20,000 per student, employer-funded. The health system asked for it.' },
  { school: 'Alvernia University', where: 'Pennsylvania', desc: 'Bought and repurposed downtown buildings instead of expanding the campus — a community health center with a local provider, an incubator, a YMCA partnership, ground-floor retail.', result: '$43 million invested, $18.5 million of it in secured redevelopment resources including state capital grants.' },
]

const STREAMS = [
  { tag: 'Start here', tagClass: 't-start', title: 'Space leasing', desc: 'Unused classroom, lab, or office space to private tenants. Officer-level signature in most delegation policies.' },
  { tag: 'Start here', tagClass: 't-start', title: 'Facility rental', desc: 'Stadium, gym, auditorium, commercial kitchen, conference and summer use. Revenue from assets you already heat.' },
  { tag: 'Start here', tagClass: 't-start', title: 'Agency and nonprofit co-location', desc: 'Child care, health clinic, county services, workforce center. Often the thing the region is most visibly short of.' },
  { tag: 'Partner-funded', tagClass: 't-partner', title: 'Employer-paid training', desc: 'Employers fund seats or full tuition for their own workforce. Apprenticeships and custom contracts.' },
  { tag: 'Partner-funded', tagClass: 't-partner', title: 'Health system partnership', desc: 'A hospital operates clinical or training space on campus and brings its own capital and staffing.' },
  { tag: 'Partner-funded', tagClass: 't-partner', title: 'Housing on surplus land', desc: 'Senior living, workforce housing, or dorm conversion. A developer builds it; you contribute the site.' },
  { tag: 'Board decision', tagClass: 't-board', title: 'Ground lease of acreage', desc: 'Long-term lease of unused land. Larger and slower, and usually a scheduled board item.' },
  { tag: 'Board decision', tagClass: 't-board', title: 'Conservation or parcel sale', desc: 'Selling land you no longer use, sometimes while keeping the right to use it. Full board, every time.' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '72px 0 84px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ content: '""', position: 'absolute', right: -140, top: -60, width: 520, height: 520, background: 'radial-gradient(circle at center, rgba(224,160,46,.16), transparent 62%)' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <p className="v2-kicker">For colleges that are still working, and would rather stay that way</p>
          <h1 style={{ fontSize: 'clamp(42px, 7vw, 74px)', lineHeight: 1.02, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 26px', maxWidth: '16ch' }}>
            Start with one building.
          </h1>
          <p style={{ fontSize: 19.5, lineHeight: 1.62, color: '#c9d4e4', maxWidth: '62ch', margin: '0 0 34px' }}>
            Most colleges under financial pressure get handed the same two options: reinvent everything, or close. There is a third one almost nobody talks about. Find <strong style={{ color: '#fff', fontWeight: 600 }}>one underused building or one unused parcel</strong>, match it to something the region is actually short of, and let somebody else pay to build it. One pathway. One signature. No grand plan.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, alignItems: 'center' }}>
            <a className="v2-btn v2-btn-a" href="#scan">See what one building could do</a>
            <a className="v2-btn v2-btn-b" href="#cases">Look up your school</a>
          </div>
          <p style={{ marginTop: 44, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.15)', fontSize: 14, color: '#8fa2bd' }}>
            <b style={{ color: 'var(--amber)', fontWeight: 700, letterSpacing: '.04em' }}>ONE BUILDING. ONE SIGNATURE. ONE NEW REVENUE LINE.</b> &nbsp;&middot;&nbsp; Campus Transformation is an initiative of Transform Learning.
          </p>
        </div>
      </div>

      {/* What this does not require */}
      <section className="v2-section" id="not-require">
        <div className="wrap">
          <h2 className="v2-h2">What this does not require</h2>
          <p className="v2-lede">The reason most transformation proposals go nowhere is not that boards disagree with them. It is that saying yes costs more than saying nothing. A single-pathway project is built the other way around.</p>
          <div className="v2-req">
            <div>
              <span className="no">No board vote, usually</span>
              <p>A term lease or license of one building typically sits inside the authority already delegated to a president or CFO. Selling property almost always needs the full board. Leasing it often does not. We read your delegation-of-authority policy first and tell you which side of that line you are on, before you take it to anyone.</p>
            </div>
            <div>
              <span className="no">No accreditation change</span>
              <p>Sale or lease of real property is not a substantive change under federal rules, and is not a reportable category for SACSCOC, HLC, or MSCHE. New England institutions accredited by NECHE do carry a filing on significant leases and asset dispositions. We will say so up front rather than let you find out later.</p>
            </div>
            <div>
              <span className="no">No change to your mission</span>
              <p>That is the one thing we will not ask you to touch. A substantial change to an institution&rsquo;s mission requires accreditor approval, and reopening the mission statement starts a board fight on top of it. Every pathway on this site is designed to work with your mission exactly as written.</p>
            </div>
            <div>
              <span className="no">No capital from the college</span>
              <p>In every model below, somebody else funded the building &mdash; a developer, a state workforce grant, a federal rural facilities program, a health system, a community foundation, an employer. Your contribution is the site.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="v2-section v2-alt" id="cases">
        <div className="wrap">
          <h2 className="v2-h2">Colleges doing this right now &mdash; and still open</h2>
          <p className="v2-lede">Not turnaround stories. Not closure stories. Colleges that stayed colleges and found money somewhere other than tuition.</p>
          <div className="v2-cases">
            {CASES.map(c => (
              <div className="v2-case" key={c.school}>
                <p className="school">{c.school}</p>
                <p className="where">{c.where}</p>
                <p>{c.desc}</p>
                <p className="v2-result">{c.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early warning */}
      <section className="v2-section" id="early">
        <div className="wrap">
          <h2 className="v2-h2">You do not have to be in crisis to read this page</h2>
          <p className="v2-lede">Almost everything written about small colleges is written about the ones already in trouble. This is for the ones still working &mdash; enrolling students, making payroll, doing it on a thinner margin every year &mdash; that would rather add a revenue line now than have the other conversation later.</p>
          <blockquote>A college with three good years left has options a college with three good months does not. It can negotiate a lease instead of accepting an offer, choose a partner instead of taking the only one, and move on its own calendar.</blockquote>
        </div>
      </section>

      {/* Eight pathways */}
      <section className="v2-section v2-alt" id="streams">
        <div className="wrap">
          <h2 className="v2-h2">Eight ways a campus earns without becoming something else</h2>
          <p className="v2-lede">You do not need eight. You need one. Each is tagged by what it actually asks of you, because the right first move is almost always the one requiring the fewest signatures.</p>
          <div className="v2-streams">
            {STREAMS.map(s => (
              <div className="v2-stream" key={s.title}>
                <span className={`v2-tag ${s.tagClass}`}>{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-Pathway Scan */}
      <div className="v2-offer" id="scan">
        <div className="wrap">
          <h2 className="v2-h2">The One-Pathway Scan</h2>
          <p className="v2-lede">Free, confidential, and narrow on purpose.</p>
          <div className="v2-steps">
            <div className="v2-step"><span className="n">01</span><p>Tell us which building or parcel is least used. That is the entire intake.</p></div>
            <div className="v2-step"><span className="n">02</span><p>We spend two weeks on the public record &mdash; what your region is short of, what federal and state money already flows there, what your zoning permits, and who at your institution can sign what.</p></div>
            <div className="v2-step"><span className="n">03</span><p>You get one recommendation. Not eight. One, with the funding program named and the approval path mapped.</p></div>
          </div>
          <p style={{ fontSize: 14.5, color: '#8fa2bd', maxWidth: '60ch', margin: '0 0 30px' }}>
            No presentation to your board. No engagement letter. No obligation of any kind. One conversation and one document, and if the answer is that nothing here fits your campus, we will tell you that instead.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 13, alignItems: 'center' }}>
            <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
            <a className="v2-btn v2-btn-b" href="mailto:jeff@transformlearning.ai">Email Jeff directly</a>
          </div>
        </div>
      </div>

      {/* Audience */}
      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">Where you&rsquo;re sitting</h2>
          <p className="v2-lede">The first conversation looks different depending on who is having it.</p>
          <div className="v2-aud">
            <Link href="/inquiry"><div className="role">Municipality or EDC</div><div className="say">&ldquo;There&rsquo;s a campus in my town and no plan for it.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">Board of Trustees</div><div className="say">&ldquo;We need an option that isn&rsquo;t closure.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">College President</div><div className="say">&ldquo;I&rsquo;m not in crisis. I&rsquo;d just rather not be, later.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">Foundation or Investor</div><div className="say">&ldquo;We want the anchor institution to survive.&rdquo;</div></Link>
          </div>
        </div>
      </section>
    </>
  )
}
