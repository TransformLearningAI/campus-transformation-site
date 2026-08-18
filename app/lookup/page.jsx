'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LookupPage() {
  const [institutions, setInstitutions] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch('/data/institutions.json')
      .then(r => r.json())
      .then(setInstitutions)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches = institutions.filter(inst =>
      inst.name.toLowerCase().includes(q) ||
      (inst.aliases || []).some(a => a.toLowerCase().includes(q)) ||
      inst.city.toLowerCase().includes(q) ||
      inst.state.toLowerCase() === q
    ).slice(0, 10)
    setResults(matches)
  }, [query, institutions])

  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">Look Up Your School</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 20px', maxWidth: '20ch' }}>
            What is your county short of?
          </h1>
          <p style={{ fontSize: 18, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Type your institution's name below. We'll show you what the federal record says about your region's needs — and what your campus could do about them. Free, instant, no login.
          </p>
        </div>
      </div>

      <section style={{ padding: '48px 0 80px', background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <input
            type="text"
            placeholder="Start typing your college name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 22px',
              fontSize: 18,
              border: '2px solid var(--rule)',
              borderRadius: 3,
              background: '#fff',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--navy)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--rule)' }}
            autoFocus
          />

          {results.length > 0 && (
            <div style={{ marginTop: 8, border: '1px solid var(--rule)', background: '#fff' }}>
              {results.map(inst => (
                <Link
                  key={inst.unitid}
                  href={`/report/${inst.unitid}`}
                  style={{
                    display: 'block',
                    padding: '16px 22px',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 16 }}>{inst.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                    {inst.city}, {inst.state} · {inst.county_name}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div style={{ marginTop: 16, padding: 20, background: '#fff', border: '1px solid var(--rule)', color: 'var(--ink-2)', fontSize: 15 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong style={{ color: 'var(--navy)' }}>Not in our system yet.</strong>
              </p>
              <p style={{ margin: 0 }}>
                We're building reports state by state. West Virginia is live now; more states are coming.{' '}
                <Link href="/inquiry" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Request a One-Pathway Scan</Link> and we'll run your school manually — free, two weeks, same result.
              </p>
            </div>
          )}

          <div style={{ marginTop: 40, padding: 24, background: 'var(--navy)', borderRadius: 3, color: '#c9d4e4', fontSize: 15 }}>
            <p style={{ margin: '0 0 12px' }}>
              <strong style={{ color: '#fff' }}>How this works:</strong> Every report is generated from public federal records — labor data, housing data, health designations, grant eligibility rules, and your institution's public filings. No login, no data shared, no permission needed.
            </p>
            <p style={{ margin: 0 }}>
              <Link href="/sample-report.html" style={{ color: 'var(--amber)', fontWeight: 600 }}>See a sample report →</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
