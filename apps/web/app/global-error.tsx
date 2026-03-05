'use client';

/**
 * Global error boundary - PHẢI dùng 100% inline styles, không import CSS.
 * Import globals.css có thể gây "missing required error components, refreshing...".
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): JSX.Element {
  return (
    <html lang="vi">
      <body style={{ margin: 0, minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.875rem', fontWeight: 700, color: '#1e293b' }}>
                Lỗi nghiêm trọng
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#64748b' }}>
                Ứng dụng gặp lỗi nghiêm trọng. Vui lòng tải lại trang.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '0.5rem',
                  textAlign: 'left',
                }}
              >
                <p style={{ marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600 }}>
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(to right, #9333ea, #ec4899)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Thử lại
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #94a3b8',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  color: '#334155',
                  textDecoration: 'none',
                }}
              >
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
