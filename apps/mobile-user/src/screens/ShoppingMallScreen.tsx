/**
 * ShoppingMallScreen - Shopping Mall Luxury E-commerce
 * Mục đại diện tương tự Gọi xe - Sàn TMĐT cao cấp KODO
 * The Essence of Luxury
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

import { WEB_BASE_URL } from '../config/api';

const MALL_WEB_URL = `${WEB_BASE_URL.replace(/\/$/, '')}/shopping-mall`;

const MALL_SECTIONS = [
  {
    id: 'gifting',
    title: 'Sử giá tặng quà',
    subtitle: 'Hamper • Hoa tươi • Gói quà thủ công',
    icon: '🎁',
    path: '/shopping-mall/gifting-concierge',
  },
  {
    id: 'boutiques',
    title: 'Boutiques',
    subtitle: 'Thời trang • Mỹ phẩm • Đồng hồ',
    icon: '👗',
    path: '/shopping-mall/boutiques',
  },
  {
    id: 'seller',
    title: 'Đăng ký bán hàng',
    subtitle: 'Trở thành đối tác nhà bán hàng',
    icon: '🏪',
    path: '/shopping-mall/dang-ky-ban-hang',
  },
];

export const ShoppingMallScreen = ({ navigation }: any) => {
  const openWeb = (path: string) => {
    Linking.openURL(`${MALL_WEB_URL.replace(/\/$/, '')}${path}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header - Serif elegant */}
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Mall</Text>
          <Text style={styles.tagline}>The Essence of Luxury</Text>
        </View>

        {/* Hero / CTA */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => openWeb('/shopping-mall')}
          activeOpacity={0.9}
        >
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Sàn TMĐT cao cấp</Text>
            <Text style={styles.heroSubtitle}>
              Thời trang hàng hiệu • Mỹ phẩm • Hamper • Hoa tươi
            </Text>
            <Text style={styles.heroCta}>Khám phá ngay →</Text>
          </View>
        </TouchableOpacity>

        {/* Sections */}
        <View style={styles.section}>
          {MALL_SECTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.sectionCard}
              onPress={() => openWeb(item.path)}
              activeOpacity={0.8}
            >
              <View style={styles.sectionIconWrap}>
                <Text style={styles.sectionIcon}>{item.icon}</Text>
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gift Widget CTA */}
        <View style={styles.giftWidget}>
          <View style={styles.giftWidgetHeader}>
            <Text style={styles.giftWidgetIcon}>🚗</Text>
            <Text style={styles.giftWidgetTitle}>Sử giá tặng quà</Text>
          </View>
          <Text style={styles.giftWidgetDesc}>
            Đặt Hamper, hoa tươi. Chọn thiệp, gói quà thủ công, giao xe hơi Premium.
          </Text>
          <TouchableOpacity
            style={styles.giftWidgetBtn}
            onPress={() => openWeb('/shopping-mall/gifting-concierge')}
          >
            <Text style={styles.giftWidgetBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.links}>
          <TouchableOpacity onPress={() => openWeb('/shopping-mall/dieu-khoan')}>
            <Text style={styles.linkText}>Điều khoản TMĐT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate('Shopping')
            }
          >
            <Text style={styles.linkText}>Mua sắm thường</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.m,
  },
  title: {
    fontSize: 28,
    fontWeight: '200',
    color: Colors.purpleDark,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
    fontStyle: 'italic',
  },
  heroCard: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    backgroundColor: '#2E1A47',
    ...Shadows.level2,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201, 162, 39, 0.15)',
  },
  heroContent: {
    padding: Spacing.l,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.purpleDark,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
  },
  heroCta: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gold,
    marginTop: 8,
  },
  section: { paddingHorizontal: Spacing.l },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  sectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.gold + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIcon: { fontSize: 24 },
  sectionText: { flex: 1, marginLeft: Spacing.m },
  sectionTitle: { ...Typography.body, fontWeight: '600', color: Colors.black },
  sectionSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  chevron: { fontSize: 20, color: Colors.lightGray },
  giftWidget: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.l,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    backgroundColor: Colors.gold + '08',
  },
  giftWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  giftWidgetIcon: { fontSize: 20 },
  giftWidgetTitle: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  giftWidgetDesc: { ...Typography.caption, color: Colors.gray },
  giftWidgetBtn: {
    marginTop: 12,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
  },
  giftWidgetBtnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.purpleDark,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: Spacing.xl,
  },
  linkText: {
    ...Typography.caption,
    color: Colors.gray,
    textDecorationLine: 'underline',
  },
});
