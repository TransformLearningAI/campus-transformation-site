'use client'
import { useState } from 'react'

const EVENTS = [
  { date: 'May 12', time: '6:00 PM', title: 'Small Business Workshop: Starting Your LLC', location: 'Innovation Lab, Room 204', type: 'workshop', spots: 8, emoji: '🚀' },
  { date: 'May 14', time: '9:00 AM', title: 'CDL Practice Test Day', location: 'Trades Building', type: 'training', spots: 12, emoji: '🚛' },
  { date: 'May 15', time: '7:00 PM', title: 'Community Jazz Night', location: 'Auditorium', type: 'event', spots: 150, emoji: '🎵' },
  { date: 'May 17', time: '10:00 AM', title: 'Farmers Market', location: 'Campus Green', type: 'community', spots: null, emoji: '🥬' },
  { date: 'May 19', time: '5:30 PM', title: 'Veterans Career Transition Meetup', location: 'Student Center', type: 'support', spots: 25, emoji: '🎖️' },
  { date: 'May 20', time: '1:00 PM', title: 'Youth STEM Camp Info Session', location: 'Science Wing', type: 'k12', spots: 40, emoji: '🔬' },
]

const RESOURCES = [
  { title: 'Co-Working Space', desc: 'Hot desks $99/mo · Private offices from $299/mo', available: true, emoji: '💻' },
  { title: 'Community Gym', desc: 'Memberships $35/mo · Pool, weights, classes', available: true, emoji: '🏋️' },
  { title: 'Maker Lab', desc: '3D printing, laser cutting, woodshop · $50/mo', available: true, emoji: '🔧' },
  { title: 'Meeting Rooms', desc: 'Book by the hour · Projector, whiteboard, WiFi', available: true, emoji: '🤝' },
  { title: 'Commercial Kitchen', desc: 'Licensed kitchen rental for food businesses', available: true, emoji: '👨‍🍳' },
  { title: 'Auditorium', desc: '400 seats · Perfect for events, performances, lectures', available: true, emoji: '🎭' },
]

const ANNOUNCEMENTS = [
  { title: 'Welding Program Now Enrolling — Fall Cohort', date: '2 days ago', tag: 'Workforce' },
  { title: 'Free Health Screening Day — May 22', date: '3 days ago', tag: 'Health' },
  { title: 'Local Employer Hiring Fair — June 5', date: '1 week ago', tag: 'Jobs' },
  { title: 'Summer Youth Camps Registration Open', date: '1 week ago', tag: 'K-12' },
]

const IMPACT = [
  { label: 'Community Members Served', value: '2,847', period: 'This Year' },
  { label: 'Events Hosted', value: '64', period: 'This Year' },
  { label: 'Jobs Placed', value: '155', period: 'Since Launch' },
  { label: 'Local Businesses Incubated', value: '12', period: 'Since Launch' },
]

const TYPE_COLORS = {
  workshop: '#7C3AED',
  training: '#D97706',
  event: '#EC4899',
  community: '#10B981',
  support: '#3B82F6',
  k12: '#F59E0B',
}

export default function CommunityPlatformDemo() {
  const [tab, setTab] = useState('events')

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#00A8A8' }}>OC</div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#0C1F3F' }}>Oakdale Community Campus</p>
              <p className="text-[10px] text-gray-400">Community Engagement Portal</p>
            </div>
          </div>
          <span className="text-[10px] text-gray-300 bg-gray-100 px-2 py-1 rounded">Live Demo</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {['events', 'resources', 'news', 'impact'].map(t => (
          <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-[11px] font-medium transition-all ${
                    tab === t ? 'text-teal-700 border-b-2 border-teal-500' : 'text-gray-400 hover:text-gray-600'
                  }`}>
            {t === 'events' ? '📅 Events' : t === 'resources' ? '🏠 Spaces' : t === 'news' ? '📢 News' : '📊 Impact'}
          </button>
        ))}
      </div>

      <div className="p-4" style={{ minHeight: '320px' }}>
        {/* Events */}
        {tab === 'events' && (
          <div className="space-y-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Upcoming at Your Campus</p>
            {EVENTS.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="text-center shrink-0 w-12">
                  <p className="text-[10px] text-gray-400">{ev.date.split(' ')[0]}</p>
                  <p className="text-lg font-bold" style={{ color: '#0C1F3F' }}>{ev.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#0C1F3F' }}>{ev.emoji} {ev.title}</p>
                  <p className="text-[11px] text-gray-400">{ev.time} · {ev.location}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: (TYPE_COLORS[ev.type] || '#666') + '15', color: TYPE_COLORS[ev.type] }}>
                    {ev.type}
                  </span>
                  {ev.spots && <span className="text-[10px] text-gray-300">{ev.spots} spots</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources / Spaces */}
        {tab === 'resources' && (
          <div className="space-y-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Available Spaces &amp; Amenities</p>
            <div className="grid grid-cols-2 gap-2.5">
              {RESOURCES.map((r, i) => (
                <div key={i} className="p-3 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                  <span className="text-xl block mb-1.5">{r.emoji}</span>
                  <p className="text-sm font-medium" style={{ color: '#0C1F3F' }}>{r.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{r.desc}</p>
                  <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News / Announcements */}
        {tab === 'news' && (
          <div className="space-y-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Announcements</p>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium" style={{ color: '#0C1F3F' }}>{a.title}</p>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 shrink-0">
                    {a.tag}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1">{a.date}</p>
              </div>
            ))}
            <div className="mt-3 p-3 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-xs text-gray-400">Subscribe for email updates from your campus</p>
              <div className="flex gap-1.5 mt-2 max-w-xs mx-auto">
                <input type="text" placeholder="your@email.com" disabled
                       className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50" />
                <button disabled className="px-3 py-1.5 rounded-lg text-white text-xs font-bold opacity-60" style={{ background: '#00A8A8' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Impact */}
        {tab === 'impact' && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">Community Impact</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {IMPACT.map((m, i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p className="text-2xl font-bold" style={{ color: '#00A8A8' }}>{m.value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{m.label}</p>
                  <p className="text-[9px] text-gray-300">{m.period}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-100">
              <p className="text-xs text-teal-700 font-medium text-center">
                &ldquo;This campus used to serve 800 students. Now it serves 2,847 community members — and it&rsquo;s only year one.&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
