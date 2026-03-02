import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_MERCHANT } from '../data/mockData';

export const MerchantProfileScreen = () => {
  const menuItems = [
    { icon: '🏪', label: 'Thông tin cửa hàng' },
    { icon: '🕐', label: 'Giờ mở cửa' },
    { icon: '💳', label: 'Tài khoản ngân hàng' },
    { icon: '💰', label: 'Ví & Rút tiền' },
    { icon: '📊', label: 'Phân tích & Báo cáo' },
    { icon: '🎫', label: 'Quản lý khuyến mãi' },
    { icon: '👥', label: 'Nhân viên' },
    { icon: '🛡️', label: 'Bảo hiểm' },
    { icon: '🔔', label: 'Thông báo' },
    { icon: '⚙️', label: 'Cài đặt' },
    { icon: '📞', label: 'Hỗ trợ' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.storeAvatar}>
            <Text style={{ fontSize: 36 }}>🍜</Text>
          </View>
          <Text style={styles.storeName}>{MOCK_MERCHANT.storeName}</Text>
          <Text style={styles.storeCategory}>
            {MOCK_MERCHANT.category === 'RESTAURANT' ? '🍽️ Nhà hàng' : MOCK_MERCHANT.category}
          </Text>
          <Text style={styles.storeAddress}>{MOCK_MERCHANT.address}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {MOCK_MERCHANT.rating}</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_MERCHANT.totalOrders}</Text>
              <Text style={styles.statLabel}>Đơn hàng</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_MERCHANT.totalReviews}</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuBorder]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Lifestyle Merchant v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.purpleDark,
    padding: Spacing.xl,
    alignItems: 'center',
    paddingBottom: Spacing.xxl + 16,
  },
  storeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  storeName: { ...Typography.h2, color: Colors.white },
  storeCategory: { ...Typography.secondary, color: Colors.gold, marginTop: 4 },
  storeAddress: { ...Typography.caption, color: Colors.silver, marginTop: 4, textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  statValue: { ...Typography.h3, color: Colors.gold },
  statLabel: { ...Typography.caption, color: Colors.silver, marginTop: 4 },

  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: -16,
    borderRadius: BorderRadius.large,
    ...Shadows.level2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.offWhite },
  menuIcon: { fontSize: 20, marginRight: Spacing.m },
  menuLabel: { ...Typography.body, color: Colors.black, flex: 1 },
  menuChevron: { fontSize: 20, color: Colors.gray },

  logoutBtn: {
    margin: Spacing.l,
    marginTop: Spacing.xl,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  logoutText: { ...Typography.body, color: Colors.red, fontWeight: '600' },
  version: { ...Typography.caption, color: Colors.gray, textAlign: 'center', marginTop: Spacing.m },
});
