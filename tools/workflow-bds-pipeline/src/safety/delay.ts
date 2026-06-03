export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Trả về số mili-giây delay ngẫu nhiên trong [minSeconds, maxSeconds]. */
export function randomDelayMs(minSeconds: number, maxSeconds: number): number {
  const min = Math.max(0, minSeconds);
  const max = Math.max(min, maxSeconds);
  const seconds = min + Math.random() * (max - min);
  return Math.round(seconds * 1000);
}

/**
 * Kiểm tra thời điểm hiện tại có nằm trong khung giờ "HH:MM-HH:MM" không.
 * "24h" hoặc rỗng = luôn cho phép.
 */
export function isWithinActiveHours(activeHours: string, now: Date = new Date()): boolean {
  const range = activeHours.trim().toLowerCase();
  if (range === '' || range === '24h') {
    return true;
  }
  const match = range.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) {
    return true;
  }
  const startH = Number(match[1]);
  const startM = Number(match[2]);
  const endH = Number(match[3]);
  const endM = Number(match[4]);
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  if (start <= end) {
    return cur >= start && cur <= end;
  }
  return cur >= start || cur <= end;
}
