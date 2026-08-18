'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Schools with prebuilt reports
const PREBUILT = new Set([237181]) // Bethany College

export default function LookupPage() {
  const [institutions, setInstitutions] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

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
      (inst.city.toLowerCase().includes(q) && q.length > 2) ||
      inst.state.toLowerCase() === q
    ).slice(0, 12)
    setResults(matches)
  }, [query, institutions])

  function selectSchool(inst) {
    setSelected(inst)
    setQuery(inst.name)
    setResults([])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !selected) return
    setSending(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: 'campus-transformation-lookup',
          rating: 5,
          audience: 'lookup-request',
          features: [selected.name, selected.state],
          comment: `REPORT REQUEST\n\nName: ${name}\nEmail: ${email}\nInstitution: ${selected.name}\nCity: ${selected.city}, ${selected.state}\nCounty: ${selected.county_name}\nCounty FIPS: ${selected.county_fips}\nUNITID: ${selected.unitid}`,
        }),
      })
      setSubmitted(true)
    } catch {
      alert('Something went wrong. Please email jeff@transformlearning.ai directly.')
    }
    setSending(false)
  }

  const hasReport = selected && PREBUILT.has(selected.unitid)

  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">Look Up Your School</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 20px', maxWidth: '20ch' }}>
            What is your county short of?
          </h1>
          <p style={{ fontSize: 18, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Type your institution's name. We'll pull federal labor, housing, health, and funding data for your region and show you what your campus could do about the gaps — free.
          </p>
          <p style={{ fontSize: 14, color: '#8fa2bd', marginTop: 12 }}>
            {institutions.length.toLocaleString()} private nonprofit 4-year colleges in the database
          </p>
        </div>
      </div>

      <section style={{ padding: '48px 0 80px', background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Start typing your college name..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); setSubmitted(false) }}
              style={{
                width: '100%', padding: '18px 22px', fontSize: 18,
                border: '2px solid var(--rule)', borderRadius: 3,
                background: '#fff', fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--navy)' }}
              onBlur={e => { setTimeout(() => { e.target.style.borderColor = 'var(--rule)' }, 200) }}
              autoFocus
            />

            {results.length > 0 && !selected && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, border: '1px solid var(--rule)', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,.1)' }}>
                {results.map(inst => (
                  <button
                    key={inst.unitid}
                    onClick={() => selectSchool(inst)}
                    style={{
                      display: 'block', width: '100%', padding: '14px 22px',
                      textAlign: 'left', border: 'none', borderBottom: '1px solid var(--rule)',
                      background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.target.style.background = 'var(--paper-2)' }}
                    onMouseLeave={e => { e.target.style.background = '#fff' }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>{inst.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                      {inst.city}, {inst.state} · {inst.county_name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* School selected — has prebuilt report */}
          {hasReport && (
            <div style={{ marginTop: 20, padding: 24, background: '#fff', border: '2px solid var(--amber)', borderRadius: 3 }}>
              <h3 style={{ margin: '0 0 8px', color: 'var(--navy)', fontSize: 18 }}>{selected.name}</h3>
              <p style={{ margin: '0 0 16px', color: 'var(--ink-2)', fontSize: 15 }}>
                {selected.city}, {selected.state} · {selected.county_name}
              </p>
              <Link
                href={`/report/${selected.unitid}`}
                className="v2-btn v2-btn-a"
                style={{ display: 'inline-block' }}
              >
                View your regional needs report →
              </Link>
            </div>
          )}

          {/* School selected — no prebuilt report, show email capture */}
          {selected && !hasReport && !submitted && (
            <div style={{ marginTop: 20, padding: 28, background: '#fff', border: '2px solid var(--navy)', borderRadius: 3 }}>
              <h3 style={{ margin: '0 0 8px', color: 'var(--navy)', fontSize: 18 }}>{selected.name}</h3>
              <p style={{ margin: '0 0 4px', color: 'var(--ink-2)', fontSize: 15 }}>
                {selected.city}, {selected.state} · {selected.county_name}
              </p>
              <p style={{ margin: '0 0 20px', color: 'var(--ink-2)', fontSize: 15 }}>
                We're pulling federal labor, housing, health, and funding data for {selected.county_name} right now. Your report will show what the region is short of, what programs your campus qualifies for, and who's already nearby to partner with.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <input
                    type="text" placeholder="Your name"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{ padding: '12px 16px', border: '1px solid var(--rule)', borderRadius: 3, fontSize: 15, fontFamily: 'inherit' }}
                  />
                  <input
                    type="email" placeholder="Email *" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{ padding: '12px 16px', border: '1px solid var(--rule)', borderRadius: 3, fontSize: 15, fontFamily: 'inherit' }}
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  style={{
                    width: '100%', padding: '14px 24px', background: 'var(--amber)',
                    color: 'var(--navy-deep)', fontWeight: 700, fontSize: 16,
                    border: 'none', borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit',
                    opacity: sending ? 0.5 : 1,
                  }}
                >
                  {sending ? 'Sending...' : 'Send me the report — free'}
                </button>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 10, textAlign: 'center' }}>
                  Free. No login required. We never share who looks up their school.
                </p>
              </form>
            </div>
          )}

          {/* Submitted */}
          {submitted && selected && (
            <div style={{ marginTop: 20, padding: 28, background: '#fff', border: '2px solid #3c6b2e', borderRadius: 3, textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px', color: 'var(--navy)', fontSize: 20 }}>Your report is on the way.</h3>
              <p style={{ margin: '0 0 8px', color: 'var(--ink-2)', fontSize: 15 }}>
                We're pulling federal data for <strong>{selected.county_name}</strong> — labor gaps, health designations, housing need, grant eligibility, and nearby partners. Your {selected.name} report will arrive at <strong>{email}</strong> within 24 hours.
              </p>
              <p style={{ margin: 0, fontSize: 14, color: '#667085' }}>
                Questions in the meantime? <a href="mailto:jeff@transformlearning.ai" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>jeff@transformlearning.ai</a>
              </p>
            </div>
          )}

          {/* No results */}
          {query.length >= 3 && results.length === 0 && !selected && (
            <div style={{ marginTop: 16, padding: 20, background: '#fff', border: '1px solid var(--rule)', color: 'var(--ink-2)', fontSize: 15 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong style={{ color: 'var(--navy)' }}>Not found.</strong>
              </p>
              <p style={{ margin: 0 }}>
                This tool covers private nonprofit 4-year colleges. If your institution isn't listed, it may be public, for-profit, or 2-year.{' '}
                <Link href="/inquiry" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Request a One-Pathway Scan</Link> and we'll run it manually.
              </p>
            </div>
          )}

          {/* What we do — the pitch */}
          <div style={{ marginTop: 40, borderTop: '1px solid var(--rule)', paddingTop: 40 }}>
            <h2 className="v2-h2">What happens after the report</h2>
            <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.6, maxWidth: '58ch', marginBottom: 24 }}>
              The report tells you what the public record says. The part that decides whether any of it works is not in the public record — it's the phone calls, the negotiations, and the one signature that makes it real. That's what we do.
            </p>

            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#fff', border: '1px solid var(--rule)', borderLeft: '4px solid var(--navy)', padding: '18px 20px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--navy)' }}>We find the partner</h4>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-2)' }}>
                  We call the health system, the workforce board, the developer, the employer. Not on your behalf in some abstract way — actual phone calls, actual conversations, actual introductions. We get it down to the one person who can sign.
                </p>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--rule)', borderLeft: '4px solid var(--navy)', padding: '18px 20px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--navy)' }}>We negotiate the terms</h4>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-2)' }}>
                  Lease structures, revenue sharing, employer-funded seats, grant applications. We hand you a deal, not a report. If the partners aren't there locally, we help you find or create them — virtual partners, faraway collaborators, other imaginative ways of finding revenue.
                </p>
              </div>
              <div style={{ background: '#fff', border: '1px solid var(--rule)', borderLeft: '4px solid var(--navy)', padding: '18px 20px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--navy)' }}>We stay until it's working</h4>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-2)' }}>
                  One building at a time, one lease at a time, one partner at a time. The transformation to a Knowledge Town can't be done all at once. We're here for the whole thing.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 13, flexWrap: 'wrap' }}>
              <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
              <Link href="/sample-report.html" className="v2-btn" style={{ border: '1.5px solid var(--rule)', color: 'var(--navy)' }}>See a sample report</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
