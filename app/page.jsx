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
            <Link className="v2-btn v2-btn-b" href="/lookup">Look up your school</Link>
          </div>
          <p style={{ marginTop: 44, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.15)', fontSize: 14, color: '#8fa2bd' }}>
            <b style={{ color: 'var(--amber)', fontWeight: 700, letterSpacing: '.04em' }}>ONE BUILDING. ONE SIGNATURE. ONE NEW REVENUE LINE.</b> &nbsp;&middot;&nbsp; Campus Transformation is an initiative of Transform Learning.
          </p>
        </div>
      </div>

      {/* Fix 11 — Plain-words box */}
      <section style={{ padding: '28px 0', background: '#f8f5ee', borderBottom: '1px solid #e8e0d0' }}>
        <div className="wrap" style={{ maxWidth: '64ch' }}>
          <p style={{ fontSize: 15.5, color: 'var(--navy)', lineHeight: 1.7, margin: 0 }}>
            <strong>This site in five sentences.</strong> Your campus probably has one building or one piece of land that could earn money without changing what your college is. We find it, match it to something your region needs, and identify who would pay to build it &mdash; usually a government program, an employer, or a development partner, not you. The first step is a free report built from public records. The second is a free two-week study of your specific campus. You can stop at any step, and if we find nothing worth doing, we&rsquo;ll say so.
          </p>
        </div>
      </section>

      {/* Fix 17 — What's free and what isn't */}
      <section style={{ padding: '32px 0', background: 'var(--paper)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: '64ch' }}>
          <div>
            <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', margin: '0 0 8px' }}>What&rsquo;s free, and what you&rsquo;re paying for when you pay.</p>
          </div>
          <div></div>
          <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '18px 20px' }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#3c6b2e', margin: '0 0 8px', letterSpacing: '.04em', textTransform: 'uppercase' }}>Free, forever</p>
            <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>The report on your region and campus, built from public records. The sample report. The two-week One-Pathway Scan, ending in one recommendation. Free because software and public data do that work, and because you shouldn&rsquo;t pay to find out whether there&rsquo;s anything here.</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: '18px 20px' }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--amber-deep)', margin: '0 0 8px', letterSpacing: '.04em', textTransform: 'uppercase' }}>What costs money</p>
            <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>The part no software can do. Building relationships with the health system, the workforce board, the developer who would fund your project. Deep research into your bylaws, your delegation policy, and the specific grant programs that fit. Communication strategy for your board, your faculty, and your community. Writing the proposal a funder says yes to, and staying with you through the first signature. That&rsquo;s the work &mdash; strategy, relationships, and execution, scoped and priced before you commit to a dollar.</p>
          </div>
        </div>
      </section>

      {/* What this does not require */}
      <section className="v2-section" id="not-require">
        <div className="wrap">
          <h2 className="v2-h2">What this does not require</h2>
          <p className="v2-lede">The reason most transformation proposals go nowhere is not that boards disagree with them. It is that saying yes costs more than saying nothing. A single-pathway project is built the other way around.</p>
          <div className="v2-req">
            <div>
              <span className="no">Within authority your board has already delegated</span>
              <p>Most boards have already delegated lease, license, and grant-application authority to the president or CFO &mdash; it&rsquo;s in your signature policy. A single-pathway project is designed to fit inside that existing delegation, so that what eventually reaches your board isn&rsquo;t a blank question but a working proposal with the risk already taken out. Boards get better decisions when the first version arrives de-risked. We&rsquo;ll read your bylaws and delegation policy and tell you exactly which side of the line your project falls on.</p>
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
          <p style={{ fontSize: 12.5, color: '#8b9099', maxWidth: '64ch', marginTop: 24, lineHeight: 1.6 }}>This is general information, not legal or financial advice. Decisions about debt, accreditation, and property belong with your counsel and advisors &mdash; we work alongside them, not in place of them.</p>
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

      {/* Fix 12c — Enrollment and revenue */}
      <section className="v2-section" style={{ padding: '40px 0' }}>
        <div className="wrap">
          <p style={{ fontSize: 15.5, color: 'var(--ink-2)', maxWidth: '64ch', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--navy)' }}>Some pathways make money. Some make students. Several do both.</strong> Employer-sponsored training seats become degree pipelines &mdash; at Dakota Wesleyan, a health system pays $20,000 per nursing student who commits to work there after graduation. A health-system partnership brings clinical placements that recruit for you. New revenue isn&rsquo;t a rival to enrollment; done right, it&rsquo;s a feeder &mdash; and it means your enrollment target stops being the only thing holding up the budget.
          </p>
        </div>
      </section>

      {/* Team section — anonymized for now */}
      <section className="v2-section">
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
          <p style={{ marginTop: 16 }}><Link href="/about" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>More about us &rarr;</Link></p>
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

      {/* Fix 13 — What can go wrong */}
      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">What can go wrong &mdash; because something can</h2>
          <p className="v2-lede" style={{ maxWidth: '64ch' }}>A serious proposal names its risks, so here are ours. <strong>A partner can walk</strong> &mdash; which is why we structure first commitments as leases and MOUs you can unwind, not conveyances you can&rsquo;t. <strong>A tenant can underperform or default</strong> &mdash; which is why the lease, not a revenue projection, defines your downside, and why we never publish projected revenue for your campus. <strong>A town can resist</strong> &mdash; which is why community benefit leads every proposal we write, and why we check zoning before you spend anything. <strong>A grant can fall through</strong> &mdash; which is why we prefer programs with rolling deadlines and name a second funding path in every proposal. <strong>And the whole idea can simply be wrong for your campus</strong> &mdash; which is why the Scan is free, and why &ldquo;nothing here is worth doing&rdquo; is an answer we actually give.</p>
        </div>
      </section>

      {/* Audience */}
      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">Where you&rsquo;re sitting</h2>
          <p className="v2-lede">The first conversation looks different depending on who is having it.</p>
          <div className="v2-aud">
            <Link href="#towns"><div className="role">Municipality or EDC</div><div className="say">&ldquo;There&rsquo;s a campus in my town and no plan for it.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">Board of Trustees</div><div className="say">&ldquo;We need an option that isn&rsquo;t closure.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">College President</div><div className="say">&ldquo;I&rsquo;m not in crisis. I&rsquo;d just rather not be, later.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">Enrollment / Admissions Leader</div><div className="say">&ldquo;I need the revenue pressure taken off my enrollment number.&rdquo;</div></Link>
            <Link href="/inquiry"><div className="role">Foundation or Investor</div><div className="say">&ldquo;We want the anchor institution to survive.&rdquo;</div></Link>
          </div>
        </div>
      </section>
      {/* Municipal landing — Fix 10 verbatim */}
      <section className="v2-section v2-alt" id="towns">
        <div className="wrap">
          <h2 className="v2-h2">For the town that hosts a campus</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: '64ch', lineHeight: 1.62, marginBottom: 20 }}>
            If the college in your community is struggling &mdash; or already gone &mdash; the campus is still your problem and still your opportunity. You don&rsquo;t need the college&rsquo;s permission to plan.
          </p>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: '64ch', lineHeight: 1.62, marginBottom: 20 }}>
            A campus reuse feasibility study is the fastest, cheapest first step a municipality can take: Ashland, Wisconsin commissioned one for $7,500 after Northland College closed. The Village of Cazenovia commissioned one for its closed college campus and then won a $10 million state revitalization award on the strength of it. Public buyers, public budgets, no confidentiality friction.
          </p>
          <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: '64ch', lineHeight: 1.62, marginBottom: 28 }}>
            We conduct these studies &mdash; one campus, one report, the realistic uses ranked, the funding programs named. And if the college is still open, a town-initiated conversation is often the least threatening way for its board to start one.
          </p>
          <Link className="v2-btn v2-btn-a" href="/inquiry">Talk to us about your campus</Link>
        </div>
      </section>
    </>
  )
}
