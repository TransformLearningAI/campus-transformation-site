'use client'
import { useState } from 'react'

export default function InquiryPage() {
  const [form, setForm] = useState({
    name: '', title: '', email: '', phone: '',
    institution: '', location: '', role: '',
    enrollment: '', situation: '', timeline: '',
    building: '', message: '',
  })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.institution) return
    setSending(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: 'campus-transformation-inquiry',
          rating: 5,
          audience: form.role,
          features: [form.situation, form.timeline],
          comment: `ONE-PATHWAY SCAN REQUEST\n\nName: ${form.name}\nTitle: ${form.title}\nEmail: ${form.email}\nPhone: ${form.phone}\nInstitution: ${form.institution}\nLocation: ${form.location}\nRole: ${form.role}\nEnrollment: ${form.enrollment}\nSituation: ${form.situation}\nTimeline: ${form.timeline}\nBuilding/Parcel: ${form.building}\n\nMessage:\n${form.message}`,
        }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
    setSending(false)
  }

  const inputStyle = { border: '1px solid var(--rule)', padding: '14px 18px', fontSize: 15, width: '100%', background: '#fff', borderRadius: 3, outline: 'none', fontFamily: 'inherit' }
  const selectStyle = { ...inputStyle, color: 'var(--ink-2)' }

  return (
    <>
      <div style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0 70px' }}>
        <div className="wrap">
          <p className="v2-kicker">One-Pathway Scan</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 20px', maxWidth: '20ch' }}>
            Request a scan.
          </h1>
          <p style={{ fontSize: 18, color: '#c9d4e4', maxWidth: '56ch', margin: 0 }}>
            Tell us which building or parcel is least used. That is the entire intake. Free, confidential, and narrow on purpose.
          </p>
        </div>
      </div>

      <section style={{ padding: '60px 0', background: 'var(--paper)' }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h2 className="v2-h2" style={{ maxWidth: 'none' }}>Thank you.</h2>
              <p style={{ color: 'var(--ink-2)', marginBottom: 8 }}>We&rsquo;ve received your request and will be in touch within 48 hours.</p>
              <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>All conversations are confidential.</p>
              <p style={{ marginTop: 24 }}>
                <a href="mailto:jeff@transformlearning.ai" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>jeff@transformlearning.ai</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ background: '#fdf0d8', border: '1px solid var(--amber)', borderRadius: 3, padding: '14px 18px', fontSize: 14, color: 'var(--navy)', marginBottom: 32 }}>
                All information is confidential. We will not contact your institution or board without your permission.
              </div>

              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber-deep)', marginBottom: 14 }}>About You</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <input style={inputStyle} type="text" placeholder="Your name *" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input style={inputStyle} type="text" placeholder="Your title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <input style={inputStyle} type="email" placeholder="Email *" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <input style={inputStyle} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>

              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber-deep)', marginBottom: 14 }}>About the Institution</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input style={inputStyle} type="text" placeholder="Institution name *" required value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} />
                <input style={inputStyle} type="text" placeholder="City, State" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <select style={selectStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="">Your relationship</option>
                  <option value="Board Member / Trustee">Board Member / Trustee</option>
                  <option value="President / Chancellor">President / Chancellor</option>
                  <option value="VP / Provost / CFO">VP / Provost / CFO</option>
                  <option value="Faculty / Staff">Faculty / Staff</option>
                  <option value="Municipal / Government">Municipal / Government</option>
                  <option value="Foundation / Investor">Foundation / Investor</option>
                  <option value="Community Member">Community Member</option>
                  <option value="Other">Other</option>
                </select>
                <select style={selectStyle} value={form.enrollment} onChange={e => setForm(f => ({ ...f, enrollment: e.target.value }))}>
                  <option value="">Approximate enrollment</option>
                  <option value="Under 500">Under 500</option>
                  <option value="500-1,000">500 – 1,000</option>
                  <option value="1,000-2,500">1,000 – 2,500</option>
                  <option value="2,500+">2,500+</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <select style={selectStyle} value={form.situation} onChange={e => setForm(f => ({ ...f, situation: e.target.value }))}>
                  <option value="">Current situation (optional)</option>
                  <option value="Planning ahead">Planning ahead</option>
                  <option value="Exploring alternatives">Exploring alternatives</option>
                  <option value="Enrollment declining">Enrollment declining</option>
                  <option value="Under financial pressure">Under financial pressure</option>
                  <option value="Considering closure">Considering closure</option>
                  <option value="Already closed">Already closed</option>
                </select>
                <select style={selectStyle} value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}>
                  <option value="">Timeline</option>
                  <option value="Urgent">Urgent — months</option>
                  <option value="This year">This year</option>
                  <option value="1-2 years">1–2 years out</option>
                  <option value="Planning ahead">Planning ahead</option>
                </select>
              </div>

              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber-deep)', marginBottom: 14 }}>The Building or Parcel</p>
              <textarea style={{ ...inputStyle, marginBottom: 24, resize: 'vertical' }} rows={3} placeholder="Which building or parcel is least used? (This is the entire intake.)" value={form.building} onChange={e => setForm(f => ({ ...f, building: e.target.value }))} />

              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--amber-deep)', marginBottom: 14 }}>Anything else</p>
              <textarea style={{ ...inputStyle, marginBottom: 24, resize: 'vertical' }} rows={4} placeholder="What's on your mind? What keeps you up at night? Anything you want us to know." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />

              {status === 'error' && (
                <p style={{ color: '#c53030', fontSize: 14, marginBottom: 16 }}>Something went wrong. Please try again or email jeff@transformlearning.ai directly.</p>
              )}

              <button type="submit" disabled={sending} style={{ width: '100%', padding: '16px 28px', background: 'var(--amber)', color: 'var(--navy-deep)', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit', opacity: sending ? 0.5 : 1 }}>
                {sending ? 'Sending...' : 'Request a One-Pathway Scan'}
              </button>

              <p style={{ fontSize: 13, color: 'var(--ink-2)', textAlign: 'center', marginTop: 16 }}>
                Or email directly: <a href="mailto:jeff@transformlearning.ai" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>jeff@transformlearning.ai</a>
                <br />No obligation. Response within 48 hours.
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
                You don&rsquo;t need to label your situation to talk to us.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
