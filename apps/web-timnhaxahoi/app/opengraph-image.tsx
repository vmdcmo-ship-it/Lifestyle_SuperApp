import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'timnhaxahoi.com — NOXH và tìm nhà trọ';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 72,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #10b981 100%)',
          color: 'white',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: '-0.02em' }}>timnhaxahoi.com</div>
        <div style={{ marginTop: 20, fontSize: 30, fontWeight: 500, opacity: 0.95, maxWidth: 900 }}>
          Nhà ở xã hội và tìm nhà trọ — tham khảo pháp lý, dự án, công cụ ước tính
        </div>
      </div>
    ),
    { ...size },
  );
}
