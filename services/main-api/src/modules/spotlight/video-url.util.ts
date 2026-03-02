/**
 * Parse video URL từ YouTube/Facebook để lấy source và thumbnail
 */
export type VideoSource = 'YOUTUBE' | 'FACEBOOK';

export interface ParsedVideo {
  source: VideoSource;
  videoId?: string;
  thumbnailUrl: string;
}

/**
 * YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function parseYouTube(url: string): ParsedVideo | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;

    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1).split('/')[0];
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v') || null;
    }

    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      return { source: 'YOUTUBE', videoId, thumbnailUrl };
    }
  } catch {
    // invalid URL
  }
  return null;
}

/**
 * Facebook: facebook.com/watch?v=, fb.watch/, facebook.com/reel/
 * Thumbnail: Dùng Graph API oEmbed hoặc placeholder
 */
function parseFacebook(url: string): ParsedVideo | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isFb =
      host === 'facebook.com' ||
      host === 'www.facebook.com' ||
      host === 'fb.watch' ||
      host === 'fb.com';

    if (isFb && (u.pathname.includes('/watch') || u.pathname.includes('/reel') || u.pathname.includes('/videos'))) {
      // Placeholder cho Facebook - Phase 1 chưa gọi Graph API
      const thumbnailUrl = 'https://via.placeholder.com/1280x720/1877f2/ffffff?text=Facebook+Video';
      return { source: 'FACEBOOK', thumbnailUrl };
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function parseVideoUrl(videoUrl: string): ParsedVideo | null {
  const yt = parseYouTube(videoUrl);
  if (yt) return yt;

  const fb = parseFacebook(videoUrl);
  if (fb) return fb;

  return null;
}
