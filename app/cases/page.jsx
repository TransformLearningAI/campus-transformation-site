import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

export const metadata = {
  title: 'Case Studies — Campus Transformation',
  description: 'What campus transformation looks like in practice. Modeled scenarios for real closing campuses.',
  alternates: { canonical: 'https://transformlearning.ai/cases' },
  openGraph: {
    title: 'Campus Transformation Case Studies',
    description: 'Detailed transformation models for real closing campuses across America.',
    siteName: 'Campus Transformation',
  },
}

const SUCCESS_STORIES = [
  {
    name: 'Marygrove Conservancy',
    location: 'Detroit, MI',
    emoji: '🌟',
    color: '#10B981',
    summary: 'A closed Catholic college transformed into a cradle-to-career educational campus serving 1,000+ students from birth through adulthood.',
    before: 'Marygrove College closed in 2019 after years of declining enrollment and mounting debt. The 53-acre campus in northwest Detroit faced an uncertain future.',
    after: [
      'Marygrove Conservancy formed in 2018 to steward the campus as a community resource',
      'Early Education Center opened 2021 — 144 children, now at full capacity',
      'The School at Marygrove opened 2019 — first graduating class in 2023',
      'Elementary school added in 2022 (K-2, expanding)',
      'P-20 cradle-to-career educational continuum serving the neighborhood',
      '$50 million Kresge Foundation commitment + $28.5M guarantee for final phase',
    ],
    lesson: '"No other private college has made a transition like this in the face of financial pressure to preserve its presence in the community while opening new opportunity pathways to serve students of all ages."',
    source: 'Kresge Foundation',
  },
  {
    name: 'Goddard College Campus',
    location: 'Plainfield, VT',
    emoji: '🏡',
    color: '#7C3AED',
    summary: 'A closed Vermont college campus purchased by a developer who is creating housing, arts spaces, and cultural offerings — bringing new life to a flood-stricken rural community.',
    before: 'Goddard College, a progressive institution founded in 1938, closed its Plainfield campus. The rural Vermont community faced losing its cultural anchor.',
    after: [
      'Developer Ledgeworks purchased the campus',
      'New housing planned — addressing acute need in flood-stricken area',
      'Arts and cultural offerings being developed',
      'Fresh energy and life returning to Plainfield',
      'Community-centered approach preserving the campus\'s creative spirit',
    ],
    lesson: 'Even without a nonprofit model, a campus can be reimagined to serve community needs — housing, culture, and gathering — when the buyer cares about the place.',
    source: 'Federal Reserve Bank of Boston',
  },
  {
    name: 'College of Saint Rose Campus',
    location: 'Albany, NY',
    emoji: '🏛️',
    color: '#3B82F6',
    summary: 'After the 104-year-old college closed in 2024, a county land authority stepped in to manage the nearly 30-acre campus and plan community-serving reuse.',
    before: 'The College of Saint Rose closed in 2024 after 104 years, leaving a 30-acre campus in Albany\'s residential Pine Hills neighborhood.',
    after: [
      'Albany County Land Authority managing the campus',
      'Community input process for future uses',
      'Focus on preserving campus as community asset rather than selling to highest bidder',
      'Exploring workforce, housing, and community programming',
    ],
    lesson: 'When local government acts quickly, a closing campus can be preserved for community benefit rather than lost to speculative development.',
    source: 'Bloomberg',
  },
]

const CASES = [
  {
    name: 'Pittsburgh Technical College',
    location: 'Oakdale, PA',
    status: 'Closed August 2024 · For Sale',
    color: '#D97706',
    before: {
      type: 'Private technical college',
      size: '~1,200 students at peak',
      campus: '180 acres, 165K sq ft main building, trades center, 461 dorm beds, professional kitchens',
      problem: 'Enrollment declined post-pandemic. Revenue couldn\'t cover costs. Board voted to close. Campus is now sitting empty, listed for sale.',
    },
    after: {
      vision: 'Regional Workforce & Innovation Campus',
      streams: [
        { name: 'Trades Training Center', desc: 'The existing trades building becomes a CDL, welding, electrical, and HVAC training hub. Equipment is already there. WIOA-funded students on day one.', revenue: '$800K' },
        { name: 'Culinary Incubator', desc: 'Professional kitchens (6th floor) become a licensed commercial kitchen for food entrepreneurs + community cooking classes.', revenue: '$200K' },
        { name: 'Tech Skills Academy', desc: 'Classrooms become IT certification, cybersecurity, and coding bootcamp spaces. Partner with CompTIA and Google for credentials.', revenue: '$400K' },
        { name: 'Workforce Housing', desc: '461 dorm beds → transitional housing for training students, short-term corporate stays, and affordable community units.', revenue: '$900K' },
        { name: 'Event & Conference Center', desc: 'Main building 5th floor gallery + grounds → corporate events, weddings, community gatherings.', revenue: '$350K' },
        { name: 'Business Incubator', desc: 'Office wings become co-working, maker space, and small business incubator. 100+ acres of excess land for future development.', revenue: '$300K' },
        { name: 'Community Fitness & Wellness', desc: 'Athletic facilities → community gym memberships, youth sports, wellness programs.', revenue: '$150K' },
        { name: 'K-12 STEM Campus', desc: '180 acres of outdoor space + labs → regional outdoor education center for school districts. Summer STEM camps.', revenue: '$250K' },
      ],
      total: '$3.35M Year 1 → $7M+ by Year 3',
      jobs: '85-120 positions (many transitioned from original staff)',
      people: '3,000+ community members served annually',
    },
  },
  {
    name: 'Hampshire College',
    location: 'Amherst, MA',
    status: 'Closing Fall 2026',
    color: '#7C3AED',
    before: {
      type: '60-year-old liberal arts college',
      size: '~600 students (down from 1,500+)',
      campus: '800 acres in Pioneer Valley, academic buildings, arts facilities, farm, extensive natural areas',
      problem: 'Declining enrollment, accreditation pressure, financial struggles. 800 acres of beautiful land that could be sold to developers — or transformed.',
    },
    after: {
      vision: 'New England Center for Arts, Ecology & Community Learning',
      streams: [
        { name: 'Ecological Learning Center', desc: 'Hampshire\'s existing farm and 800 acres become a regional outdoor education and ecological research destination. K-12 field trips, citizen science, conservation workshops.', revenue: '$400K' },
        { name: 'Artists\' Colony & Residency', desc: 'Studio spaces and housing become artist residencies, writer retreats, and creative workshops. Build on Hampshire\'s arts legacy.', revenue: '$300K' },
        { name: 'Workforce Skills Hub', desc: 'Classrooms become training centers for healthcare, trades, and tech certifications. Pioneer Valley has workforce gaps.', revenue: '$600K' },
        { name: 'Retreat & Conference Center', desc: '800 acres in the Berkshire foothills. Corporate retreats, yoga retreats, wedding venue, academic conferences. Dorms become rustic-luxury lodging.', revenue: '$800K' },
        { name: 'Community Farm & Food Hub', desc: 'Expand the existing farm into a community-supported agriculture program, farm-to-table dining, and food entrepreneur incubator.', revenue: '$200K' },
        { name: 'Senior Lifelong Learning', desc: 'Retiree-rich Pioneer Valley population gets enrichment courses, nature walks, art classes, and social connection in a beautiful campus setting.', revenue: '$250K' },
      ],
      total: '$2.55M Year 1 → $5.5M+ by Year 3',
      jobs: '60-90 positions',
      people: '5,000+ community members + visitors served annually',
    },
  },
  {
    name: 'A Small Private College',
    location: 'Rural Midwest',
    status: 'Considering Closure',
    color: '#10B981',
    before: {
      type: 'Faith-affiliated private college, 80+ years old',
      size: '~400 students (down from 1,200)',
      campus: '40 acres, main academic building, chapel, gym, dining hall, 3 residence halls, athletic fields',
      problem: 'Enrollment has dropped 65% in 10 years. Endowment nearly depleted. Board is split between selling to a developer and "finding another way." Faculty morale is low.',
    },
    after: {
      vision: 'Community Learning & Wellness Campus with Faith-Based Mission',
      streams: [
        { name: 'Workforce Training', desc: 'Main building becomes training center for in-demand certifications. Partner with regional employers. WIOA funding covers most students.', revenue: '$500K' },
        { name: 'Community Health Clinic', desc: 'Partner with nearest hospital system for a satellite clinic. The community lost its last doctor. This brings healthcare back.', revenue: '$200K' },
        { name: 'Faith & Community Center', desc: 'Chapel becomes multi-faith community space. Counseling, AA/NA meetings, food pantry, community dinners. Honor the institution\'s roots.', revenue: '$50K (grant-funded)' },
        { name: 'Youth & Family Programs', desc: 'Gym and fields → after-school programs, summer camps, youth sports leagues. Dining hall → community meals program.', revenue: '$200K' },
        { name: 'Senior Enrichment', desc: 'Art, music, Bible study, fitness, technology classes for the growing retiree population. They have time and disposable income.', revenue: '$150K' },
        { name: 'Affordable Housing', desc: '3 residence halls → mix of workforce housing, senior independent living, and transitional housing. Filling a critical community need.', revenue: '$400K' },
      ],
      total: '$1.5M Year 1 → $3.5M+ by Year 3',
      jobs: '35-50 positions (many retained from original staff)',
      people: '2,000+ community members served annually',
    },
  },
]

export default function CasesPage() {
  return (
    <>
      <section className="py-20 lg:py-28" style={{ background: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#00A8A8' }}>Case Studies</p>
            <h1 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              What transformation<br />
              <span style={{ color: '#00A8A8' }}>actually looks like.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl leading-relaxed">
              Real examples of campuses that transformed instead of closing, followed by
              our modeled transformation plans for campuses facing closure now.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Real Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">It&rsquo;s Already Happening</p>
            <h2 className="section-headline mb-12">Campuses that transformed instead of dying.</h2>
          </ScrollReveal>

          <div className="space-y-6 mb-16">
            {SUCCESS_STORIES.map((story, i) => (
              <ScrollReveal key={story.name} delay={Math.min(i, 2)}>
                <div className="rounded-2xl p-6 border" style={{ borderColor: story.color + '40', background: story.color + '08' }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{story.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#0C1F3F' }}>{story.name}</h3>
                      <p className="text-sm text-brand-gray">{story.location}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-4" style={{ color: story.color }}>{story.summary}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/80 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Before</p>
                      <p className="text-sm text-brand-gray">{story.before}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2">After</p>
                      <ul className="space-y-1.5">
                        {story.after.map((item, j) => (
                          <li key={j} className="text-sm text-brand-gray flex items-start gap-1.5">
                            <span className="text-green-500 mt-0.5">&#10003;</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-brand-gray italic">{story.lesson}</p>
                    <p className="text-[10px] text-brand-gray mt-1">Source: {story.source}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="border-b mb-16" style={{ borderColor: '#DDE5EF' }} />
            <p className="eyebrow mb-4">What We Would Build</p>
            <h2 className="section-headline mb-4">Transformation models for campuses closing now.</h2>
            <p className="text-brand-gray text-sm max-w-2xl mb-12">
              These are Transform Learning&rsquo;s own modeled plans — not completed projects. Revenue figures
              are illustrative projections based on market analysis and comparable programs. Actual results
              require site-specific assessment.
            </p>
          </ScrollReveal>

          {CASES.map((cs, ci) => (
            <div key={cs.name} className="mb-20 last:mb-0">
              <ScrollReveal>
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                       style={{ background: cs.color }}>
                    {ci + 1}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: '#0C1F3F' }}>{cs.name}</h2>
                    <p className="text-sm text-brand-gray">{cs.location} · {cs.status}</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Before */}
              <ScrollReveal delay={1}>
                <div className="rounded-xl p-6 mb-4 border" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                  <h3 className="text-sm font-bold text-red-700 mb-3">Before: The Situation</h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-red-900/70">
                    <div><span className="font-medium text-red-800">Type:</span> {cs.before.type}</div>
                    <div><span className="font-medium text-red-800">Size:</span> {cs.before.size}</div>
                    <div className="sm:col-span-2"><span className="font-medium text-red-800">Campus:</span> {cs.before.campus}</div>
                    <div className="sm:col-span-2"><span className="font-medium text-red-800">Problem:</span> {cs.before.problem}</div>
                  </div>
                </div>
              </ScrollReveal>

              {/* After */}
              <ScrollReveal delay={2}>
                <div className="rounded-xl p-6 border" style={{ background: '#F0FDF4', borderColor: '#BBF7D0' }}>
                  <h3 className="text-sm font-bold text-green-700 mb-1">After: {cs.after.vision}</h3>
                  <div className="flex flex-wrap gap-3 mb-4 text-xs">
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{cs.after.total}</span>
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{cs.after.jobs}</span>
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{cs.after.people}</span>
                  </div>

                  <div className="space-y-3">
                    {cs.after.streams.map((stream, si) => (
                      <div key={si} className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-green-800">{stream.name}</p>
                            <p className="text-xs text-green-700/70 mt-1 leading-relaxed">{stream.desc}</p>
                          </div>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded shrink-0">{stream.revenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {ci < CASES.length - 1 && <div className="border-b my-16" style={{ borderColor: '#DDE5EF' }} />}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16" style={{ background: '#F4F7FB' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-headline mb-4">Is your campus next?</h2>
            <p className="text-brand-gray mb-8">
              Every campus is different. We&rsquo;ll build a transformation model specific to
              your buildings, your community, and your people.
            </p>
            <Link href="/inquiry"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-bold hover:opacity-90"
                  style={{ background: '#00A8A8' }}>
              Start a Conversation
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
