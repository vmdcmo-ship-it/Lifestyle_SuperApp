import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import { MOCK_USER } from "@/data/mockData";
import { Colors } from "@/theme";
import { getXuBalance } from "@/services/loyalty";
import { isLoggedIn } from "@/services/auth";

export default function LoyaltyPage() {
  const navigate = useNavigate();
  const [xuData, setXuData] = useState<{ xuBalance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }
    getXuBalance()
      .then(setXuData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const xuBalance = xuData?.xuBalance ?? MOCK_USER.xuBalance;

  return (
    <Page className="bg-[#F5F5F5] pb-20">
      <div className="flex justify-between items-center px-4 py-3 bg-white" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <button onClick={() => navigate("/")} className="text-2xl text-[#1A1A1A]">←</button>
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Lifestyle Xu</h1>
        <button onClick={() => navigate("/wallet")} className="text-sm font-semibold" style={{ color: Colors.gold }}>Chi tiết ›</button>
      </div>
      <div className="px-4 pt-4">
        {loading && isLoggedIn() && <p className="text-sm text-[#9E9E9E] py-2">Đang tải...</p>}
        <div className="rounded-xl p-5 shadow-md" style={{ backgroundColor: Colors.gold + "20", borderLeft: `4px solid ${Colors.gold}` }}>
          <p className="text-lg font-bold" style={{ color: Colors.purpleDark }}>{xuBalance.toLocaleString()} Xu</p>
          <p className="text-sm text-[#4A4A4A] mt-1">Số dư Lifestyle Xu của bạn</p>
        </div>
        {!isLoggedIn() && (
          <p className="text-sm text-[#9E9E9E] mt-4">Đăng nhập để xem số dư Xu chính xác và tích điểm.</p>
        )}
        <p className="text-sm text-[#9E9E9E] mt-4">Tích điểm khi mua sắm, đặt món, đặt xe. Đổi Xu lấy ưu đãi và quà tặng.</p>
      </div>
    </Page>
  );
}
