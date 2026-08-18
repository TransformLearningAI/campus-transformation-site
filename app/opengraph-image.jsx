import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Campus Transformation — Start with one building.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#12294a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#e0a02e',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          CAMPUS TRANSFORMATION
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          Start with one building.
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#c9d4e4',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}
        >
          One underused building. One pathway. One signature. No grand plan.
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#e0a02e',
            marginTop: '48px',
            fontWeight: 700,
          }}
        >
          campustransformation.org
        </div>
      </div>
    ),
    { ...size }
  )
}
