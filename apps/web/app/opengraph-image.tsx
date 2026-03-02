import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Lifestyle Super App';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '30px',
            }}
          >
            <span
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              L
            </span>
          </div>
          <span style={{ fontWeight: 'bold' }}>Lifestyle</span>
        </div>
        <div
          style={{
            fontSize: '40px',
            textAlign: 'center',
            maxWidth: '900px',
            opacity: 0.9,
          }}
        >
          Giải pháp tổng hợp cho cuộc sống hiện đại
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
