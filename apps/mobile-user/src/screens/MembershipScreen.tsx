import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

const MEMBERSHIP_PACKAGES = [
  {
    id: 'family-unlimited',
    badge: 'x120',
    badgeColor: Colors.gold,
    saving: 'Tiết kiệm lên đến 5.000.000 VNĐ',
    name: '[Gói gia đình] Lifestyle Không Giới Hạn',
    price: 59167,
    period: 'tháng',
    trial: '1 tháng dùng thử',
    features: ['Xe máy + Ô tô + Đồ ăn không giới hạn', 'Chia sẻ tối đa 5 thành viên', 'Xu x2 cho mọi giao dịch'],
    popular: true,
  },
  {
    id: 'savings',
    badge: 'x20',
    badgeColor: Colors.info,
    saving: 'Tiết kiệm lên đến 1.500.000 VNĐ',
    name: 'Gói Hội Viên | Lifestyle Tiết Kiệm',
    price: 49000,
    period: null,
    trial: null,
    features: ['20 mã giảm giá đa dịch vụ', 'Freeship đơn từ 30K', 'Ưu tiên kết nối tài xế'],
    popular: false,
  },
  {
    id: 'personal-unlimited',
    badge: 'x80',
    badgeColor: Colors.success,
    saving: '80 mã Xe/Đồ ăn, tiết kiệm tới 2 triệu đồng',
    name: '[Gói cá nhân] Lifestyle Không Giới Hạn',
    price: 35000,
    period: 'tháng',
    trial: '1 tháng dùng thử',
    features: ['Xe máy + Đồ ăn không giới hạn', 'Xu bonus mỗi chuyến đi', 'Run to Earn xu x1.5'],
    popular: false,
  },
  {
    id: 'insurance-combo',
    badge: '🛡️',
    badgeColor: Colors.purpleDark,
    saving: 'Tiết kiệm 30% so với mua lẻ',
    name: 'Gói An Tâm | Bảo hiểm + Đi lại',
    price: 99000,
    period: 'tháng',
    trial: null,
    features: ['BHXH tự nguyện hỗ trợ đóng', 'TNDS xe máy cả năm', '10 mã giảm giá đặt xe', 'Tư vấn bảo hiểm miễn phí'],
    popular: false,
  },
];

export const MembershipScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'family' | 'other'>('all');

  const filteredPackages =
    filter === 'all'
      ? MEMBERSHIP_PACKAGES
      : filter === 'family'
      ? MEMBERSHIP_PACKAGES.filter((p) => p.id.includes('family'))
      : MEMBERSHIP_PACKAGES.filter((p) => !p.id.includes('family'));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title area */}
        <View style={styles.titleArea}>
          <Text style={styles.title}>Gói hội viên</Text>
          <Text style={styles.subtitle}>Đăng ký để nhận nhiều ưu đãi!</Text>
          <Text style={styles.crownEmoji}>👑</Text>
        </View>

        {/* Filter tabs + My packages */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Khám phá</Text>
          <TouchableOpacity>
            <Text style={styles.myPackages}>Gói của tôi 🕐</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filterChips}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'family', label: 'Gia đình' },
            { key: 'other', label: 'Khác' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key as any)}
            >
              <Text
                style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Packages */}
        {filteredPackages.map((pkg) => (
          <TouchableOpacity key={pkg.id} style={styles.packageCard}>
            {/* Badge */}
            <View style={[styles.packageBadge, { backgroundColor: pkg.badgeColor }]}>
              <Text style={styles.packageBadgeText}>{pkg.badge}</Text>
            </View>

            {/* Content */}
            <View style={styles.packageContent}>
              {/* Saving line */}
              <Text style={styles.packageSaving}>{pkg.saving}</Text>

              {/* Name */}
              <Text style={styles.packageName}>{pkg.name}</Text>

              {/* Features */}
              {pkg.features.map((feat, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}

              {/* Price */}
              <View style={styles.priceRow}>
                <Text style={styles.priceFrom}>Từ </Text>
                <Text style={styles.priceAmount}>{formatVND(pkg.price)}đ</Text>
                {pkg.period && <Text style={styles.pricePeriod}>/{pkg.period}</Text>}
              </View>

              {/* Trial */}
              {pkg.trial && (
                <Text style={styles.trialText}>{pkg.trial}</Text>
              )}

              {/* Popular badge */}
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>🔥 Phổ biến nhất</Text>
                </View>
              )}
            </View>

            <Text style={styles.packageChevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Bottom note */}
        <Text style={styles.bottomNote}>
          Hãy theo dõi thông báo để không bỏ lỡ các gói hội viên với ưu đãi hấp dẫn nhất!
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: { padding: Spacing.l },

  titleArea: { paddingHorizontal: Spacing.l, position: 'relative' },
  title: { ...Typography.h1, color: Colors.black },
  subtitle: { ...Typography.secondary, color: Colors.gray, marginTop: 4 },
  crownEmoji: { position: 'absolute', right: Spacing.l, top: 0, fontSize: 48 },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.xl,
  },
  filterLabel: { ...Typography.h3, color: Colors.black },
  myPackages: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.s,
    marginTop: Spacing.m,
    marginBottom: Spacing.l,
  },
  filterChip: {
    paddingHorizontal: Spacing.l,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  filterChipActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  filterChipText: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500' },
  filterChipTextActive: { color: Colors.white },

  packageCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    position: 'relative',
  },
  packageBadge: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  packageBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  packageContent: { flex: 1 },
  packageSaving: { ...Typography.caption, color: Colors.success, fontWeight: '500' },
  packageName: { ...Typography.body, fontWeight: '700', color: Colors.black, marginTop: 4, paddingRight: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  featureCheck: { fontSize: 12, color: Colors.success },
  featureText: { ...Typography.caption, color: Colors.darkGray },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: Spacing.m },
  priceFrom: { ...Typography.secondary, color: Colors.gray },
  priceAmount: { fontSize: 20, fontWeight: '800', color: Colors.black },
  pricePeriod: { ...Typography.secondary, color: Colors.gray },
  trialText: { ...Typography.caption, color: Colors.gold, fontWeight: '600', marginTop: 4 },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.s,
  },
  popularText: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },
  packageChevron: { fontSize: 20, color: Colors.lightGray, alignSelf: 'center' },

  bottomNote: {
    ...Typography.caption,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.l,
  },
});
