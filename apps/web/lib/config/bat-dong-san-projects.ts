/**
 * Config dự án chung cư - dùng khi chưa có API
 * Backend: GET /api/v1/bat-dong-san/projects
 */

export interface DuAnChungCu {
  id: string;
  name: string;
  location: string;
  district?: string;
  city: string;
  status: 'dang-mo-ban' | 'sap-ra-mat' | 'dang-xay' | 'da-ban-giao';
  statusLabel: string;
  priceRange?: string;
  developer?: string;
  slug?: string;
}

export const DU_AN_CHUNG_CU_STATIC: DuAnChungCu[] = [
  {
    id: '1',
    name: 'Dự án chung cư cao cấp Q1',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    status: 'dang-mo-ban',
    statusLabel: 'Đang mở bán',
    priceRange: '50 - 120 triệu/m²',
    developer: 'Tập đoàn bất động sản',
    slug: 'du-an-chung-cu-cao-cap-q1',
  },
  {
    id: '2',
    name: 'Khu đô thị sinh thái Thủ Đức',
    location: 'Thủ Đức, TP.HCM',
    district: 'Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    status: 'sap-ra-mat',
    statusLabel: 'Sắp ra mắt',
    priceRange: '35 - 80 triệu/m²',
    slug: 'khu-do-thi-sinh-thai-thu-duc',
  },
  {
    id: '3',
    name: 'Chung cư hạng sang Bình Thạnh',
    location: 'Bình Thạnh, TP.HCM',
    district: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    status: 'dang-mo-ban',
    statusLabel: 'Đang mở bán',
    priceRange: '45 - 95 triệu/m²',
    slug: 'chung-cu-hang-sang-binh-thanh',
  },
  {
    id: '4',
    name: 'Dự án căn hộ giá rẻ Quận 9',
    location: 'Quận 9, TP.HCM',
    district: 'Quận 9',
    city: 'TP. Hồ Chí Minh',
    status: 'dang-xay',
    statusLabel: 'Đang xây dựng',
    priceRange: '25 - 45 triệu/m²',
    slug: 'du-an-can-ho-gia-re-quan-9',
  },
  {
    id: '5',
    name: 'Chung cư Linh Đàm',
    location: 'Hoàng Mai, Hà Nội',
    district: 'Hoàng Mai',
    city: 'Hà Nội',
    status: 'da-ban-giao',
    statusLabel: 'Đã bàn giao',
    slug: 'chung-cu-linh-dam',
  },
  {
    id: '6',
    name: 'Khu đô thị Vinhomes',
    location: 'Long Biên, Hà Nội',
    district: 'Long Biên',
    city: 'Hà Nội',
    status: 'dang-mo-ban',
    statusLabel: 'Đang mở bán',
    priceRange: '30 - 70 triệu/m²',
    developer: 'Vingroup',
    slug: 'khu-do-thi-vinhomes',
  },
];

const STATUS_CLASS: Record<DuAnChungCu['status'], string> = {
  'dang-mo-ban': 'bg-green-100 text-green-800',
  'sap-ra-mat': 'bg-amber-100 text-amber-800',
  'dang-xay': 'bg-blue-100 text-blue-800',
  'da-ban-giao': 'bg-slate-100 text-slate-700',
};

export function getProjectStatusClass(status: DuAnChungCu['status']): string {
  return STATUS_CLASS[status] || 'bg-slate-100 text-slate-700';
}
