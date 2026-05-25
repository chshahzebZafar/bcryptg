import { ImageResponse } from 'next/og'

export const alt = 'BcryptGenerator.org — Free Bcrypt Hash Generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(30,41,59,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* Left column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: '60px',
            position: 'relative',
          }}
        >
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '44px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                background: '#2563eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '26px',
                  color: 'white',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  display: 'flex',
                  lineHeight: 1,
                }}
              >
                #
              </div>
            </div>
            <div
              style={{
                fontSize: '21px',
                color: '#64748b',
                fontFamily: 'monospace',
                fontWeight: '600',
                display: 'flex',
              }}
            >
              BcryptGenerator.org
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: '900',
                color: '#f8fafc',
                lineHeight: 1.05,
                display: 'flex',
              }}
            >
              Free Bcrypt
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: '900',
                color: '#3b82f6',
                lineHeight: 1.05,
                display: 'flex',
              }}
            >
              Hash Generator
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              marginBottom: '40px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <span>Client-side only</span>
            <span style={{ color: '#334155', display: 'flex' }}>·</span>
            <span>No signup</span>
            <span style={{ color: '#334155', display: 'flex' }}>·</span>
            <span>OWASP 2026</span>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Private', bg: '#0f2942', border: '#1d4ed8', color: '#93c5fd' },
              { label: 'Instant', bg: '#052e16', border: '#14532d', color: '#6ee7b7' },
              { label: 'Free Forever', bg: '#1c1917', border: '#44403c', color: '#d6d3d1' },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: b.bg,
                  border: `1.5px solid ${b.border}`,
                  borderRadius: '10px',
                  padding: '10px 22px',
                  fontSize: '17px',
                  color: b.color,
                  fontWeight: '600',
                  display: 'flex',
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Hash card mock-up */}
        <div
          style={{
            width: '430px',
            background: '#1e293b',
            border: '1.5px solid #334155',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
          }}
        >
          {/* Card title */}
          <div
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              display: 'flex',
              textTransform: 'uppercase',
            }}
          >
            GENERATED HASH
          </div>

          {/* Hash output */}
          <div
            style={{
              background: '#0f172a',
              border: '1.5px solid #1e293b',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {['$2b$12$LQv3c1yqBWVHxkd0LH', 'AkCOYz6TtxMQJqhN8/Le', 'wdNkqL9MiWMf3Wm2xPQ'].map((line) => (
              <div
                key={line}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#34d399',
                  lineHeight: 1.6,
                  display: 'flex',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Rounds row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace', display: 'flex' }}>
                Salt Rounds
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#60a5fa',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  display: 'flex',
                }}
              >
                12
              </div>
            </div>
            {/* Progress bar */}
            <div
              style={{
                background: '#334155',
                borderRadius: '4px',
                height: '6px',
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: '#2563eb',
                  width: '62%',
                  height: '6px',
                  borderRadius: '4px',
                  display: 'flex',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#475569',
                fontFamily: 'monospace',
                display: 'flex',
              }}
            >
              Round 12 — Recommended (OWASP 2026)
            </div>
          </div>

          {/* Security badge */}
          <div
            style={{
              background: '#052e16',
              border: '1.5px solid #14532d',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                background: '#34d399',
                borderRadius: '50%',
                display: 'flex',
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: '13px', color: '#6ee7b7', fontFamily: 'monospace', display: 'flex' }}>
              No data sent to servers
            </div>
          </div>

          {/* Language pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
            {['Node.js', 'PHP', 'Python', 'Go', '+3'].map((lang) => (
              <div
                key={lang}
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  display: 'flex',
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
