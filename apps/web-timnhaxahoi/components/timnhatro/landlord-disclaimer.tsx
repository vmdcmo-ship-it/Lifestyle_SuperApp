/** Disclaimer hiển thị cho chủ trọ khi đăng tin */
export function LandlordDisclaimer(): JSX.Element {
  return (
    <p className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
      <strong>Lưu ý pháp lý:</strong> Nền tảng không thu tiền đặt cọc, không giữ chỗ thuê nhà. Mọi giao dịch giữa bạn và
      người tìm trọ do hai bên tự thỏa thuận; vui lòng tự xác minh thông tin trước khi chuyển tiền.
    </p>
  );
}
