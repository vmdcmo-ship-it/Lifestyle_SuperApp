/**
 * Danh mục sản phẩm bảo hiểm - đồng bộ với App User
 * Mục 1: BH bắt buộc (TNDS Xe máy, Ôtô) - theo dõi theo quy định pháp luật
 * Mục 2: Kinh doanh cross-sell - TNDS, BHXH TN, BHNT, BHYT
 */

export type InsuranceProductType = 'VEHICLE' | 'SOCIAL' | 'LIFE' | 'HEALTH';

export const INSURANCE_PRODUCT_CATALOG = [
  {
    id: 'tnds-xm',
    productCode: 'TNDS-XM',
    type: 'VEHICLE' as InsuranceProductType,
    icon: '🏍️',
    title: 'BH TNDS Xe máy',
    subtitle: 'Bắt buộc theo quy định pháp luật',
    color: '#E3F2FD',
    textColor: '#1565C0',
  },
  {
    id: 'tnds-ot',
    productCode: 'TNDS-OT',
    type: 'VEHICLE' as InsuranceProductType,
    icon: '🚗',
    title: 'BH TNDS Ôtô',
    subtitle: 'Bắt buộc theo quy định pháp luật',
    color: '#E8F5E9',
    textColor: '#2E7D32',
  },
  {
    id: 'vat-chat',
    productCode: 'VC-XE',
    type: 'VEHICLE' as InsuranceProductType,
    icon: '🚙',
    title: 'Vật chất xe',
    subtitle: 'Bảo vệ toàn diện cho xế yêu',
    color: '#FFF3E0',
    textColor: '#E65100',
  },
  {
    id: 'bhxh',
    productCode: 'BHXH-TN',
    type: 'SOCIAL' as InsuranceProductType,
    icon: '🌸',
    title: 'BHXH Tự nguyện',
    subtitle: 'Tích lũy thảnh thơi - An nhàn tuổi già',
    color: '#FFB6C1',
    textColor: '#8B3A62',
  },
  {
    id: 'bhnt',
    productCode: 'BHNT',
    type: 'LIFE' as InsuranceProductType,
    icon: '🛡️',
    title: 'Bảo hiểm nhân thọ',
    subtitle: 'Bản Thiết Kế Tương Lai',
    color: '#F3E5F5',
    textColor: '#6A1B9A',
  },
  {
    id: 'health',
    productCode: 'BHYT',
    type: 'HEALTH' as InsuranceProductType,
    icon: '🏥',
    title: 'Bảo hiểm Y tế',
    subtitle: 'Chăm sóc sức khỏe toàn diện',
    color: '#E1F5FE',
    textColor: '#0277BD',
  },
] as const;
