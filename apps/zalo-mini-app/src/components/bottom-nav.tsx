import { useNavigate, useLocation, Icon } from "zmp-ui";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const tabs = [
    { path: "/", label: "Trang chủ", icon: "zi-home" },
    { path: "/food", label: "Đặt món", icon: "zi-more-grid" },
    { path: "/wallet", label: "Ví", icon: "zi-wallet" },
    { path: "/loyalty", label: "Xu", icon: "zi-star" },
    { path: "/profile", label: "Tôi", icon: "zi-user" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E0E0E0]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              isActive(tab.path) ? "text-[#FDB813]" : "text-[#9E9E9E]"
            }`}
          >
            <Icon icon={tab.icon} className="text-xl" />
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
