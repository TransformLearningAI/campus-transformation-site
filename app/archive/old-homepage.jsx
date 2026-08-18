import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import SchoolComparison from '@/components/SchoolComparison'
import ImpactDashboardDemo from '@/components/ImpactDashboardDemo'
import CommunityPlatformDemo from '@/components/CommunityPlatformDemo'

export const metadata = {
  title: 'Don\'t Close. Transform. — Campus Transformation',
  description: 'Your campus doesn\'t have to close. Explore transforming it into a workforce development, community learning, and innovation hub. Keep your mission. Serve more people.',
  alternates: { canonical: 'https://campustransformation.org' },
  openGraph: {
    title: 'Don\'t Close. Transform.',
    description: 'Your college campus doesn\'t have to shut down. Explore turning it into a workforce center, community hub, and sustainable operation with multiple revenue streams.',
    siteName: 'Campus Transformation',
    type: 'website',
    url: 'https://campustransformation.org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Don\'t Close. Transform.',
    description: 'Your college campus doesn\'t have to shut down. Explore turning it into a workforce center, community hub, and sustainable operation with multiple revenue streams.',
  },
}

const WHAT_IT_BECOMES = [
  {
    icon: '⚡',
    title: 'Workforce Development Center',
    desc: 'CDL, welding, healthcare, IT certifications. Industry credentials that employers actually want. WIOA-funded students from day one. Your existing labs and classrooms are already built for this.',
    revenue: '$1.5–2.5M/year',
  },
  {
    icon: '🧒',
    title: 'K-12 Outdoor Education Campus',
    desc: 'Schools are desperate for field trip destinations and outdoor learning. Your green space, science labs, and athletic facilities become a regional outdoor education center. Summer STEM camps. Nature programs. School districts pay per student.',
    revenue: '$200–500K/year',
  },
  {
    icon: '🤖',
    title: 'AI Learning & Career Hub',
    desc: 'Walk-in career exploration, AI tutoring, micro-credentials from Google and IBM delivered in person. No degree needed — just skills that get people hired. Serves everyone from teens to career changers.',
    revenue: '$200–500K/year',
  },
  {
    icon: '🚀',
    title: 'Small Business Incubator & Citizen Lab',
    desc: 'Classrooms become co-working space, maker labs, and startup incubators. A "citizen lab" where community members learn to build apps, start businesses, and solve local problems. Partner with SBA and SCORE for programming.',
    revenue: '$375–750K/year',
  },
  {
    icon: '🎭',
    title: 'Community Arts & Events Center',
    desc: 'Your auditorium, dining hall, and green spaces host concerts, theater, corporate events, weddings, and farmers markets. The campus becomes the cultural heart of the community again.',
    revenue: '$350–700K/year',
  },
  {
    icon: '🏠',
    title: 'Workforce & Community Housing',
    desc: 'Dorms become transitional housing for workforce students, short-term corporate stays, or affordable community housing. Revenue while you fill beds that would otherwise sit empty.',
    revenue: '$500K–1.2M/year',
  },
  {
    icon: '🌿',
    title: 'Wellness & Lifelong Learning',
    desc: 'Community gym memberships, yoga and wellness programs, senior enrichment courses, ESL classes, health clinic with a hospital partner. The campus serves every age, every stage of life.',
    revenue: '$350–800K/year',
  },
  {
    icon: '🔬',
    title: 'Citizen Science & Innovation Lab',
    desc: 'Your science labs become community innovation spaces. Environmental monitoring, local food production research, student competitions, maker faires. Partner with local industry for applied R&D.',
    revenue: '$100–300K/year',
  },
]

const CAMPUSES = [
  { name: 'Pittsburgh Technical College', location: 'Oakdale, PA', status: 'For Sale Now', statusColor: '#C53030', details: '180 acres · 165K sq ft · 461 dorm beds · Professional kitchens & labs' },
  { name: 'Fontbonne University', location: 'St. Louis, MO', status: 'Closed 2025', statusColor: '#C53030', details: 'Century-old Catholic college · Full campus facilities' },
  { name: 'Hampshire College', location: 'Amherst, MA', status: 'Closing Fall 2026', statusColor: '#D69E2E', details: '800-acre campus · 60-year-old liberal arts institution' },
  { name: 'Siena Heights University', location: 'Adrian, MI', status: 'Closing 2026', statusColor: '#D69E2E', details: 'Full residential campus · Strong community ties' },
  { name: 'Lourdes University', location: 'Sylvania, OH', status: 'Closing Spring 2026', statusColor: '#D69E2E', details: 'Toledo metro · Classroom + athletic facilities' },
  { name: 'Penn State (7 campuses)', location: 'PA Statewide', status: 'Closing 2027', statusColor: '#D69E2E', details: '7 campuses, 3,000+ students, rural communities across PA' },
  { name: 'Northland College', location: 'Ashland, WI', status: 'Closed 2025', statusColor: '#C53030', details: '133-year-old institution · Environmental focus · Northern WI' },
  { name: 'Trinity Christian College', location: 'Palos Heights, IL', status: 'Closing May 2026', statusColor: '#D69E2E', details: 'Chicago suburb · Residential campus' },
]

export default function CampusTransformationPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-36 overflow-hidden" style={{ background: '#0A0A0A' }}>
        <div className="max-w-6xl mx-auto px-6 relative">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#00A8A8' }}>
              For Boards of Trustees &amp; Campus Leaders
            </p>
            <h1 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Don&rsquo;t close.<br />
              <span style={{ color: '#00A8A8' }}>Transform.</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mb-10 leading-relaxed">
              Your campus doesn&rsquo;t have to shut down. There may be a path to keep
              your buildings, preserve your mission, and build something the community
              needs even more than a struggling college. We help you explore that path --
              including alternative accreditation models, new revenue streams, and
              workforce-centered programming.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#contact"
                 className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold hover:opacity-90"
                 style={{ background: '#00A8A8', color: 'white' }}>
                Talk to Us — Free &amp; Confidential
              </a>
              <a href="#model"
                 className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-white/20">
                See What Your Campus Could Become
              </a>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <a href="/process"
                 className="text-white/40 text-xs hover:text-white/60 transition-colors">
                Our Process →
              </a>
              <span className="text-white/20">·</span>
              <a href="/Campus-Transformation-Prospectus.html" target="_blank"
                 className="text-white/40 text-xs hover:text-white/60 transition-colors">
                View Prospectus →
              </a>
              <span className="text-white/20">·</span>
              <a href="/cases"
                 className="text-white/40 text-xs hover:text-white/60 transition-colors">
                Case Studies →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The Situation */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">The Situation You&rsquo;re In</p>
            <h2 className="section-headline mb-8">You&rsquo;re not failing. The model is.</h2>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <div className="space-y-6 text-brand-gray leading-relaxed">
              <p>
                Your enrollment is declining. Your endowment can&rsquo;t cover the gap. Your board
                is looking at closure — selling the campus, laying off your people, and watching
                the community lose its anchor. Your faculty and staff will lose their jobs. Your
                alumni will lose their alma mater. Your community will lose its heart.
              </p>
              <p className="font-semibold" style={{ color: '#0C1F3F' }}>
                But here&rsquo;s what nobody is telling you: the problem isn&rsquo;t your campus.
                It&rsquo;s the accredited-degree business model. There are ways to rethink
                that model -- including working with your accreditor on innovation, exploring
                alternative accreditation, or transitioning to non-degree programming --
                without walking away from your mission.
              </p>
              <p>
                Your buildings may be worth more as a workforce development center, community
                learning hub, and innovation campus than as a struggling college. Some of your faculty
                could transition to workforce instruction. Your staff may find new roles. Your campus
                has the potential to serve <em>more</em> people than it does as a college -- and
                generate <em>more diverse</em> revenue doing it. Every situation is different, and we help
                you figure out what&rsquo;s realistic for yours.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {[
              { num: '100+', label: 'Colleges closed or merged since 2020', source: 'HECB / State Higher Ed Executive Officers' },
              { num: '65%', label: 'Of small privates showing financial stress', source: 'Forbes Financial Health Grades' },
              { num: '8M+', label: 'Unfilled jobs in the US', source: 'Bureau of Labor Statistics JOLTS, 2025' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i} type="scale">
                <div className="text-center p-6 rounded-2xl" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                  <p className="font-serif font-light" style={{ fontSize: '42px', lineHeight: 1, color: '#0C1F3F' }}>{stat.num}</p>
                  <p className="text-sm text-brand-gray mt-2">{stat.label}</p>
                  {stat.source && <p className="text-[10px] text-brand-gray/50 mt-1">{stat.source}</p>}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* School Lookup Tool */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">See the Data</p>
            <h2 className="section-headline mb-4">Look up your school. See where you stand.</h2>
            <p className="text-brand-gray max-w-2xl mb-8">
              Type your institution&rsquo;s name below. We&rsquo;ll pull the latest federal data and
              compare you to peer institutions of the same type and size. Understanding where
              you stand is the first step toward deciding what comes next.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <SchoolComparison />
          </ScrollReveal>
        </div>
      </section>

      {/* What You Keep */}
      <section className="py-20" style={{ background: '#0C1F3F' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-serif font-light text-white mb-10"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              What you keep.
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🏛️', text: 'Your buildings and campus' },
              { emoji: '👥', text: 'Some faculty and staff in new roles' },
              { emoji: '🎓', text: 'Your educational mission' },
              { emoji: '❤️', text: 'Your community role' },
              { emoji: '🏠', text: 'Your housing and facilities' },
              { emoji: '📛', text: 'Your name and brand' },
              { emoji: '🤝', text: 'Your alumni network' },
              { emoji: '🌳', text: 'Your land and green space' },
            ].map((item, i) => (
              <ScrollReveal key={item.text} delay={Math.min(i, 4)} type="scale">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <p className="text-sm text-white/80 font-medium">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={2}>
            <div className="mt-10">
              <h3 className="font-serif font-light text-white/40 text-xl mb-2">What you might leave behind.</h3>
              <p className="text-white/30 text-sm max-w-md mx-auto">
                Depending on the model that fits your campus: some or all accreditation compliance,
                federal financial aid paperwork, the enrollment treadmill. We also explore
                working with your accreditor to create room for innovation within your
                existing framework.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What It Becomes */}
      <section id="model" className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">The New Model</p>
            <h2 className="section-headline mb-4">Eight ways your campus serves the community — and pays for itself.</h2>
            <p className="text-brand-gray max-w-2xl mb-12">
              Some of these work within existing accreditation. Others work alongside it
              or independently. We help you find the right mix of industry certifications,
              community programs, and revenue streams for your situation.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            {WHAT_IT_BECOMES.map((stream, i) => (
              <ScrollReveal key={stream.title} delay={Math.min(i, 4)} type="scale">
                <div className="card-lift bg-white rounded-xl p-6 h-full" style={{ border: '1px solid #DDE5EF' }}>
                  <span className="text-3xl block mb-3">{stream.icon}</span>
                  <h3 className="font-bold text-sm mb-1" style={{ color: '#0C1F3F' }}>{stream.title}</h3>
                  <p className="text-xs font-bold mb-2" style={{ color: '#00A8A8' }}>{stream.revenue}</p>
                  <p className="text-sm text-brand-gray leading-relaxed">{stream.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Total */}
          <ScrollReveal>
            <div className="mt-10 bg-white rounded-2xl p-8 text-center" style={{ border: '2px solid #00A8A8' }}>
              <p className="text-brand-gray text-sm mb-2">Combined potential annual revenue</p>
              <p className="font-serif font-light" style={{ fontSize: '56px', lineHeight: 1, color: '#00A8A8' }}>$3.5–7.5M</p>
              <p className="text-brand-gray text-sm mt-2">Potentially lower operating cost than a traditional accredited college · Actual mix varies significantly by campus</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Who It Serves */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Who Your Campus Serves Now</p>
            <h2 className="section-headline mb-12">More people than a college ever could.</h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: '👷', title: 'Adults needing new skills', desc: 'Career changers, displaced workers, anyone who needs a certification — not a 4-year degree — to get hired.' },
              { emoji: '🧒', title: 'K-12 students', desc: 'Field trips, outdoor education, STEM camps, after-school programs. Schools pay per student for experiences they can\'t create themselves.' },
              { emoji: '👴', title: 'Seniors & retirees', desc: 'Lifelong learning, art classes, health programs, social connection. The fastest-growing demographic with disposable time and income.' },
              { emoji: '🚀', title: 'Entrepreneurs & startups', desc: 'Co-working, incubator space, mentorship, maker labs. Small towns need this and don\'t have it.' },
              { emoji: '🎖️', title: 'Veterans in transition', desc: 'Military-to-civilian career coaching, skills translation, employer connections. Federally funded through VA and DOL programs.' },
              { emoji: '🔄', title: 'Returning citizens', desc: 'Workforce training, peer support, housing — all background-check friendly. Federal workforce grants (DOL, WIOA) support reentry programming.' },
              { emoji: '🌍', title: 'Immigrants & new Americans', desc: 'ESL, citizenship preparation, cultural integration, workforce entry. Community colleges are overwhelmed — your campus picks up the slack.' },
              { emoji: '🏢', title: 'Local employers', desc: 'Custom training contracts, apprenticeship programs, hiring pipelines. They need skilled workers and will pay for the pipeline.' },
              { emoji: '🎵', title: 'The whole community', desc: 'Events, concerts, festivals, farmers markets, weddings, fitness center. The campus becomes the town square again.' },
            ].map((audience, i) => (
              <ScrollReveal key={audience.title} delay={Math.min(i, 4)} type="scale">
                <div className="p-5 rounded-xl" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                  <span className="text-2xl block mb-2">{audience.emoji}</span>
                  <h3 className="font-bold text-sm mb-1" style={{ color: '#0C1F3F' }}>{audience.title}</h3>
                  <p className="text-xs text-brand-gray leading-relaxed">{audience.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Your People Keep Working */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Your People</p>
            <h2 className="section-headline mb-8">Some roles can carry forward. We help figure out which ones.</h2>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              { role: 'Professors', becomes: 'Some faculty may transition to workforce instruction, skills coaching, or content development. A biology professor might develop lab safety certifications. A business professor might mentor incubator startups. Not every faculty role will carry forward, but those with applied skills and flexibility may find a fit.' },
              { role: 'Admissions & Student Services', becomes: 'Potential roles in community outreach, marketing, intake, event planning, or employer partnerships. These are transferable skill sets, though the new entity may need fewer positions.' },
              { role: 'Maintenance & Facilities', becomes: 'These roles are most likely to carry forward -- the buildings still need to run. Some facilities staff might also contribute to trades instruction.' },
              { role: 'IT Staff', becomes: 'Possible roles in technology center management, digital literacy instruction, or AI learning hub coordination.' },
              { role: 'Financial Aid & Registrar', becomes: 'Some may transition to enrollment coordination, billing, or grant compliance support. The compliance mindset transfers, though the specific regulations differ.' },
              { role: 'Athletics & Recreation', becomes: 'If the campus runs a community fitness center or youth programs, these roles may continue in adapted forms.' },
            ].map((item, i) => (
              <ScrollReveal key={item.role} delay={Math.min(i, 3)}>
                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #DDE5EF' }}>
                  <p className="font-bold text-sm mb-1" style={{ color: '#0C1F3F' }}>{item.role}</p>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.becomes}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Year Projection */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Financials</p>
            <h2 className="section-headline mb-8">Lower costs. Higher revenue. Faster than you think.</h2>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid #DDE5EF' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#DDE5EF' }}>
                      <th className="text-left py-3 text-brand-gray font-medium">Year</th>
                      <th className="text-right py-3 text-brand-gray font-medium">Revenue</th>
                      <th className="text-right py-3 text-brand-gray font-medium">Operating Cost</th>
                      <th className="text-right py-3 text-brand-gray font-medium">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['1', '$1.5M', '$1.8M', '($300K)', false],
                      ['2', '$3.5M', '$2.5M', '$1.0M', true],
                      ['3', '$5.0M', '$3.2M', '$1.8M', true],
                      ['4', '$6.0M', '$3.8M', '$2.2M', true],
                      ['5', '$7.5M', '$4.2M', '$3.3M', true],
                    ].map(([yr, rev, cost, net, positive]) => (
                      <tr key={yr} className="border-b" style={{ borderColor: '#DDE5EF' }}>
                        <td className="py-3 font-medium" style={{ color: '#0C1F3F' }}>Year {yr}</td>
                        <td className="py-3 text-right">{rev}</td>
                        <td className="py-3 text-right text-brand-gray">{cost}</td>
                        <td className={`py-3 text-right font-bold ${positive ? 'text-green-600' : 'text-red-500'}`}>{net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-brand-gray mt-4">
                <strong>Note:</strong> These are illustrative projections for a mid-size campus (~150K sq ft, 40-180 acres).
                Actual figures depend on campus size, local market demand, existing debt, staffing levels, and program mix.
                We build site-specific financial models during assessment. Compare this trajectory to the alternative:
                declining revenue, rising costs, and closure in 2-3 years.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Operating costs can drop because', items: ['Reduced or eliminated accreditation compliance overhead', 'Simplified or no federal financial aid administration', 'Reduced athletics costs', 'Leaner operations', 'AI multiplies what each team member can deliver'] },
                { title: 'Revenue grows because', items: ['8 revenue streams instead of 1', 'Federal workforce grants (WIOA, RESTART, EDA)', 'Employer training contracts', 'Community memberships and events', 'Everyone is your market — not just 18-year-olds'] },
                { title: 'Funding sources include', items: ['WIOA Individual Training Accounts ($3-10K per student, varies by state)', 'DOL RESTART and workforce grants', 'USDA Rural Development', 'EDA Public Works & Economic Adjustment grants', 'New Markets Tax Credits', 'Impact investors and foundations'] },
              ].map((col, i) => (
                <ScrollReveal key={col.title} delay={i}>
                  <div className="p-5 rounded-xl h-full" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                    <p className="font-bold text-xs mb-3" style={{ color: '#0C1F3F' }}>{col.title}</p>
                    <ul className="space-y-1.5">
                      {col.items.map(item => (
                        <li key={item} className="text-xs text-brand-gray flex items-start gap-1.5">
                          <span style={{ color: '#00A8A8' }}>&#10003;</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What About Our Debt */}
      <section className="py-20" style={{ background: '#0C1F3F' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">The Hard Question</p>
            <h2 className="font-serif font-light text-white mb-8"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              &ldquo;But what about our debt?&rdquo;
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <p className="text-white/50 leading-relaxed mb-6">
              Every board asks this. It&rsquo;s the right question. Here&rsquo;s the honest answer:
              transformation doesn&rsquo;t eliminate debt overnight. But it creates the cash flow
              to service it — which closure and liquidation do not.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold text-sm mb-4">Your board is choosing between two paths:</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Option A: Close &amp; Sell</p>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li>&#x2717; Developer pays 20-40 cents on the dollar</li>
                    <li>&#x2717; Debt still has to be settled from proceeds</li>
                    <li>&#x2717; Every employee loses their job</li>
                    <li>&#x2717; Community loses the campus permanently</li>
                    <li>&#x2717; Alumni lose their alma mater</li>
                    <li>&#x2717; Remaining debt may still fall on the institution</li>
                  </ul>
                </div>
                <div className="border border-white/20 rounded-xl p-5" style={{ background: 'rgba(0,168,168,0.1)', borderColor: 'rgba(0,168,168,0.3)' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00A8A8' }}>Option B: Transform</p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>&#10003; New revenue streams can begin within 6-12 months</li>
                    <li>&#10003; Potential for net revenue and debt service by year 2</li>
                    <li>&#10003; Some staff may continue in new roles</li>
                    <li>&#10003; Campus stays open and serving community</li>
                    <li>&#10003; Bondholders generally prefer going concern over liquidation</li>
                    <li>&#10003; Federal grants may offset transformation costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-2">Bond debt ($10-30M+)</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Many campuses carry tax-exempt bond debt from building projects. Those payments continue
                  regardless. But a transformed campus generating $5-7M in revenue can service $1-2M
                  in annual bond payments while still operating sustainably. Bondholders can also be
                  approached to restructure — they&rsquo;d rather receive 70 cents over 10 years from
                  a going concern than 30 cents from a fire-sale liquidation.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-2">Operating deficits ($1-5M/year)</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Your deficit likely exists because of high compliance costs and declining tuition
                  revenue. By rethinking accreditation -- whether working with your accreditor to
                  innovate, exploring alternative accreditation, or transitioning some programs to
                  non-degree formats -- your cost structure can drop while revenue diversifies.
                  The timeline varies, but many campuses could see improvement within 12-24 months.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-2">Pension obligations</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  If faculty are in a state pension system, obligations may transfer with the
                  institutional change. Private pension obligations need restructuring, but
                  a solvent, operating institution has far more leverage to negotiate than
                  one in liquidation. Keeping people employed also reduces pension withdrawal costs.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-2">Deferred maintenance</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  You don&rsquo;t have to fix everything on day one. Activate your best buildings
                  first. Generate revenue. Renovate as cash flow allows. Federal grants (USDA Rural
                  Development, EDA Public Works, state capital improvement programs) can fund facility
                  upgrades for workforce and community-serving facilities that wouldn&rsquo;t qualify
                  under the old model.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div className="mt-8 p-6 rounded-2xl border" style={{ background: 'rgba(0,168,168,0.08)', borderColor: 'rgba(0,168,168,0.3)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#00A8A8' }}>
                <strong>The bottom line:</strong> Closure guarantees a loss for everyone — the institution, the employees,
                the bondholders, and the community. Transformation creates a path to solvency. It&rsquo;s
                not risk-free, but it&rsquo;s the only option where everyone has a chance to come out ahead.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Campuses Closing Now */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Happening Now</p>
            <h2 className="section-headline mb-4">Campuses closing across America.</h2>
            <p className="text-brand-gray max-w-2xl mb-12">
              Each of these campuses could transform instead of close.
              Is yours next? It doesn&rsquo;t have to be.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {CAMPUSES.map((campus, i) => (
              <ScrollReveal key={campus.name} delay={Math.min(i, 3)} type="scale">
                <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #DDE5EF' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: '#0C1F3F' }}>{campus.name}</h3>
                      <p className="text-xs text-brand-gray">{campus.location}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: campus.statusColor + '15', color: campus.statusColor }}>
                      {campus.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray">{campus.details}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What We Bring */}
      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">What We Do</p>
            <h2 className="section-headline mb-4">Three services. One question: what is your campus worth to your community?</h2>
            <p className="text-brand-gray max-w-2xl mb-12">
              Most colleges know they&rsquo;re in trouble. What they don&rsquo;t know is what&rsquo;s hiding
              in plain sight &mdash; the workforce demand, the employer partnerships, the community needs,
              and the revenue their campus could generate if anyone had time to look. We look.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <ScrollReveal delay={0}>
              <div className="rounded-xl p-8 h-full" style={{ background: '#0C1F3F', color: '#fff' }}>
                <div className="text-3xl mb-4">&#128269;</div>
                <h3 className="font-bold text-lg mb-2">Community X-Ray</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,.7)' }}>
                  A deep scan of your region&rsquo;s workforce demand, employer needs, training gaps,
                  and community assets &mdash; mapped against your campus. Who needs what within 30 miles
                  of your front gate? What programs could launch in 6 months? What revenue is hiding
                  in plain sight while everyone stares at the enrollment chart?
                </p>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00A8A8' }}>What you get:</div>
                <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,.7)' }}>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Employer demand scan (10-30 mile radius)</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Workforce gap analysis by sector</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Campus asset map &mdash; every building matched to alternative uses</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Revenue projections by stream</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Grant and funding pathway identification</li>
                </ul>
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,.15)' }}>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>Free for qualifying institutions. Typically a $15-20K engagement &mdash; we offer it at no cost to start the conversation.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div className="rounded-xl p-8 h-full" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                <div className="text-3xl mb-4">&#9881;&#65039;</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#0C1F3F' }}>Infrastructure Alignment</h3>
                <p className="text-sm text-brand-gray leading-relaxed mb-4">
                  Your campus has classrooms, labs, dormitories, kitchens, athletic facilities,
                  performance spaces, and green space. Your region has employers who can&rsquo;t find
                  trained workers, families who need services, and a community that lost its gathering
                  place. We connect the two &mdash; building by building, program by program, dollar by dollar.
                </p>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00A8A8' }}>What you get:</div>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Building-by-building reuse plan with revenue estimates</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Employer partnership development (who signs first)</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Workforce program design matched to regional demand</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Staff transition plan &mdash; who stays, in what role</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>5-year financial model with 3 scenarios</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Grant applications drafted and ready to submit</li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="rounded-xl p-8 h-full" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                <div className="text-3xl mb-4">&#129309;</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#0C1F3F' }}>Community Outreach & Collaboration</h3>
                <p className="text-sm text-brand-gray leading-relaxed mb-4">
                  Transformation doesn&rsquo;t happen in the boardroom. It happens when the mayor,
                  the employers, the school district, the nonprofits, and the families who live
                  around your campus are in the room building what comes next &mdash; together.
                  We run that process.
                </p>
                <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00A8A8' }}>What you get:</div>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Community visioning sessions (we facilitate)</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Municipal and economic development alignment</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>K-12 partnership development</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Nonprofit and faith community engagement</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Public communication strategy &mdash; how to tell the story</li>
                  <li className="flex items-start gap-2"><span style={{ color: '#00A8A8' }}>&#10003;</span>Alumni and donor transition messaging</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="rounded-xl p-8 text-center" style={{ background: '#00A8A8', color: '#fff' }}>
              <h3 className="font-bold text-xl mb-3">Start with a free Community X-Ray.</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,.8)', maxWidth: '500px', margin: '0 auto 24px' }}>
                We&rsquo;ll scan your region, map your assets, and show you what&rsquo;s hiding in plain sight.
                No cost. No obligation. Confidential.
              </p>
              <Link href="/inquiry"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold"
                    style={{ background: '#fff', color: '#0C1F3F' }}>
                Request a Community X-Ray &#8594;
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How We Help - detailed */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Full Service</p>
            <h2 className="section-headline mb-4">Everything you need to transform. Nothing you don&rsquo;t.</h2>
            <p className="text-brand-gray max-w-2xl mb-12">
              We don&rsquo;t buy your campus. We help you reimagine it. Strategy, technology,
              and operational support from people who understand education from the inside.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Strategy & Consulting', items: ['Campus assessment & transformation plan', 'Financial modeling & 5-year projections', 'Grant writing & funding strategy', 'Workforce market analysis', 'Employer & community partnership development', 'Staff transition & retention planning'] },
              { title: 'AI Technology Platform', items: ['Career exploration tools', 'Skills assessment engine', 'AI coaching & support', 'Impact dashboards', 'Micro-credential delivery system', 'Community engagement platform'] },
              { title: 'Ongoing Support', items: ['Operations consulting', 'Marketing & growth strategy', 'Data analytics & impact reporting', 'Technology maintenance & updates', 'Quality assurance framework', 'Grant compliance & reporting'] },
            ].map((col, i) => (
              <ScrollReveal key={col.title} delay={i}>
                <div>
                  <h3 className="font-bold text-base mb-4" style={{ color: '#0C1F3F' }}>{col.title}</h3>
                  <ul className="space-y-2.5">
                    {col.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-brand-gray">
                        <span style={{ color: '#00A8A8' }} className="mt-0.5 font-bold">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Demos */}
      <section className="py-20" style={{ background: '#F4F7FB' }}>
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">See It In Action</p>
            <h2 className="section-headline mb-12">What the transformed campus looks like — day to day.</h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#0C1F3F' }}>Impact Dashboard</h3>
                <p className="text-xs text-brand-gray mb-4">Real-time visibility into every program, every dollar, every outcome. Board members and funders see exactly what&rsquo;s working.</p>
                <ImpactDashboardDemo />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#0C1F3F' }}>Community Engagement Platform</h3>
                <p className="text-xs text-brand-gray mb-4">Your campus becomes the community&rsquo;s home page. Events, spaces, news, and impact — all in one place.</p>
                <CommunityPlatformDemo />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Questions</p>
            <h2 className="section-headline mb-10">What boards ask us.</h2>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              ['Do we have to close and reopen?', 'No. You can transition while still operating. The best transformations happen while the campus is still alive — you shift programs and revenue streams gradually, not all at once.'],
              ['What happens to accreditation?', 'You voluntarily relinquish it as part of the transition. This eliminates the compliance burden, federal financial aid administration, and the regulatory overhead that\'s contributing to your deficit. Industry certifications replace degrees.'],
              ['Can our faculty still teach?', 'Absolutely. Most faculty have skills that transfer directly to workforce training, community programming, and adult education. A biology professor can develop lab safety and environmental certification courses. A business professor can mentor startups. An English professor can run ESL and professional communication programs. We plan individual transition paths for every team member.'],
              ['How do students get financial aid without accreditation?', 'Workforce students access WIOA funding (up to $15,000 per student), employer-sponsored training, DOL grants, and state workforce development funds. These often cover more of the cost than traditional financial aid.'],
              ['What about our bond debt?', 'Transformation creates cash flow to service debt. A campus generating $5M in revenue can service $1-2M in annual bond payments. Bondholders prefer a going concern over liquidation — they\'ll negotiate.'],
              ['How much does Transform Learning charge?', 'Our first campus assessment is free. After that, our fees are on a sliding scale and always negotiable. We structure engagements collaboratively — that may include revenue sharing, cooperative arrangements, or grant-funded work rather than large upfront payments. We keep our operations lean and our travel minimal. The institutions we serve are already under financial pressure, and adding burdensome consulting fees defeats the purpose.'],
              ['Is this just a theory?', 'No — campus transformation is already happening. The Marygrove Conservancy in Detroit, backed by the Kresge Foundation and the University of Michigan, turned a closed college into a cradle-to-career education campus. Goddard College\'s Vermont campus is being reimagined as housing and arts space. The College of Saint Rose campus in Albany is being managed by the county for community reuse. Each model is different. We study what works, then build site-specific plans with realistic financial projections for your campus.'],
              ['How long does the whole process take?', 'Assessment and planning: 3-4 months. First programs active: 4-6 months. Break-even: 14-18 months. Self-sustaining: 2-3 years. We stay until you don\'t need us anymore.'],
              ['What if our board can\'t agree?', 'We work with boards at every stage of readiness. Sometimes a confidential assessment is enough to shift the conversation from "should we close?" to "what could we become?" That shift changes everything.'],
              ['What about students currently enrolled?', 'This is the question that matters most, and it\'s the one we start with — not finish with. Every transformation plan begins with a teach-out strategy that protects current students. We identify partner institutions, negotiate transfer agreements that preserve credits and financial aid, and work individually with students and families to find the right landing place. We help navigate the accreditor requirements, the state notifications, and the emotional reality of telling students their college is changing. The goal is simple: every student finishes what they started, somewhere that fits. No one gets stranded. No one loses credits. We stay in the process until the last student has a path.'],
              ['What about legal and governance issues?', 'Campus transformation involves real legal complexity — 501(c)(3) restructuring, bond covenant renegotiation, state attorney general notifications, employment transitions, and zoning changes. We work with your legal counsel and bring in specialized higher-ed attorneys when needed. Our role is strategy and planning; your attorneys handle the filings.'],
              ['What\'s the first step?', 'A free, confidential conversation. No pitch, no obligation. Just two people who care about education talking about what\'s possible.'],
            ].map(([q, a], i) => (
              <ScrollReveal key={i} delay={Math.min(i, 3)}>
                <div className="border-b pb-5" style={{ borderColor: '#DDE5EF' }}>
                  <h3 className="font-bold text-sm mb-2" style={{ color: '#0C1F3F' }}>{q}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Teach-Out */}
      <section className="py-20" style={{ background: '#F9FBFD' }}>
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <p className="eyebrow mb-4">Students First</p>
            <h2 className="section-headline mb-4">Before we transform anything, we take care of your students.</h2>
            <p className="text-brand-gray max-w-2xl mb-10 leading-relaxed">
              The hardest part of any transition is the human part. Students chose your institution because they believed in it.
              They deserve honesty, a plan, and a place to land. That&rsquo;s where we start.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                icon: '🎯',
                title: 'Finding the Right Fit',
                desc: 'We don\'t just find transfer seats — we find the right institution for each student. Academic programs that match, financial aid that transfers, campuses where they\'ll succeed. We work with families individually because every student\'s situation is different.',
              },
              {
                icon: '🤝',
                title: 'Partner Institutions',
                desc: 'We build transfer agreements with nearby colleges and universities before the transition is announced — so when students hear the news, the next step is already in place. Credits preserved. Financial aid bridged. No gaps.',
              },
              {
                icon: '📋',
                title: 'Navigating the Process',
                desc: 'Teach-outs involve accreditor requirements, state education department notifications, Title IV compliance, transcript preservation, and federal reporting. It\'s complex territory. We\'ve studied how it works and how it fails. We help you get it right.',
              },
              {
                icon: '💛',
                title: 'The Conversation Nobody Wants to Have',
                desc: 'Telling students, parents, and alumni that the institution is changing is one of the hardest things a president will ever do. We help you plan that communication — the timing, the tone, the follow-up — so that honesty builds trust instead of panic.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={Math.min(i, 2)}>
                <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #DDE5EF' }}>
                  <span className="text-2xl block mb-3">{item.icon}</span>
                  <h3 className="font-bold text-sm mb-2" style={{ color: '#0C1F3F' }}>{item.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={2}>
            <div className="border-l-4 pl-6 max-w-2xl" style={{ borderColor: '#00A8A8' }}>
              <p className="text-sm text-brand-gray leading-relaxed italic">
                &ldquo;A campus transformation that leaves students stranded isn&rsquo;t a transformation &mdash; it&rsquo;s an abandonment.
                We won&rsquo;t let that happen. The teach-out plan comes first. Everything else follows.&rdquo;
              </p>
              <p className="text-xs mt-2" style={{ color: '#00A8A8' }}>— Jeff Ritter, Founder</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About */}
      <section className="py-20" style={{ background: '#0C1F3F' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Who We Are</p>
            <h2 className="font-serif font-light text-white mb-6"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Built by educators, administrators, and strategists who watched it happen from the inside.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed mb-6">
              Our team includes professors, school district superintendents, business strategists,
              data analysts, and community developers — people who spent decades inside the
              institutions now facing closure. We built Transform Learning because we believe
              campuses should outlive their accreditation — and the communities that depend on
              them deserve better than a &ldquo;For Sale&rdquo; sign.
            </p>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
              We&rsquo;re not a real estate company. We&rsquo;re not McKinsey. We&rsquo;re educators,
              administrators, business strategists, community developers, and innovation
              specialists who build AI tools and design programs
              that make workforce development cheaper, faster, and more effective than
              traditional higher education. Your campus is the venue. Our technology is
              the engine. Your community is the mission.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-headline mb-4">Your campus doesn&rsquo;t have to close.</h2>
            <p className="text-brand-gray mb-8">
              If you&rsquo;re a board member, president, or trustee facing this decision —
              let&rsquo;s talk before you call the developer. The first conversation is free.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                ['Board of Trustees', 'See what transformation looks like for your specific campus before you vote to close.'],
                ['College President', 'A confidential conversation about alternatives to closure.'],
                ['Municipality or EDC', 'Don\'t let the campus leave your community. We can help you keep it.'],
                ['Investor or Foundation', 'Campus transformation is an impact investment with real returns.'],
              ].map(([who, what]) => (
                <div key={who} className="text-left p-4 rounded-xl" style={{ background: '#F4F7FB', border: '1px solid #DDE5EF' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#0C1F3F' }}>{who}</p>
                  <p className="text-xs text-brand-gray">{what}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <a href="mailto:jeff@transformlearning.ai?subject=Campus%20Transformation%20—%20Confidential%20Inquiry"
                 className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-bold hover:opacity-90"
                 style={{ background: '#00A8A8' }}>
                Email: jeff@transformlearning.ai
              </a>
              <Link href="/inquiry"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold border-2 hover:bg-gray-50"
                    style={{ borderColor: '#00A8A8', color: '#00A8A8' }}>
                Fill Out an Inquiry Form
              </Link>
            </div>
            <p className="text-xs text-brand-gray mt-4">
              All initial conversations are free and confidential. · Jeff Ritter, PhD · Founder, Transform Learning
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
