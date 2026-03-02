import { Page, useNavigate } from "zmp-ui";
import { ZALO_SERVICES } from "@/data/mockData";

export default function FoodPage() {
  const navigate = useNavigate();
  const foodServices = ZALO_SERVICES.filter((s) => ["food", "wallet", "xu", "shop"].includes(s.id));

  return (
    <Page className="bg-[#F5F5F5] pb-20">
      <div className="flex items-center px-4 py-3 bg-white" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <button onClick={() => navigate("/")} className="text-2xl text-[#1A1A1A] mr-2">←</button>
        <h1 className="text-lg font-semibold text-[#1A1A1A]">Đặt món</h1>
      </div>
      <div className="p-4">
        <p className="text-sm text-[#9E9E9E] mb-4">Khám phá món ăn ngon từ các nhà hàng đối tác.</p>
        <div className="flex flex-wrap gap-3">
          {foodServices.map((s) => (
            <button key={s.id} onClick={() => navigate(s.path)} className="flex items-center w-full p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-3" style={{ backgroundColor: s.color + "20" }}>{s.icon}</div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-[#1A1A1A]">{s.label}</p>
                <p className="text-xs text-[#9E9E9E]">{s.id === "food" ? "Giao thức ăn tận nơi" : s.id === "shop" ? "Mua sắm trực tuyến" : "Xem thêm"}</p>
              </div>
              <span className="text-[#9E9E9E]">›</span>
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}
