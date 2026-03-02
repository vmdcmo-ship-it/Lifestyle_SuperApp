import { Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import { ZALO_SERVICES, ZALO_PROMOTIONS, MOCK_USER } from "@/data/mockData";
import { Colors } from "@/theme";
import { apiFetch, endpoints } from "@/services/api";
import { isLoggedIn } from "@/services/auth";

interface ProfileData {
  displayName?: string;
  firstName?: string;
  xuBalance?: number;
  wallets?: { balance?: number } | null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) return;
    apiFetch<ProfileData>(endpoints.auth.profile).then(setProfile).catch(() => {});
  }, []);

  const displayName = profile?.firstName || profile?.displayName?.split(" ")[0] || MOCK_USER.displayName.split(" ")[0];
  const xuBalance = profile?.xuBalance != null ? Number(profile.xuBalance) : MOCK_USER.xuBalance;
  const walletBalance = profile?.wallets ? Number(profile.wallets.balance) : MOCK_USER.walletBalance;

  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

  return (
    <Page className="bg-[#F5F5F5] pb-20">
      {/* Header - Xin chào + Xu badge */}
      <div
        className="flex justify-between items-center px-4 py-3 bg-white"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <h1 className="text-xl font-bold text-[#1A1A1A]">Xin chào, {displayName}</h1>
        <button
          onClick={() => navigate("/wallet")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: Colors.gold + "15" }}
        >
          <span>🪙</span>
          <span className="text-sm font-bold" style={{ color: Colors.gold }}>
            {xuBalance.toLocaleString()}
          </span>
        </button>
      </div>

      {/* Search bar */}
      <button
        onClick={() => navigate("/food")}
        className="flex items-center mx-4 mt-2 px-4 h-12 bg-white rounded-full shadow-md"
      >
        <span className="text-lg mr-2">📍</span>
        <span className="flex-1 text-left text-[#9E9E9E] text-base">Bạn muốn đi đâu?</span>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-2xl text-xs font-semibold"
          style={{ backgroundColor: Colors.gold + "15", color: Colors.gold }}
        >
          ⏰ Hẹn giờ
        </span>
      </button>

      {/* Services Grid */}
      <div className="mt-3 pt-4 pb-2 bg-white">
        <div className="flex flex-wrap px-3">
          {ZALO_SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.path)}
              className="flex flex-col items-center w-1/4 mb-4"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1.5"
                style={{ backgroundColor: s.color + "15" }}
              >
                {s.icon}
              </div>
              <span className="text-xs font-medium text-[#4A4A4A] text-center leading-tight">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Promotions carousel */}
      <div className="mt-3 pt-4">
        <div className="flex overflow-x-auto gap-3 px-4 pb-2" style={{ scrollSnapType: "x mandatory" }}>
          {ZALO_PROMOTIONS.map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 w-[78%] h-24 rounded-xl px-4 flex flex-col justify-center"
              style={{
                backgroundColor: p.color,
                color: p.textColor,
                scrollSnapAlign: "start",
              }}
            >
              <p className="text-base font-bold">{p.title}</p>
              <p className="text-sm opacity-90">{p.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-2">
          {ZALO_PROMOTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full ${i === 0 ? "w-4 bg-[#FDB813]" : "w-1.5 bg-[#E0E0E0]"}`}
            />
          ))}
        </div>
      </div>

      {/* Wallet Card - Premium (purple) */}
      <div className="mt-3 px-4">
        <div
          className="rounded-xl p-4 shadow-lg"
          style={{ backgroundColor: Colors.purpleDark }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#C0C0C0] mb-1">Ví Lifestyle</p>
              <p className="text-2xl font-bold text-white">
                {formatVND(walletBalance)}
              </p>
            </div>
            <button
              onClick={() => navigate("/wallet")}
              className="px-3 py-1 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: Colors.gold }}
            >
              Chi tiết ›
            </button>
          </div>
          <div className="flex justify-around mt-4 pt-4 border-t border-white/10">
            {[
              { icon: "+", label: "Nạp tiền" },
              { icon: "↗️", label: "Chuyển" },
              { icon: "📊", label: "Lịch sử" },
              { icon: "🎁", label: "Ưu đãi" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate("/wallet")}
                className="flex flex-col items-center"
              >
                <span className="text-xl mb-1" style={{ color: Colors.gold }}>{a.icon}</span>
                <span className="text-xs text-white">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 mx-4 py-4 px-4 bg-white rounded-xl shadow-sm flex divide-x divide-[#E0E0E0]">
        <div className="flex-1 text-center">
          <p className="text-lg font-extrabold text-[#2E1A47]">47</p>
          <p className="text-xs text-[#9E9E9E] mt-0.5">Chuyến đi</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-extrabold text-[#2E1A47]">189 km</p>
          <p className="text-xs text-[#9E9E9E] mt-0.5">Run to Earn</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-extrabold text-[#2E1A47]">12.5K</p>
          <p className="text-xs text-[#9E9E9E] mt-0.5">Xu tích lũy</p>
        </div>
      </div>
    </Page>
  );
}
