import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import { apiFetch, endpoints } from "@/services/api";
import { Colors } from "@/theme";
import { MOCK_USER } from "@/data/mockData";

interface WalletInfo {
  balance?: number;
  xu?: number;
}

export default function WalletPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const balance = wallet?.balance ?? MOCK_USER.walletBalance;
  const xuBal = wallet?.xu ?? MOCK_USER.xuBalance;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem ví");
      return;
    }
    apiFetch<WalletInfo>(endpoints.wallet.info)
      .then(setWallet)
      .catch((e) => setError(e.message || "Không tải được ví"))
      .finally(() => setLoading(false));
  }, [token]);

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <Page className="bg-[#F5F5F5] pb-20">
      <div className="flex justify-between items-center px-4 py-3 bg-white" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <button onClick={() => navigate("/")} className="text-2xl text-[#1A1A1A]">←</button>
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Thanh toán</h1>
        <button className="text-sm font-medium" style={{ color: Colors.gold }}>Lịch sử</button>
      </div>
      <div className="px-4 pt-4">
        <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: Colors.purpleDark }}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-[#C0C0C0]">Ví Lifestyle</p>
            <button onClick={() => setShowBalance(!showBalance)}><span className="text-lg">{showBalance ? "👁️" : "🙈"}</span></button>
          </div>
          <p className="text-2xl font-bold text-white">{showBalance ? formatVND(balance) : "••••••••"}</p>
          <p className="text-sm mt-2" style={{ color: Colors.gold }}>🪙 {xuBal.toLocaleString()} Xu</p>
          <p className="text-xs text-white/70 mt-1">Sử dụng trong hệ sinh thái Lifestyle</p>
          <div className="flex justify-around mt-4 pt-4 border-t border-white/10">
            {["+", "↗️", "🎁"].map((icon, i) => (
              <button key={i} className="flex flex-col items-center">
                <span className="text-xl mb-1" style={{ color: Colors.gold }}>{icon}</span>
                <span className="text-xs text-white">{["Nạp tiền", "Chuyển", "Đổi quà"][i]}</span>
              </button>
            ))}
          </div>
        </div>
        {loading && <p className="text-center text-[#9E9E9E] py-4">Đang tải...</p>}
        {error && <div className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}>{error}</div>}
      </div>
    </Page>
  );
}
