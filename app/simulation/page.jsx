'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

/* ═══════════════════════════════════════════════════════════════
   EDGEWATER COLLEGE SIMULATION — INTERACTIVE TEAM EXERCISE
   Hidden page: /simulation
   ═══════════════════════════════════════════════════════════════ */

const BUILDINGS = [
  { name: 'Founders Hall', desc: 'Administration, classrooms, faculty offices', year: '1924, renovated 2003', icon: '🏛️' },
  { name: 'The Science Center', desc: 'Biology, chemistry, physics labs; greenhouse', year: '1968, updated 2015', icon: '🔬' },
  { name: 'Morrison Library', desc: '45,000 volumes, computer lab, study spaces', year: '1952', icon: '📚' },
  { name: 'The Arts Building', desc: 'Theater (320 seats), art studios, music rooms', year: '1971', icon: '🎭' },
  { name: 'The Student Center', desc: 'Dining hall (seats 300), bookstore', year: '1985', icon: '🍽️' },
  { name: 'The Gymnasium', desc: 'Basketball court, fitness center, lockers', year: '1978', icon: '🏀' },
  { name: 'Residence Halls (3)', desc: '380 beds total, varying condition', year: '1965–1988', icon: '🏠' },
  { name: 'The Chapel', desc: 'Nondenominational, seats 200, events', year: '1932', icon: '⛪' },
  { name: 'The Fieldhouse', desc: 'Athletic fields, concessions, bleachers', year: '1992', icon: '🏟️' },
  { name: 'The Welcome Center', desc: 'Admissions and alumni relations', year: '2010', icon: '🚪' },
]

const FINANCIALS = [
  { label: 'Total enrollment (FTE)', y2016: '1,420', y2020: '1,080', y2024: '720', y2026: '580', trend: 'down' },
  { label: 'First-year class', y2016: '340', y2020: '245', y2024: '155', y2026: '110', trend: 'down' },
  { label: 'Discount rate', y2016: '42%', y2020: '48%', y2024: '57%', y2026: '62%', trend: 'down' },
  { label: 'Net tuition revenue', y2016: '$26.4M', y2020: '$19.9M', y2024: '$11.7M', y2026: '$8.5M', trend: 'down' },
  { label: 'Operating surplus/(deficit)', y2016: '$1.4M', y2020: '($1.6M)', y2024: '($3.4M)', y2026: '($5.3M)', trend: 'down' },
  { label: 'Endowment', y2016: '$38M', y2020: '$34M', y2024: '$27M', y2026: '$22M', trend: 'down' },
  { label: 'Bond debt', y2016: '$14.5M', y2020: '$13.2M', y2024: '$11.8M', y2026: '$11.0M', trend: 'flat' },
  { label: 'Deferred maintenance', y2016: '$8M', y2020: '$12M', y2024: '$18M', y2026: '$22M', trend: 'up' },
  { label: 'Full-time faculty', y2016: '72', y2020: '58', y2024: '41', y2026: '34', trend: 'down' },
]

const PEOPLE = [
  { name: 'Dr. Linda Vasquez', role: 'President', detail: '4 years. Previously VP Academic Affairs at a school that merged in 2023. She\'s seen this before.', color: '#7C3AED' },
  { name: 'Thomas Whitfield', role: 'Board Chair', detail: '12 years on the board. Local business owner (auto dealerships). His father graduated Edgewater in 1958.', color: '#0891B2' },
  { name: 'Peggy Stahl', role: 'CFO', detail: '8 years. Exhausted. Managing the decline with skill and honesty. The board trusts her numbers.', color: '#059669' },
  { name: 'Dr. James Okonkwo', role: 'Provost', detail: '2 years. Came from a larger institution. Increasingly frustrated. Quietly exploring other positions.', color: '#D97706' },
  { name: 'Rosa Medina', role: 'VP Enrollment', detail: '5 years. Works incredibly hard. Discount rate keeps rising because it\'s the only way to fill seats.', color: '#DC2626' },
  { name: 'Dave Kowalski', role: 'Facilities Director', detail: '22 years. Knows every pipe and wire. Deeply loyal. Terrified of losing his job.', color: '#64748B' },
]

const SECTIONS = [
  {
    id: 'A', title: 'The Honest Assessment', color: '#0C1F3F', icon: '🎯',
    intro: 'Thomas and Linda need a straight answer. Is transformation viable for Edgewater?',
    questions: [
      { id: 'A1', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'Is transformation viable for Edgewater? Give me a straight answer.' },
      { id: 'A2', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'You\'ve seen campuses in worse shape. You\'ve seen campuses in better shape. Where do we fall? And what\'s the one thing that could kill this before it starts?' },
      { id: 'A3', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'My father went here. I\'ve been on this board for 12 years. I need to know — if we do this, is it still Edgewater? Or is it something else with the same buildings?' },
    ]
  },
  {
    id: 'B', title: 'Students & Faculty', color: '#7C3AED', icon: '🎓',
    intro: 'The hardest questions — what happens to the 580 students and 34 faculty who are here right now?',
    questions: [
      { id: 'B1', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'We have 580 students enrolled right now. What happens to them? I will not leave students stranded.' },
      { id: 'B2', speaker: 'Dr. Okonkwo', speakerRole: 'Provost', q: 'I have 34 full-time faculty. Some of them have been here 25 years. What are you going to tell them? And how many of them have a future in whatever this becomes?' },
      { id: 'B3', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'The nursing program is our strongest. The local hospital relies on us for their pipeline. If we drop accreditation, what happens to nursing?' },
      { id: 'B4', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'Our education majors do student teaching in local schools. Our criminal justice students intern at the county courthouse. These are real relationships. How do we preserve them in a non-accredited model?' },
    ]
  },
  {
    id: 'C', title: 'Technology & AI', color: '#0891B2', icon: '🤖',
    intro: 'What does an AI Learning Hub actually look like in a building from 1968 with WiFi that barely works?',
    questions: [
      { id: 'C1', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'You mention an "AI Learning Hub" as one of the revenue streams. I\'m a hospital administrator, not a technologist. Explain to me like I\'m a board member — what does that actually look like on this campus? What does someone walk into?' },
      { id: 'C2', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'Our IT infrastructure is old. We have campus WiFi that barely works in the residence halls. Our "computer lab" has machines from 2018. What does it take to get the technology piece up and running, and what does it cost?' },
      { id: 'C3', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'I\'ve read about AI replacing teachers. Is that what you\'re proposing? Because my faculty will revolt.' },
    ]
  },
  {
    id: 'D', title: 'Community Demand & Partnerships', color: '#059669', icon: '🤝',
    intro: 'Millbrook is a small town of 18,000. How do you discover demand that might not be obvious — even remotely?',
    questions: [
      { id: 'D1', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'You say you\'ll figure out what the community needs. How? Millbrook is a small town. How do you discover demand that might not be obvious? Walk me through exactly how you\'d do that — even remotely.' },
      { id: 'D2', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'The nearest hospital is 8 miles away. We have an aging population. There\'s no urgent care in town. Could the campus include a health clinic? How would that work?' },
      { id: 'D3', speaker: 'Peggy Stahl', speakerRole: 'CFO', q: 'You mentioned employer partnerships. We\'re 90 minutes from Pittsburgh. There\'s a small manufacturing cluster 15 miles away and a logistics warehouse. That\'s not exactly a booming economy. Where does the workforce demand come from? Be specific.' },
      { id: 'D4', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'The school district superintendent — what would you even ask her? What could the K-12 system possibly want from our campus?' },
      { id: 'D5', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'The Science Center has biology and chemistry labs. The greenhouse is in decent shape. Is there anything useful we can do with those facilities outside of a traditional college program?' },
    ]
  },
  {
    id: 'E', title: 'Financials & Funding', color: '#D97706', icon: '💰',
    intro: 'The CFO wants real numbers. The board chair wants to know who pays. No hand-waving.',
    questions: [
      { id: 'E1', speaker: 'Peggy Stahl', speakerRole: 'CFO', q: 'Give me a realistic — not optimistic, realistic — picture of what the first three years look like financially. Revenue, costs, and when we stop bleeding.' },
      { id: 'E2', speaker: 'Peggy Stahl', speakerRole: 'CFO', q: 'We have $11 million in bond debt and $1.4 million in annual debt service. Transformation doesn\'t make that go away. How do we handle the bonds?' },
      { id: 'E3', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'Where does the money come from to fund the transformation itself? We don\'t have spare cash. You said your fees are on a sliding scale — what does that actually mean for a campus with a $5.3 million deficit?' },
      { id: 'E4', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'I\'ve seen consultants before. They charge $300,000 for a report that sits on a shelf. How is this different? How do we know we\'re not just adding another expense to a dying institution?' },
    ]
  },
  {
    id: 'F', title: 'The Human Side', color: '#EC4899', icon: '❤️',
    intro: 'Dave has been here 22 years. Thomas\'s father graduated in \'58. The alumni will be furious. How do you handle the people?',
    questions: [
      { id: 'F1', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'Dave Kowalski has been our Facilities Director for 22 years. He knows every building on this campus. If we transform, does Dave have a job?' },
      { id: 'F2', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'The alumni are going to be upset. My phone is going to ring off the hook. How do we manage that?' },
      { id: 'F3', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'What about morale? Right now, the faculty and staff know something is wrong but they don\'t know how bad. When and how do we tell them? And how do we keep people from leaving before we\'re ready?' },
      { id: 'F4', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'There are kids in this town who grew up going to Edgewater basketball games. The gym is where the community talent show happens every spring. How does a transformed campus keep that community connection?' },
    ]
  },
  {
    id: 'G', title: 'Programs & Vision', color: '#8B5CF6', icon: '🔮',
    intro: 'Paint the picture. It\'s two years from now. What does a Tuesday morning look like on this campus?',
    questions: [
      { id: 'G1', speaker: 'Linda Vasquez', speakerRole: 'President', q: 'Give me a concrete picture. It\'s two years from now. I drive onto campus on a Tuesday morning. What do I see? Who\'s here? What\'s happening in each building?' },
      { id: 'G2', speaker: 'Dr. Okonkwo', speakerRole: 'Provost', q: 'Our biology professor, Dr. Anita Sharma, has been here 18 years. She runs the greenhouse and teaches intro bio to 60 students a semester. In the new model, what does her Tuesday look like?' },
      { id: 'G3', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'What certifications and credentials would you actually offer here? Not theory — what specific programs, how long, and who pays?' },
    ]
  },
  {
    id: 'H', title: 'Timeline & Accountability', color: '#3B82F6', icon: '📋',
    intro: 'When does it start? When do we tell people? When do we break even? And what if it doesn\'t work?',
    questions: [
      { id: 'H1', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'Give me a timeline. Week by week for the first three months, then month by month after that. When do we make the decision? When do we tell people? When do the first new programs start? When do we break even?' },
      { id: 'H2', speaker: 'Peggy Stahl', speakerRole: 'CFO', q: 'How do we measure whether this is working? What are the KPIs? When do we know if we need to pull the plug?' },
      { id: 'H3', speaker: 'Thomas Whitfield', speakerRole: 'Board Chair', q: 'Who from your team is actually working on this? How often are you engaged? I don\'t want a consultant who disappears after the first call.' },
      { id: 'H4', speaker: 'Sandra Chen', speakerRole: 'Board Member', q: 'What happens if it doesn\'t work? What\'s our exit ramp? At what point do we say "this isn\'t going to make it" and go back to the sale option?' },
    ]
  },
  {
    id: 'I', title: 'The Preliminary Assessment', color: '#00A8A8', icon: '📝',
    intro: 'Write the memo. This is the document that determines whether they hire us.',
    questions: [
      { id: 'I1', speaker: 'Thomas Whitfield & Linda Vasquez', speakerRole: 'Board Chair & President', q: 'Write the preliminary assessment memo that the team would present at the end of the 3-week remote discovery phase. Be honest about challenges, clear about opportunities, specific about next steps, and realistic about when we\'d recommend an in-person visit.' },
    ]
  },
]

// ── EXISTING RESPONSE DISPLAY ──────────────────────────────────
function ExistingResponses({ questionId }) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/simulation-response?questionId=${questionId}`)
      const data = await res.json()
      setResponses(data.responses || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [questionId])

  useEffect(() => { load() }, [load])

  if (loading) return <p style={{ fontSize: 12, color: '#94A3B8', margin: '8px 0' }}>Loading responses...</p>
  if (responses.length === 0) return <p style={{ fontSize: 12, color: '#94A3B8', margin: '8px 0', fontStyle: 'italic' }}>No responses yet. Be the first!</p>

  return (
    <div style={{ margin: '12px 0' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#00A8A8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        {responses.length} Response{responses.length !== 1 ? 's' : ''}
      </p>
      {responses.map((r) => (
        <div key={r.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#0C1F3F', margin: 0 }}>{r.name}</p>
            <p style={{ fontSize: 10, color: '#94A3B8', margin: 0 }}>
              {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{r.response}</p>
        </div>
      ))}
    </div>
  )
}

// ── AI ANALYSIS COMPONENT ──────────────────────────────────────
function AIAnalysis({ questionId, questionText, section }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function runAnalysis() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/simulation-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, questionText, section }),
      })
      const data = await res.json()
      if (data.analysis) setAnalysis(data.analysis)
      else setError('No analysis returned.')
    } catch {
      setError('Failed to generate analysis.')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: 12 }}>
      {!analysis && !loading && (
        <button onClick={runAnalysis}
                style={{ background: '#0C1F3F', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>&#9733;</span> AI Analysis of Responses
        </button>
      )}
      {loading && (
        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: '14px 16px' }}>
          <p style={{ fontSize: 12, color: '#0369A1', margin: 0, fontWeight: 600 }}>Analyzing responses...</p>
        </div>
      )}
      {error && <p style={{ fontSize: 12, color: '#DC2626', margin: '4px 0' }}>{error}</p>}
      {analysis && (
        <div style={{ background: 'linear-gradient(135deg, #F0F9FF, #F5F3FF)', border: '1px solid #C7D2FE', borderRadius: 10, padding: '16px 18px', marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#4338CA', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              &#9733; AI Analysis
            </p>
            <button onClick={runAnalysis}
                    style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              Refresh
            </button>
          </div>
          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {analysis}
          </div>
        </div>
      )}
    </div>
  )
}

// ── RESPONSE FORM ──────────────────────────────────────────────
function ResponseForm({ questionId, questionText, section, onSubmitted }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !response) return
    setSending(true)
    try {
      await fetch('/api/simulation-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, questionId, questionText, response, section }),
      })
      setStatus('sent')
      setResponse('')
      if (onSubmitted) onSubmitted()
    } catch {
      setStatus('error')
    }
    setSending(false)
  }

  if (status === 'sent') {
    return (
      <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '14px 18px', marginTop: 12 }}>
        <p style={{ color: '#166534', fontSize: 13, fontWeight: 600, margin: 0 }}>Response submitted! It will appear above shortly.</p>
        <button onClick={() => setStatus(null)}
                style={{ marginTop: 8, background: 'none', border: 'none', color: '#00A8A8', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          + Add another response
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Add Your Response</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input type="text" placeholder="Your name *" required value={name}
               onChange={e => setName(e.target.value)}
               style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #DDE5EF', fontSize: 13, outline: 'none' }} />
        <input type="email" placeholder="Email (optional)" value={email}
               onChange={e => setEmail(e.target.value)}
               style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #DDE5EF', fontSize: 13, outline: 'none' }} />
      </div>
      <textarea placeholder="Type your response... Be specific. Reference Edgewater's data. Speak directly to the person asking."
                required value={response} onChange={e => setResponse(e.target.value)} rows={5}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #DDE5EF', fontSize: 13, lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
      {status === 'error' && <p style={{ color: '#DC2626', fontSize: 12, margin: '4px 0' }}>Something went wrong. Try again.</p>}
      <button type="submit" disabled={sending}
              style={{ background: '#00A8A8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: sending ? 0.5 : 1, marginTop: 4 }}>
        {sending ? 'Sending...' : 'Submit Response'}
      </button>
    </form>
  )
}

// ── QUESTION CARD ──────────────────────────────────────────────
function QuestionCard({ q, section, sectionColor }) {
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [count, setCount] = useState(null)

  useEffect(() => {
    fetch(`/api/simulation-response?questionId=${q.id}`)
      .then(r => r.json())
      .then(d => setCount((d.responses || []).length))
      .catch(() => setCount(0))
  }, [q.id, refreshKey])

  return (
    <div style={{ background: 'white', borderRadius: 12, border: count === 0 ? '1px solid #FECACA' : '1px solid #DDE5EF', marginBottom: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
              style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ background: sectionColor, color: 'white', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 5, flexShrink: 0, marginTop: 2 }}>
          {q.id}
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#0C1F3F', fontSize: 14, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.4 }}>
            {q.speaker} <span style={{ color: '#94A3B8', fontWeight: 400, fontSize: 12 }}>({q.speakerRole})</span>
          </p>
          <p style={{ color: '#475569', fontSize: 13, margin: 0, lineHeight: 1.5 }}>&ldquo;{q.q}&rdquo;</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {count !== null && count > 0 && (
            <span style={{ background: '#00A8A8', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap' }}>
              {count} {count === 1 ? 'response' : 'responses'}
            </span>
          )}
          {count === 0 && (
            <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', border: '1px solid #FECACA' }}>
              needs response
            </span>
          )}
          <span style={{ color: '#94A3B8', fontSize: 18, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            &#9662;
          </span>
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F1F5F9' }}>
          <ExistingResponses key={refreshKey} questionId={q.id} />
          <AIAnalysis questionId={q.id} questionText={q.q} section={section} />
          <ResponseForm
            questionId={q.id}
            questionText={q.q}
            section={section}
            onSubmitted={() => setRefreshKey(k => k + 1)}
          />
        </div>
      )}
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────
export default function SimulationPage() {
  const questionsRef = useRef(null)

  return (
    <>
      {/* HERO */}
      <section style={{ background: '#0A0A0A', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 6, height: '100%', background: 'linear-gradient(180deg, #3B82F6, #059669, #D97706, #EC4899, #8B5CF6)' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <ScrollReveal>
            <p style={{ color: '#00A8A8', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
              Team Simulation Exercise
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif, Georgia)', fontWeight: 300, color: 'white', fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.05, marginBottom: 16 }}>
              Edgewater College<br />
              <span style={{ color: '#00A8A8' }}>is at a crossroads.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 520, lineHeight: 1.6, marginBottom: 24 }}>
              A fictional campus. Real numbers. Real questions from a scared board and a hopeful president.
              Your job: answer them like it&rsquo;s your first client.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => questionsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      style={{ background: '#00A8A8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Jump to Questions
              </button>
              <a href="#narrative" style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', padding: '12px 16px' }}>
                Read the full story first &darr;
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CRISIS STATS */}
      <section style={{ background: '#0C1F3F', padding: '40px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { num: '580', label: 'Students remaining', sub: 'down from 1,420' },
              { num: '$5.3M', label: 'Annual deficit', sub: 'and growing' },
              { num: '$22M', label: 'Deferred maintenance', sub: 'buildings aging' },
              { num: 'May 2028', label: 'Reserves run out', sub: '~18 months' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-serif, Georgia)', fontSize: 28, fontWeight: 300, color: '#00A8A8', lineHeight: 1, margin: 0 }}>{s.num}</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{s.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NARRATIVE */}
      <section id="narrative" style={{ background: 'white', padding: '60px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <ScrollReveal>
            <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>The Narrative</p>
            <h2 style={{ fontFamily: 'var(--font-serif, Georgia)', fontSize: 28, color: '#0C1F3F', marginBottom: 20, lineHeight: 1.2 }}>
              A Tuesday morning in late September.
            </h2>
          </ScrollReveal>

          <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
            <ScrollReveal>
              <p style={{ marginBottom: 16 }}>
                Dr. Linda Vasquez is sitting in her office on the second floor of Founders Hall, looking out at a quad that used to be full of students. Today, there are maybe a dozen people crossing it. Two of them are maintenance workers.
              </p>
              <p style={{ marginBottom: 16 }}>
                Linda has been president of <strong style={{ color: '#0C1F3F' }}>Edgewater College</strong> for four years. She took the job because she believed she could turn things around. She was wrong &mdash; not because she lacked ability, but because the math was unbeatable.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div style={{ background: '#F4F7FB', borderRadius: 12, padding: 20, margin: '24px 0', border: '1px solid #DDE5EF' }}>
                <p style={{ color: '#0C1F3F', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Edgewater College</p>
                <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Private, nonprofit liberal arts institution. Founded 1921. <strong>Millbrook, Pennsylvania</strong> &mdash; a small city of 18,000 people, 90 minutes northeast of Pittsburgh, in a county where the population has declined 11% since 2010. Sits on <strong>87 acres</strong> with <strong>14 buildings</strong> totaling ~185,000 sq ft. Nearest community college: 35 miles. Nearest hospital: 8 miles.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, marginTop: 24 }}>The Campus</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {BUILDINGS.map(b => (
                  <div key={b.name} style={{ display: 'flex', gap: 10, padding: 10, borderRadius: 8, border: '1px solid #E2E8F0', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{b.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 12, color: '#0C1F3F', margin: 0 }}>{b.name}</p>
                      <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{b.desc}</p>
                      <p style={{ fontSize: 10, color: '#94A3B8', margin: 0 }}>{b.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, marginTop: 32 }}>The Numbers</p>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #DDE5EF', marginBottom: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#0C1F3F' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left', color: 'white', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: 'white', fontSize: 10 }}>2016</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: 'white', fontSize: 10 }}>2020</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: 'white', fontSize: 10 }}>2024</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: 'white', fontSize: 10 }}>2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIALS.map((r, i) => (
                      <tr key={r.label} style={{ background: i % 2 ? '#F8FAFC' : 'white' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0C1F3F' }}>{r.label}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B' }}>{r.y2016}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B' }}>{r.y2020}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B' }}>{r.y2024}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: r.trend === 'flat' ? '#64748B' : '#DC2626' }}>{r.y2026}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, marginTop: 24 }}>The People</p>
              <div style={{ display: 'grid', gap: 8 }}>
                {PEOPLE.map(p => (
                  <div key={p.name} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                      {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#0C1F3F', margin: 0 }}>{p.name} <span style={{ fontWeight: 400, color: '#00A8A8', fontSize: 12 }}>&mdash; {p.role}</span></p>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.4 }}>{p.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10, marginTop: 32 }}>The Board Meeting</p>
              <div style={{ background: '#0C1F3F', borderRadius: 12, padding: 24, margin: '12px 0' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
                  On a Thursday evening in October, the Board of Trustees meets in the Morrison Library conference room. Thomas Whitfield opens:
                </p>
                <blockquote style={{ borderLeft: '3px solid #00A8A8', paddingLeft: 16, margin: '0 0 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;I&rsquo;ll be direct. Peggy&rsquo;s projections show us running out of operating reserves by May 2028. The endowment is being drawn down at 8%. Our accreditor has questions we may not be able to answer in the spring. Enrollment is not going to recover. One real estate firm offered $6&ndash;8 million for the full property. That wouldn&rsquo;t cover our bond debt.&rdquo;
                </blockquote>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 12 }}>Linda speaks:</p>
                <blockquote style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 16, margin: '0 0 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;Before we go down the sale path, I want us to consider an alternative. I&rsquo;ve been in contact with a company called Transform Learning. They help campuses like ours transition into community learning and workforce centers. Not a college anymore, but not a demolition site either.&rdquo;
                </blockquote>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 12 }}>Sandra Chen asks:</p>
                <blockquote style={{ borderLeft: '3px solid #059669', paddingLeft: 16, margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;What happens to accreditation? What happens to the students? What happens to the faculty? I have a lot of questions.&rdquo;
                </blockquote>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <p style={{ color: '#0C1F3F', fontSize: 15, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>
                Thomas nods. &ldquo;We all do. Let&rsquo;s hear them out.&rdquo;
              </p>
              <p style={{ marginBottom: 0 }}>
                Over the next three weeks, the Transform Learning team conducts remote discovery &mdash; video calls with campus leadership, a walking video tour from Dave Kowalski, financial document review, census and employer research, outreach to the workforce board, school district, and local employers.
              </p>
              <p style={{ fontWeight: 600, color: '#0C1F3F', marginTop: 16 }}>
                Thomas asks: &ldquo;Give us your honest assessment.&rdquo;
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* QUESTIONS */}
      <section ref={questionsRef} style={{ background: '#F4F7FB', padding: '60px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <ScrollReveal>
            <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Your Turn</p>
            <h2 style={{ fontFamily: 'var(--font-serif, Georgia)', fontSize: 28, color: '#0C1F3F', marginBottom: 6, lineHeight: 1.2 }}>
              Answer the board&rsquo;s questions.
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 8, maxWidth: 560, lineHeight: 1.6 }}>
              Click any question to see existing responses, submit your own, and run an AI analysis. Anyone can answer anything &mdash; build on each other, challenge ideas, add detail.
            </p>
          </ScrollReveal>

          {SECTIONS.map(section => (
            <div key={section.id} style={{ marginBottom: 32 }}>
              <ScrollReveal>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {section.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 10, color: section.color, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Section {section.id}</p>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0C1F3F', margin: 0 }}>{section.title}</h3>
                  </div>
                </div>
                <p style={{ color: '#64748B', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>{section.intro}</p>
              </ScrollReveal>

              {section.questions.map(q => (
                <QuestionCard key={q.id} q={q} section={`Section ${section.id}: ${section.title}`} sectionColor={section.color} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* SCORING RUBRIC */}
      <section style={{ background: '#0C1F3F', padding: '48px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px' }}>
          <ScrollReveal>
            <p style={{ color: '#00A8A8', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>How You&rsquo;ll Be Scored</p>
            <h2 style={{ fontFamily: 'var(--font-serif, Georgia)', fontSize: 24, color: 'white', marginBottom: 20 }}>Four dimensions. 1&ndash;5 scale.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { name: 'Specificity', desc: 'Does your answer reference Edgewater\'s buildings, people, and numbers \u2014 or could it apply to any campus?' },
                { name: 'Honesty', desc: 'Do you lead with candor? Do you hedge appropriately? Or do you oversell?' },
                { name: 'Feasibility', desc: 'Is what you\'re proposing actually doable? With realistic timelines and costs?' },
                { name: 'Empathy', desc: 'Do you speak to the humans \u2014 Dave\'s 22 years, Thomas\'s father, the 580 students?' },
              ].map(d => (
                <div key={d.name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 16 }}>
                  <p style={{ color: '#00A8A8', fontWeight: 700, fontSize: 14, margin: '0 0 4px' }}>{d.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <section style={{ background: '#F4F7FB', padding: '32px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: 12, margin: 0 }}>
            Edgewater College is fictional. All data is illustrative, based on composite patterns from real closures.
          </p>
          <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 8 }}>
            Campus Transformation &mdash; Transform Learning &mdash; Confidential Training Material
          </p>
        </div>
      </section>
    </>
  )
}
