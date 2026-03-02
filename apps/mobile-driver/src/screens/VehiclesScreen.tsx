import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { driverService } from '../services/driver.service';
import { useAuth } from '../context/AuthContext';
import { isDemoDriverEmail } from '../data/mockData';
import { VEHICLE_TYPE_LABELS, TRUCK_CLASS_LABELS } from '../constants/vehicleTypes';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

type VehicleItem = {
  id: string;
  vehicleType: string;
  vehicle_class?: string | null;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  verification_status?: string;
};

const MOCK_VEHICLES: VehicleItem[] = [
  {
    id: '1',
    vehicleType: 'BIKE',
    vehicle_class: null,
    licensePlate: '59A-12345',
    brand: 'Honda',
    model: 'Wave RSX',
    year: 2024,
    color: 'Đen',
    verification_status: 'APPROVED',
  },
];

export function VehiclesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);

  const load = useCallback(async () => {
    if (isDemo) {
      setVehicles(MOCK_VEHICLES);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await driverService.getVehicles();
      const data = Array.isArray(res?.data) ? res.data : (res && (res as any).data) ? (res as any).data : res ? [res] : [];
      setVehicles(
        (data as any[]).map((v: any) => ({
          id: v.id,
          vehicleType: v.vehicleType ?? v.vehicle_type,
          vehicle_class: v.vehicle_class ?? v.vehicleClass ?? null,
          licensePlate: v.licensePlate ?? v.license_plate ?? '',
          brand: v.brand ?? '',
          model: v.model ?? '',
          year: v.year ?? 0,
          color: v.color ?? '',
          verification_status: v.verification_status,
        })),
      );
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemo]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const typeLabel = (v: VehicleItem) => {
    const t = VEHICLE_TYPE_LABELS[v.vehicleType as keyof typeof VEHICLE_TYPE_LABELS] ?? v.vehicleType;
    if (v.vehicleType === 'TRUCK' && v.vehicle_class && TRUCK_CLASS_LABELS[v.vehicle_class]) {
      return `${t} · ${TRUCK_CLASS_LABELS[v.vehicle_class]}`;
    }
    return t;
  };

  const statusLabel = (v: VehicleItem) => {
    const s = v.verification_status;
    if (s === 'APPROVED') return { text: 'Đã duyệt', color: Colors.success };
    if (s === 'REJECTED') return { text: 'Từ chối', color: Colors.error };
    return { text: 'Chờ duyệt', color: Colors.warning };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương tiện</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.gold]} />}
        >
          <Text style={styles.hint}>Thông tin theo giấy đăng ký xe / đăng kiểm. Chọn nhóm xe phù hợp để tính đúng bảng giá dịch vụ.</Text>

          {vehicles.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏍️</Text>
              <Text style={styles.emptyText}>Chưa có phương tiện nào</Text>
              <Text style={styles.emptySub}>Thêm xe để nhận đơn phù hợp với loại xe của bạn</Text>
            </View>
          ) : (
            vehicles.map((v) => {
              const status = statusLabel(v);
              return (
                <View key={v.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardPlate}>{v.licensePlate}</Text>
                    <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
                      <Text style={[styles.badgeText, { color: status.color }]}>{status.text}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardType}>{typeLabel(v)}</Text>
                  <Text style={styles.cardDetail}>{v.brand} {v.model} · {v.color} · {v.year}</Text>
                </View>
              );
            })
          )}

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => (navigation as any).navigate('AddVehicle')}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Thêm xe</Text>
          </TouchableOpacity>

          <View style={{ height: 80 }} />
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
  scrollContent: { padding: Spacing.l },
  hint: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.m },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyText: { ...Typography.h3, color: Colors.darkGray, marginBottom: Spacing.xs },
  emptySub: { ...Typography.secondary, color: Colors.gray },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  cardPlate: { ...Typography.h3, color: Colors.purpleDark },
  badge: { paddingHorizontal: Spacing.s, paddingVertical: 4, borderRadius: BorderRadius.small },
  badgeText: { ...Typography.caption, fontWeight: '600' },
  cardType: { ...Typography.body, color: Colors.black, marginBottom: 4 },
  cardDetail: { ...Typography.secondary, color: Colors.gray },
  addBtn: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.gold,
    alignItems: 'center',
  },
  addBtnText: { ...Typography.body, color: Colors.gold, fontWeight: '600' },
});
