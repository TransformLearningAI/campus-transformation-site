'use client'

import { useState, useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

/* ═══════════════════════════════════════════════════════════════════
   GATED PROCESS PAGE
   Visitors must request access. Jeff approves via email link.
   Approved tokens stored in localStorage.
   ═══════════════════════════════════════════════════════════════════ */

// ── ACCESS GATE ────────────────────────────────────────────────────

function AccessGate({ onGranted }) {
  const [form, setForm] = useState({ name: '', email: '', title: '', institution: '', reason: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [token, setToken] = useState('')

  // Check URL for approval token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) {
      localStorage.setItem('process-access-token', t)
      onGranted()
    }
  }, [onGranted])

  // Check localStorage for existing token
  useEffect(() => {
    const saved = localStorage.getItem('process-access-token')
    if (saved) onGranted()
  }, [onGranted])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSending(true)

    try {
      await fetch('/api/process-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
    setSending(false)
  }

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-5xl mb-4">📋</p>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#0C1F3F' }}>Request received.</h2>
          <p className="text-brand-gray mb-2">
            We&rsquo;ll review your request and send you access within 24 hours.
          </p>
          <p className="text-sm text-brand-gray">
            Check your email at <strong>{form.email}</strong> for the access link.
          </p>
          <p className="text-xs text-brand-gray mt-6">
            Questions? <a href="mailto:jeff@transformlearning.ai" style={{ color: '#00A8A8' }}>jeff@transformlearning.ai</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0C1F3F' }}>Our Process is Proprietary</h1>
          <p className="text-brand-gray text-sm leading-relaxed max-w-md mx-auto">
            Our detailed transformation process represents years of development and real-world experience.
            We share it with serious partners and prospective clients. Request access below and
            we&rsquo;ll review your request personally.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#DDE5EF' }}>
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Your name *" required value={form.name}
                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                   className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
            <input type="email" placeholder="Email *" required value={form.email}
                   onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                   className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Your title" value={form.title}
                   onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                   className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
            <input type="text" placeholder="Institution / Organization" value={form.institution}
                   onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
                   className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500" style={{ borderColor: '#DDE5EF' }} />
          </div>
          <textarea placeholder="Why are you interested in our process?" rows={3} value={form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500 resize-none" style={{ borderColor: '#DDE5EF' }} />

          {status === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}

          <button type="submit" disabled={sending}
                  className="w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#00A8A8' }}>
            {sending ? 'Sending...' : 'Request Access'}
          </button>

          <p className="text-[10px] text-center text-brand-gray">
            All requests reviewed within 24 hours. Your information is kept confidential.
          </p>
        </form>
      </div>
    </div>
  )
}

// ── PROCESS CONTENT (only shown after access granted) ──────────────

const PHASES = [
  {
    num: '01',
    title: 'Discovery & Assessment',
    duration: 'Weeks 1–4',
    color: '#3B82F6',
    summary: 'We learn everything about your campus, your community, and your situation — before we propose anything.',
    activities: [
      { name: 'Confidential Leadership Meeting', who: 'Board chair, president, key leaders, Transform Learning team', what: 'Understand the situation, timeline, what\'s been considered, and what the community means to the people in the room. Everything said here stays here.', deliverable: 'Shared understanding and engagement letter' },
      { name: 'Campus Walk-Through', who: 'Transform Learning team, facilities staff, anyone who knows the buildings', what: 'Walk every building together. Not just walls and wiring — imagine out loud. This kitchen could be a culinary program. This gym could serve 500 community members. This quad could host a farmers market. See the potential, not just the condition.', deliverable: 'Facility inventory with conversion possibilities' },
      { name: 'Staff & Faculty Conversations (Confidential)', who: 'Department heads, faculty, student services, admissions, athletics, maintenance — anyone who wants to talk', what: 'One-on-one conversations about what they know, who they know in the community, what skills they have beyond their title, and what they\'d want to do next. These people are the campus\'s greatest asset.', deliverable: 'People inventory — skills, relationships, and energy for what\'s next' },
      { name: 'Institutional & Financial Review', who: 'CFO, Transform Learning team', what: 'Understand the financial picture — what you owe, what you own, what flexibility exists. Not an audit, just a clear-eyed look at reality so we can plan around it.', deliverable: 'Financial snapshot and peer benchmarking report' },
      { name: 'Campus History & Story Gathering', who: 'Long-time staff, alumni who are still local, community elders', what: 'What does this place mean to people? What happened here that mattered? The transformation should honor the story, not erase it. These conversations shape the brand and the mission.', deliverable: 'Campus narrative and legacy themes' },
    ],
  },
  {
    num: '02',
    title: 'Community Listening',
    duration: 'Weeks 5–8',
    color: '#10B981',
    summary: 'The campus doesn\'t exist in a vacuum. We talk to everyone who has a stake in what happens next.',
    activities: [
      { name: 'Employer Roundtable', who: '15-25 local employers across industries (healthcare, manufacturing, construction, tech, logistics, hospitality)', what: 'What positions can\'t you fill? What skills are missing? Would you pay for a training pipeline? Would you hire graduates of a 12-week certificate program? What do you pay?', deliverable: 'Workforce demand map with employer commitment letters of interest' },
      { name: 'Community Town Hall #1', who: 'Open to all community members, advertised through local media, churches, social media', what: 'Present the situation honestly. The campus is at a crossroads. We\'re here to listen — what does this community need? What would you use this campus for? What are you missing?', deliverable: 'Community needs inventory (ranked by frequency and passion)' },
      { name: 'Municipal & County Government Meetings', who: 'Mayor, council members, county commissioners, planning department, economic development corporation', what: 'Zoning flexibility, tax incentives, TIF districts, municipal partnership opportunities, infrastructure support. What does the government want this campus to become?', deliverable: 'Government partnership framework and incentive inventory' },
      { name: 'K-12 School District Meetings', who: 'Superintendent, principals, CTE directors, guidance counselors', what: 'Would you send students here for STEM camps, outdoor education, dual enrollment alternatives, after-school programs? What do your students need that your buildings can\'t provide?', deliverable: 'K-12 partnership opportunity matrix' },
      { name: 'Community Organization Outreach', who: 'Chamber of Commerce, Rotary, Lions, VFW, churches, mosques, synagogues, cultural organizations, arts councils, garden clubs, historical societies, youth groups, senior centers', what: 'Individual meetings with each group. What programs would your members attend? Would you hold events on campus? Would you partner on programming? What\'s missing in this community?', deliverable: 'Community organization partnership inventory' },
      { name: 'Healthcare & Social Services Assessment', who: 'Local hospitals, health departments, mental health agencies, substance abuse programs, food banks, housing authorities', what: 'Is there a clinic shortage? Could the campus host a satellite health center? Are there social services that need space? What about counseling, AA/NA meetings, food distribution?', deliverable: 'Health and social services gap analysis' },
      { name: 'Alumni & Donor Listening Sessions', who: 'Alumni association leadership, major donors, foundation board members', what: 'The hardest conversation. The school as they knew it is changing. But the mission doesn\'t have to die. How do they want to be involved? What legacy matters to them?', deliverable: 'Alumni engagement strategy and legacy preservation plan' },
      { name: 'Workforce Development Board Meeting', who: 'Local WDB director, WIOA administrators, PA CareerLink / American Job Center staff', what: 'What training programs qualify for WIOA funding? What\'s the ITA (Individual Training Account) process? Can this campus become an eligible training provider? What certifications are in demand?', deliverable: 'Funding eligibility assessment and pathway plan' },
    ],
  },
  {
    num: '03',
    title: 'Collaborative Design',
    duration: 'Weeks 9–14',
    color: '#F59E0B',
    summary: 'We take everything we\'ve learned and build the transformation plan — with the community, not for them.',
    activities: [
      { name: 'Community Design Night', who: 'Open community event — families, retirees, business owners, students, everyone', what: 'Giant campus maps on tables. Sticky notes, markers, colored dots. Community members physically place programs on the map. "I\'d come here for this." Vote on priorities. Kids draw what they want. This is their campus — they should design what it becomes.', deliverable: 'Community-validated campus vision map' },
      { name: 'Reimagination Charrette (2-Day Workshop)', who: 'Board reps, community leaders, employer partners, staff, artists, local entrepreneurs', what: 'Two days of hands-on design. Walk the buildings together, then sit down and map programs to spaces. Who runs what? Who partners? What opens first? By end of day two, the plan is on the wall and everyone owns a piece of it.', deliverable: 'Campus activation plan with space assignments and champions' },
      { name: 'Staff Futures Workshop', who: 'All staff invited, open and honest format', what: 'Present the new model. Show every person where their skills fit. A maintenance worker who can teach trades. An admissions counselor who becomes a community outreach coordinator. Honest, respectful, no surprises.', deliverable: 'Individual transition paths for every team member' },
      { name: 'Brand & Identity Workshop', who: 'Board, staff, community representatives, alumni, local artists', what: 'What is this place called now? Does it keep the old name? A new name? How do we honor the past while signaling the future? Bring in a local artist to sketch the vision. Logo, messaging, signage, the story you tell.', deliverable: 'Brand identity and naming recommendation' },
      { name: 'Arts & Culture Planning', who: 'Local artists, musicians, theater groups, cultural organizations, arts council', what: 'The auditorium, the gallery space, the outdoor amphitheater — how do they come alive? Concert series? Community theater? Youth arts programs? Gallery shows by local artists? The culture is what makes people come back.', deliverable: 'Year-one arts and culture programming calendar' },
      { name: 'Sustainability & Financial Planning', who: 'Transform Learning team, board finance committee', what: 'Build the business plan. Not a spreadsheet exercise — a living model based on everything the community told us they want. Revenue projections, funding sources, what it costs to run, and when it breaks even.', deliverable: 'Business plan with financial projections and funding strategy' },
      { name: 'Technology & Community Platform Design', who: 'Transform Learning tech team, campus staff', what: 'Design the community engagement platform — events calendar, space booking, impact tracking. The digital front door that makes the campus feel organized and alive.', deliverable: 'Platform design and deployment timeline' },
    ],
  },
  {
    num: '04',
    title: 'Activation & Launch',
    duration: 'Months 4–12',
    color: '#EC4899',
    summary: 'Stop planning. Start doing. Open doors, turn on lights, welcome people back onto campus.',
    activities: [
      { name: 'Open the Doors (Month 4-5)', who: 'Operations team, community partners, volunteers', what: 'Open the gym. Host the first concert in the auditorium. Welcome the first co-working members. Launch a Saturday farmers market on the quad. People on campus again — that\'s the signal that everything has changed.', deliverable: 'Alive campus with foot traffic and energy' },
      { name: 'Workforce Program Launch (Month 5-7)', who: 'Program directors (former faculty), employer partners, WDB', what: 'First cohort of CDL, welding, CNA, or IT cert students. WIOA-funded where possible. Employer partners committed to interview graduates. Marketing blitz — radio, social, community boards, churches.', deliverable: 'First training cohort enrolled and funded' },
      { name: 'K-12 Programs Launch (Month 6-8)', who: 'Education coordinator, school district partners', what: 'Summer STEM camps. Fall field trip programs. After-school robotics or coding clubs. Outdoor education days on campus green space. Schools pay per student or per program.', deliverable: 'School district contracts and first programs delivered' },
      { name: 'The Campus Comes Alive', who: 'Community engagement team, every partner organization from Phase 2', what: 'Senior watercolor class on Tuesday mornings. ESL on Wednesday nights. Yoga in the gym. Book club in the old library. Gardening club on the grounds. Veterans meetup. Kids\' robotics after school. The calendar fills up because the community designed it.', deliverable: 'A campus that\'s busy seven days a week' },
      { name: 'Housing Activation', who: 'Property manager, renovation contractors', what: 'Convert best-condition dorms first. Workforce student housing for training program participants. Short-term corporate stays. Transitional housing partnerships with social services.', deliverable: 'First housing units occupied and generating revenue' },
      { name: 'Grand Re-Opening Celebration', who: 'Everyone — board, staff, community, employers, media, politicians, alumni, kids', what: 'A block party for the campus\'s new life. Tours of every space, food trucks, live music, demonstrations by every program, kids\' activities on the lawn. Alumni come back and see the campus thriving in a new way. The local paper runs it front page.', deliverable: 'The moment the community takes ownership' },
      { name: 'Impact Dashboard Goes Live', who: 'Transform Learning tech team', what: 'Real-time tracking of everything that matters — people served, programs running, jobs placed, community events hosted. Board members and funders see the impact. The community sees their campus working.', deliverable: 'Live impact visibility for everyone' },
    ],
  },
  {
    num: '05',
    title: 'Growth & Sustainability',
    duration: 'Year 2 and Beyond',
    color: '#8B5CF6',
    summary: 'We don\'t leave after the launch. We stay until the campus is self-sustaining — and then we\'re a phone call away.',
    activities: [
      { name: 'Quarterly Check-Ins', who: 'Transform Learning team, board, program leaders, community reps', what: 'Walk the campus together. What\'s humming? What needs attention? What are people asking for that we\'re not offering yet? Adjust based on what the community is telling us.', deliverable: 'Quarterly reflection and course corrections' },
      { name: 'Annual Community Gathering', who: 'Open event — everyone invited, food, conversation', what: 'A celebration and a listening session in one. What\'s working? What do you wish we had? What\'s changed in your life since the campus reopened? The campus evolves because the community keeps shaping it.', deliverable: 'Community voice guiding the next year' },
      { name: 'Funding & Sustainability', who: 'Transform Learning team, operations leads', what: 'Renew existing grants, pursue new ones, expand employer partnerships. The track record from year one makes every conversation easier. Success is the best pitch.', deliverable: 'Growing and diversified funding base' },
      { name: 'New Programs & Partnerships', who: 'Operations team, employer partners, community members', what: 'The community asks for something new — an EV repair certification, a pottery studio, a weekend coding camp for teens, a veterans\' woodworking shop. If people want it and it fits the campus, we build it.', deliverable: 'Programs that grow from community demand' },
      { name: 'Deepening Roots', who: 'Everyone on campus', what: 'More employer partnerships. More community groups calling the campus home. More kids on the lawn. More seniors in the art studio. More veterans finding careers. The campus becomes the thing the community can\'t imagine living without.', deliverable: 'A campus that belongs to its community' },
      { name: 'Final Assessment & Transition to Independence', who: 'Transform Learning team, board', what: 'When the campus is self-sustaining — generating enough to cover operations, service debt, and invest in growth — we step back to advisory. Your team runs it. We\'re a call away.', deliverable: 'Independence readiness assessment and ongoing advisory agreement' },
    ],
  },
]

// ── MAIN PAGE COMPONENT ────────────────────────────────────────────

export default function ProcessPage() {
  return (
    <>
      <section className="py-20 lg:py-28" style={{ background: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#00A8A8' }}>Our Process</p>
            <h1 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              From first conversation to<br />
              <span style={{ color: '#00A8A8' }}>thriving community campus.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Five phases. 12-18 months. Every meeting, every analysis, every community
              conversation — mapped out so you know exactly what happens and when.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {PHASES.map((phase, pi) => (
            <div key={phase.num} className="mb-16 last:mb-0">
              <ScrollReveal>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                       style={{ background: phase.color }}>
                    {phase.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold" style={{ color: '#0C1F3F' }}>{phase.title}</h2>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            style={{ background: phase.color + '15', color: phase.color }}>
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-sm text-brand-gray">{phase.summary}</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="space-y-4 ml-0 sm:ml-[4.5rem]">
                {phase.activities.map((act, ai) => (
                  <ScrollReveal key={ai} delay={Math.min(ai, 3)}>
                    <div className="bg-white rounded-xl p-5 border hover:border-gray-300 transition-colors"
                         style={{ borderColor: '#E2E8F0' }}>
                      <h3 className="font-bold text-sm mb-2" style={{ color: '#0C1F3F' }}>{act.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider shrink-0 w-20 pt-0.5" style={{ color: phase.color }}>Who</span>
                          <span className="text-brand-gray">{act.who}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider shrink-0 w-20 pt-0.5" style={{ color: phase.color }}>What</span>
                          <span className="text-brand-gray">{act.what}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider shrink-0 w-20 pt-0.5" style={{ color: phase.color }}>Output</span>
                          <span className="text-brand-gray font-medium">{act.deliverable}</span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {pi < PHASES.length - 1 && (
                <div className="flex justify-center my-8">
                  <div className="w-0.5 h-8" style={{ background: `linear-gradient(180deg, ${phase.color}, ${PHASES[pi+1].color})` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ background: '#F4F7FB' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-headline mb-6">That&rsquo;s the process. Here&rsquo;s the promise.</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { num: '30+', label: 'Meetings & sessions' },
                { num: '100+', label: 'Stakeholders engaged' },
                { num: '12-18', label: 'Months to self-sustaining' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl bg-white border" style={{ borderColor: '#DDE5EF' }}>
                  <p className="text-2xl font-bold" style={{ color: '#00A8A8' }}>{s.num}</p>
                  <p className="text-xs text-brand-gray mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-brand-gray leading-relaxed mb-8">
              We don&rsquo;t drop a report on your desk and leave. We sit in the community meetings.
              We walk the buildings with your staff. We hand out sticky notes at design night.
              We stand on stage at the grand re-opening. We stay until the campus is alive
              and the community owns it. That&rsquo;s not consulting — that&rsquo;s building something together.
            </p>
            <a href="/campus-transformation#contact"
               className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-bold hover:opacity-90"
               style={{ background: '#00A8A8' }}>
              Start the Conversation
            </a>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
