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

type GiftTab = 'unused' | 'sent' | 'used' | 'expired';

const MOCK_GIFT_CARDS = [
  { id: 'g1', name: 'Voucher giảm 50K đặt xe', value: 50000, from: 'Nguyễn Minh', status: 'unused', expiry: '28/02/2026' },
  { id: 'g2', name: 'Thẻ quà Đồ ăn 100K', value: 100000, from: 'Chương trình Tết', status: 'unused', expiry: '15/03/2026' },
  { id: 'g3', name: 'Voucher Bảo hiểm -20%', value: null, from: 'Giới thiệu bạn bè', status: 'used', expiry: '01/02/2026' },
];

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export const GiftCardScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<GiftTab>('unused');

  const tabs: { key: GiftTab; label: string }[] = [
    { key: 'unused', label: 'Chưa sử dụng' },
    { key: 'sent', label: 'Đã gửi tặng' },
    { key: 'used', label: 'Đã sử dụng' },
    { key: 'expired', label: 'Hết hạn' },
  ];

  const filtered = MOCK_GIFT_CARDS.filter((g) => g.status === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thẻ quà của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          filtered.map((card) => (
            <View key={card.id} style={styles.giftCard}>
              <View style={styles.giftLeft}>
                <Text style={styles.giftEmoji}>🎁</Text>
              </View>
              <View style={styles.giftContent}>
                <Text style={styles.giftName}>{card.name}</Text>
                {card.value && (
                  <Text style={styles.giftValue}>{formatVND(card.value)}</Text>
                )}
                <Text style={styles.giftFrom}>Từ: {card.from}</Text>
                <Text style={styles.giftExpiry}>HSD: {card.expiry}</Text>
              </View>
              {card.status === 'unused' && (
                <TouchableOpacity style={styles.useBtn}>
                  <Text style={styles.useBtnText}>Dùng ngay</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'unused'
                ? 'Chưa có thẻ quà tặng trong đây, mua ngay thẻ mới niềm vui tràn đầy!'
                : activeTab === 'sent'
                ? 'Bạn chưa gửi thẻ quà nào.'
                : activeTab === 'used'
                ? 'Chưa có thẻ đã sử dụng.'
                : 'Không có thẻ hết hạn.'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.buyLink}>Mua thẻ quà tặng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Buy section */}
        <View style={styles.buySection}>
          <Text style={styles.buyTitle}>Mua thẻ quà tặng mới</Text>
          <View style={styles.buyGrid}>
            {[
              { value: 50000, label: '50K', color: '#FFB6C1' },
              { value: 100000, label: '100K', color: '#87CEEB' },
              { value: 200000, label: '200K', color: '#98FB98' },
              { value: 500000, label: '500K', color: Colors.gold },
            ].map((item) => (
              <TouchableOpacity key={item.value} style={[styles.buyCard, { borderColor: item.color }]}>
                <Text style={styles.buyEmoji}>🎁</Text>
                <Text style={[styles.buyValue, { color: item.color }]}>{item.label}</Text>
                <Text style={styles.buyPrice}>{formatVND(item.value)}</Text>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },

  tabsScroll: { backgroundColor: Colors.white, maxHeight: 50 },
  tabsContent: { paddingHorizontal: Spacing.l, gap: Spacing.s, paddingBottom: Spacing.m },
  tab: {
    paddingHorizontal: Spacing.l,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
  },
  tabActive: { backgroundColor: Colors.purpleDark },
  tabText: { ...Typography.secondary, color: Colors.gray, fontWeight: '500' },
  tabTextActive: { color: Colors.white, fontWeight: '700' },

  giftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  giftLeft: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.gold + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  giftEmoji: { fontSize: 28 },
  giftContent: { flex: 1 },
  giftName: { ...Typography.body, fontWeight: '600', color: Colors.black },
  giftValue: { ...Typography.h3, color: Colors.gold, marginTop: 2 },
  giftFrom: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  giftExpiry: { ...Typography.caption, color: Colors.gray },
  useBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.m,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  useBtnText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '700' },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.l },
  emptyText: {
    ...Typography.body,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    lineHeight: 22,
  },
  buyLink: { ...Typography.body, color: Colors.gold, fontWeight: '700', marginTop: Spacing.l },

  buySection: { padding: Spacing.l, marginTop: Spacing.xl },
  buyTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  buyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.m },
  buyCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.level1,
  },
  buyEmoji: { fontSize: 32, marginBottom: 4 },
  buyValue: { fontSize: 24, fontWeight: '800' },
  buyPrice: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
});
