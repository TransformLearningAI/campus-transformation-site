import Link from 'next/link'

export const metadata = {
  title: 'The market context: closures are accelerating — Campus Transformation',
  description: 'We keep this page because the trend is real. Nothing on it is a prediction about any individual institution.',
}

const CAMPUSES = [
  { name: 'University of Valley Forge', location: 'Phoenixville, PA', status: 'Closed August 2026', details: '87-year-old Assemblies of God institution · 102 acres · $30M debt' },
  { name: 'Pittsburgh Technical College', location: 'Oakdale, PA', status: 'For Sale', details: '180 acres · 165K sq ft · 461 dorm beds · Professional kitchens & labs' },
  { name: 'Fontbonne University', location: 'St. Louis, MO', status: 'Closed 2025', details: 'Century-old Catholic college · Full campus facilities' },
  { name: 'Hampshire College', location: 'Amherst, MA', status: 'Closing Fall 2026', details: '800-acre campus · 60-year-old liberal arts institution' },
  { name: 'Siena Heights University', location: 'Adrian, MI', status: 'Closing 2026', details: 'Full residential campus · Strong community ties' },
  { name: 'Lourdes University', location: 'Sylvania, OH', status: 'Closing Spring 2026', details: 'Toledo metro · Classroom + athletic facilities' },
  { name: 'Penn State (7 campuses)', location: 'PA Statewide', status: 'Closing 2027', details: '7 campuses, 3,000+ students, rural communities across PA' },
  { name: 'Northland College', location: 'Ashland, WI', status: 'Closed 2025', details: '133-year-old institution · Environmental focus · Northern WI' },
  { name: 'Trinity Christian College', location: 'Palos Heights, IL', status: 'Closing May 2026', details: 'Chicago suburb · Residential campus' },
  { name: 'Eastern Gateway Community College', location: 'Steubenville, OH', status: 'Closed October 2024', details: 'Youngstown State moving toward taking over the building' },
]

export default function MarketContextPage() {
  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">Market context</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 800, margin: '0 0 20px', maxWidth: '24ch' }}>
            The market context: closures are accelerating
          </h1>
          <p style={{ fontSize: 17, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            We keep this page because the trend is real. Nothing on it is a prediction about any individual institution.
          </p>
        </div>
      </div>

      <section className="v2-section">
        <div className="wrap">
          <div style={{ display: 'grid', gap: 16 }}>
            {CAMPUSES.map(c => (
              <div key={c.name} style={{ background: '#fff', border: '1px solid var(--rule)', padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: 17, color: 'var(--navy)', margin: '0 0 2px' }}>{c.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>{c.location}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)', whiteSpace: 'nowrap', flexShrink: 0 }}>{c.status}</span>
                </div>
                <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0 }}>{c.details}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: '#667085', marginTop: 28, maxWidth: '60ch' }}>
            Sources: institutional announcements, Inside Higher Ed, Higher Ed Dive, local news reporting. Updated periodically. This list is not exhaustive.
          </p>

          <div style={{ marginTop: 32, padding: 24, background: 'var(--navy)', borderRadius: 3, textAlign: 'center' }}>
            <p style={{ color: '#c2cfe0', margin: '0 0 16px', fontSize: 15 }}>
              Every one of these started with one decision deferred too long.
            </p>
            <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
          </div>
        </div>
      </section>
    </>
  )
}
