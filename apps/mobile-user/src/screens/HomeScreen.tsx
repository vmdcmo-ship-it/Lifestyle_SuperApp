import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card } from '../components/ui';
import { MOCK_USER, MOCK_SERVICES, MOCK_PROMOTIONS, MOCK_SPOTLIGHT_REELS } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { walletService } from '../services/wallet.service';
import { loyaltyService } from '../services/loyalty.service';
import { notificationsService } from '../services/notifications.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_GRID_SLOTS = 11; // 4 + 4 + 3 = 11 chính + 1 nút "Tiện ích khác"

// ─── Service Item Component ─────────────────────────────────────────────────

const ServiceItem = ({
  service,
  onPress,
}: {
  service: (typeof MOCK_SERVICES)[0];
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.serviceItem} onPress={onPress}>
    <View style={styles.serviceIconWrap}>
      <View style={[styles.serviceIcon, { backgroundColor: service.color + '15' }]}>
        <Text style={styles.serviceEmoji}>{service.icon}</Text>
      </View>
      {service.badge && (
        <View
          style={[
            styles.serviceBadge,
            service.badge === 'HOT' || service.badge === '❤️'
              ? { backgroundColor: Colors.red }
              : { backgroundColor: Colors.gold },
          ]}
        >
          <Text style={styles.serviceBadgeText}>{service.badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.serviceLabel}>{service.label}</Text>
  </TouchableOpacity>
);

// ─── Main HomeScreen ────────────────────────────────────────────────────────

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(MOCK_USER.walletBalance);
  const [xuBalance, setXuBalance] = useState<number>(MOCK_USER.xuBalance);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [wallet, xuRes, notif] = await Promise.allSettled([
          walletService.getWallet(),
          loyaltyService.getXuBalance(),
          notificationsService.getUnreadCount(),
        ]);
        if (wallet.status === 'fulfilled' && wallet.value?.balance != null) {
          setWalletBalance(wallet.value.balance);
        }
        if (xuRes.status === 'fulfilled' && xuRes.value?.xuBalance != null) {
          setXuBalance(xuRes.value.xuBalance);
        } else if (wallet.status === 'fulfilled' && wallet.value?.xu != null) {
          setXuBalance(wallet.value.xu);
        }
        if (notif.status === 'fulfilled' && notif.value?.count != null) {
          setUnreadCount(notif.value.count);
        }
      } catch { /* use mock fallback */ }
    })();
  }, []);

  const displayName = user?.firstName || MOCK_USER.firstName;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

  const activeServices = useMemo(
    () => MOCK_SERVICES.filter((s) => s.enabled).sort((a, b) => a.order - b.order),
    [],
  );

  const mainServices = activeServices.slice(0, MAX_GRID_SLOTS);
  const overflowServices = activeServices.slice(MAX_GRID_SLOTS);
  const hasOverflow = overflowServices.length > 0;

  const handleServicePress = (service: (typeof MOCK_SERVICES)[0]) => {
    if (service.screen) {
      navigation?.navigate(service.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Xin chào, {displayName}</Text>
          <TouchableOpacity
            style={styles.xuBadge}
            onPress={() => navigation?.navigate('Wallet')}
          >
            <Text style={styles.xuBadgeIcon}>🪙</Text>
            <Text style={styles.xuBadgeText}>{xuBalance.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════
            SEARCH BAR
        ═══════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation?.navigate('Booking')}
          activeOpacity={0.8}
        >
          <Text style={styles.searchPin}>📍</Text>
          <Text style={styles.searchPlaceholder}>Bạn muốn đi đâu?</Text>
          <View style={styles.scheduleBtn}>
            <Text style={styles.scheduleIcon}>⏰</Text>
            <Text style={styles.scheduleText}>Hẹn giờ</Text>
          </View>
        </TouchableOpacity>

        {/* ═══════════════════════════════════════════════════
            SERVICES GRID - Hàng 1: 4, Hàng 2: 4, Hàng 3: 3 + "Tiện ích khác"
        ═══════════════════════════════════════════════════ */}
        <View style={styles.servicesSection}>
          <View style={styles.servicesGrid}>
            {mainServices.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                onPress={() => handleServicePress(service)}
              />
            ))}

            {/* Nút "Tiện ích khác" - luôn hiện ở slot cuối hàng 3 */}
            {hasOverflow && (
              <TouchableOpacity
                style={styles.serviceItem}
                onPress={() => setShowMoreModal(true)}
              >
                <View style={styles.serviceIconWrap}>
                  <View style={[styles.serviceIcon, styles.moreIcon]}>
                    <Text style={styles.moreEmoji}>⋯</Text>
                  </View>
                  <View style={[styles.serviceBadge, { backgroundColor: Colors.info }]}>
                    <Text style={styles.serviceBadgeText}>{overflowServices.length}</Text>
                  </View>
                </View>
                <Text style={styles.serviceLabel}>Tiện ích{'\n'}khác</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            PROMOTIONS CAROUSEL
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOCK_PROMOTIONS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.l }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.promoCard, { backgroundColor: item.color }]}
              >
                <Text style={[styles.promoTitle, { color: item.textColor }]}>
                  {item.title}
                </Text>
                <Text style={[styles.promoSubtitle, { color: item.textColor, opacity: 0.8 }]}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.dotsRow}>
            {MOCK_PROMOTIONS.map((_, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            WALLET CARD
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <Card variant="premium" style={styles.walletCard}>
            <View style={styles.walletRow}>
              <View>
                <Text style={styles.walletLabel}>Ví Lifestyle</Text>
                <Text style={styles.walletBalance}>
                  {formatCurrency(walletBalance)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.walletViewAll}
                onPress={() => navigation?.navigate('Wallet')}
              >
                <Text style={styles.walletViewText}>Chi tiết ›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.walletActionBtn} onPress={() => navigation?.navigate('Wallet')}>
                <Text style={styles.walletActionIcon}>+</Text>
                <Text style={styles.walletActionText}>Nạp tiền</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.walletActionBtn} onPress={() => navigation?.navigate('Wallet')}>
                <Text style={styles.walletActionIcon}>↗️</Text>
                <Text style={styles.walletActionText}>Chuyển</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.walletActionBtn} onPress={() => navigation?.navigate('Wallet')}>
                <Text style={styles.walletActionIcon}>📊</Text>
                <Text style={styles.walletActionText}>Lịch sử</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.walletActionBtn} onPress={() => navigation?.navigate('GiftCard')}>
                <Text style={styles.walletActionIcon}>🎁</Text>
                <Text style={styles.walletActionText}>Ưu đãi</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* ═══════════════════════════════════════════════════
            LIFESTYLE STATS
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Chuyến đi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>189 km</Text>
              <Text style={styles.statLabel}>Run to Earn</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12.5K</Text>
              <Text style={styles.statLabel}>Xu tích lũy</Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            SPOTLIGHT PREVIEW
        ═══════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lifestyle Spotlight</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Spotlight')}>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOCK_SPOTLIGHT_REELS.slice(0, 4)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: Spacing.l }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.spotlightCard}
                onPress={() => navigation?.navigate('Spotlight')}
              >
                <View style={[styles.spotlightThumb, { backgroundColor: item.thumbnailColor }]}>
                  <Text style={styles.spotlightPlay}>▶</Text>
                  <View style={styles.spotlightDuration}>
                    <Text style={styles.durationText}>{item.duration}s</Text>
                  </View>
                </View>
                <View style={styles.spotlightInfo}>
                  <Text style={styles.spotlightTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.spotlightMeta}>
                    <Text style={styles.spotlightViews}>
                      {item.views > 1000
                        ? (item.views / 1000).toFixed(1) + 'K'
                        : item.views}{' '}
                      views
                    </Text>
                    <Text style={styles.spotlightRating}>⭐ {item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ═══════════════════════════════════════════════════
          MODAL: Tiện ích khác
      ═══════════════════════════════════════════════════ */}
      <Modal
        visible={showMoreModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMoreModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>Tiện ích khác</Text>
                <TouchableOpacity onPress={() => setShowMoreModal(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalSubtitle}>
                Các dịch vụ bổ sung trong hệ sinh thái Lifestyle
              </Text>
            </View>

            {/* Overflow services grid */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalGrid}
            >
              {overflowServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.modalServiceItem}
                  onPress={() => {
                    setShowMoreModal(false);
                    handleServicePress(service);
                  }}
                >
                  <View style={[styles.modalServiceIcon, { backgroundColor: service.color + '15' }]}>
                    <Text style={{ fontSize: 28 }}>{service.icon}</Text>
                  </View>
                  <View style={styles.modalServiceInfo}>
                    <Text style={styles.modalServiceName}>{service.label.replace('\n', ' ')}</Text>
                    <Text style={styles.modalServicePhase}>
                      {service.phase === 'P1' ? 'Dịch vụ cốt lõi'
                        : service.phase === 'P2' ? 'Hệ sinh thái'
                        : service.phase === 'P3' ? 'Mở rộng Lifestyle'
                        : 'Tài chính & Tiện ích'}
                    </Text>
                  </View>
                  <Text style={styles.modalChevron}>›</Text>
                </TouchableOpacity>
              ))}

              {/* Admin note */}
              <View style={styles.adminNote}>
                <Text style={styles.adminNoteIcon}>⚙️</Text>
                <Text style={styles.adminNoteText}>
                  Thứ tự và vị trí hiển thị các dịch vụ được quản lý từ App Admin.
                  Quản trị viên có thể kéo thả để sắp xếp nhóm chính / nhóm phụ.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
  },
  greeting: { ...Typography.h2, color: Colors.black, fontWeight: '700' },
  xuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  xuBadgeIcon: { fontSize: 16 },
  xuBadgeText: { ...Typography.secondary, color: Colors.kodoGreen, fontWeight: '700' },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.s,
    paddingHorizontal: Spacing.l,
    height: 48,
    borderRadius: 24,
    ...Shadows.level2,
  },
  searchPin: { fontSize: 18, marginRight: 8 },
  searchPlaceholder: { ...Typography.body, color: Colors.gray, flex: 1 },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  scheduleIcon: { fontSize: 14 },
  scheduleText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  // Services grid
  servicesSection: {
    backgroundColor: Colors.white,
    marginTop: Spacing.m,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.s,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.m,
  },
  serviceItem: {
    width: (SCREEN_WIDTH - 24) / 4,
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  serviceIconWrap: { position: 'relative', marginBottom: 6 },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: { fontSize: 28 },
  serviceBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  serviceBadgeText: { ...Typography.tiny, color: Colors.white, fontWeight: '800' },
  serviceLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
  moreIcon: {
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
  moreEmoji: { fontSize: 24, color: Colors.gray },

  // Wallet
  section: { marginTop: Spacing.m },
  walletCard: { marginHorizontal: Spacing.l },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  walletLabel: { ...Typography.caption, color: Colors.silver, marginBottom: 4 },
  walletBalance: { fontSize: 26, fontWeight: '700', color: Colors.white },
  walletViewAll: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  walletViewText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  walletActions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  walletActionBtn: { alignItems: 'center' },
  walletActionIcon: { fontSize: 22, marginBottom: 4, color: Colors.gold },
  walletActionText: { ...Typography.caption, color: Colors.white },

  // Promo
  promoCard: {
    width: SCREEN_WIDTH * 0.78,
    height: 100,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginRight: Spacing.m,
    justifyContent: 'center',
  },
  promoTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  promoSubtitle: { ...Typography.secondary },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.m },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.lightGray },
  dotActive: { width: 18, backgroundColor: Colors.gold },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.l,
    ...Shadows.level1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...Typography.h3, color: Colors.purpleDark, fontWeight: '800' },
  statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.lightGray },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: { ...Typography.h3, color: Colors.black },
  seeAll: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  // Spotlight
  spotlightCard: {
    width: 160,
    marginRight: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level2,
  },
  spotlightThumb: { width: 160, height: 200, alignItems: 'center', justifyContent: 'center' },
  spotlightPlay: { fontSize: 36, color: 'rgba(255,255,255,0.9)' },
  spotlightDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  spotlightInfo: { padding: Spacing.s },
  spotlightTitle: { ...Typography.caption, fontWeight: '600', color: Colors.black },
  spotlightMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  spotlightViews: { ...Typography.tiny, color: Colors.gray },
  spotlightRating: { ...Typography.tiny, color: Colors.gold, fontWeight: '600' },

  // ─── Modal: Tiện ích khác ──────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 32,
  },
  modalHeader: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: 'center',
    marginBottom: Spacing.m,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { ...Typography.h2, color: Colors.black },
  modalClose: { fontSize: 20, color: Colors.gray, padding: 4 },
  modalSubtitle: { ...Typography.caption, color: Colors.gray, marginTop: 4 },

  modalGrid: { padding: Spacing.l },
  modalServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
    gap: Spacing.m,
  },
  modalServiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalServiceInfo: { flex: 1 },
  modalServiceName: { ...Typography.body, fontWeight: '600', color: Colors.black },
  modalServicePhase: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  modalChevron: { fontSize: 20, color: Colors.lightGray },

  adminNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.gold + '10',
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    marginTop: Spacing.xl,
    gap: Spacing.m,
  },
  adminNoteIcon: { fontSize: 20 },
  adminNoteText: { ...Typography.caption, color: Colors.darkGray, flex: 1, lineHeight: 18 },
});
