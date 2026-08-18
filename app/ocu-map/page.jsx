'use client'

// HIDDEN PAGE — not linked from nav or sitemap
// Access only via direct URL: /ocu-map

export default function OCUCampusMap() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        src="/ocu-campus-map.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
        }}
        title="OCU Campus Reimagined Map"
      />
    </div>
  )
}
