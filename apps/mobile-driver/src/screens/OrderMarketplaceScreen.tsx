/**
 * Màn "Nhận đơn" = chợ đơn (marketplace).
 * Tất cả đơn khách đặt đẩy vào đây; tài xế vào chọn đơn → nhận thì đơn chuyển sang tab "Đơn hàng" (Đang thực hiện).
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_AVAILABLE_ORDERS, MOCK_DRIVER, isDemoDriverEmail } from '../data/mockData';
import { bookingService } from '../services/booking.service';
import { driverService } from '../services/driver.service';
import { connectDriverSocket, disconnectDriverSocket } from '../services/socket.service';
import { DriverMapView, type OrderPin } from '../components/DriverMapView';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { canAcceptOrders } from '../constants/driverStatus';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

type OrderType = 'RIDE' | 'FOOD';
type MarketplaceOrder = {
  id: string;
  type: OrderType;
  pickup: string;
  dropoff: string;
  /** Tọa độ điểm đón (để hiển thị trên bản đồ). */
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  distance: number;
  distanceFromDriver?: number;
  estimatedPrice: number;
  codAmount?: number;
  senderNotes?: string;
  eta: string;
  customerName: string;
  customerRating: number;
};

function mapOrder(o: any): MarketplaceOrder {
  return {
    id: o.id ?? o.bookingId ?? o._id,
    type: (o.type ?? o.serviceType ?? 'RIDE') as OrderType,
    pickup: o.pickup?.address ?? o.pickupAddress ?? o.origin ?? o.pickup ?? '',
    dropoff: o.dropoff?.address ?? o.dropoffAddress ?? o.destination ?? o.dropoff ?? '',
    pickupLat: o.pickupLat ?? o.pickup?.lat ?? o.originLat,
    pickupLng: o.pickupLng ?? o.pickup?.lng ?? o.originLng,
    dropoffLat: o.dropoffLat ?? o.dropoff?.lat ?? o.destinationLat,
    dropoffLng: o.dropoffLng ?? o.dropoff?.lng ?? o.destinationLng,
    distance: o.distance ?? o.distanceKm ?? (typeof o.price === 'object' ? o.price?.distanceKm : undefined) ?? o.estimatedDistance ?? 0,
    distanceFromDriver: o.distanceFromDriver ?? o.distanceToPickup ?? o.distance,
    estimatedPrice: o.estimatedPrice ?? o.totalPrice ?? (typeof o.price === 'object' ? o.price?.totalPrice : o.price) ?? o.fare ?? 0,
    codAmount: o.codAmount ?? o.cod ?? o.cashOnDelivery ?? 0,
    senderNotes: o.senderNotes ?? o.notes ?? o.sender_notes ?? '',
    eta: o.eta ?? o.estimatedTime ?? '—',
    customerName: o.customerName ?? o.customer?.name ?? 'Khách',
    customerRating: o.customerRating ?? o.customer?.rating ?? 0,
  };
}

/** Chuyển đơn có tọa độ thành OrderPin cho bản đồ. */
function toOrderPins(orders: MarketplaceOrder[]): OrderPin[] {
  return orders
    .filter((o) => o.pickupLat != null && o.pickupLng != null && o.dropoffLat != null && o.dropoffLng != null)
    .map((o) => ({
      id: o.id,
      pickup: { latitude: o.pickupLat!, longitude: o.pickupLng! },
      dropoff: { latitude: o.dropoffLat!, longitude: o.dropoffLng! },
      label: o.pickup,
    }));
}

export function OrderMarketplaceScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const isDemo = isDemoDriverEmail(user?.email ?? null);
  const canGoOnline = isDemo || canAcceptOrders(profile?.status);

  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orderPins = toOrderPins(orders);

  const loadOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await bookingService.getAvailableOrders();
      const data = Array.isArray(res) ? res : (res?.data ?? []);
      setOrders(isDemo && data.length === 0 ? MOCK_AVAILABLE_ORDERS.map(mapOrder) : (data as any[]).map(mapOrder));
    } catch {
      setOrders(isDemo ? MOCK_AVAILABLE_ORDERS.map(mapOrder) : []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemo]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
      return () => {};
    }, [loadOrders]),
  );

  // WebSocket: đơn đẩy real-time khi online
  useFocusEffect(
    useCallback(() => {
      if (!isOnline || isDemo || !user?.id) return;
      connectDriverSocket(user.id, (data) => {
        setOrders((prev) => {
          if (prev.some((o) => o.id === (data.id ?? data.bookingId))) return prev;
          return [mapOrder(data), ...prev];
        });
      });
      return () => disconnectDriverSocket();
    }, [isOnline, isDemo, user?.id]),
  );

  const handleOnlineChange = useCallback(async (value: boolean) => {
    setIsOnline(value);
    if (isDemo) return;
    try {
      await driverService.updateStatus(value ? 'ONLINE' : 'OFFLINE');
    } catch {
      setIsOnline(!value);
    }
  }, [isDemo]);

  const handleAccept = useCallback(
    async (order: MarketplaceOrder) => {
      setAcceptingId(order.id);
      try {
        if (!isDemo) {
          await bookingService.acceptOrder(order.id);
        }
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
        (navigation as any).navigate('Orders', {
          screen: 'OrderExecution',
          params: {
            orderId: order.id,
            type: order.type,
            from: order.pickup,
            to: order.dropoff,
            earnings: order.estimatedPrice,
            pickupLat: order.pickupLat,
            pickupLng: order.pickupLng,
            dropoffLat: order.dropoffLat,
            dropoffLng: order.dropoffLng,
            status: 'DRIVER_ARRIVING',
          },
        });
      } catch (e: any) {
        Alert.alert('Lỗi', e?.message ?? 'Không thể nhận đơn.');
      } finally {
        setAcceptingId(null);
      }
    },
    [navigation, isDemo],
  );

  const handleReject = useCallback(async (orderId: string) => {
    setRejectingId(orderId);
    try {
      if (!isDemo) {
        await bookingService.rejectOrder(orderId);
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể từ chối.');
    } finally {
      setRejectingId(null);
    }
  }, [isDemo]);

  const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : user?.email ?? MOCK_DRIVER.name;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Banner phiên bản thử nghiệm */}
      <View style={styles.testBanner}>
        <Text style={styles.testBannerText}>🧪 Phiên bản thử nghiệm — Các tính năng đã sẵn sàng để test</Text>
      </View>
      {/* Header: avatar (→ Tài khoản) + Nhận đơn + Online toggle */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => (navigation as any).navigate('Profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'TX'}
            </Text>
          </View>
          <Text style={styles.headerTitle}>Nhận đơn</Text>
        </TouchableOpacity>
        <View style={styles.onlineWrap}>
          <Text style={[styles.onlineLabel, { color: isOnline ? Colors.success : Colors.gray }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={handleOnlineChange}
            disabled={!canGoOnline}
            trackColor={{ false: Colors.lightGray, true: Colors.success + '60' }}
            thumbColor={isOnline ? Colors.success : Colors.gray}
          />
        </View>
      </View>

      {!canGoOnline ? (
        <View style={styles.profileBlockedWrap}>
          <Text style={styles.profileBlockedIcon}>⏳</Text>
          <Text style={styles.profileBlockedTitle}>Chờ duyệt hồ sơ để nhận đơn</Text>
          <Text style={styles.profileBlockedText}>
            Hồ sơ của bạn đang chờ duyệt hoặc chưa được duyệt. Sau khi được kích hoạt, bạn có thể bật Online và nhận đơn tại đây.
          </Text>
          <TouchableOpacity
            style={styles.profileBlockedBtn}
            onPress={() => (navigation as any).navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.profileBlockedBtnText}>Xem trạng thái hồ sơ</Text>
          </TouchableOpacity>
        </View>
      ) : loading && orders.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải đơn...</Text>
        </View>
      ) : (
        <>
          {/* Bản đồ: vị trí tài xế + các đơn (điểm đón/trả) */}
          <View style={styles.mapWrap}>
            <DriverMapView
              mode="order"
              orders={orderPins}
              selectedOrderId={selectedOrderId ?? undefined}
              onOrderPinPress={setSelectedOrderId}
              height={220}
            />
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadOrders(true)} colors={[Colors.gold]} />
            }
          >
            {orders.length === 0 && !isDemo && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Chưa có đơn mới</Text>
              <Text style={styles.emptySub}>Bật Online và chờ đơn xuất hiện tại đây.</Text>
            </View>
          )}
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={[styles.card, selectedOrderId === order.id && styles.cardSelected]}
              onPress={() => setSelectedOrderId((id) => (id === order.id ? null : order.id))}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: order.type === 'RIDE' ? Colors.gold + '20' : '#FF6B6B20' }]}>
                  <Text style={styles.typeIcon}>{order.type === 'RIDE' ? '🏍️' : '🍜'}</Text>
                  <Text style={[styles.typeText, { color: order.type === 'RIDE' ? Colors.gold : '#FF6B6B' }]}>
                    {order.type === 'RIDE' ? 'Chở khách' : 'Giao đồ ăn'}
                  </Text>
                </View>
                <Text style={styles.price}>{formatVND(order.estimatedPrice)}</Text>
              </View>

              <View style={styles.route}>
                <View style={styles.dots}>
                  <View style={[styles.dot, styles.dotGreen]} />
                  <View style={styles.dotLine} />
                  <View style={[styles.dot, styles.dotRed]} />
                </View>
                <View style={styles.routeText}>
                  <Text style={styles.pickup} numberOfLines={1}>{order.pickup}</Text>
                  <Text style={styles.dropoff} numberOfLines={1}>{order.dropoff}</Text>
                </View>
              </View>

              <View style={styles.meta}>
                <Text style={styles.metaItem}>📍 Cách bạn {(order.distanceFromDriver ?? order.distance).toFixed(1)} km</Text>
                <Text style={styles.metaItem}>📏 Quãng đường {order.distance} km</Text>
                <Text style={styles.metaItem}>⏱️ {order.eta}</Text>
              </View>
              {order.codAmount != null && order.codAmount > 0 && (
                <View style={styles.codRow}>
                  <Text style={styles.codLabel}>COD cần ứng:</Text>
                  <Text style={styles.codValue}>{formatVND(order.codAmount)}</Text>
                </View>
              )}
              {order.senderNotes ? (
                <View style={styles.notesRow}>
                  <Text style={styles.notesLabel}>Ghi chú người gửi:</Text>
                  <Text style={styles.notesValue}>{order.senderNotes}</Text>
                </View>
              ) : null}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(order.id)}
                  disabled={!!acceptingId || !!rejectingId}
                >
                  {rejectingId === order.id ? (
                    <ActivityIndicator size="small" color={Colors.gray} />
                  ) : (
                    <Text style={styles.rejectText}>Từ chối</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAccept(order)}
                  disabled={!!acceptingId || !!rejectingId}
                >
                  {acceptingId === order.id ? (
                    <ActivityIndicator size="small" color={Colors.purpleDark} />
                  ) : (
                    <Text style={styles.acceptText}>Nhận đơn</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  testBanner: {
    backgroundColor: Colors.info + '20',
    paddingVertical: 8,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  testBannerText: { ...Typography.caption, color: Colors.info, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.purpleDark,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: Colors.purpleDark },
  headerTitle: { ...Typography.h3, color: Colors.white },
  onlineWrap: { alignItems: 'flex-end' },
  onlineLabel: { ...Typography.caption, fontWeight: '600', marginBottom: 2 },
  profileBlockedWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  profileBlockedIcon: { fontSize: 48, marginBottom: Spacing.m },
  profileBlockedTitle: { ...Typography.h3, color: Colors.purpleDark, marginBottom: Spacing.s, textAlign: 'center' },
  profileBlockedText: { ...Typography.body, color: Colors.darkGray, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  profileBlockedBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl * 2,
    borderRadius: BorderRadius.medium,
  },
  profileBlockedBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
  mapWrap: { paddingHorizontal: Spacing.l, paddingTop: Spacing.s, paddingBottom: Spacing.m },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.l },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl * 2 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyTitle: { ...Typography.h3, color: Colors.darkGray, marginBottom: Spacing.xs },
  emptySub: { ...Typography.secondary, color: Colors.gray },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.m },
  typeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.m, paddingVertical: 4, borderRadius: 20, gap: 4 },
  typeIcon: { fontSize: 14 },
  typeText: { ...Typography.caption, fontWeight: '600' },
  price: { ...Typography.h2, color: Colors.purpleDark },
  route: { flexDirection: 'row', marginBottom: Spacing.m },
  dots: { alignItems: 'center', marginRight: 12, paddingTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotGreen: { backgroundColor: Colors.success },
  dotRed: { backgroundColor: Colors.red },
  dotLine: { width: 2, height: 24, backgroundColor: Colors.lightGray },
  routeText: { flex: 1, gap: 4 },
  pickup: { ...Typography.secondary, color: Colors.black },
  dropoff: { ...Typography.secondary, color: Colors.black },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.m, marginBottom: Spacing.s },
  metaItem: { ...Typography.caption, color: Colors.gray },
  codRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  codLabel: { ...Typography.caption, color: Colors.gray },
  codValue: { ...Typography.body, fontWeight: '600', color: Colors.warning },
  notesRow: { marginBottom: Spacing.m },
  notesLabel: { ...Typography.caption, color: Colors.gray, marginBottom: 2 },
  notesValue: { ...Typography.secondary, color: Colors.darkGray, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: Spacing.m, marginTop: Spacing.m },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  rejectText: { ...Typography.body, color: Colors.gray, fontWeight: '600' },
  acceptBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.gold,
    alignItems: 'center',
  },
  acceptText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '700' },
});
