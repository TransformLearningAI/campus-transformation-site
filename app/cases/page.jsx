import Link from 'next/link'

export const metadata = {
  title: 'Case Studies — Campus Transformation',
  description: 'Colleges that stayed colleges and found new revenue — and what happens to campuses whose boards waited.',
  alternates: { canonical: 'https://campustransformation.org/cases' },
}

const STAYED_OPEN = [
  { school: 'Cheyney University', where: 'Pennsylvania', desc: 'Had close to 400,000 square feet of building space sitting unoccupied or underused, and opened it to private tenants. Eight companies are on campus now — agribusiness, cancer research, solar manufacturing, additive manufacturing — alongside stadium and auditorium rentals.', result: 'A $7.4M deficit became a $2.1M surplus. First balanced budget in eight years.' },
  { school: 'Purchase College, SUNY', where: 'New York', desc: 'Ground-leased 40 acres to a life-plan senior living community, financed with public bonds. No college capital at risk at any point.', result: '$2 million a year in rent, directed by statute to student scholarships and new faculty lines.' },
  { school: 'Warren Wilson College', where: 'North Carolina', desc: 'Sold 191 of its 1,100 acres to a land conservancy — with a cooperative management agreement that keeps the college grazing the pasture and teaching in the forest.', result: '$4.7 million, against a $5.5 million deficit. They sold the asset without losing the use of it.' },
  { school: 'Goucher College', where: 'Maryland', desc: 'Ground-leased three acres out of 287 to a neighboring senior living operator for 127 independent-living apartments.', result: 'Zero construction capital from the college. Three acres is a proposal a president can carry into a room.' },
  { school: "D'Youville University", where: 'New York', desc: 'Built a health professions building in which a regional health system staffs and operates a community clinic, alongside student simulation space and workforce retraining.', result: 'The health system raised $5.07 million toward the project. It is the tenant and the operator.' },
  { school: 'Lackawanna College', where: 'Pennsylvania', desc: 'A $10 million technology center in a former factory, funded by state money, the Appalachian Regional Commission, and a private energy company. Separately, employers pay tuition directly for their own staff.', result: 'The college built it without spending its own capital.' },
  { school: 'Dakota Wesleyan University', where: 'South Dakota', desc: 'A regional health system funds nursing students\u2019 junior and senior years in exchange for a three-year work commitment after graduation.', result: '$20,000 per student, employer-funded. The health system asked for it.' },
  { school: 'Alvernia University', where: 'Pennsylvania', desc: 'Bought and repurposed downtown buildings instead of expanding the campus — a community health center with a local provider, an incubator, a YMCA partnership, ground-floor retail.', result: '$43 million invested, $18.5 million of it in secured redevelopment resources including state capital grants.' },
]

const WAITED = [
  {
    name: 'Marygrove Conservancy',
    location: 'Detroit, MI',
    summary: 'A closed Catholic college transformed into a cradle-to-career educational campus serving 1,000+ students from birth through adulthood.',
    detail: 'Marygrove College closed in 2019. The Marygrove Conservancy, backed by a $50 million Kresge Foundation commitment, turned the 53-acre campus into an early education center (144 children, full capacity), a K-12 school, and a P-20 cradle-to-career continuum.',
    source: 'Kresge Foundation',
  },
  {
    name: 'Goddard College Campus',
    location: 'Plainfield, VT',
    summary: 'A closed Vermont campus purchased by a developer creating housing and arts spaces in a flood-stricken rural community.',
    detail: 'Goddard College, founded in 1938, closed its Plainfield campus. Developer Ledgeworks purchased it and is planning housing and cultural offerings.',
    source: 'Federal Reserve Bank of Boston',
  },
  {
    name: 'College of Saint Rose Campus',
    location: 'Albany, NY',
    summary: 'After the 104-year-old college closed in 2024, a county land authority stepped in to manage the nearly 30-acre campus.',
    detail: 'Albany County Land Authority is managing the campus and running a community input process, focusing on preserving the campus as a community asset rather than selling to the highest bidder.',
    source: 'Bloomberg',
  },
]

export default function CasesPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">Case Studies</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 800, margin: '0 0 20px', maxWidth: '24ch' }}>
            What transformation actually looks like.
          </h1>
          <p style={{ fontSize: 17, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Real examples — colleges that found new revenue while staying colleges, and what happens to campuses whose boards waited.
          </p>
        </div>
      </div>

      {/* Stayed open — the lead */}
      <section className="v2-section">
        <div className="wrap">
          <h2 className="v2-h2">Colleges that stayed colleges &mdash; and found new revenue.</h2>
          <p className="v2-lede">Not turnaround stories. Not closure stories. Colleges that stayed colleges and found money somewhere other than tuition.</p>
          <div className="v2-cases">
            {STAYED_OPEN.map(c => (
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

      {/* Waited — honest heading */}
      <section className="v2-section v2-alt">
        <div className="wrap">
          <h2 className="v2-h2">And what happens to campuses whose boards waited.</h2>
          <p className="v2-lede">These colleges closed. Their campuses found second lives — but the institutions themselves did not survive.</p>

          <div style={{ display: 'grid', gap: 20 }}>
            {WAITED.map(w => (
              <div key={w.name} style={{ background: '#fff', border: '1px solid var(--rule)', padding: '24px' }}>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', margin: '0 0 2px' }}>{w.name}</h3>
                <p style={{ fontSize: 12, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8b9099', margin: '0 0 10px' }}>{w.location}</p>
                <p style={{ fontSize: 15, color: 'var(--ink-2)', margin: '0 0 10px' }}>{w.detail}</p>
                <p style={{ fontSize: 12, color: '#8b9099' }}>Source: {w.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Fix 5 verbatim */}
      <div className="v2-offer">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#fff', fontWeight: 600, marginBottom: 20 }}>
            Every one of these started with one decision. See what your first one could be.
          </p>
          <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
        </div>
      </div>
    </>
  )
}
