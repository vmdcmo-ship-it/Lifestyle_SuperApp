import { ReferralCampaign } from '@lifestyle/types';

interface ReferralHowItWorksProps {
  campaign: ReferralCampaign;
}

export function ReferralHowItWorks({ campaign }: ReferralHowItWorksProps) {
  return (
    <div className="mb-8 space-y-6">
      {/* Đối với người giới thiệu */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-6 text-xl font-bold">ĐỐI VỚI NGƯỜI GIỚI THIỆU</h3>
        
        <div className="space-y-6">
          {/* Cách 1 */}
          <div>
            <div className="mb-3 inline-block rounded-lg bg-purple-600 px-4 py-1 text-sm font-bold text-white">
              Cách 1
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Đối với người được giới thiệu đã cài ứng dụng <strong>Lifestyle</strong> và chưa
              đăng ký tài khoản
            </p>
            
            <div className="space-y-3">
              <StepItem
                number={1}
                text="Mở ứng dụng Lifestyle."
              />
              <StepItem
                number={2}
                text={`Tại màn hình Đăng ký tài khoản, nhập Mã giới thiệu của người giới thiệu.`}
              />
              <StepItem
                number={3}
                text={`Hoàn tất đăng ký tài khoản Lifestyle. Hệ thống sẽ gửi thông báo tự động và gói ưu đãi trị giá ${campaign.referrerRewards[0]?.amount.toLocaleString()}đ "TỪ GÓI HỘI VIÊN" vào phần "Khuyến mại" mục "Ưu đãi của tôi".`}
              />
              <StepItem
                number={4}
                text={`Sau khi người được giới thiệu sử dụng mã Khuyến Mại và hoàn thành chuyến đi đầu tiên (chỉ áp dụng cho các dịch vụ Lifestyle Transport: Xe máy, Xe ô tô), hệ thống sẽ gửi thông báo và gói ưu đãi trị giá ${campaign.referrerRewards[0]?.amount.toLocaleString()}đ cho người giới thiệu.`}
              />
            </div>
          </div>

          {/* Cách 2 */}
          <div className="border-t pt-6">
            <div className="mb-3 inline-block rounded-lg bg-purple-600 px-4 py-1 text-sm font-bold text-white">
              Cách 2
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Đối với người được giới thiệu đã cài ứng dụng <strong>Lifestyle</strong> và chưa
              đăng ký tài khoản
            </p>
            
            <div className="space-y-3">
              <StepItem
                number={1}
                text="Mở ứng dụng Lifestyle."
              />
              <StepItem
                number={2}
                text={`Tại màn hình Đăng ký tài khoản, nhập Mã giới thiệu của người giới thiệu.`}
              />
              <StepItem
                number={3}
                text={`Hoàn tất đăng ký tài khoản Lifestyle. Hệ thống sẽ gửi thông báo tự động và gói ưu đãi trị giá ${campaign.referrerRewards[0]?.amount.toLocaleString()}đ "TỪ GÓI HỘI VIÊN" vào phần "Khuyến mại" mục "Ưu đãi của tôi".`}
              />
              <StepItem
                number={4}
                text={`Sau khi người được giới thiệu sử dụng ưu đãi "TỪ GÓI HỘI VIÊN" và hoàn thành chuyến đi đầu tiên (chỉ áp dụng cho các dịch vụ Lifestyle Transport: Xe máy, Xe ô tô), hệ thống sẽ gửi thông báo và gói ưu đãi trị giá ${campaign.referrerRewards[0]?.amount.toLocaleString()}đ cho người giới thiệu.`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Đối với người được giới thiệu */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-6 text-xl font-bold">ĐỐI VỚI NGƯỜI ĐƯỢC GIỚI THIỆU</h3>
        
        <div className="space-y-6">
          {/* Cách 1 */}
          <div>
            <div className="mb-3 inline-block rounded-lg bg-green-600 px-4 py-1 text-sm font-bold text-white">
              Cách 1
            </div>
            
            <div className="space-y-3">
              <StepItem
                number={1}
                text="Bấm vào liên kết trong tin nhắn để ứng dụng Lifestyle."
              />
              <StepItem
                number={2}
                text={`Tại màn hình Đăng ký tài khoản, mã giới thiệu sẽ được tự động điền dựa trên thông tin của người gửi tin nhắn.`}
              />
              <StepItem
                number={3}
                text={`Hoàn tất đăng ký tài khoản Lifestyle. Hệ thống sẽ gửi thông báo tự động và gói ưu đãi trị giá ${campaign.refereeRewards[0]?.amount.toLocaleString()}đ "TỪ GÓI HỘI VIÊN" vào phần "Khuyến mại" mục "Ưu đãi của tôi".`}
              />
              <StepItem
                number={4}
                text={`Sau khi người được giới thiệu sử dụng mã Khuyến Mại và hoàn thành chuyến đi đầu tiên (chỉ áp dụng cho các dịch vụ Lifestyle Transport: Xe máy, Xe ô tô), hệ thống sẽ gửi thông báo và gói ưu đãi trị giá ${campaign.referrerRewards[0]?.amount.toLocaleString()}đ cho người giới thiệu.`}
              />
            </div>
          </div>

          {/* Cách 2 */}
          <div className="border-t pt-6">
            <div className="mb-3 inline-block rounded-lg bg-green-600 px-4 py-1 text-sm font-bold text-white">
              Cách 2
            </div>
            
            <div className="space-y-3">
              <StepItem
                number={1}
                text={`Mở ứng dụng Lifestyle, trên giao diện app, chọn icon "👥 Giới thiệu"`}
              />
              <StepItem
                number={2}
                text={`Bấm "Chia sẻ" và gửi đến bạn bè của bạn qua tin nhắn SMS, email hoặc các phương tiện khác có sẵn trên ứng dụng.`}
              />
              <StepItem
                number={3}
                text={`(*) Mã giới thiệu có thể được đặt lại theo ý thích (tối đa 1 lần); số lượng ký tự trong khoảng 6-20 ký tự, bao gồm chữ số và chữ cái không dấu.`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
        {number}
      </div>
      <p className="flex-1 pt-1 text-sm text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
}
