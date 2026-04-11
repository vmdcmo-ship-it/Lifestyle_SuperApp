/** Nhãn hiển thị cho người dùng cuối (ẩn mã nội bộ). */
export function segmentLabelVi(segment: string | null | undefined): string {
  switch (segment) {
    case 'GREEN':
      return 'Tiềm năng tốt — ưu tiên liên hệ';
    case 'YELLOW':
      return 'Cần bổ sung / tư vấn thêm';
    case 'RED':
      return 'Cần điều chỉnh điều kiện hoặc lộ trình';
    case 'ORANGE_SPECIAL':
      return 'Hồ sơ đặc thù — tư vấn viên sẽ liên hệ';
    default:
      return 'Chưa có phân loại';
  }
}
