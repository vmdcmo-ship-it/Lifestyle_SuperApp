import { Page } from "zmp-ui";
import { isLoggedIn } from "@/services/auth";
import { Colors } from "@/theme";

const MENU_SECTIONS = [
  {
    title: "Hạng thành viên & Ưu đãi",
    items: [
      { icon: "📦", label: "Gói hội viên", badge: "Mới" },
      { icon: "🎫", label: "Mã Khuyến mại", badge: "3" },
      { icon: "👑", label: "Hạng thành viên", right: "🥇 Vàng", rightColor: Colors.gold },
      { icon: "🤝", label: "Giới thiệu bạn bè", right: "LS313BA8B2" },
    ],
  },
  {
    title: "Hệ sinh thái Lifestyle",
    items: [
      { icon: "🏃", label: "Run to Earn", right: "🪙 2,450 Xu" },
      { icon: "⭐", label: "Spotlight của tôi" },
      { icon: "🛡️", label: "Bảo hiểm của tôi" },
      { icon: "💰", label: "Gói Tiết Kiệm" },
    ],
  },
  {
    title: "Cài đặt chung",
    items: [
      { icon: "🌐", label: "Ngôn ngữ", right: "Tiếng Việt" },
      { icon: "🔒", label: "Đăng nhập & Bảo mật" },
    ],
  },
];

export default function ProfilePage() {
  const loggedIn = isLoggedIn();

  const handleZaloLogin = async () => {
    try {
      const getOAuthCode = (window as any).zmp?.User?.getOauthV1Code;
      if (!getOAuthCode) {
        alert(
          "Chức năng đăng nhập Zalo chỉ hoạt động trong Zalo Mini App. Mở app trong Zalo để đăng nhập."
        );
        return;
      }
      const { code, codeVerifier } = await getOAuthCode({
        scopes: ["user.phone", "user.name", "user.avatar"],
      });
      const { zaloLogin } = await import("@/services/auth");
      await zaloLogin(code, codeVerifier);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Đăng nhập thất bại");
    }
  };

  const handleLogout = async () => {
    const { logout } = await import("@/services/auth");
    await logout();
    window.location.reload();
  };

  return (
    <Page className="bg-[#F5F5F5] pb-20">
      {/* Header */}
      <div
        className="px-4 py-3 bg-white"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
      >
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Tài khoản</h1>
      </div>

      {/* Login / User state */}
      <div className="p-4">
        {!loggedIn ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-[#9E9E9E] text-sm mb-4">
              Đăng nhập để sử dụng đầy đủ tính năng.
            </p>
            <button
              onClick={handleZaloLogin}
              className="w-full py-3 rounded-lg font-semibold text-white"
              style={{ backgroundColor: Colors.purpleDark }}
            >
              Đăng nhập với Zalo
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
            <p className="text-sm text-[#9E9E9E] mb-3">Bạn đã đăng nhập.</p>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-lg font-semibold border"
              style={{ borderColor: Colors.red, color: Colors.red }}
            >
              Đăng xuất
            </button>
          </div>
        )}

        {/* Menu sections - giống Mobile ProfileScreen */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mt-6">
            <p
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={{ color: "#4A4A4A" }}
            >
              {section.title}
            </p>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {section.items.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center px-4 py-3.5 ${
                    i < section.items.length - 1 ? "border-b border-[#F8F8F8]" : ""
                  }`}
                >
                  <span className="text-xl mr-3 w-7 text-center">{item.icon}</span>
                  <span className="flex-1 font-medium text-[#1A1A1A]">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold mr-2"
                      style={{ backgroundColor: Colors.gold + "20", color: Colors.gold }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.right && (
                    <span
                      className="text-sm mr-2"
                      style={{ color: item.rightColor || "#9E9E9E" }}
                    >
                      {item.right}
                    </span>
                  )}
                  <span className="text-[#E0E0E0]">›</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-[#9E9E9E] mt-6">
          Lifestyle Super App v1.0.0
        </p>
      </div>
    </Page>
  );
}
