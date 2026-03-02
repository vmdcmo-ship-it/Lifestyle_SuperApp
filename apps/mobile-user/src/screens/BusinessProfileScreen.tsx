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
import { Button } from '../components/ui';

const BENEFITS = [
  {
    icon: '💰',
    title: 'Tối ưu hóa chi phí vận hành',
    desc: 'Phương pháp toàn diện giúp doanh nghiệp cắt giảm chi phí và tinh gọn quy trình quản lý.',
  },
  {
    icon: '🚐',
    title: 'Giải pháp vận chuyển toàn diện',
    desc: 'Cung cấp các giải pháp liền mạch cho việc vận chuyển của nhân viên, khách hàng VIP cho các sự kiện và hội nghị.',
  },
  {
    icon: '📊',
    title: 'Hệ thống Quản lý tối ưu 4.0',
    desc: 'Công nghệ hiện đại cùng giải pháp quản lý tối ưu được phát triển để phù hợp với nhu cầu doanh nghiệp của bạn.',
  },
  {
    icon: '📋',
    title: 'Tự động xuất hoá đơn',
    desc: 'Chuyến đi bằng Tài khoản Doanh nghiệp sẽ được tự động xuất hoá đơn về công ty.',
  },
  {
    icon: '🛡️',
    title: 'Bảo hiểm doanh nghiệp',
    desc: 'Quản lý BHXH, bảo hiểm sức khỏe cho toàn bộ nhân viên trên cùng một nền tảng.',
  },
];

const PACKAGES = [
  {
    id: 'starter',
    name: 'Gói Khởi nghiệp',
    employees: 'Dưới 10 nhân viên',
    price: 'Miễn phí',
    features: ['Đặt xe doanh nghiệp', 'Xuất hoá đơn tự động', 'Báo cáo chi tiêu cơ bản'],
    color: Colors.info,
  },
  {
    id: 'growth',
    name: 'Gói Tăng trưởng',
    employees: '10 - 50 nhân viên',
    price: '990,000đ/tháng',
    features: ['Tất cả tính năng Khởi nghiệp', 'Fleet management', 'Đồ ăn doanh nghiệp', 'BHXH tích hợp', 'Ưu tiên hỗ trợ'],
    color: Colors.gold,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Gói Doanh nghiệp',
    employees: 'Trên 50 nhân viên',
    price: 'Liên hệ',
    features: ['Tất cả tính năng Tăng trưởng', 'API tích hợp ERP/SAP', 'Account Manager riêng', 'SLA 99.9%', 'Bảo hiểm đoàn thể'],
    color: Colors.purpleDark,
  },
];

export const BusinessProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Hồ sơ doanh nghiệp</Text>
          <Text style={styles.heroSubtitle}>
            Chuyến đi bằng Tài khoản Doanh nghiệp sẽ được tự động xuất hoá đơn về công ty.
          </Text>
          <Text style={styles.heroIllustration}>🏢🚗💼</Text>
        </View>

        {/* Benefits */}
        {BENEFITS.map((b, i) => (
          <View key={i} style={styles.benefitRow}>
            <View style={styles.benefitIconWrap}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          </View>
        ))}

        {/* Business Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gói doanh nghiệp</Text>
          {PACKAGES.map((pkg) => (
            <View key={pkg.id} style={[styles.packageCard, { borderColor: pkg.color }]}>
              {pkg.popular && (
                <View style={[styles.popularTag, { backgroundColor: pkg.color }]}>
                  <Text style={styles.popularTagText}>Phổ biến nhất</Text>
                </View>
              )}
              <Text style={[styles.packageName, { color: pkg.color }]}>{pkg.name}</Text>
              <Text style={styles.packageEmployees}>{pkg.employees}</Text>
              <Text style={styles.packagePrice}>{pkg.price}</Text>
              {pkg.features.map((feat, i) => (
                <View key={i} style={styles.packageFeatureRow}>
                  <Text style={[styles.packageCheck, { color: pkg.color }]}>✓</Text>
                  <Text style={styles.packageFeatureText}>{feat}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Đăng ký hồ sơ doanh nghiệp"
            onPress={() => {}}
            size="large"
            style={{ width: '100%' }}
          />
          <Text style={styles.ctaNote}>
            Đội ngũ tư vấn sẽ liên hệ trong 24 giờ làm việc
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { padding: Spacing.l },

  hero: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xl },
  heroTitle: { ...Typography.h1, color: Colors.black },
  heroSubtitle: { ...Typography.secondary, color: Colors.gray, marginTop: 8, lineHeight: 22 },
  heroIllustration: { fontSize: 48, marginTop: Spacing.l, textAlign: 'center' },

  benefitRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    gap: Spacing.l,
    alignItems: 'flex-start',
  },
  benefitIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitIcon: { fontSize: 24 },
  benefitTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  benefitDesc: { ...Typography.secondary, color: Colors.gray, marginTop: 4, lineHeight: 20 },

  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xxl },
  sectionTitle: { ...Typography.h2, color: Colors.black, marginBottom: Spacing.l },

  packageCard: {
    borderWidth: 2,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.l,
    position: 'relative',
  },
  popularTag: {
    position: 'absolute',
    top: -1,
    right: Spacing.l,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  popularTagText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  packageName: { ...Typography.h3, fontWeight: '700' },
  packageEmployees: { ...Typography.secondary, color: Colors.gray, marginTop: 2 },
  packagePrice: { ...Typography.h2, color: Colors.black, marginTop: Spacing.s, fontWeight: '800' },
  packageFeatureRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  packageCheck: { fontSize: 14, fontWeight: '700' },
  packageFeatureText: { ...Typography.secondary, color: Colors.darkGray },

  ctaSection: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl, alignItems: 'center' },
  ctaNote: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.s },
});
