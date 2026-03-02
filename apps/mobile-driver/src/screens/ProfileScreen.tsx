import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { normalizeAvatarUrl } from '../services/api';
import { MOCK_DRIVER, isDemoDriverEmail } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { ComingSoonModal } from '../components/ComingSoonModal';
import { DRIVER_STATUS } from '../constants/driverStatus';

export const DriverProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { profile: sharedProfile, loading } = useProfile();
  const isDemoAccount = isDemoDriverEmail(user?.email);

  // Ánh xạ từ DriverProfile (shared) sang shape màn hình cần
  const rawName = sharedProfile
    ? [sharedProfile.firstName, sharedProfile.lastName].filter(Boolean).join(' ') ||
      sharedProfile.email ||
      ''
    : '';

  const profile = isDemoAccount
    ? {
        name: MOCK_DRIVER.name,
        phone: MOCK_DRIVER.phone,
        rating: MOCK_DRIVER.rating,
        totalTrips: MOCK_DRIVER.totalTrips,
        memberSince: MOCK_DRIVER.memberSince,
        vehiclePlate: MOCK_DRIVER.vehiclePlate,
        vehicleType: MOCK_DRIVER.vehicleType,
        avatar_url: sharedProfile?.avatar_url,
      }
    : {
        name: rawName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : user?.email ?? ''),
        phone: sharedProfile?.phoneNumber,
        rating: sharedProfile?.rating ?? 0,
        totalTrips: sharedProfile?.totalTrips ?? 0,
        memberSince: sharedProfile?.memberSince,
        vehiclePlate: sharedProfile?.vehiclePlate,
        vehicleType: sharedProfile?.vehicleType,
        avatar_url: sharedProfile?.avatar_url,
      };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const [avatarLoadError, setAvatarLoadError] = useState(false);
  // Reset lỗi khi URL thay đổi
  useEffect(() => { setAvatarLoadError(false); }, [profile?.avatar_url]);

  const displayName =
    profile?.name ??
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.email ?? '');
  const displayPhone = profile?.phone ?? (isDemoAccount ? MOCK_DRIVER.phone : '—');
  const displayRating = profile?.rating ?? (isDemoAccount ? MOCK_DRIVER.rating : 0);
  const displayTrips = profile?.totalTrips ?? (isDemoAccount ? MOCK_DRIVER.totalTrips : 0);
  const displayMemberSince = profile?.memberSince ?? (isDemoAccount ? MOCK_DRIVER.memberSince : undefined);
  const hasVehicle = !!(profile?.vehiclePlate ?? profile?.vehicleType);
  const isNewDriver = !isDemoAccount && !hasVehicle;

  const tabNav = navigation.getParent()?.getParent();

  type MenuItem = { icon: string; label: string; screen?: string; tab?: string; subItems?: MenuItem[]; comingSoon?: boolean };
  type Section = { title?: string; items: MenuItem[] };

  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);

  const sections: Section[] = [
    {
      title: undefined,
      items: [
        { icon: '🏅', label: 'Hạng thành viên', comingSoon: true },
        { icon: '🛡️', label: 'Bảo hiểm', screen: 'Insurance' },
      ],
    },
    {
      title: 'Tài xế thân thiết',
      items: [
        { icon: '🤝', label: 'Giới thiệu & nhận thưởng', comingSoon: true },
        { icon: '🏆', label: 'Thi đua tài xế', comingSoon: true },
        { icon: '🎖️', label: 'Thưởng tuần', comingSoon: true },
      ],
    },
    {
      title: 'Sổ tay và Đào tạo',
      items: [
        { icon: '📖', label: 'Sổ tay trực tuyến', comingSoon: true },
        { icon: '🎓', label: 'Đào tạo trực tuyến', comingSoon: true },
      ],
    },
    {
      title: 'Tổng quát',
      items: [
        {
          icon: '👤',
          label: 'Thông tin tài khoản',
          screen: 'AccountInfo',
          subItems: [
            { icon: '🏍️', label: 'Phương tiện', screen: 'Vehicles' },
            { icon: '📄', label: 'Cập nhật giấy tờ', screen: 'UpdateDocuments' },
          ],
        },
        { icon: '📑', label: 'Bảng giá', screen: 'Pricing' },
        { icon: '❓', label: 'Câu hỏi thường gặp', screen: 'FAQ' },
        { icon: '🎧', label: 'Tổng đài hỗ trợ', screen: 'SupportHotline' },
        { icon: '📥', label: 'Cài đặt nhận đơn', screen: 'OrderReceivingSettings' },
        { icon: '⚙️', label: 'Cài đặt', screen: 'Settings' },
      ],
    },
  ];

  const handleMenuPress = (item: { icon: string; label: string; screen?: string; tab?: string }) => {
    if (item.screen === 'Settings') {
      (navigation as any).navigate('Settings');
      return;
    }
    if (item.screen === 'OrderReceivingSettings') {
      (navigation as any).navigate('OrderReceivingSettings');
      return;
    }
    if (item.screen === 'AccountInfo') {
      (navigation as any).navigate('AccountInfo');
      return;
    }
    if (item.screen === 'UpdateDocuments') {
      (navigation as any).navigate('UpdateDocuments');
      return;
    }
    if (item.screen === 'Pricing') {
      (navigation as any).navigate('Pricing');
      return;
    }
    if (item.screen === 'FAQ') {
      (navigation as any).navigate('FAQ');
      return;
    }
    if (item.screen === 'SupportHotline') {
      (navigation as any).navigate('SupportHotline');
      return;
    }
    if (item.screen === 'Insurance') {
      (navigation as any).navigate('Insurance');
      return;
    }
    if (item.screen === 'Vehicles') {
      (navigation as any).navigate('Vehicles');
      return;
    }
    if (item.tab && tabNav) {
      (tabNav as any).navigate(item.tab);
      return;
    }
    if (!item.screen && !item.tab) {
      setComingSoonFeature(item.label);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header: chạm vào ảnh đại diện hoặc tên để mở Thông tin tài khoản */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => (navigation as any).navigate('AccountInfo')}
          activeOpacity={0.9}
          accessibilityLabel="Tài khoản. Chạm để xem hoặc sửa thông tin."
          accessibilityRole="button"
        >
          <View style={styles.avatarLarge}>
            {profile?.avatar_url && !avatarLoadError ? (
              <Image
                key={profile.avatar_url}
                source={{ uri: normalizeAvatarUrl(profile.avatar_url) ?? profile.avatar_url }}
                style={styles.avatarLargeImg}
                onError={() => setAvatarLoadError(true)}
              />
            ) : (
              <Text style={styles.avatarLargeText}>
                {displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'TX'}
              </Text>
            )}
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.phone}>{displayPhone}</Text>
          <Text style={styles.headerHint}>Chạm để xem thông tin tài khoản</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {displayRating}</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{displayTrips}</Text>
              <Text style={styles.statLabel}>Chuyến đi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {displayMemberSince ? new Date(displayMemberSince).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : '—'}
              </Text>
              <Text style={styles.statLabel}>Tham gia</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuCard}>
          {!isDemoAccount && profile?.status === DRIVER_STATUS.PENDING_VERIFICATION && (
            <View style={[styles.newDriverBanner, styles.statusBannerPending]}>
              <Text style={styles.newDriverBannerTitle}>⏳ Hồ sơ đang chờ duyệt</Text>
              <Text style={styles.newDriverBannerText}>
                Bạn sẽ nhận được thông báo khi có kết quả. Thời gian duyệt thường từ 1–3 ngày làm việc.
              </Text>
            </View>
          )}
          {!isDemoAccount && profile?.status === DRIVER_STATUS.INACTIVE && (
            <TouchableOpacity
              style={[styles.newDriverBanner, styles.statusBannerRejected]}
              onPress={() => (navigation as any).navigate('UpdateDocuments')}
              activeOpacity={0.9}
            >
              <Text style={styles.newDriverBannerTitle}>❌ Hồ sơ chưa được duyệt</Text>
              <Text style={styles.newDriverBannerText}>
                {profile?.rejectionReason || 'Không đạt yêu cầu xác minh.'} Vui lòng cập nhật và gửi lại hồ sơ.
              </Text>
              <Text style={styles.statusBannerCta}>Cập nhật giấy tờ →</Text>
            </TouchableOpacity>
          )}
          {isNewDriver && profile?.status !== DRIVER_STATUS.INACTIVE && (
            <View style={styles.newDriverBanner}>
              <Text style={styles.newDriverBannerTitle}>📋 Bạn cần đăng ký và hoàn thành hồ sơ để sử dụng tính năng</Text>
              <Text style={styles.newDriverBannerText}>
                Hồ sơ giai đoạn chính gồm: Giấy phép lái xe, loại xe, hình ảnh, CCCD, BHTNDS phương tiện. Sau khi được duyệt bạn mới nhận đơn và có dữ liệu giao dịch.
              </Text>
            </View>
          )}
          {sections.map((section, sIdx) => (
            <View key={sIdx} style={sIdx > 0 ? styles.sectionBlock : undefined}>
              {section.title ? (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              ) : null}
              {section.items.map((item, i) => (
                <View key={i}>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.menuBorder]}
                    onPress={() => handleMenuPress(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.comingSoon ? (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Sắp ra mắt</Text>
                      </View>
                    ) : null}
                    <Text style={styles.menuChevron}>›</Text>
                  </TouchableOpacity>
                  {item.subItems && item.subItems.length > 0 && (
                    <View style={styles.subItemsBlock}>
                      {item.subItems.map((sub, j) => (
                        <TouchableOpacity
                          key={j}
                          style={[styles.subMenuItem, j < item.subItems!.length - 1 && styles.menuBorder]}
                          onPress={() => handleMenuPress(sub)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.subItemConnector} />
                          <Text style={styles.subMenuIcon}>{sub.icon}</Text>
                          <Text style={styles.subMenuLabel}>{sub.label}</Text>
                          <Text style={styles.menuChevron}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Phiên bản */}
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>

        <ComingSoonModal
          visible={!!comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
          featureName={comingSoonFeature ?? undefined}
        />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },

  header: {
    backgroundColor: Colors.purpleDark,
    padding: Spacing.xl,
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  avatarLargeText: { fontSize: 28, fontWeight: '700', color: Colors.purpleDark },
  avatarLargeImg: { width: 80, height: 80, borderRadius: 40 },
  name: { ...Typography.h2, color: Colors.white },
  phone: { ...Typography.secondary, color: Colors.silver, marginTop: 4 },
  headerHint: { ...Typography.caption, color: Colors.silver, marginTop: 6, opacity: 0.9 },

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
    paddingBottom: Spacing.m,
    ...Shadows.level2,
  },
  sectionBlock: { marginTop: Spacing.l, paddingTop: Spacing.m, borderTopWidth: 1, borderTopColor: Colors.offWhite },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.gray,
    marginBottom: Spacing.s,
    marginLeft: Spacing.l,
    marginTop: Spacing.xs,
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
  comingSoonBadge: {
    backgroundColor: Colors.gold + '30',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
    marginRight: Spacing.s,
  },
  comingSoonText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '600' },
  menuChevron: { fontSize: 20, color: Colors.gray },

  subItemsBlock: {
    backgroundColor: Colors.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: Spacing.l,
    paddingLeft: Spacing.l,
  },
  subItemConnector: {
    width: 16,
    height: 16,
    marginRight: Spacing.s,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.gray + '60',
    borderBottomLeftRadius: 4,
    marginLeft: Spacing.m,
  },
  subMenuIcon: { fontSize: 17, marginRight: Spacing.s },
  subMenuLabel: { ...Typography.body, color: Colors.darkGray, flex: 1, fontSize: 14 },

  logoutBtn: {
    margin: Spacing.l,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  logoutText: { ...Typography.body, color: Colors.red, fontWeight: '600' },
  versionText: {
    ...Typography.caption,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  newDriverBanner: {
    padding: Spacing.l,
    backgroundColor: Colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginBottom: Spacing.s,
  },
  statusBannerPending: {
    backgroundColor: Colors.info + '20',
    borderLeftColor: Colors.info,
  },
  statusBannerRejected: {
    backgroundColor: Colors.error + '15',
    borderLeftColor: Colors.error,
  },
  statusBannerCta: { ...Typography.body, fontWeight: '600', color: Colors.gold, marginTop: Spacing.s },
  newDriverBannerTitle: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark, marginBottom: 4 },
  newDriverBannerText: { ...Typography.caption, color: Colors.darkGray },
});
