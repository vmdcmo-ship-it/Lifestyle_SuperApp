/** Danh sách video hub — bổ sung youtubeId khi có clip thật. */

export type VideoItem = {
  id: string;
  title: string;
  durationLabel: string;
  topic: string;
  /** Khi có YouTube/Vimeo, gán id để nhúng iframe */
  youtubeId?: string;
};

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: '1',
    title: 'NOXH là gì? Ai được mua?',
    durationLabel: '~75s',
    topic: 'Giới thiệu',
  },
  {
    id: '2',
    title: 'Chuẩn bị hồ sơ trước đợt mở bán',
    durationLabel: '~60s',
    topic: 'Thủ tục',
  },
  {
    id: '3',
    title: 'Vốn tự có và vay — nên tính trước những gì?',
    durationLabel: '~90s',
    topic: 'Tài chính',
  },
];
