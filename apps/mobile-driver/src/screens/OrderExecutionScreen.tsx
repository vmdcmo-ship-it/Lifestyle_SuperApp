/**
 * Màn hình thực hiện đơn — bản đồ + luồng bước: Đến điểm đón → Đã đón → Đến điểm trả → Hoàn thành.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { DriverMapView, type LatLng, type OrderPin } from '../components/DriverMapView';
import { bookingService } from '../services/booking.service';
import { MOCK_ACTIVE_ORDER } from '../data/mockData';
import { isDemoDriverEmail } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

type OrderStep = 'DRIVER_ARRIVING' | 'PICKED_UP' | 'IN_PROGRESS' | 'COMPLETED';

type OrderExecutionParams = {
  orderId: string;
  type: string;
  from: string;
  to: string;
  earnings: number;
  customerName?: string;
  customerPhone?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  status?: string;
};

const DEFAULT_PICKUP: LatLng = { latitude: 10.7629, longitude: 106.6825 };
const DEFAULT_DROPOFF: LatLng = { latitude: 10.7769, longitude: 106.7009 };

const STEP_LABELS: Record<OrderStep, string> = {
  DRIVER_ARRIVING: 'Đi đến điểm đón',
  PICKED_UP: 'Đã đón khách / lấy hàng',
  IN_PROGRESS: 'Đi đến điểm trả',
  COMPLETED: 'Hoàn thành',
};

const STEP_BUTTON_LABELS: Record<OrderStep, string> = {
  DRIVER_ARRIVING: 'Tôi đã đến điểm đón',
  PICKED_UP: 'Đã lên xe / lấy hàng',
  IN_PROGRESS: 'Đã đến điểm trả',
  COMPLETED: '',
};

export function OrderExecutionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);

  const params = (route.params as OrderExecutionParams | undefined) ?? (MOCK_ACTIVE_ORDER as unknown as OrderExecutionParams);
  const orderId = params.orderId ?? params.id ?? MOCK_ACTIVE_ORDER.id;
  const pickup: LatLng =
    params.pickupLat != null && params.pickupLng != null
      ? { latitude: params.pickupLat, longitude: params.pickupLng }
      : DEFAULT_PICKUP;
  const dropoff: LatLng =
    params.dropoffLat != null && params.dropoffLng != null
      ? { latitude: params.dropoffLat, longitude: params.dropoffLng }
      : DEFAULT_DROPOFF;

  const orderPin: OrderPin = { id: orderId, pickup, dropoff, label: params.from };
  const [step, setStep] = useState<OrderStep>(
    (params.status as OrderStep) ?? 'DRIVER_ARRIVING',
  );
  const [completing, setCompleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleNextStep = useCallback(async () => {
    if (step === 'DRIVER_ARRIVING') {
      setUpdating(true);
      try {
        if (!isDemo) await bookingService.updateBookingStatus(orderId, 'PICKED_UP');
        setStep('PICKED_UP');
      } catch (e: any) {
        Alert.alert('Lỗi', e?.message ?? 'Không thể cập nhật trạng thái.');
      } finally {
        setUpdating(false);
      }
      return;
    }
    if (step === 'PICKED_UP') {
      setUpdating(true);
      try {
        if (!isDemo) await bookingService.updateBookingStatus(orderId, 'IN_PROGRESS');
        setStep('IN_PROGRESS');
      } catch (e: any) {
        Alert.alert('Lỗi', e?.message ?? 'Không thể cập nhật trạng thái.');
      } finally {
        setUpdating(false);
      }
      return;
    }
    if (step === 'IN_PROGRESS') {
      setCompleting(true);
      try {
        if (!isDemo) {
          await bookingService.completeOrder(orderId);
        }
        setStep('COMPLETED');
        Alert.alert(
          'Hoàn thành',
          `Đơn đã hoàn thành. Thu nhập: ${formatVND(params.earnings ?? 0)}`,
          [
            {
              text: 'Về danh sách đơn',
              onPress: () => (navigation as any).navigate('Orders'),
            },
          ],
        );
      } catch (e: any) {
        Alert.alert('Lỗi', e?.message ?? 'Không thể hoàn thành đơn.');
      } finally {
        setCompleting(false);
      }
    }
  }, [step, orderId, params.earnings, isDemo, navigation]);

  const isLoadingStep = updating || completing;

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Hủy đơn',
      'Bạn có chắc muốn hủy đơn này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy đơn',
          style: 'destructive',
          onPress: () => {
            if (!isDemo) {
              bookingService.cancelOrder(orderId, 'Tài xế hủy').catch(() => {});
            }
            (navigation as any).navigate('Orders');
          },
        },
      ],
    );
  }, [orderId, isDemo, navigation]);

  const currentStepIndex =
    step === 'DRIVER_ARRIVING'
      ? 0
      : step === 'PICKED_UP'
        ? 1
        : step === 'IN_PROGRESS'
          ? 2
          : 3;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation as any).goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thực hiện đơn</Text>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Hủy đơn</Text>
        </TouchableOpacity>
      </View>

      {/* Bản đồ */}
      <View style={styles.mapSection}>
        <DriverMapView
          mode="order"
          orders={[orderPin]}
          selectedOrderId={orderId}
          height={240}
        />
      </View>

      {/* Thông tin đơn + luồng bước */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Địa chỉ */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.dotGreen]} />
            <Text style={styles.routeAddress} numberOfLines={2}>
              {params.from}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.dotRed]} />
            <Text style={styles.routeAddress} numberOfLines={2}>
              {params.to}
            </Text>
          </View>
        </View>

        {/* Thanh tiến trình */}
        <View style={styles.progressBar}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  i <= currentStepIndex && styles.progressDotActive,
                ]}
              />
              {i < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    i < currentStepIndex && styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.stepLabel}>{STEP_LABELS[step]}</Text>

        {/* Nút hành động */}
        {step !== 'COMPLETED' && (
          <TouchableOpacity
            style={[styles.actionBtn, isLoadingStep && styles.actionBtnDisabled]}
            onPress={handleNextStep}
            disabled={isLoadingStep}
          >
            {isLoadingStep ? (
              <ActivityIndicator size="small" color={Colors.purpleDark} />
            ) : (
              <Text style={styles.actionBtnText}>
                {STEP_BUTTON_LABELS[step]}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Thông tin khách (nếu có) */}
        {(params.customerName || params.customerPhone) && (
          <View style={styles.customerCard}>
            <Text style={styles.customerLabel}>Khách hàng</Text>
            <Text style={styles.customerName}>{params.customerName ?? '—'}</Text>
            {params.customerPhone ? (
              <Text style={styles.customerPhone}>{params.customerPhone}</Text>
            ) : null}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
    borderBottomColor: Colors.offWhite,
  },
  backBtn: { minWidth: 80 },
  backBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.black },
  cancelBtn: { minWidth: 80, alignItems: 'flex-end' },
  cancelBtnText: { ...Typography.body, color: Colors.red, fontWeight: '600' },

  mapSection: { paddingHorizontal: Spacing.l, paddingTop: Spacing.m },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.l },

  routeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.l,
    ...Shadows.level2,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start' },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 6, marginRight: 12 },
  dotGreen: { backgroundColor: Colors.success },
  dotRed: { backgroundColor: Colors.red },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.lightGray,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeAddress: { ...Typography.body, color: Colors.black, flex: 1 },

  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.lightGray,
  },
  progressDotActive: { backgroundColor: Colors.gold },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 4,
  },
  progressLineActive: { backgroundColor: Colors.gold },
  stepLabel: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.l },

  actionBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  actionBtnDisabled: { opacity: 0.7 },
  actionBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '700' },

  customerCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    padding: Spacing.l,
  },
  customerLabel: { ...Typography.caption, color: Colors.gray, marginBottom: 4 },
  customerName: { ...Typography.body, color: Colors.black, fontWeight: '600' },
  customerPhone: { ...Typography.secondary, color: Colors.gray, marginTop: 2 },
});
