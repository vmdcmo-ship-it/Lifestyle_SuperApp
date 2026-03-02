import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_ORDERS } from '../data/mockData';

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

type OrderStatus = 'ALL' | 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  NEW: { color: Colors.error, bg: '#FFEBEE', label: 'Mới', icon: '🔴' },
  PREPARING: { color: Colors.warning, bg: '#FFF3E0', label: 'Đang làm', icon: '🟡' },
  READY: { color: Colors.info, bg: '#E3F2FD', label: 'Sẵn sàng', icon: '🔵' },
  DELIVERING: { color: Colors.success, bg: '#E8F5E9', label: 'Đang giao', icon: '🟢' },
  COMPLETED: { color: Colors.gray, bg: Colors.offWhite, label: 'Hoàn thành', icon: '⚪' },
};

export const OrdersScreen = () => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus>('ALL');

  const filteredOrders =
    filterStatus === 'ALL'
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter((o) => o.status === filterStatus);

  const statusCounts = MOCK_ORDERS.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Đơn hàng</Text>
        <Text style={styles.subtitle}>Hôm nay: {MOCK_ORDERS.length} đơn</Text>
      </View>

      {/* Status Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'ALL', label: 'Tất cả', count: MOCK_ORDERS.length },
          { key: 'NEW', label: 'Mới', count: statusCounts.NEW || 0 },
          { key: 'PREPARING', label: 'Đang làm', count: statusCounts.PREPARING || 0 },
          { key: 'READY', label: 'Sẵn sàng', count: statusCounts.READY || 0 },
          { key: 'DELIVERING', label: 'Đang giao', count: statusCounts.DELIVERING || 0 },
          { key: 'COMPLETED', label: 'Hoàn thành', count: statusCounts.COMPLETED || 0 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterChip,
              filterStatus === tab.key && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus(tab.key as OrderStatus)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === tab.key && styles.filterChipTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View
                style={[
                  styles.filterCount,
                  filterStatus === tab.key && styles.filterCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    filterStatus === tab.key && styles.filterCountTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => {
          const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.NEW;

          return (
            <View key={order.id} style={styles.orderCard}>
              {/* Header */}
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.orderIdRow}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusLabel, { color: sc.color }]}>
                        {sc.icon} {sc.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderCustomer}>
                    👤 {order.customer} • {order.time}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>{formatVND(order.total)}</Text>
              </View>

              {/* Items */}
              <View style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemQty}>{item.qty}x</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatVND(item.price * item.qty)}</Text>
                  </View>
                ))}
              </View>

              {/* Note */}
              {order.note ? (
                <View style={styles.noteBox}>
                  <Text style={styles.noteIcon}>📝</Text>
                  <Text style={styles.noteText}>{order.note}</Text>
                </View>
              ) : null}

              {/* Delivery info */}
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryType}>
                  {order.deliveryType === 'DELIVERY' ? '🏍️ Giao hàng' : '🏪 Tự đến lấy'}
                </Text>
                {order.driverName && (
                  <Text style={styles.driverInfo}>Tài xế: {order.driverName}</Text>
                )}
              </View>

              {/* Actions based on status */}
              <View style={styles.orderActions}>
                {order.status === 'NEW' && (
                  <>
                    <TouchableOpacity style={styles.rejectBtn}>
                      <Text style={styles.rejectText}>Từ chối</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <Text style={styles.acceptText}>✅ Xác nhận</Text>
                    </TouchableOpacity>
                  </>
                )}
                {order.status === 'PREPARING' && (
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Text style={styles.acceptText}>📦 Đã xong</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'READY' && (
                  <TouchableOpacity
                    style={[styles.acceptBtn, { backgroundColor: Colors.info }]}
                  >
                    <Text style={[styles.acceptText, { color: Colors.white }]}>
                      🏍️ Giao cho tài xế
                    </Text>
                  </TouchableOpacity>
                )}
                {order.status === 'DELIVERING' && (
                  <View style={styles.trackingInfo}>
                    <Text style={styles.trackingText}>
                      📍 Tài xế đang trên đường giao...
                    </Text>
                  </View>
                )}
                {order.status === 'COMPLETED' && (
                  <View style={styles.completedInfo}>
                    <Text style={styles.completedText}>✅ Hoàn thành</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Không có đơn hàng</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: { backgroundColor: Colors.white, padding: Spacing.l },
  title: { ...Typography.h1, color: Colors.black },
  subtitle: { ...Typography.caption, color: Colors.gray, marginTop: 4 },

  filterRow: { backgroundColor: Colors.white, maxHeight: 52 },
  filterContent: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.m, gap: Spacing.s },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    gap: 6,
  },
  filterChipActive: { backgroundColor: Colors.gold },
  filterChipText: { ...Typography.secondary, color: Colors.gray, fontWeight: '500' },
  filterChipTextActive: { color: Colors.purpleDark, fontWeight: '700' },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive: { backgroundColor: Colors.purpleDark },
  filterCountText: { ...Typography.tiny, color: Colors.gray, fontWeight: '700' },
  filterCountTextActive: { color: Colors.gold },

  orderCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  orderHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.m },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.s, marginBottom: 4 },
  orderId: { ...Typography.caption, color: Colors.gray, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusLabel: { ...Typography.caption, fontWeight: '700' },
  orderCustomer: { ...Typography.secondary, color: Colors.darkGray },
  orderTotal: { ...Typography.h3, color: Colors.purpleDark },

  itemsList: { borderTopWidth: 1, borderTopColor: Colors.offWhite, paddingTop: Spacing.m, gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemQty: { ...Typography.secondary, color: Colors.gold, fontWeight: '700', width: 30 },
  itemName: { ...Typography.secondary, color: Colors.black, flex: 1 },
  itemPrice: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500' },

  noteBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.m,
    gap: 8,
  },
  noteIcon: { fontSize: 14 },
  noteText: { ...Typography.caption, color: Colors.darkGray, flex: 1, fontStyle: 'italic' },

  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.m,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.offWhite,
  },
  deliveryType: { ...Typography.caption, color: Colors.gray },
  driverInfo: { ...Typography.caption, color: Colors.info, fontWeight: '500' },

  orderActions: { flexDirection: 'row', gap: Spacing.m, marginTop: Spacing.l },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  rejectText: { ...Typography.secondary, color: Colors.gray, fontWeight: '600' },
  acceptBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.gold,
    alignItems: 'center',
  },
  acceptText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },
  trackingInfo: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  trackingText: { ...Typography.secondary, color: Colors.success },
  completedInfo: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  completedText: { ...Typography.secondary, color: Colors.gray },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyText: { ...Typography.body, color: Colors.gray },
});
