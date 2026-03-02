import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_ORDER_HISTORY, MOCK_ACTIVE_ORDER, isDemoDriverEmail } from '../data/mockData';
import { bookingService } from '../services/booking.service';
import { useAuth } from '../context/AuthContext';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

type OrderType = 'RIDE' | 'FOOD';
type HistoryItem = {
  id: string;
  type: OrderType;
  from: string;
  to: string;
  earnings: number;
  rating: number;
  time: string;
  status: string;
};

function mapHistoryItem(o: any): HistoryItem {
  return {
    id: o.id ?? o.bookingId ?? o._id,
    type: (o.type ?? o.serviceType ?? 'RIDE') as OrderType,
    from: o.pickupAddress ?? o.pickup?.address ?? o.origin ?? o.from ?? '',
    to: o.dropoffAddress ?? o.dropoff?.address ?? o.destination ?? o.to ?? '',
    earnings: o.earnings ?? o.amount ?? o.total ?? o.estimatedPrice ?? 0,
    rating: o.rating ?? o.customerRating ?? 0,
    time: o.completedAt ? new Date(o.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : (o.time ?? '—'),
    status: o.status ?? 'COMPLETED',
    customerName: o.customerName ?? o.customer?.name,
    customerPhone: o.customerPhone ?? o.customer?.phone,
    pickupLat: o.pickupLat ?? o.pickup?.lat ?? o.originLat,
    pickupLng: o.pickupLng ?? o.pickup?.lng ?? o.originLng,
    dropoffLat: o.dropoffLat ?? o.dropoff?.lat ?? o.destinationLat,
    dropoffLng: o.dropoffLng ?? o.dropoff?.lng ?? o.destinationLng,
  };
}

export const OrdersScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const isDemoAccount = isDemoDriverEmail(user?.email);
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [activeOrders, setActiveOrders] = useState<HistoryItem[]>([]);
  const [historyOrders, setHistoryOrders] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const historyRes = await bookingService.getHistory({ limit: 50 });
      const raw = historyRes?.data ?? (Array.isArray(historyRes) ? historyRes : []);
      const list = (Array.isArray(raw) ? raw : []).map((o: any) => mapHistoryItem(o));
      const activeStatuses = ['DRIVER_ASSIGNED', 'DRIVER_ARRIVING', 'PICKED_UP', 'IN_PROGRESS', 'SEARCHING_DRIVER', 'CONFIRMED'];
      const active = list.filter((o: any) => activeStatuses.includes(o.status));
      const history = list.filter((o: any) => o.status === 'COMPLETED' || o.status === 'CANCELLED');
      if (isDemoAccount) {
        const demoActive = active.length > 0 ? active : [mapHistoryItem(MOCK_ACTIVE_ORDER)];
        setActiveOrders(demoActive);
        setHistoryOrders(history.length > 0 ? history : MOCK_ORDER_HISTORY.map(mapHistoryItem));
      } else {
        setActiveOrders(active);
        setHistoryOrders(history);
      }
    } catch (e) {
      // Khi chuyển tab, không đăng xuất nếu API lỗi 401 — chỉ hiển thị rỗng để tránh thoát về màn đăng nhập.
      if (isDemoAccount) {
        setActiveOrders([]);
        setHistoryOrders(MOCK_ORDER_HISTORY.map(mapHistoryItem));
      } else {
        setActiveOrders([]);
        setHistoryOrders([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemoAccount]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'active' && styles.tabActive]}
            onPress={() => setTab('active')}
          >
            <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
              Đang thực hiện ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'history' && styles.tabActive]}
            onPress={() => setTab('history')}
          >
            <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
              Lịch sử
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && activeOrders.length === 0 && historyOrders.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders(true)}
            colors={[Colors.gold]}
          />
        }
      >
        {tab === 'active' && activeOrders.length === 0 && !isDemoAccount && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>Chưa có đơn đang thực hiện</Text>
            <Text style={styles.emptyStateText}>
              Vào tab Nhận đơn để chọn đơn từ chợ đơn. Khi bạn nhận đơn, đơn sẽ hiển thị tại đây.
            </Text>
          </View>
        )}
        {tab === 'active' &&
          activeOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() =>
                (navigation as any).navigate('OrderExecution', {
                  orderId: order.id,
                  type: order.type,
                  from: order.from,
                  to: order.to,
                  earnings: order.earnings,
                  customerName: order.customerName,
                  customerPhone: order.customerPhone,
                  pickupLat: order.pickupLat,
                  pickupLng: order.pickupLng,
                  dropoffLat: order.dropoffLat,
                  dropoffLng: order.dropoffLng,
                  status: order.status,
                })
              }
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View style={[styles.typeBadge, { backgroundColor: order.type === 'RIDE' ? Colors.gold + '20' : '#FF6B6B20' }]}>
                  <Text style={styles.typeIcon}>{order.type === 'RIDE' ? '🏍️' : '🍜'}</Text>
                  <Text style={[styles.typeText, { color: order.type === 'RIDE' ? Colors.gold : '#FF6B6B' }]}>
                    {order.type === 'RIDE' ? 'Chở khách' : 'Giao đồ ăn'}
                  </Text>
                </View>
                <Text style={styles.orderPrice}>{formatVND(order.earnings)}</Text>
              </View>
              <View style={styles.routeContainer}>
                <View style={styles.routeDots}>
                  <View style={styles.dotGreen} />
                  <View style={styles.dotLine} />
                  <View style={styles.dotRed} />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={styles.routePickup} numberOfLines={1}>{order.from}</Text>
                  <Text style={styles.routeDropoff} numberOfLines={1}>{order.to}</Text>
                </View>
              </View>
              <Text style={styles.metaItem}>🕐 {order.time}</Text>
              <Text style={styles.openHint}>Chạm để mở bản đồ thực hiện đơn →</Text>
            </TouchableOpacity>
          ))}

        {tab === 'history' && historyOrders.length === 0 && !isDemoAccount && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📜</Text>
            <Text style={styles.emptyStateTitle}>Chưa có lịch sử đơn</Text>
            <Text style={styles.emptyStateText}>
              Bạn cần hoàn thành hồ sơ (Giấy phép lái xe, loại xe, hình ảnh, CCCD, BHTNDS phương tiện) và được duyệt. Lịch sử sẽ hiển thị sau khi có chuyến đi thực tế.
            </Text>
          </View>
        )}
        {tab === 'history' &&
          historyOrders.map((order) => (
            <View key={order.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyType}>
                  {order.type === 'RIDE' ? '🏍️' : '🍜'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyRoute}>
                    {order.from} → {order.to}
                  </Text>
                  <Text style={styles.historyTime}>{order.time} hôm nay</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.historyEarning,
                      { color: order.status === 'CANCELLED' ? Colors.gray : Colors.success },
                    ]}
                  >
                    {order.status === 'CANCELLED' ? 'Đã hủy' : `+${formatVND(order.earnings)}`}
                  </Text>
                  {order.rating > 0 && (
                    <Text style={styles.historyRating}>⭐ {order.rating}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingTop: 48 },
  loadingText: { ...Typography.body, color: Colors.gray },

  header: { backgroundColor: Colors.white, padding: Spacing.l, paddingBottom: 0 },
  headerTitle: { ...Typography.h1, color: Colors.black, marginBottom: Spacing.m },
  tabs: { flexDirection: 'row' },
  tab: { paddingVertical: Spacing.m, paddingHorizontal: Spacing.l, marginRight: 4 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: Colors.gold },
  tabText: { ...Typography.body, color: Colors.gray },
  tabTextActive: { color: Colors.purpleDark, fontWeight: '600' },

  orderCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  typeIcon: { fontSize: 14 },
  typeText: { ...Typography.caption, fontWeight: '600' },
  orderPrice: { ...Typography.h2, color: Colors.purpleDark },

  routeContainer: { flexDirection: 'row', marginBottom: Spacing.m },
  routeDots: { alignItems: 'center', marginRight: 12, paddingTop: 4 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotLine: { width: 2, height: 24, backgroundColor: Colors.lightGray },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.red },
  routeInfo: { flex: 1, gap: 14 },
  routePickup: { ...Typography.secondary, color: Colors.black },
  routeDropoff: { ...Typography.secondary, color: Colors.black },
  openHint: { ...Typography.caption, color: Colors.gold, marginTop: Spacing.s },

  orderMeta: { flexDirection: 'row', gap: Spacing.l, marginBottom: Spacing.l },
  metaItem: { ...Typography.caption, color: Colors.gray },

  historyCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.s,
    borderRadius: BorderRadius.medium,
    padding: Spacing.l,
  },
  historyHeader: { flexDirection: 'row', alignItems: 'center' },
  historyType: { fontSize: 24, marginRight: 12 },
  historyRoute: { ...Typography.secondary, color: Colors.black, fontWeight: '500' },
  historyTime: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  historyEarning: { ...Typography.body, fontWeight: '700' },
  historyRating: { ...Typography.caption, color: Colors.gold, marginTop: 2 },
  emptyState: {
    margin: Spacing.xl,
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyStateTitle: { ...Typography.h3, color: Colors.darkGray, marginBottom: Spacing.s },
  emptyStateText: { ...Typography.secondary, color: Colors.gray, textAlign: 'center' },
});
