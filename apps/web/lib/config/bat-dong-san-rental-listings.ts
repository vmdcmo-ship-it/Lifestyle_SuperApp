/**
 * Dữ liệu mẫu tin cho thuê - dùng khi API chưa có
 * Backend: GET /api/v1/bat-dong-san/rental-listings
 */

export interface RentalListing {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  district?: string;
  price?: number; // triệu/tháng
  area?: number; // m²
  description?: string;
  contactPhone?: string;
  createdAt?: string;
}

export const RENTAL_LISTINGS_STATIC: RentalListing[] = [
  {
    id: '1',
    title: 'Cho thuê phòng trọ Quận 1, gần chợ Bến Thành',
    propertyType: 'Phòng trọ',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: 4.5,
    area: 20,
    description: 'Phòng sạch sẽ, có máy lạnh, wifi. Gần trung tâm, thuận tiện đi lại.',
    contactPhone: '0900***',
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    title: 'Cho thuê căn hộ 2 phòng ngủ Bình Thạnh',
    propertyType: 'Căn hộ chung cư',
    location: 'Bình Thạnh, TP.HCM',
    district: 'Bình Thạnh',
    price: 12,
    area: 65,
    description: 'Căn hộ full nội thất, view đẹp. Chủ nhà cho thuê lâu dài.',
    contactPhone: '0912***',
    createdAt: '2024-02-28',
  },
  {
    id: '3',
    title: 'Phòng trọ giá rẻ Thủ Đức, gần khu công nghiệp',
    propertyType: 'Phòng trọ',
    location: 'Thủ Đức, TP.HCM',
    district: 'Thủ Đức',
    price: 2.5,
    area: 15,
    description: 'Phù hợp sinh viên, công nhân. Có chỗ để xe.',
    contactPhone: '0987***',
    createdAt: '2024-02-25',
  },
];
