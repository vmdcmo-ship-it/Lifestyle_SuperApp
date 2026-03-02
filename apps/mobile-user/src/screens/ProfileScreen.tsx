import React, { useState, useEffect } from 'react';
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
import { Avatar, Card, Badge } from '../components/ui';
import { MOCK_USER } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { loyaltyService } from '../services/loyalty.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [referralCode, setReferralCode] = useState(MOCK_USER.referralCode);

  useEffect(() => {
    (async () => {
      try {
        const res = await loyaltyService.getReferralInfo();
        if (res?.referralCode) setReferralCode(res.referralCode);
      } catch { /* keep mock */ }
    })();
  }, [user?.id]);

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Người dùng' : MOCK_USER.displayName;
  const phone = user?.phoneNumber || MOCK_USER.phone;
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════════════════════════════════════════════════
            1. USER HEADER + VERIFIED BADGE
        ═══════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Avatar name={displayName} size={64} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.displayName}>{displayName}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={{ fontSize: 10, color: Colors.white }}>✓</Text>
                </View>
              </View>
              <Text style={styles.phone}>{phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation?.navigate('AccountUpdate')}
            >
              <Text style={{ fontSize: 14, color: Colors.gray }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            2. COMMUNITY FUND BANNER (inspired by Quỹ Vì Tương Lai Xanh)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.fundBanner}>
          <View style={styles.fundBannerContent}>
            <Text style={styles.fundLabel}>Bạn đã đóng góp</Text>
            <Text style={styles.fundAmount}>125,000 VNĐ</Text>
            <Text style={styles.fundName}>vào Quỹ Lifestyle Care 💛</Text>
          </View>
          <View style={styles.fundQuickActions}>
            <TouchableOpacity
              style={styles.fundAction}
              onPress={() => navigation?.navigate('Wallet')}
            >
              <Text style={styles.fundActionIcon}>💳</Text>
              <Text style={styles.fundActionLabel}>Thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fundAction}
              onPress={() => navigation?.navigate('BusinessProfile')}
            >
              <Text style={styles.fundActionIcon}>🏢</Text>
              <Text style={styles.fundActionLabel}>Hồ sơ{'\n'}doanh nghiệp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fundAction}
              onPress={() => navigation?.navigate('FamilyAccount')}
            >
              <Text style={styles.fundActionIcon}>👨‍👩‍👧</Text>
              <Text style={styles.fundActionLabel}>Lifestyle{'\n'}Gia đình</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            3. GIFT CARD PROMO BANNER
        ═══════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.giftBanner}
          onPress={() => navigation?.navigate('GiftCard')}
        >
          <Text style={styles.giftEmoji}>🎁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.giftTitle}>Thẻ quà tặng Lifestyle</Text>
            <Text style={styles.giftSubtitle}>Gửi yêu thương, nhận Xu thưởng</Text>
          </View>
          <Text style={styles.giftArrow}>›</Text>
        </TouchableOpacity>

        {/* ═══════════════════════════════════════════════════
            4. MEMBERSHIP & BENEFITS (Hạng thành viên & Ưu đãi)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hạng thành viên & Ưu đãi</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="📦"
              label="Gói hội viên"
              badge="Mới"
              badgeColor={Colors.error}
              onPress={() => navigation?.navigate('Membership')}
            />
            <MenuItem icon="🎫" label="Mã Khuyến mại" badge="3" />
            <MenuItem
              icon="👑"
              label="Hạng thành viên"
              rightText="🥇 Vàng"
              rightColor={Colors.gold}
            />
            <MenuItem
              icon="🤝"
              label="Giới thiệu bạn bè"
              rightText={referralCode}
              rightColor={Colors.info}
              isLast
            />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            5. LIFESTYLE ECOSYSTEM (unique to our app)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hệ sinh thái Lifestyle</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="🏃"
              label="Run to Earn"
              rightText="🪙 2,450 Xu"
              rightColor={Colors.gold}
              onPress={() => navigation?.navigate('RunToEarn')}
            />
            <MenuItem
              icon="⭐"
              label="Spotlight của tôi"
              badge="12 lượt xem"
              badgeColor={Colors.info}
            />
            <MenuItem
              icon="🛡️"
              label="Bảo hiểm của tôi"
              onPress={() => navigation?.navigate('Insurance')}
            />
            <MenuItem
              icon="💰"
              label="Gói Tiết Kiệm"
              badge="Tiết kiệm 40%"
              badgeColor={Colors.success}
              isLast
            />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            6. PERSONAL INFO (Thông tin cá nhân)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="📋" label="Thông tin hoá đơn" />
            <MenuItem icon="📍" label="Địa chỉ đã lưu" badge="3" />
            <MenuItem icon="🔔" label="Thông báo" isLast />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            7. SUPPORT (Hỗ trợ)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="📜" label="Điều khoản và Chính sách" />
            <MenuItem icon="💬" label="Trung tâm hỗ trợ" />
            <MenuItem icon="⭐" label="Chia sẻ trải nghiệm với Lifestyle" />
            <MenuItem icon="🏛️" label="Thông tin công ty" isLast />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            8. COLLABORATION (Cơ hội hợp tác)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cơ hội hợp tác</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="🏍️" label="Trở thành tài xế Lifestyle" />
            <MenuItem icon="🏪" label="Đăng ký bán hàng trên Lifestyle" />
            <MenuItem icon="✍️" label="Trở thành Creator Spotlight" />
            <MenuItem icon="📢" label="Chương trình Affiliate" isLast />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            9. SETTINGS (Cài đặt chung)
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt chung</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="🌐"
              label="Ngôn ngữ"
              rightText="Tiếng Việt"
              onPress={() => navigation?.navigate('Language')}
            />
            <MenuItem
              icon="🔒"
              label="Đăng nhập & Bảo mật"
              onPress={() => navigation?.navigate('Security')}
              isLast
            />
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            10. SATISFACTION FEEDBACK
        ═══════════════════════════════════════════════════ */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackEmoji}>❤️</Text>
          <Text style={styles.feedbackTitle}>Bạn có hài lòng với ứng dụng chứ?</Text>
          <Text style={styles.feedbackSubtitle}>
            Đánh giá giúp chúng tôi cải thiện dịch vụ
          </Text>
          <View style={styles.feedbackStars}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s}>
                <Text style={styles.feedbackStar}>☆</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await logout();
            navigation?.reset({ index: 0, routes: [{ name: 'Auth' }] });
          }}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.version}>KODO v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Menu Item Component ────────────────────────────────────────────────────

const MenuItem = ({
  icon,
  label,
  badge,
  badgeColor,
  rightText,
  rightColor,
  isLast,
  onPress,
}: {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  rightText?: string;
  rightColor?: string;
  isLast?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
  >
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={styles.menuLabel}>{label}</Text>
    {badge && (
      <View style={[styles.menuBadge, { backgroundColor: (badgeColor || Colors.gold) + '20' }]}>
        <Text style={[styles.menuBadgeText, { color: badgeColor || Colors.gold }]}>
          {badge}
        </Text>
      </View>
    )}
    {rightText && (
      <Text style={[styles.menuRight, rightColor ? { color: rightColor } : {}]}>
        {rightText}
      </Text>
    )}
    <Text style={styles.menuChevron}>›</Text>
  </TouchableOpacity>
);

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: { backgroundColor: Colors.white, padding: Spacing.l },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: Spacing.l },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  displayName: { ...Typography.h2, color: Colors.black },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  editProfileBtn: { padding: 8 },

  // Fund banner
  fundBanner: {
    backgroundColor: Colors.white,
    marginHorizontal: 0,
    paddingBottom: Spacing.l,
  },
  fundBannerContent: {
    marginHorizontal: Spacing.l,
    backgroundColor: '#E8F5E9',
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  fundLabel: { ...Typography.caption, color: Colors.darkGray },
  fundAmount: { fontSize: 24, fontWeight: '800', color: Colors.purpleDark, marginTop: 2 },
  fundName: { ...Typography.caption, color: Colors.success, marginTop: 2 },
  fundQuickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: Spacing.xl,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.m,
    ...Shadows.level2,
  },
  fundAction: { alignItems: 'center', width: 80 },
  fundActionIcon: { fontSize: 24, marginBottom: 4 },
  fundActionLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Gift banner
  giftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
    gap: Spacing.m,
  },
  giftEmoji: { fontSize: 36 },
  giftTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  giftSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  giftArrow: { fontSize: 20, color: Colors.gray },

  // Sections
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.l },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.darkGray,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.s,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level1,
  },

  // Menu item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.offWhite },
  menuIcon: { fontSize: 20, marginRight: Spacing.m, width: 28, textAlign: 'center' },
  menuLabel: { ...Typography.body, color: Colors.black, flex: 1 },
  menuBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
  },
  menuBadgeText: { ...Typography.caption, fontWeight: '700' },
  menuRight: { ...Typography.secondary, color: Colors.gray, fontWeight: '500', marginRight: 4 },
  menuChevron: { fontSize: 20, color: Colors.lightGray },

  // Feedback
  feedbackCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.level1,
  },
  feedbackEmoji: { fontSize: 32, marginBottom: Spacing.s },
  feedbackTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  feedbackSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  feedbackStars: { flexDirection: 'row', gap: 12, marginTop: Spacing.m },
  feedbackStar: { fontSize: 32, color: Colors.gold },

  // Logout
  logoutBtn: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.l,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  logoutText: { ...Typography.body, color: Colors.red, fontWeight: '600' },
  version: { ...Typography.caption, color: Colors.gray, textAlign: 'center', marginTop: Spacing.l },
});
