'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

/*
 * Report page — spec §6 order:
 * 1. What your region is short of (regional gaps)
 * 2. What you already have that could supply it (assets → pathways)
 * 3. Who would pay (funding eligibility)
 * 4. Who is already nearby (partners)
 * 5. Where you stand (revenue mix — flat, no scoring, no color)
 * 6. The honest close + conversion mechanic
 *
 * Spec §5 "must never display":
 *   - No distress score, closure-risk score, survival probability
 *   - No peer comparison framed as ranking against closed schools
 *   - No named employers from QCEW
 *   - No unverified confidence fields
 *   - No unqualified eligibility boolean for half-computed tests
 *   - No projected dollar revenue for proposed pathways
 *   - No recommendation phrased as a conclusion
 */

const RPT = `
  .rephead{background:var(--navy);color:#fff;padding:44px 0 40px}
  .rephead .county{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--amber);font-weight:700;margin:0 0 10px}
  .rephead h1{font-size:clamp(30px,5vw,44px);line-height:1.08;letter-spacing:-.03em;font-weight:800;margin:0 0 10px}
  .rephead p{color:#c9d4e4;max-width:60ch;margin:0 0 6px;font-size:16.5px}
  .vint{font-size:12.5px;color:#8fa2bd;margin-top:14px}
  .rpt-section{padding:52px 0;border-bottom:1px solid var(--rule)}
  .rpt-alt{background:var(--paper-2)}
  .rpt-h2{font-size:clamp(23px,3.4vw,30px);line-height:1.15;letter-spacing:-.025em;font-weight:800;margin:0 0 8px;color:var(--navy)}
  .rpt-lede{font-size:16px;color:var(--ink-2);max-width:64ch;margin:0 0 28px}
  .modnum{font-size:11px;letter-spacing:.2em;font-weight:800;color:var(--amber-deep);text-transform:uppercase;display:block;margin-bottom:8px}
  .gap{background:#fff;border:1px solid var(--rule);border-left:4px solid var(--navy);padding:22px 22px 18px;margin-bottom:16px}
  .gap h3{margin:0 0 6px;font-size:18px;letter-spacing:-.015em;font-weight:700}
  .gap .big{font-size:15.5px;color:var(--ink-2);margin:0 0 12px}
  .gap .big b{color:var(--navy)}
  .meta{font-size:12.5px;color:#667085;border-top:1px solid var(--rule);padding-top:9px;margin:0}
  .assets label{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1.5px solid var(--rule);
    border-radius:3px;padding:9px 14px;margin:0 8px 10px 0;font-size:14.5px;cursor:pointer;user-select:none}
  .assets label:has(input:checked){border-color:var(--navy);background:#eef2f8;font-weight:600}
  .assets input{accent-color:var(--navy)}
  .path{background:#fff;border:1px solid var(--rule);padding:18px 20px;margin-bottom:12px;display:none}
  .path.show{display:block}
  .path .ptag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;
    padding:3px 8px;border-radius:2px;margin-bottom:8px;background:var(--green-bg,#e8f0e4);color:var(--green,#3c6b2e)}
  .path .ptag.partner{background:#fdf0d8;color:var(--amber-deep)}
  .path .ptag.board{background:#e9edf4;color:var(--navy-soft)}
  .path h4{margin:0 0 5px;font-size:16.5px;font-weight:700}
  .path p{margin:0;font-size:14.5px;color:var(--ink-2)}
  .pathhint{font-size:14px;color:#667085;font-style:italic;margin:6px 0 0}
  .ftable{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--rule);font-size:14.5px}
  .ftable th{background:var(--navy);color:#fff;text-align:left;padding:10px 14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
  .ftable td{padding:12px 14px;border-top:1px solid var(--rule);vertical-align:top;color:var(--ink-2)}
  .ftable td b{color:var(--navy)}
  .yes{color:#3c6b2e;font-weight:700}
  .call{color:var(--amber-deep);font-weight:700}
  .partner-row{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--rule);font-size:15px}
  .partner-row:last-child{border:0}
  .partner-who{font-weight:700;color:var(--navy);min-width:220px;flex-shrink:0}
  .partner-what{color:var(--ink-2)}
  .stand{display:flex;flex-wrap:wrap;gap:14px}
  .stat{background:#fff;border:1px solid var(--rule);padding:18px 22px;flex:1;min-width:200px}
  .stat .n{font-size:30px;font-weight:800;color:var(--navy);letter-spacing:-.02em}
  .stat .l{font-size:13.5px;color:var(--ink-2);margin-top:2px}
  .standnote{font-size:14px;color:#667085;margin-top:14px;max-width:64ch}
  .rpt-close{background:var(--navy);color:#fff;padding:52px 0}
  .rpt-close h2{color:#fff}
  .rpt-close p{color:#c9d4e4;max-width:62ch}
  .qbox{margin-top:30px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);padding:22px;border-radius:3px}
  .qbox p{margin:0 0 12px;font-size:15px}
  .qbox .chips a{display:inline-block;border:1px solid rgba(255,255,255,.35);border-radius:20px;
    padding:6px 14px;font-size:13.5px;color:#fff;text-decoration:none;margin:0 8px 8px 0}
  .qbox .chips a:hover{border-color:var(--amber);color:var(--amber)}
  .qbox small{color:#8fa2bd;font-size:12.5px}
  @media(max-width:640px){.partner-row{flex-direction:column;gap:4px} .partner-who{min-width:auto}}
  @media(max-width:640px){.stand{flex-direction:column}}
`

const ASSET_CHECKS = [
  { key: 'class', label: 'Classroom or lab space' },
  { key: 'dorm', label: 'Dormitory beds' },
  { key: 'kitchen', label: 'Commercial kitchen' },
  { key: 'gym', label: 'Gym or athletics facilities' },
  { key: 'land', label: 'Acreage' },
  { key: 'theater', label: 'Auditorium or theater' },
]

function getPathways(record) {
  // Map gaps to pathways with asset requirements
  // Per spec §6.2: tagged by signature level matching homepage
  const paths = []
  for (const atg of (record.assets_to_gaps || [])) {
    const gap = (record.regional_gaps || []).find(g => g.domain === atg.gap_domain)
    if (!gap) continue

    let tag = 'Start here', tagClass = ''
    if (atg.suggested_pathway === 'health_system_partnership') { tag = 'Partner-funded'; tagClass = 'partner' }
    if (atg.suggested_pathway === 'housing_on_surplus_land') { tag = 'Partner-funded'; tagClass = 'partner' }
    if (atg.suggested_pathway === 'ground_lease') { tag = 'Board decision'; tagClass = 'board' }

    // Map asset_required to checkbox keys
    let needs = 'class'
    if (atg.asset_required.includes('lab') || atg.asset_required.includes('classroom')) needs = 'class'
    if (atg.asset_required.includes('dorm')) needs = 'dorm'
    if (atg.asset_required.includes('acreage') || atg.asset_required.includes('surplus')) needs = 'land'

    paths.push({
      needs,
      tag, tagClass,
      title: `${gap.headline} — via ${atg.suggested_pathway.replace(/_/g, ' ')}`,
      desc: gap.detail,
      asset: atg.asset_required,
    })
  }

  // Add standard pathways not tied to specific gaps
  paths.push({
    needs: 'gym',
    tag: 'Start here', tagClass: '',
    title: 'Athletics facilities rented to the county and region',
    desc: 'Tournaments, camps, school district use, a health-system wellness contract. Rental agreements sit under officer authority at nearly every college.',
    asset: 'gym or athletics facilities',
  })
  paths.push({
    needs: 'kitchen',
    tag: 'Start here', tagClass: '',
    title: 'Commercial kitchen as a shared community asset',
    desc: 'Licensed child-care food service, a food-business incubator, or senior meal contracts — all revenue uses of a kitchen you already ventilate and insure.',
    asset: 'commercial kitchen',
  })
  paths.push({
    needs: 'theater',
    tag: 'Start here', tagClass: '',
    title: "Auditorium as the county's venue",
    desc: "Performance rentals, graduations, civic meetings, film series. Modest revenue, outsized community goodwill — which is worth real money when a grant application needs local letters of support.",
    asset: 'auditorium or theater',
  })

  return paths
}

export default function ReportPage() {
  const { unitid } = useParams()
  const [record, setRecord] = useState(null)
  const [error, setError] = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    fetch('/data/institutions.json')
      .then(r => r.json())
      .then(data => {
        const match = data.find(rec => String(rec.institution?.unitid) === String(unitid))
        if (match) setRecord(match)
        else setError('Report not found for this institution.')
      })
      .catch(() => setError('Could not load report data.'))
  }, [unitid])

  if (error) return (
    <div style={{ padding: '100px 28px', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--navy)', marginBottom: 16 }}>Report not found</h1>
      <p style={{ color: 'var(--ink-2)' }}>{error}</p>
      <Link href="/lookup" style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>← Back to lookup</Link>
    </div>
  )

  if (!record) return (
    <div style={{ padding: '100px 28px', textAlign: 'center', color: 'var(--ink-2)' }}>Loading report...</div>
  )

  const inst = record.institution
  const gaps = (record.regional_gaps || []).filter(g => g.confidence !== 'unverified')
  const funding = (record.funding || [])
  const partners = record.partners || { named: [], counted: [] }
  const pos = record.position || {}
  const pathways = getPathways(record)

  function toggleAsset(key) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <style>{RPT}</style>

      {/* Beta banner — BETA_LAUNCH_SPEC.md §1 verbatim */}
      <div style={{ background: '#fdf0d8', padding: '10px 0', fontSize: 14, color: 'var(--navy)' }}>
        <div className="wrap">
          <strong style={{ color: 'var(--amber-text)' }}>Beta.</strong>{' '}
          This report is generated from public federal records and covers every private nonprofit four-year college in the U.S. If a number looks wrong for your campus, it might be — <a href={`mailto:jeff@transformlearning.ai?subject=${encodeURIComponent(`[Beta feedback] ${inst.name} (${inst.unitid})`)}&body=${encodeURIComponent(`School: ${inst.name}, ${inst.city} ${inst.state} (UNITID ${inst.unitid})\nData version: ${record.data_version}\nWhat looks wrong (please describe):\n\n`)}`} style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>tell us</a> and a person will check it within two business days.
        </div>
      </div>

      {/* Report header */}
      <div className="rephead">
        <div className="wrap">
          <p className="county">Regional Needs Report · {inst.county_name}</p>
          <h1>What {inst.county_name} is short of — and what {inst.name} could do about it</h1>
          <p>Generated from public records: federal labor, housing, and health data, grant program rules, and your institution's public filings. Nothing here required your permission, and nothing here has been shared with anyone.</p>
          <p className="vint">Data vintages shown on every figure · Report generated {record.built_at} · This is a public-record summary, not advice</p>
        </div>
      </div>

      {/* §6.1 — What your region is short of */}
      <section className="rpt-section">
        <div className="wrap">
          <span className="modnum">1 · The region</span>
          <h2 className="rpt-h2">What {inst.county_name} is short of</h2>
          <p className="rpt-lede">
            {gaps.length} gap{gaps.length !== 1 ? 's' : ''} clear our evidence bar. Each is a need your campus could plausibly help supply — and each has money attached to it somewhere.
          </p>

          {gaps.map((gap, i) => (
            <div className="gap" key={i}>
              <h3>{gap.headline}</h3>
              <p className="big" dangerouslySetInnerHTML={{ __html: formatDetail(gap) }} />
              <p className="meta">
                {gap.metric} · {gap.vintage} · {gap.geography}
              </p>
            </div>
          ))}

          <FeedbackLink inst={inst} record={record} section="The region" />

          {/* Oversupplied contrast per spec §7 */}
          {record.oversupplied && record.oversupplied.length > 0 && (
            <div style={{ marginTop: 24, padding: '16px 20px', background: '#fff', border: '1px solid var(--rule)', fontSize: 14, color: 'var(--ink-2)' }}>
              <strong style={{ color: 'var(--navy)' }}>Worth noting:</strong> The region is <em>over</em>-supplied in {record.oversupplied.map(o => `${o.occupation} (LQ ${o.lq})`).join(', ')}. A naive "add a nursing program" recommendation would be exactly wrong here.
            </div>
          )}
        </div>
      </section>

      {/* §6.2 — What you already have */}
      <section className="rpt-section rpt-alt">
        <div className="wrap">
          <span className="modnum">2 · Your campus</span>
          <h2 className="rpt-h2">Which of these does your campus have more of than it needs?</h2>
          <p className="rpt-lede">Check what applies. The pathways below appear as you do.</p>

          <div className="assets">
            {ASSET_CHECKS.map(a => (
              <label key={a.key}>
                <input type="checkbox" checked={!!checked[a.key]} onChange={() => toggleAsset(a.key)} />
                {a.label}
              </label>
            ))}
          </div>

          <div style={{ marginTop: 22 }}>
            {pathways.map((p, i) => (
              <div className={`path ${checked[p.needs] ? 'show' : ''}`} key={i}>
                <span className={`ptag ${p.tagClass}`}>{p.tag}</span>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
            {!Object.values(checked).some(Boolean) && (
              <p className="pathhint">Check an asset above to see matching pathways.</p>
            )}
          </div>
          <FeedbackLink inst={inst} record={record} section="Your campus" />
        </div>
      </section>

      {/* §6.3 — Who would pay */}
      <section className="rpt-section">
        <div className="wrap">
          <span className="modnum">3 · The money</span>
          <h2 className="rpt-h2">Who would pay</h2>
          <p className="rpt-lede">The college writes no check in any of these. Green means the public record already confirms it. Amber means one fact still needs a phone call — and we tell you which fact.</p>

          <table className="ftable">
            <thead>
              <tr><th>Program</th><th>Status</th><th>What we can already say</th></tr>
            </thead>
            <tbody>
              {funding.map((f, i) => {
                const prog = f.program || ''
                if (prog.includes('USDA')) {
                  const ae = f.area_eligible || {}
                  return (
                    <tr key={i}>
                      <td><b>USDA Community Facilities</b><br />{f.cadence || 'continuous'} applications</td>
                      <td>{ae.value ? <span className="yes">Area eligible</span> : ae.confidence === 'unverified' ? <span className="call">Unverified</span> : 'Not eligible'}</td>
                      <td>
                        {ae.reasoning || ''}
                        {ae.value && <> The grant share (up to 75% of project cost) depends on one income figure USDA publishes only by phone — <span className="call">call to confirm</span>. The applicant can be the town, not the college.</>}
                      </td>
                    </tr>
                  )
                }
                if (prog.includes('Section 202')) {
                  const se = f.sponsor_eligible || {}
                  if (se.confidence === 'unverified') return null
                  return (
                    <tr key={i}>
                      <td><b>HUD Section 202</b><br />supportive housing for elderly</td>
                      <td className="yes">Sponsor eligible</td>
                      <td>{se.reasoning}</td>
                    </tr>
                  )
                }
                if (prog.includes('CDBG')) {
                  return (
                    <tr key={i}>
                      <td><b>CDBG</b><br />{f.route || 'state program'}</td>
                      <td className={f.route === 'state small cities' ? 'call' : 'yes'}>{f.route === 'state small cities' ? 'State route' : f.route}</td>
                      <td>{f.reasoning}</td>
                    </tr>
                  )
                }
                if (prog.includes('ARC')) {
                  const status = f.county_status?.value || f.county_status || ''
                  if (!status) return null
                  return (
                    <tr key={i}>
                      <td><b>Appalachian Regional Commission</b></td>
                      <td>{status === 'Distressed' ? <span className="yes">Distressed</span> : status}</td>
                      <td>County status: <b>{status}</b>.{status === 'Transitional' && ' Transitional counties receive a moderate federal cost share.'}{status === 'Distressed' && ' Distressed counties receive the highest federal cost share.'}</td>
                    </tr>
                  )
                }
                return null
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 14, color: '#667085', marginTop: 14, maxWidth: '64ch' }}>
            One thing we will not do: put a projected revenue number on any of this. Anyone who gives you a dollar figure before the phone calls is guessing.
          </p>
          <FeedbackLink inst={inst} record={record} section="Who would pay" />
        </div>
      </section>

      {/* §6.4 — Who is already nearby */}
      <section className="rpt-section rpt-alt">
        <div className="wrap">
          <span className="modnum">4 · The neighbors</span>
          <h2 className="rpt-h2">Who is already nearby</h2>
          <p className="rpt-lede">Named where the public record allows naming; counted where it doesn't.</p>

          {partners.named.map((p, i) => (
            <div className="partner-row" key={i}>
              <div className="partner-who">{p.name}</div>
              <div className="partner-what">
                {p.city && <>{p.city}. </>}
                {p.operator && <>Operated by {p.operator}. </>}
                {p.note}
              </div>
            </div>
          ))}
          {partners.counted.map((c, i) => (
            <div className="partner-row" key={`c${i}`}>
              <div className="partner-who">{c.type.replace(/_/g, ' ')}</div>
              <div className="partner-what">
                {c.count ? `${c.count} establishments` : 'Count pending'} in {c.geography} ({c.source}).
                {' '}{c.note}
              </div>
            </div>
          ))}

          <FeedbackLink inst={inst} record={record} section="The neighbors" />

          {/* Regional shocks per spec §7 */}
          {record.regional_shocks && (
            <div style={{ marginTop: 24, padding: '16px 20px', background: '#fff', border: '1px solid var(--rule)', fontSize: 14 }}>
              <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Regional context</strong>
              {record.regional_shocks.map((s, i) => (
                <p key={i} style={{ margin: '0 0 8px', color: 'var(--ink-2)' }}>
                  {s.event}{s.follow_up && <> — {s.follow_up}</>}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* §6.5 — Where you stand */}
      <section className="rpt-section">
        <div className="wrap">
          <span className="modnum">5 · Your position</span>
          <h2 className="rpt-h2">Where {inst.name} stands</h2>
          <p className="rpt-lede">Stated flatly, from public filings. No score, no gauge, no color — you know your situation better than any dashboard does.</p>

          {pos.tuition_dependence?.value != null ? (
            <div className="stand">
              <div className="stat">
                <div className="n">{Math.round(pos.tuition_dependence.value * 100)}%</div>
                <div className="l">of revenue is net tuition and fees<br /><span style={{ color: '#98a1ab' }}>IPEDS F2, FY{pos.tuition_dependence.year}</span></div>
              </div>
              {pos.earned_and_public_revenue?.value != null && (
                <div className="stat">
                  <div className="n">{Math.round(pos.earned_and_public_revenue.value * 100)}%</div>
                  <div className="l">is earned or public non-tuition revenue<br /><span style={{ color: '#98a1ab' }}>contracts, auxiliaries, government</span></div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--rule)', padding: 20, color: 'var(--ink-2)', fontSize: 15 }}>
              <strong style={{ color: 'var(--navy)' }}>Revenue mix data not yet available.</strong>
              <p style={{ margin: '8px 0 0' }}>IPEDS F2 finance data for this institution has not yet been pulled into the pipeline. This section will populate when it is.</p>
            </div>
          )}

          {/* Show what we do have: Form 990 and endowment */}
          {pos.form_990_net && (
            <div style={{ marginTop: 16, background: '#fff', border: '1px solid var(--rule)', padding: 20, fontSize: 14, color: 'var(--ink-2)' }}>
              <strong style={{ color: 'var(--navy)' }}>From public filings (Form 990):</strong>
              <p style={{ margin: '8px 0 4px' }}>
                Net results: FY2023 <b style={{ color: pos.form_990_net.fy2023 < 0 ? '#c53030' : 'var(--navy)' }}>${(pos.form_990_net.fy2023 / 1e6).toFixed(2)}M</b>,{' '}
                FY2024 <b style={{ color: pos.form_990_net.fy2024 < 0 ? '#c53030' : 'var(--navy)' }}>${(pos.form_990_net.fy2024 / 1e6).toFixed(2)}M</b>,{' '}
                FY2025 <b style={{ color: pos.form_990_net.fy2025 < 0 ? '#c53030' : 'var(--navy)' }}>${(pos.form_990_net.fy2025 / 1e6).toFixed(2)}M</b>
              </p>
              {pos.endowment && (
                <p style={{ margin: '4px 0 0' }}>Endowment: <b style={{ color: 'var(--navy)' }}>${(pos.endowment.value / 1e6).toFixed(1)}M</b> ({pos.endowment.year})</p>
              )}
              <p style={{ margin: '8px 0 0', fontSize: 12, color: '#98a1ab' }}>Source: {pos.form_990_net.source}</p>
            </div>
          )}

          {inst.enrollment?.value && (
            <p className="standnote">
              Current enrollment: <b>{inst.enrollment.value.toLocaleString()}</b> ({inst.enrollment.source}).
            </p>
          )}
          <FeedbackLink inst={inst} record={record} section="Your position" />
        </div>
      </section>

      {/* §6.6 — The honest close */}
      <div className="rpt-close">
        <div className="wrap">
          <span className="modnum" style={{ color: 'var(--amber)' }}>6 · What this report can't tell you</span>
          <h2 className="rpt-h2" style={{ color: '#fff' }}>The part that isn't in the public record</h2>
          <p>
            This is what the public record says about your campus. The part that decides whether any of it works is not in the public record: what a lease like this actually earns, who carries the capital risk, whether the hospital will sign, and what your own bylaws let one person approve. That takes about a dozen phone calls, and it is what the One-Pathway Scan is — free, confidential, two weeks, one recommendation.
          </p>
          <p style={{ marginTop: 22 }}>
            <Link className="v2-btn v2-btn-a" href="/inquiry">Request a One-Pathway Scan</Link>
            <button className="v2-btn v2-btn-b" onClick={() => window.print()} style={{ cursor: 'pointer', background: 'transparent' }}>Download as PDF</button>
          </p>
          <div className="qbox">
            <p><b>Have a question about this report?</b> Answered by a person, within two business days.</p>
            <div className="chips">
              <a href={`mailto:jeff@transformlearning.ai?subject=Report question: ${inst.name} — who signs`}>Who at our college could sign this?</a>
              <a href={`mailto:jeff@transformlearning.ai?subject=Report question: ${inst.name} — accreditor`}>Would our accreditor care?</a>
              <a href={`mailto:jeff@transformlearning.ai?subject=Report question: ${inst.name} — funding`}>Which program fits our project?</a>
              <a href={`mailto:jeff@transformlearning.ai?subject=Report question: ${inst.name}`}>Something else</a>
            </div>
            <small>Questions go to Jeff Ritter, PhD — not a chatbot. We never publish or share who asks.</small>
          </div>
        </div>
      </div>

      {/* Flags — for transparency */}
      {record.flags && record.flags.length > 0 && (
        <section className="rpt-section" style={{ padding: '28px 0' }}>
          <div className="wrap">
            <p style={{ fontSize: 12, color: '#98a1ab' }}>
              <strong>Data notes:</strong> {record.flags.map(f => f.replace(/_/g, ' ')).join(' · ')}
            </p>
          </div>
        </section>
      )}
    </>
  )
}

function FeedbackLink({ inst, record, section }) {
  const subject = encodeURIComponent(`[Beta feedback] ${inst.name} (${inst.unitid}) — ${section}`)
  const body = encodeURIComponent(`School: ${inst.name}, ${inst.city} ${inst.state} (UNITID ${inst.unitid})\nReport section: ${section}\nData version: ${record.data_version}\nWhat looks wrong (please describe):\n\n`)
  return (
    <p style={{ fontSize: 12.5, color: '#98a1ab', marginTop: 20 }}>
      See something wrong in this section?{' '}
      <a href={`mailto:jeff@transformlearning.ai?subject=${subject}&body=${body}`}
         style={{ color: 'var(--amber-deep)', fontWeight: 600 }}>Tell us.</a>
      {' '}Answered by a person, within two business days.
    </p>
  )
}

function formatDetail(gap) {
  // Bold key numbers in detail text
  return gap.detail
    .replace(/(\$[\d,.]+\/hr)/g, '<b>$1</b>')
    .replace(/(\+\d+%)/g, '<b>$1</b>')
    .replace(/(LQ [\d.]+)/g, '<b>$1</b>')
    .replace(/([\d.]+%)/g, '<b>$1</b>')
}
