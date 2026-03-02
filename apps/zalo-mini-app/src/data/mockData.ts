/**
 * Mock data Zalo Mini App - đồng bộ với Mobile App
 */
export const MOCK_USER = {
  displayName: "Nguyễn Văn An",
  xuBalance: 12500,
  walletBalance: 2450000,
};

export const ZALO_SERVICES = [
  { id: "food", icon: "🍜", label: "Đặt món", color: "#FF6B6B", path: "/food" },
  { id: "wallet", icon: "💰", label: "Ví tiền", color: "#A8E6CF", path: "/wallet" },
  { id: "xu", icon: "🪙", label: "Lifestyle Xu", color: "#FDB813", path: "/loyalty" },
  { id: "booking", icon: "🚗", label: "Đặt xe", color: "#2196F3", path: "/food" },
  { id: "run", icon: "🏃", label: "Run to Earn", color: "#E17055", path: "/loyalty" },
  { id: "spotlight", icon: "⭐", label: "Spotlight", color: "#FFD93D", path: "/food" },
  { id: "insurance", icon: "🛡️", label: "Bảo hiểm", color: "#6C5CE7", path: "/profile" },
  { id: "shop", icon: "🛒", label: "Mua sắm", color: "#4ECDC4", path: "/food" },
];

export const ZALO_PROMOTIONS = [
  { id: "1", title: "Giảm 20% chuyến đi đầu", subtitle: "Xe máy & ô tô", color: "#FDB813", textColor: "#2E1A47" },
  { id: "2", title: "Freeship đơn từ 50K", subtitle: "Đặt đồ ăn ngay!", color: "#FF6B6B", textColor: "#FFFFFF" },
  { id: "3", title: "Tích Xu x2 cuối tuần", subtitle: "Mua sắm nhận Xu", color: "#2E1A47", textColor: "#FDB813" },
];
