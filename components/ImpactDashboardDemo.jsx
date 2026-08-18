'use client'
import { useState, useEffect } from 'react'

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const PROGRAMS = [
  { name: 'CDL Training', enrolled: 48, completed: 41, placed: 38, revenue: 384000, color: '#D97706' },
  { name: 'Welding & Fab', enrolled: 32, completed: 28, placed: 26, revenue: 256000, color: '#DC2626' },
  { name: 'IT Certifications', enrolled: 55, completed: 44, placed: 40, revenue: 385000, color: '#7C3AED' },
  { name: 'CNA Healthcare', enrolled: 40, completed: 36, placed: 34, revenue: 200000, color: '#059669' },
  { name: 'Culinary Arts', enrolled: 24, completed: 20, placed: 17, revenue: 144000, color: '#EA580C' },
]

const ENROLLMENT_TREND = [28, 45, 72, 98, 124, 148, 165, 180, 192, 199]
const REVENUE_TREND = [42, 85, 156, 245, 380, 520, 680, 840, 1020, 1180]

export default function ImpactDashboardDemo() {
  const [animate, setAnimate] = useState(false)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const totalEnrolled = PROGRAMS.reduce((a, p) => a + p.enrolled, 0)
  const totalCompleted = PROGRAMS.reduce((a, p) => a + p.completed, 0)
  const totalPlaced = PROGRAMS.reduce((a, p) => a + p.placed, 0)
  const totalRevenue = PROGRAMS.reduce((a, p) => a + p.revenue, 0)
  const completionRate = Math.round(totalCompleted / totalEnrolled * 100)
  const placementRate = Math.round(totalPlaced / totalCompleted * 100)

  return (
    <div className="bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-[11px] text-white/30 font-mono">Impact Dashboard — Oakdale Campus</span>
        <span className="text-[10px] text-white/20">Live Demo</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-3">
        {['overview', 'programs', 'financials'].map(t => (
          <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    tab === t ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
                  }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Enrolled', value: totalEnrolled, color: '#3B82F6' },
                { label: 'Completion Rate', value: completionRate + '%', color: '#10B981' },
                { label: 'Job Placement', value: placementRate + '%', color: '#F59E0B' },
                { label: 'Revenue YTD', value: '$' + (totalRevenue / 1000).toFixed(0) + 'K', color: '#8B5CF6' },
              ].map((kpi, i) => (
                <div key={kpi.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-xl font-bold mt-1" style={{ color: kpi.color }}>
                    {animate ? kpi.value : '—'}
                  </p>
                </div>
              ))}
            </div>

            {/* Enrollment trend chart (CSS bars) */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Enrollment Growth (Year 1)</p>
              <div className="flex items-end gap-1 h-24">
                {ENROLLMENT_TREND.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t transition-all duration-1000"
                         style={{
                           height: animate ? `${(val / 200) * 100}%` : '0%',
                           background: `linear-gradient(180deg, #3B82F6, #1D4ED8)`,
                           transitionDelay: `${i * 80}ms`,
                         }} />
                    <span className="text-[8px] text-white/20">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick program list */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Programs at a Glance</p>
              {PROGRAMS.map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-xs text-white/70">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-white/40">{p.enrolled} enrolled</span>
                    <span className="text-green-400">{Math.round(p.completed / p.enrolled * 100)}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'programs' && (
          <div className="space-y-3">
            {PROGRAMS.map(p => {
              const compPct = Math.round(p.completed / p.enrolled * 100)
              const placePct = Math.round(p.placed / p.completed * 100)
              return (
                <div key={p.name} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ background: p.color }} />
                      <span className="text-sm text-white font-medium">{p.name}</span>
                    </div>
                    <span className="text-xs text-white/30">${(p.revenue / 1000).toFixed(0)}K revenue</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">{p.enrolled}</p>
                      <p className="text-[9px] text-white/30 uppercase">Enrolled</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-400">{compPct}%</p>
                      <p className="text-[9px] text-white/30 uppercase">Completed</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-400">{placePct}%</p>
                      <p className="text-[9px] text-white/30 uppercase">Placed</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full rounded-full transition-all duration-1000"
                         style={{ width: animate ? `${compPct}%` : '0%', background: p.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'financials' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Revenue YTD', value: '$1.18M', sub: 'vs $1.05M projected', color: '#10B981', good: true },
                { label: 'Operating Cost', value: '$892K', sub: 'vs $950K budgeted', color: '#10B981', good: true },
                { label: 'Net Income', value: '$288K', sub: 'Month 10 of Year 1', color: '#3B82F6' },
                { label: 'Grant Funding', value: '$420K', sub: 'WIOA + DOL RESTART', color: '#8B5CF6' },
              ].map(f => (
                <div key={f.label} className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{f.label}</p>
                  <p className="text-lg font-bold mt-1" style={{ color: f.color }}>{f.value}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue by stream */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Revenue by Stream</p>
              {[
                { name: 'Workforce Training', amount: 480, pct: 41, color: '#D97706' },
                { name: 'Event & Conference', amount: 220, pct: 19, color: '#EC4899' },
                { name: 'Housing', amount: 185, pct: 16, color: '#3B82F6' },
                { name: 'Co-Working / Incubator', amount: 125, pct: 11, color: '#10B981' },
                { name: 'Community Programs', amount: 95, pct: 8, color: '#8B5CF6' },
                { name: 'Fitness Center', amount: 75, pct: 6, color: '#F59E0B' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3 py-1.5">
                  <span className="text-[11px] text-white/50 w-32 shrink-0">{s.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                         style={{ width: animate ? `${s.pct}%` : '0%', background: s.color }} />
                  </div>
                  <span className="text-[11px] text-white/40 w-12 text-right">${s.amount}K</span>
                </div>
              ))}
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-green-400 font-medium">On track for break-even at Month 15</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
