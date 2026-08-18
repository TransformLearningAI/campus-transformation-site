'use client'
import { useState } from 'react'

function fmt(n) { return n != null ? n.toLocaleString() : '—' }
function pct(n) { return n != null ? Math.round(n * 100) + '%' : '—' }
function dollar(n) { return n != null ? '$' + n.toLocaleString() : '—' }

function Metric({ label, value, peerValue, format = 'number', worse }) {
  const formatted = format === 'pct' ? pct(value) : format === 'dollar' ? dollar(value) : fmt(value)
  const peerFormatted = format === 'pct' ? pct(peerValue) : format === 'dollar' ? dollar(peerValue) : fmt(peerValue)

  let comparison = null
  if (value != null && peerValue != null) {
    if (worse === 'lower' && value < peerValue) comparison = 'warning'
    else if (worse === 'higher' && value > peerValue) comparison = 'warning'
    else if (worse === 'lower' && value >= peerValue) comparison = 'ok'
    else if (worse === 'higher' && value <= peerValue) comparison = 'ok'
  }

  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#DDE5EF' }}>
      <span className="text-sm text-brand-gray">{label}</span>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-bold ${comparison === 'warning' ? 'text-red-600' : comparison === 'ok' ? 'text-green-600' : ''}`}
              style={!comparison ? { color: '#0C1F3F' } : {}}>
          {formatted}
        </span>
        {peerValue != null && (
          <span className="text-xs text-brand-gray bg-gray-50 px-2 py-0.5 rounded">
            peers: {peerFormatted}
          </span>
        )}
      </div>
    </div>
  )
}

export default function SchoolComparison() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [selected, setSelected] = useState(null)
  const [peers, setPeers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSelected(null)
    setPeers(null)
    try {
      const res = await fetch(`/api/school-lookup?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.schools || [])
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  async function selectSchool(id) {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/school-lookup?id=${id}`)
      const data = await res.json()
      if (data.schools?.length > 0) {
        setSelected(data.schools[0])
        setPeers(data.peers)
      }
    } catch {}
    setLoadingDetail(false)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type your institution's name..."
          className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-teal-500"
          style={{ borderColor: '#DDE5EF' }}
        />
        <button type="submit" disabled={loading}
                className="px-5 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 shrink-0"
                style={{ background: '#00A8A8' }}>
          {loading ? '...' : 'Look Up'}
        </button>
      </form>

      {/* Search results */}
      {results && !selected && (
        <div className="space-y-2 mb-6">
          {results.length === 0 && (
            <p className="text-sm text-brand-gray text-center py-4">No schools found. Try a different name.</p>
          )}
          {results.map(school => (
            <button key={school.id} onClick={() => selectSchool(school.id)}
                    className="w-full text-left p-4 rounded-xl border hover:border-teal-400 transition-colors bg-white"
                    style={{ borderColor: '#DDE5EF' }}>
              <p className="font-bold text-sm" style={{ color: '#0C1F3F' }}>{school.name}</p>
              <p className="text-xs text-brand-gray">
                {school.city}, {school.state} · {school.size ? school.size.toLocaleString() + ' students' : 'Size unknown'} · {school.ownership === 1 ? 'Public' : school.ownership === 2 ? 'Private Nonprofit' : 'Private For-Profit'}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Loading detail */}
      {loadingDetail && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-brand-gray">Loading your school&rsquo;s data and peer comparison...</p>
        </div>
      )}

      {/* School detail + peer comparison */}
      {selected && !loadingDetail && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg" style={{ color: '#0C1F3F' }}>{selected.name}</h3>
              <p className="text-sm text-brand-gray">{selected.city}, {selected.state}</p>
            </div>
            <button onClick={() => { setSelected(null); setPeers(null); setResults(null); setQuery(''); }}
                    className="text-xs text-brand-gray hover:text-black">
              Search another ↺
            </button>
          </div>

          {peers && (
            <div className="text-xs text-brand-gray mb-4 px-3 py-2 rounded-lg bg-gray-50">
              Compared against {peers.count} peer institutions (same type, similar size)
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#DDE5EF' }}>
            <Metric label="Enrollment" value={selected.size} peerValue={peers?.avg_size} />
            <Metric label="Completion Rate" value={selected.completion_rate} peerValue={peers?.avg_completion} format="pct" worse="lower" />
            <Metric label="Net Price (what students actually pay)" value={selected.net_price} peerValue={peers?.avg_net_price} format="dollar" worse="higher" />
            <Metric label="Pell Grant Recipients" value={selected.pell_rate} peerValue={peers?.avg_pell_rate} format="pct" />
            <Metric label="Median Debt at Graduation" value={selected.median_debt} peerValue={peers?.avg_median_debt} format="dollar" worse="higher" />
            <Metric label="Earnings 10 Years After" value={selected.earnings_10yr} peerValue={peers?.avg_earnings_10yr} format="dollar" worse="lower" />
            <Metric label="Admission Rate" value={selected.admission_rate} format="pct" />
            <Metric label="Federal Loan Rate" value={selected.loan_rate} format="pct" />
            <Metric label="First-Generation Students" value={selected.firstgen_share} format="pct" />
            <Metric label="Tuition (In-State)" value={selected.tuition_in} format="dollar" />
            <Metric label="Tuition (Out-of-State)" value={selected.tuition_out} format="dollar" />
          </div>

          {/* Warning signals */}
          {selected.completion_rate != null && selected.completion_rate < 0.4 && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm font-bold text-red-700 mb-1">⚠ Below-average completion rate</p>
              <p className="text-xs text-red-600">
                A {pct(selected.completion_rate)} completion rate means {Math.round((1 - selected.completion_rate) * 100)}% of students don&rsquo;t finish.
                This is a leading indicator of enrollment decline and financial stress.
                {peers?.avg_completion && selected.completion_rate < peers.avg_completion &&
                  ` Your rate is below the ${pct(peers.avg_completion)} peer average.`
                }
              </p>
            </div>
          )}

          {selected.size != null && selected.size < 1000 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm font-bold text-amber-700 mb-1">⚠ Small enrollment</p>
              <p className="text-xs text-amber-600">
                At {selected.size.toLocaleString()} students, fixed costs are spread across a small base.
                Institutions under 1,000 students are disproportionately represented in recent closures.
              </p>
            </div>
          )}

          {selected.pell_rate != null && selected.pell_rate > 0.5 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm font-bold text-amber-700 mb-1">⚠ High Pell dependence</p>
              <p className="text-xs text-amber-600">
                {pct(selected.pell_rate)} of students receive Pell grants, indicating high dependence on
                federal aid. Changes in federal funding policy create significant revenue risk.
              </p>
            </div>
          )}

          <div className="mt-6 p-5 rounded-xl" style={{ background: 'rgba(0,168,168,0.08)', border: '1px solid rgba(0,168,168,0.2)' }}>
            <p className="text-sm font-bold mb-2" style={{ color: '#00A8A8' }}>
              What this means for your campus
            </p>
            <p className="text-xs text-brand-gray leading-relaxed">
              These numbers tell the story the board already knows. The question isn&rsquo;t whether
              the trend continues — it&rsquo;s what you do about it. A transformation plan turns these
              liabilities into a different kind of asset: a workforce center, community hub, and
              revenue-generating campus that doesn&rsquo;t depend on 18-year-olds choosing your school.
            </p>
            <a href="#contact"
               className="inline-block mt-3 text-xs font-bold hover:opacity-80"
               style={{ color: '#00A8A8' }}>
              Talk to us about your options →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
