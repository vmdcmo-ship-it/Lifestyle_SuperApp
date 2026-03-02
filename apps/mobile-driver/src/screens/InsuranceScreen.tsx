import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { driverService } from '../services/driver.service';
import { insuranceService } from '../services/insurance.service';
import { isDemoDriverEmail } from '../data/mockData';
import { INSURANCE_PRODUCT_CATALOG } from '../data/insuranceProducts';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

/** Loại xe → label BH TNDS */
const VEHICLE_TNDS_LABEL: Record<string, string> = {
  BIKE: 'BH TNDS Xe máy',
  CAR_4_SEATS: 'BH TNDS Ôtô (4 chỗ)',
  CAR_7_SEATS: 'BH TNDS Ôtô (7 chỗ)',
  TRUCK: 'BH TNDS Xe tải',
};

type VehicleTnds = {
  id: string;
  licensePlate: string;
  vehicleType: string;
  insuranceNumber: string;
  insuranceProvider: string;
  insuranceExpiry: string;
  insuranceExpiryDate: Date;
  status: 'valid' | 'expiring' | 'expired';
};

type InsuranceProduct = {
  id: string;
  productCode: string;
  name: string;
  type: string;
  provider: string;
  description?: string;
  premiumMonthly: number;
  premiumYearly: number;
  coverageAmount: number;
  currency: string;
};

const MOCK_TNDS: VehicleTnds[] = [
  {
    id: '1',
    licensePlate: '59A-12345',
    vehicleType: 'BIKE',
    insuranceNumber: 'TNDS-2024-001',
    insuranceProvider: 'PVI',
    insuranceExpiry: '2025-12-31',
    insuranceExpiryDate: new Date('2025-12-31'),
    status: 'valid',
  },
];

/** Sản phẩm mặc định khi API trống - đồng bộ với App User qua INSURANCE_PRODUCT_CATALOG */

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + 'đ';
}

function getTndsStatus(expiryDate: Date): 'valid' | 'expiring' | 'expired' {
  const now = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'valid';
}

function getDaysLeft(expiryDate: Date): number {
  return Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** vehicleType → productId catalog (để mở màn mua BH) */
function getTndsProductId(vehicleType: string): string {
  if (vehicleType?.toUpperCase().includes('CAR') || vehicleType === 'TRUCK') return 'tnds-ot';
  return 'tnds-xm';
}

export function InsuranceScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tndsList, setTndsList] = useState<VehicleTnds[]>([]);
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [policiesCount, setPoliciesCount] = useState(0);

  const load = useCallback(async () => {
    if (isDemo) {
      setTndsList(MOCK_TNDS);
      setProducts([]);
      setPoliciesCount(0);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setLoading(true);
    try {
      const [vehiclesRes, productsRes, policiesRes] = await Promise.all([
        driverService.getVehicles(),
        insuranceService.listProducts({ limit: 20 }),
        insuranceService.getMyPolicies({ limit: 1 }),
      ]);

      const vehicles = Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes as any)?.data ?? [];
      const tnds: VehicleTnds[] = vehicles.map((v: any) => {
        const expiry = v.insurance_expiry ?? v.insuranceExpiry;
        const expiryDate = expiry ? new Date(expiry) : new Date(0);
        return {
          id: v.id,
          licensePlate: v.license_plate ?? v.licensePlate ?? '—',
          vehicleType: v.vehicleType ?? v.vehicle_type ?? 'BIKE',
          insuranceNumber: v.insurance_number ?? v.insuranceNumber ?? '—',
          insuranceProvider: v.insurance_provider ?? v.insuranceProvider ?? '—',
          insuranceExpiry: expiryDate.toISOString().slice(0, 10),
          insuranceExpiryDate: expiryDate,
          status: getTndsStatus(expiryDate),
        };
      });
      setTndsList(tnds);

      const prodData = (productsRes as any)?.data ?? [];
      setProducts(
        prodData.map((p: any) => ({
          id: p.id,
          productCode: p.productCode ?? p.product_code ?? '',
          name: p.name,
          type: p.type ?? 'VEHICLE',
          provider: p.provider ?? '',
          description: p.description,
          premiumMonthly: Number(p.premiumMonthly ?? p.premium_monthly ?? 0),
          premiumYearly: Number(p.premiumYearly ?? p.premium_yearly ?? 0),
          coverageAmount: Number(p.coverageAmount ?? p.coverage_amount ?? 0),
          currency: p.currency ?? 'VND',
        })),
      );

      const polData = (policiesRes as any)?.data ?? [];
      setPoliciesCount(Array.isArray(polData) ? polData.length : 0);
      const total = (policiesRes as any)?.pagination?.total;
      if (typeof total === 'number') setPoliciesCount(total);
    } catch {
      setTndsList([]);
      setProducts([]);
      setPoliciesCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemo]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const displayProducts = products.length > 0 ? products : INSURANCE_PRODUCT_CATALOG;
  const isApiProduct = products.length > 0;

  /** Xe cần nhắc BH (sắp hết hạn hoặc hết hạn) — ưu tiên hết hạn rồi sắp hết */
  const urgentTnds = tndsList
    .filter((v) => v.status === 'expired' || v.status === 'expiring')
    .sort((a, b) => {
      if (a.status === 'expired' && b.status !== 'expired') return -1;
      if (a.status !== 'expired' && b.status === 'expired') return 1;
      return getDaysLeft(a.insuranceExpiryDate) - getDaysLeft(b.insuranceExpiryDate);
    })[0];

  const handleProductPress = (p: InsuranceProduct | (typeof INSURANCE_PRODUCT_CATALOG)[number]) => {
    const id = (p as InsuranceProduct).id ?? (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).id;
    (navigation as any).navigate('InsuranceProductDetail', { productId: id });
  };

  const tndsStatusColor = (s: VehicleTnds['status']) => {
    if (s === 'expired') return Colors.error;
    if (s === 'expiring') return Colors.warning;
    return Colors.success;
  };

  const tndsStatusText = (s: VehicleTnds['status']) => {
    if (s === 'expired') return 'Hết hạn';
    if (s === 'expiring') return 'Sắp hết hạn';
    return 'Còn hiệu lực';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảo hiểm</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation as any).navigate('InsurancePolicies')}
        >
          <Text style={styles.backBtnText}>Hợp đồng</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.gold]} />}
        >
          {/* ─── Nhắc BH TNDS sắp hết / hết hạn (cross-sell) ─────────────────── */}
          {urgentTnds && (
            <View style={[styles.reminderBanner, urgentTnds.status === 'expired' ? styles.reminderBannerExpired : styles.reminderBannerExpiring]}>
              <Text style={styles.reminderIcon}>{urgentTnds.status === 'expired' ? '❌' : '⚠️'}</Text>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>
                  {urgentTnds.status === 'expired'
                    ? `BH TNDS xe ${urgentTnds.licensePlate} đã hết hạn`
                    : `BH TNDS xe ${urgentTnds.licensePlate} sắp hết hạn trong ${getDaysLeft(urgentTnds.insuranceExpiryDate)} ngày`}
                </Text>
                <Text style={styles.reminderSubtitle}>
                  Gia hạn ngay để tránh bị phạt theo quy định pháp luật
                </Text>
                <TouchableOpacity
                  style={styles.reminderBtn}
                  onPress={() => (navigation as any).navigate('InsuranceProductDetail', { productId: getTndsProductId(urgentTnds.vehicleType) })}
                >
                  <Text style={styles.reminderBtnText}>🛒 Mua bảo hiểm ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ─── Phần 1: BH bắt buộc TNDS ───────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Bảo hiểm bắt buộc (pháp luật)</Text>
            <Text style={styles.sectionSubtitle}>BH TNDS xe máy, ôtô theo quy định</Text>

            {tndsList.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Chưa có phương tiện đăng ký</Text>
                <Text style={styles.emptyHint}>Thêm phương tiện tại mục Phương tiện để theo dõi BH TNDS</Text>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => (navigation as any).navigate('UpdateDocuments')}
                >
                  <Text style={styles.ctaBtnText}>Cập nhật giấy tờ</Text>
                </TouchableOpacity>
              </View>
            ) : (
              tndsList.map((v) => (
                <View key={v.id} style={[styles.tndsCard, { borderLeftColor: tndsStatusColor(v.status) }]}>
                  <View style={styles.tndsRow}>
                    <Text style={styles.tndsLabel}>{VEHICLE_TNDS_LABEL[v.vehicleType] ?? `BH TNDS ${v.vehicleType}`}</Text>
                    <Text style={[styles.tndsStatus, { color: tndsStatusColor(v.status) }]}>{tndsStatusText(v.status)}</Text>
                  </View>
                  <Text style={styles.tndsPlate}>Biển số: {v.licensePlate}</Text>
                  <Text style={styles.tndsDetail}>Số BH: {v.insuranceNumber} · Hết hạn: {v.insuranceExpiry}</Text>
                  <TouchableOpacity
                    style={styles.tndsBtn}
                    onPress={() => (navigation as any).navigate('UpdateDocuments')}
                  >
                    <Text style={styles.tndsBtnText}>Cập nhật / Gia hạn</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* ─── Phần 2: Kinh doanh cross-sell ───────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🛒 Mua bảo hiểm thêm</Text>
            <Text style={styles.sectionSubtitle}>Gói bảo hiểm dành cho tài xế</Text>

            {displayProducts.map((p) => (
              <TouchableOpacity
                key={isApiProduct ? (p as InsuranceProduct).id : (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).id}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: isApiProduct ? '#FFF' : (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).color,
                  },
                ]}
                onPress={() => handleProductPress(p)}
                activeOpacity={0.8}
              >
                <Text style={styles.productIcon}>{isApiProduct ? '📋' : (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).icon}</Text>
                <View style={styles.productContent}>
                  <Text style={[styles.productTitle, isApiProduct && { color: Colors.black }]}>
                    {isApiProduct ? (p as InsuranceProduct).name : (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).title}
                  </Text>
                  <Text style={[styles.productSubtitle, isApiProduct && { color: Colors.gray }]}>
                    {isApiProduct
                      ? `${formatVND((p as InsuranceProduct).premiumYearly || (p as InsuranceProduct).premiumMonthly)}/năm`
                      : (p as (typeof INSURANCE_PRODUCT_CATALOG)[number]).subtitle}
                  </Text>
                </View>
                <Text style={[styles.productChevron, isApiProduct && { color: Colors.gray }]}>→</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Thống kê nhanh */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Bảo hiểm của tôi</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{policiesCount}</Text>
                <Text style={styles.statLabel}>Hợp đồng</Text>
              </View>
              <TouchableOpacity style={styles.statItem} onPress={() => (navigation as any).navigate('InsurancePolicies')}>
                <Text style={styles.statLink}>Xem chi tiết →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backBtn: { minWidth: 80 },
  backBtnText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.purpleDark },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
  scroll: { flex: 1 },
  reminderBanner: {
    margin: Spacing.l,
    flexDirection: 'row',
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    ...Shadows.level2,
  },
  reminderBannerExpiring: {
    backgroundColor: Colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  reminderBannerExpired: {
    backgroundColor: Colors.error + '15',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  reminderIcon: { fontSize: 32, marginRight: Spacing.m },
  reminderContent: { flex: 1 },
  reminderTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  reminderSubtitle: { ...Typography.caption, color: Colors.darkGray, marginTop: 4 },
  reminderBtn: {
    marginTop: Spacing.m,
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.medium,
  },
  reminderBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  section: { padding: Spacing.l, paddingTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: 4 },
  sectionSubtitle: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.m },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.level1,
  },
  emptyText: { ...Typography.body, color: Colors.darkGray, fontWeight: '600' },
  emptyHint: { ...Typography.caption, color: Colors.gray, marginTop: 8 },
  ctaBtn: {
    marginTop: Spacing.m,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
  },
  ctaBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600' },
  tndsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    ...Shadows.level1,
  },
  tndsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tndsLabel: { ...Typography.body, fontWeight: '600', color: Colors.black },
  tndsStatus: { ...Typography.caption, fontWeight: '600' },
  tndsPlate: { ...Typography.secondary, color: Colors.darkGray },
  tndsDetail: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  tndsBtn: { marginTop: Spacing.m, alignSelf: 'flex-start' },
  tndsBtnText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  productIcon: { fontSize: 32, marginRight: Spacing.m },
  productContent: { flex: 1 },
  productTitle: { ...Typography.body, fontWeight: '600', color: Colors.black },
  productSubtitle: { ...Typography.caption, color: Colors.darkGray },
  productChevron: { fontSize: 20, color: Colors.gray },
  statsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    marginTop: Spacing.m,
    ...Shadows.level1,
  },
  statsTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { ...Typography.h2, color: Colors.purpleDark },
  statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  statLink: { ...Typography.body, color: Colors.info, fontWeight: '600' },
});
