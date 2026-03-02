/**
 * 3 tài khoản demo để nhiều người truy cập cùng lúc không xung đột dữ liệu.
 * Mỗi tài khoản đăng nhập riêng, app hiển thị cùng bộ dữ liệu mẫu (read-only).
 */
export const DEMO_DRIVER_ACCOUNTS = [
  { email: 'demo1@driver.vmd.asia', password: 'Demo1@123', label: 'Demo 1' },
  { email: 'demo2@driver.vmd.asia', password: 'Demo2@123', label: 'Demo 2' },
  { email: 'demo3@driver.vmd.asia', password: 'Demo3@123', label: 'Demo 3' },
] as const;

/** Danh sách email demo (để kiểm tra nhanh). */
const DEMO_EMAILS = DEMO_DRIVER_ACCOUNTS.map((a) => a.email.toLowerCase());

/** Kiểm tra email có phải tài khoản demo không. */
export function isDemoDriverEmail(email: string | null | undefined): boolean {
  return !!email && DEMO_EMAILS.includes(email.toLowerCase());
}

/** Giữ tương thích cũ (dùng email demo đầu tiên). */
export const DEMO_DRIVER_EMAIL = DEMO_DRIVER_ACCOUNTS[0].email;
export const DEMO_DRIVER_PASSWORD = DEMO_DRIVER_ACCOUNTS[0].password;

export const MOCK_DRIVER = {
  id: 'drv-001',
  name: 'Trần Văn Bảo',
  phone: '0912345678',
  avatar: null,
  rating: 4.85,
  totalTrips: 1250,
  vehiclePlate: '59A-123.45',
  vehicleType: 'Honda Wave RSX',
  status: 'ONLINE',
  memberSince: '2026-01-10',
};

export const MOCK_TODAY_STATS = {
  totalTrips: 8,
  totalEarnings: 520000,
  onlineHours: 5.5,
  acceptanceRate: 92,
  cancellationRate: 4,
  averageRating: 4.9,
};

export const MOCK_WEEKLY_EARNINGS = [
  { day: 'T2', amount: 450000 },
  { day: 'T3', amount: 620000 },
  { day: 'T4', amount: 380000 },
  { day: 'T5', amount: 550000 },
  { day: 'T6', amount: 720000 },
  { day: 'T7', amount: 890000 },
  { day: 'CN', amount: 520000 },
];

export const MOCK_WALLET = {
  balance: 3250000,
  pendingWithdraw: 0,
  totalEarningsMonth: 12500000,
  commission: 1250000,
  bonus: 350000,
};

export const MOCK_MISSIONS = [
  { id: 'trips-daily-5', title: 'Hoàn thành 5 chuyến trong ngày', reward: 50000, progress: 2, target: 5, unit: 'chuyến' },
  { id: 'trips-daily-10', title: 'Hoàn thành 10 chuyến trong ngày', reward: 120000, progress: 1, target: 10, unit: 'chuyến' },
  { id: 'trips-weekly-20', title: 'Tuần chạy 20 chuyến', reward: 200000, progress: 12, target: 20, unit: 'chuyến' },
];

/** Tọa độ mẫu TP.HCM (để hiển thị trên bản đồ). */
const HCM = {
  nguyenVanCu: { lat: 10.7629, lng: 106.6825 },
  leLoi: { lat: 10.7769, lng: 106.7009 },
  pasteur: { lat: 10.7854, lng: 106.6912 },
  cachMang: { lat: 10.7812, lng: 106.6678 },
  tanSonNhat: { lat: 10.8188, lng: 106.6519 },
  phuMyHung: { lat: 10.7292, lng: 106.7192 },
};

export const MOCK_AVAILABLE_ORDERS = [
  {
    id: 'ORD-001',
    type: 'RIDE',
    pickup: '227 Nguyễn Văn Cừ, Q.5',
    dropoff: '45 Lê Lợi, Q.1',
    pickupLat: HCM.nguyenVanCu.lat,
    pickupLng: HCM.nguyenVanCu.lng,
    dropoffLat: HCM.leLoi.lat,
    dropoffLng: HCM.leLoi.lng,
    distance: 5.2,
    distanceFromDriver: 1.2,
    estimatedPrice: 32800,
    codAmount: 0,
    senderNotes: '',
    eta: '3 phút',
    customerName: 'Nguyễn Văn An',
    customerRating: 4.8,
  },
  {
    id: 'ORD-002',
    type: 'FOOD',
    pickup: 'Phở Hòa - 260C Pasteur, Q.3',
    dropoff: '100 Cách Mạng Tháng 8, Q.10',
    pickupLat: HCM.pasteur.lat,
    pickupLng: HCM.pasteur.lng,
    dropoffLat: HCM.cachMang.lat,
    dropoffLng: HCM.cachMang.lng,
    distance: 3.8,
    distanceFromDriver: 2.5,
    estimatedPrice: 18000,
    codAmount: 85000,
    senderNotes: 'Cần túi giữ nhiệt, giao trước 12h',
    eta: '5 phút',
    customerName: 'Lê Thị Mai',
    customerRating: 4.5,
  },
  {
    id: 'ORD-003',
    type: 'RIDE',
    pickup: 'Sân bay Tân Sơn Nhất',
    dropoff: 'Phú Mỹ Hưng, Q.7',
    pickupLat: HCM.tanSonNhat.lat,
    pickupLng: HCM.tanSonNhat.lng,
    dropoffLat: HCM.phuMyHung.lat,
    dropoffLng: HCM.phuMyHung.lng,
    distance: 12.5,
    distanceFromDriver: 4.0,
    estimatedPrice: 125000,
    codAmount: 0,
    senderNotes: 'Hành lý cồng kềnh, cần baga',
    eta: '8 phút',
    customerName: 'Phạm Văn Hùng',
    customerRating: 4.9,
  },
];

/** Đơn đang thực hiện (demo) — dùng cho OrderExecutionScreen. */
export const MOCK_ACTIVE_ORDER = {
  id: 'ORD-001',
  type: 'RIDE' as const,
  from: '227 Nguyễn Văn Cừ, Q.5',
  to: '45 Lê Lợi, Q.1',
  pickupLat: HCM.nguyenVanCu.lat,
  pickupLng: HCM.nguyenVanCu.lng,
  dropoffLat: HCM.leLoi.lat,
  dropoffLng: HCM.leLoi.lng,
  earnings: 32800,
  customerName: 'Nguyễn Văn An',
  customerPhone: '0901234567',
  status: 'DRIVER_ARRIVING',
};

export const MOCK_ORDER_HISTORY = [
  { id: 'H-001', type: 'RIDE', from: '227 Nguyễn Văn Cừ', to: 'Lê Lợi Q.1', earnings: 32800, rating: 5, time: '14:30', status: 'COMPLETED' },
  { id: 'H-002', type: 'FOOD', from: 'Phở Hòa Pasteur', to: 'Cách Mạng Q.10', earnings: 18000, rating: 4, time: '12:15', status: 'COMPLETED' },
  { id: 'H-003', type: 'RIDE', from: 'Tân Sơn Nhất', to: 'Phú Mỹ Hưng', earnings: 125000, rating: 5, time: '10:00', status: 'COMPLETED' },
  { id: 'H-004', type: 'RIDE', from: 'Q.Bình Thạnh', to: 'Q.1', earnings: 0, rating: 0, time: '09:30', status: 'CANCELLED' },
];

/** Dữ liệu rỗng cho tài xế mới (chưa có hồ sơ / chưa có giao dịch). */
export const EMPTY_TODAY_STATS = {
  totalTrips: 0,
  totalEarnings: 0,
  onlineHours: 0,
  acceptanceRate: 0,
  cancellationRate: 0,
  averageRating: 0,
};

export const EMPTY_WEEKLY_EARNINGS = [
  { day: 'T2', amount: 0 },
  { day: 'T3', amount: 0 },
  { day: 'T4', amount: 0 },
  { day: 'T5', amount: 0 },
  { day: 'T6', amount: 0 },
  { day: 'T7', amount: 0 },
  { day: 'CN', amount: 0 },
];

export const EMPTY_WALLET = {
  balance: 0,
  pendingWithdraw: 0,
  totalEarningsMonth: 0,
  commission: 0,
  bonus: 0,
};

/** Cài đặt nhận đơn (mock cho demo). */
export const MOCK_ORDER_RECEIVING_SETTINGS = {
  isOnline: true,
  cashOnHand: 500000,
  availableCash: 500000,
  pendingCOD: 0,
  enabledServices: {
    foodDelivery: true,
    rideBike: true,
    rideCar4: true,
    rideCar7: false,
    parcel: true,
  },
  autoAcceptEnabled: false,
  autoAcceptMaxDistanceKm: 5,
  autoAcceptMinAmount: 30000,
  maxBatchOrders: 3,
};
