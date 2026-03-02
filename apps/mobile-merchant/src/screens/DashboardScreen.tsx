import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import {
  MOCK_MERCHANT,
  MOCK_TODAY_REVENUE,
  MOCK_WEEKLY_REVENUE,
  MOCK_ORDERS,
} from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export const DashboardScreen = ({ navigation }: any) => {
  const [isOpen, setIsOpen] = useState(MOCK_MERCHANT.isOpen);
  const maxRevenue = Math.max(...MOCK_WEEKLY_REVENUE.map((d) => d.amount));
  const newOrders = MOCK_ORDERS.filter((o) => o.status === 'NEW').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🍜</Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.storeName}>{MOCK_MERCHANT.storeName}</Text>
              <Text style={styles.storeAddress} numberOfLines={1}>
                {MOCK_MERCHANT.address}
              </Text>
            </View>
          </View>
          <View style={styles.storeToggle}>
            <Text
              style={[
                styles.toggleLabel,
                { color: isOpen ? Colors.success : Colors.error },
              ]}
            >
              {isOpen ? 'Đang mở' : 'Đã đóng'}
            </Text>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: Colors.lightGray, true: Colors.success + '40' }}
              thumbColor={isOpen ? Colors.success : Colors.gray}
            />
          </View>
        </View>

        {/* ─── New Orders Alert ───────────────────────────── */}
        {newOrders > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation?.navigate('Orders')}
          >
            <Text style={styles.alertIcon}>🔔</Text>
            <Text style={styles.alertText}>
              Bạn có <Text style={styles.alertBold}>{newOrders} đơn mới</Text>{' '}
              cần xác nhận!
            </Text>
            <Text style={styles.alertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* ─── Today Stats ────────────────────────────────── */}
        <View style={styles.statsContainer}>
          <View style={styles.statsMainCard}>
            <Text style={styles.statsLabel}>Doanh thu hôm nay</Text>
            <Text style={styles.statsAmount}>
              {formatVND(MOCK_TODAY_REVENUE.totalRevenue)}
            </Text>
            <View style={styles.statsCompare}>
              <Text style={styles.statsUp}>📈 +15%</Text>
              <Text style={styles.statsCompareText}>so với hôm qua</Text>
            </View>
          </View>

          <View style={styles.miniStatsRow}>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatIcon}>📦</Text>
              <Text style={styles.miniStatValue}>
                {MOCK_TODAY_REVENUE.totalOrders}
              </Text>
              <Text style={styles.miniStatLabel}>Đơn hàng</Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatIcon}>💰</Text>
              <Text style={styles.miniStatValue}>
                {(MOCK_TODAY_REVENUE.averageOrderValue / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.miniStatLabel}>TB/đơn</Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatIcon}>👤</Text>
              <Text style={styles.miniStatValue}>
                {MOCK_TODAY_REVENUE.newCustomers}
              </Text>
              <Text style={styles.miniStatLabel}>KH mới</Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatIcon}>⭐</Text>
              <Text style={styles.miniStatValue}>
                {MOCK_MERCHANT.rating}
              </Text>
              <Text style={styles.miniStatLabel}>Đánh giá</Text>
            </View>
          </View>
        </View>

        {/* ─── Weekly Revenue Chart ───────────────────────── */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Doanh thu tuần</Text>
            <Text style={styles.chartTotal}>
              {formatVND(MOCK_WEEKLY_REVENUE.reduce((s, d) => s + d.amount, 0))}
            </Text>
          </View>
          <View style={styles.barChart}>
            {MOCK_WEEKLY_REVENUE.map((d, i) => {
              const isToday = i === 6;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barValue}>
                    {(d.amount / 1000000).toFixed(1)}M
                  </Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (d.amount / maxRevenue) * 100,
                        backgroundColor: isToday
                          ? Colors.gold
                          : Colors.gold + '40',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.barLabel,
                      isToday && { color: Colors.gold, fontWeight: '700' },
                    ]}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── Recent Orders ──────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn gần đây</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Orders')}>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_ORDERS.slice(0, 3).map((order) => {
            const statusConfig: Record<
              string,
              { color: string; bg: string; label: string }
            > = {
              NEW: { color: Colors.error, bg: '#FFEBEE', label: 'Mới' },
              PREPARING: {
                color: Colors.warning,
                bg: '#FFF3E0',
                label: 'Đang làm',
              },
              READY: {
                color: Colors.info,
                bg: '#E3F2FD',
                label: 'Sẵn sàng',
              },
              DELIVERING: {
                color: Colors.success,
                bg: '#E8F5E9',
                label: 'Đang giao',
              },
              COMPLETED: {
                color: Colors.gray,
                bg: Colors.offWhite,
                label: 'Hoàn thành',
              },
            };
            const sc = statusConfig[order.status] || statusConfig.NEW;

            return (
              <View key={order.id} style={styles.orderMiniCard}>
                <View style={styles.orderMiniHeader}>
                  <Text style={styles.orderMiniId}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.color }]}>
                      {sc.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderMiniCustomer}>
                  {order.customer} • {order.time}
                </Text>
                <Text style={styles.orderMiniItems}>
                  {order.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                </Text>
                <View style={styles.orderMiniFooter}>
                  <Text style={styles.orderMiniTotal}>
                    {formatVND(order.total)}
                  </Text>
                  <Text style={styles.orderMiniType}>
                    {order.deliveryType === 'DELIVERY' ? '🏍️ Giao hàng' : '🏪 Tự đến lấy'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ─── Quick Actions ──────────────────────────────── */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: '🍽️', label: 'Sản phẩm', screen: 'Products' },
              { icon: '📋', label: 'Đơn hàng', screen: 'Orders' },
              { icon: '⭐', label: 'Đánh giá', screen: 'Reviews' },
              { icon: '📊', label: 'Báo cáo', screen: null },
              { icon: '🎫', label: 'Khuyến mãi', screen: null },
              { icon: '💬', label: 'Chat', screen: null },
              { icon: '⚙️', label: 'Cài đặt', screen: null },
              { icon: '📞', label: 'Hỗ trợ', screen: null },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickItem}
                onPress={() => {
                  if (item.screen) navigation?.navigate(item.screen);
                }}
              >
                <View style={styles.quickIcon}>
                  <Text style={{ fontSize: 26 }}>{item.icon}</Text>
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.purpleDark,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  storeName: { ...Typography.h3, color: Colors.white },
  storeAddress: { ...Typography.caption, color: Colors.silver, marginTop: 2 },
  storeToggle: { alignItems: 'center' },
  toggleLabel: { ...Typography.caption, fontWeight: '600', marginBottom: 4 },

  // Alert
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  alertIcon: { fontSize: 20, marginRight: 8 },
  alertText: { ...Typography.secondary, color: Colors.darkGray, flex: 1 },
  alertBold: { fontWeight: '700', color: Colors.warning },
  alertArrow: { fontSize: 18, color: Colors.warning },

  // Stats
  statsContainer: { padding: Spacing.l },
  statsMainCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.level2,
  },
  statsLabel: { ...Typography.secondary, color: Colors.gray },
  statsAmount: { fontSize: 32, fontWeight: '700', color: Colors.purpleDark, marginVertical: Spacing.s },
  statsCompare: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statsUp: { ...Typography.secondary, color: Colors.success, fontWeight: '600' },
  statsCompareText: { ...Typography.caption, color: Colors.gray },

  miniStatsRow: {
    flexDirection: 'row',
    gap: Spacing.s,
    marginTop: Spacing.m,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    alignItems: 'center',
    ...Shadows.level1,
  },
  miniStatIcon: { fontSize: 20, marginBottom: 4 },
  miniStatValue: { ...Typography.h3, color: Colors.purpleDark },
  miniStatLabel: { ...Typography.tiny, color: Colors.gray, marginTop: 2 },

  // Chart
  chartSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  chartTitle: { ...Typography.h3, color: Colors.black },
  chartTotal: { ...Typography.body, color: Colors.gold, fontWeight: '700' },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
  },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: 4, minHeight: 4 },
  barLabel: { ...Typography.caption, color: Colors.gray, marginTop: 6 },
  barValue: { ...Typography.tiny, color: Colors.darkGray, fontWeight: '600', marginBottom: 4 },

  // Section
  section: { padding: Spacing.l },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  seeAll: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  // Order mini card
  orderMiniCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.l,
    marginBottom: Spacing.s,
    ...Shadows.level1,
  },
  orderMiniHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderMiniId: { ...Typography.secondary, color: Colors.gray, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusText: { ...Typography.caption, fontWeight: '700' },
  orderMiniCustomer: { ...Typography.secondary, color: Colors.black, fontWeight: '500', marginBottom: 4 },
  orderMiniItems: { ...Typography.caption, color: Colors.gray, marginBottom: 8 },
  orderMiniFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderMiniTotal: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  orderMiniType: { ...Typography.caption, color: Colors.gray },

  // Quick Actions
  quickActions: { paddingHorizontal: Spacing.l },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  quickItem: { width: (SCREEN_WIDTH - 32) / 4, alignItems: 'center', marginBottom: Spacing.l },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.large,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.level1,
    marginBottom: Spacing.xs,
  },
  quickLabel: { ...Typography.caption, color: Colors.darkGray, fontWeight: '500' },
});
