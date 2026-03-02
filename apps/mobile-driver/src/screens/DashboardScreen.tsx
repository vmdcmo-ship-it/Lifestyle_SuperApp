import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import {
  MOCK_DRIVER,
  MOCK_TODAY_STATS,
  MOCK_WEEKLY_EARNINGS,
  MOCK_WALLET,
  isDemoDriverEmail,
  EMPTY_TODAY_STATS,
  EMPTY_WEEKLY_EARNINGS,
  EMPTY_WALLET,
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { driverService } from '../services/driver.service';
import { walletService } from '../services/wallet.service';
import { DriverMapView } from '../components/DriverMapView';
import { DRIVER_STATUS, canAcceptOrders } from '../constants/driverStatus';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

type DriverInfo = {
  name: string;
  vehicleType?: string;
  vehiclePlate?: string;
};

type TodayStats = {
  totalTrips: number;
  totalEarnings: number;
  onlineHours?: number;
  acceptanceRate?: number;
  cancellationRate?: number;
  averageRating?: number;
};

type WalletInfo = {
  balance: number;
  totalEarningsMonth?: number;
  commission?: number;
  bonus?: number;
};

const defaultWeekly = MOCK_WEEKLY_EARNINGS;
const maxEarningDefault = Math.max(...defaultWeekly.map((d) => d.amount), 1);

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { profile: sharedProfile } = useProfile();
  const isDemoAccount = isDemoDriverEmail(user?.email);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState(defaultWeekly);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [hasVehicleFromApi, setHasVehicleFromApi] = useState(false);

  // Đồng bộ driver info từ ProfileContext (avatar/name/vehicle luôn cập nhật)
  useEffect(() => {
    if (isDemoAccount || !sharedProfile) return;
    const p = sharedProfile as any;
    setDriver((prev) => ({
      name: [p.firstName, p.lastName].filter(Boolean).join(' ') || p.email || prev?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : user?.email ?? ''),
      vehicleType: p.vehicleType ?? prev?.vehicleType,
      vehiclePlate: p.vehiclePlate ?? prev?.vehiclePlate,
    }));
    setHasVehicleFromApi(!!(p.vehiclePlate ?? p.vehicleType));
  }, [sharedProfile, isDemoAccount, user]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [dashboardRes, walletRes] = await Promise.allSettled([
        driverService.getDashboard(),
        walletService.getInfo(),
      ]);
      const dashboard = dashboardRes.status === 'fulfilled' ? dashboardRes.value : null;
      const walletData = walletRes.status === 'fulfilled' ? walletRes.value : null;

      if (isDemoAccount) {
        setDriver({
          name: MOCK_DRIVER.name,
          vehicleType: MOCK_DRIVER.vehicleType,
          vehiclePlate: MOCK_DRIVER.vehiclePlate,
        });
        setHasVehicleFromApi(true);
        setTodayStats(MOCK_TODAY_STATS);
        setWeeklyEarnings(MOCK_WEEKLY_EARNINGS);
        setWallet(MOCK_WALLET);
      } else {
        if (dashboard && ((dashboard as any).today || (dashboard as any).stats)) {
          const d = dashboard as any;
          const t = d.today ?? d.stats ?? {};
          setTodayStats({
            totalTrips: t.totalTrips ?? t.todayTrips ?? 0,
            totalEarnings: t.totalEarnings ?? 0,
            onlineHours: t.onlineHours ?? 0,
            acceptanceRate: t.acceptanceRate ?? 0,
            cancellationRate: t.cancellationRate ?? 0,
            averageRating: t.averageRating ?? 0,
          });
          if (Array.isArray(d.weeklyEarnings)) {
            setWeeklyEarnings(
              d.weeklyEarnings.map((w: { day: string; earnings?: number; amount?: number }) => ({
                day: w.day,
                amount: w.earnings ?? w.amount ?? 0,
              })),
            );
          } else {
            setWeeklyEarnings(EMPTY_WEEKLY_EARNINGS);
          }
        } else {
          setTodayStats(EMPTY_TODAY_STATS);
          setWeeklyEarnings(EMPTY_WEEKLY_EARNINGS);
        }
        if (walletData && typeof (walletData as any).balance === 'number') {
          const w = walletData as any;
          setWallet({
            balance: w.balance,
            totalEarningsMonth: w.totalEarningsMonth ?? w.totalEarned ?? w.totals?.earned ?? 0,
            commission: w.commission ?? 0,
            bonus: w.bonus ?? 0,
          });
        } else {
          setWallet(EMPTY_WALLET);
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
        await logout();
      }
      if (isDemoAccount) {
        setDriver({ name: MOCK_DRIVER.name, vehicleType: MOCK_DRIVER.vehicleType, vehiclePlate: MOCK_DRIVER.vehiclePlate });
        setTodayStats(MOCK_TODAY_STATS);
        setWeeklyEarnings(defaultWeekly);
        setWallet(MOCK_WALLET);
      } else {
        setTodayStats(EMPTY_TODAY_STATS);
        setWeeklyEarnings(EMPTY_WEEKLY_EARNINGS);
        setWallet(EMPTY_WALLET);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logout, isDemoAccount]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleOnlineChange = useCallback(
    async (value: boolean) => {
      const next = value ? 'ONLINE' : 'OFFLINE';
      setIsOnline(value);
      try {
        await driverService.updateStatus(next);
      } catch {
        setIsOnline(!value);
        Alert.alert(
          'Chưa cập nhật được trạng thái',
          'Bạn cần đăng ký và hoàn thành hồ sơ để sử dụng tính năng (Giấy phép lái xe, loại xe, hình ảnh, CCCD, BHTNDS phương tiện). Nút Online/Offline chỉ báo sẵn sàng nhận đơn, không tắt app.',
          [{ text: 'Đã hiểu' }],
        );
      }
    },
    [],
  );

  const profileStatus = sharedProfile?.status;
  const canGoOnline = isDemoAccount || canAcceptOrders(profileStatus);
  const displayDriver = driver ?? {
    name: (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : user?.email) ?? '',
    vehicleType: undefined,
    vehiclePlate: undefined,
  };
  const displayStats = todayStats ?? (isDemoAccount ? MOCK_TODAY_STATS : EMPTY_TODAY_STATS);
  const displayWallet = wallet ?? (isDemoAccount ? MOCK_WALLET : EMPTY_WALLET);
  const maxEarning = Math.max(...weeklyEarnings.map((d) => d.amount), 1);
  const isNewDriver = !isDemoAccount && !hasVehicleFromApi && !driver?.vehiclePlate;

  if (loading && !driver && !todayStats) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} colors={[Colors.gold]} />
        }
      >
        {/* Header: chạm vào ảnh đại diện hoặc tên để mở Tài khoản */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => (navigation as any).navigate('Profile')}
            activeOpacity={0.8}
            accessibilityLabel="Tài khoản. Chạm để mở trang tài khoản."
            accessibilityRole="button"
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayDriver.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'TX'}
              </Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.driverName}>{displayDriver.name || 'Tài xế'}</Text>
              <Text style={styles.vehicleInfo}>
                {displayDriver.vehicleType && displayDriver.vehiclePlate
                  ? `${displayDriver.vehicleType} • ${displayDriver.vehiclePlate}`
                  : 'Chưa cập nhật phương tiện'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.onlineToggle}>
            <Text style={[styles.onlineText, { color: isOnline ? Colors.success : Colors.gray }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={handleOnlineChange}
              disabled={!canGoOnline}
              trackColor={{ false: Colors.lightGray, true: Colors.success + '40' }}
              thumbColor={isOnline ? Colors.success : Colors.gray}
            />
          </View>
        </View>

        {/* Banner trạng thái hồ sơ */}
        {!isDemoAccount && profileStatus === DRIVER_STATUS.PENDING_VERIFICATION && (
          <View style={[styles.newDriverBanner, styles.statusBannerPending]}>
            <Text style={styles.newDriverBannerTitle}>⏳ Hồ sơ đang chờ duyệt</Text>
            <Text style={styles.newDriverBannerText}>
              Bạn sẽ nhận được thông báo khi có kết quả. Chỉ có thể bật trực tuyến sau khi được duyệt.
            </Text>
          </View>
        )}
        {!isDemoAccount && profileStatus === DRIVER_STATUS.INACTIVE && (
          <TouchableOpacity
            style={[styles.newDriverBanner, styles.statusBannerRejected]}
            onPress={() => (navigation as any).navigate('UpdateDocuments')}
            activeOpacity={0.9}
          >
            <Text style={styles.newDriverBannerTitle}>❌ Hồ sơ chưa được duyệt</Text>
            <Text style={styles.newDriverBannerText}>
              {sharedProfile?.rejectionReason || 'Không đạt yêu cầu.'} Cập nhật hồ sơ và gửi lại để được xem xét.
            </Text>
            <Text style={styles.statusBannerCta}>Cập nhật giấy tờ →</Text>
          </TouchableOpacity>
        )}
        {isNewDriver && profileStatus !== DRIVER_STATUS.INACTIVE && (
          <TouchableOpacity style={styles.newDriverBanner} activeOpacity={0.9}>
            <Text style={styles.newDriverBannerTitle}>📋 Bạn cần đăng ký và hoàn thành hồ sơ để sử dụng tính năng</Text>
            <Text style={styles.newDriverBannerText}>
              Hồ sơ giai đoạn chính gồm: Giấy phép lái xe, loại xe, hình ảnh, CCCD, BHTNDS phương tiện. Sau khi được duyệt bạn mới nhận đơn; dữ liệu thống kê có sau giao dịch thực tế.
            </Text>
          </TouchableOpacity>
        )}

        {/* Bản đồ vị trí */}
        <View style={styles.mapSection}>
          <Text style={styles.mapSectionTitle}>Khu vực của bạn</Text>
          <DriverMapView mode="driver" height={200} />
        </View>

        {/* Today Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Hôm nay</Text>
            <Text style={styles.statsDate}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
            </Text>
          </View>

          <View style={styles.earningsRow}>
            <Text style={styles.earningsAmount}>
              {formatVND(displayStats.totalEarnings)}
            </Text>
            <View style={styles.tripsCount}>
              <Text style={styles.tripsNumber}>{displayStats.totalTrips}</Text>
              <Text style={styles.tripsLabel}>chuyến</Text>
            </View>
          </View>

          <View style={styles.miniStats}>
            <View style={styles.miniStatItem}>
              <Text style={styles.miniStatIcon}>⏱️</Text>
              <Text style={styles.miniStatValue}>{displayStats.onlineHours ?? 0}h</Text>
              <Text style={styles.miniStatLabel}>Online</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Text style={styles.miniStatIcon}>✅</Text>
              <Text style={styles.miniStatValue}>{displayStats.acceptanceRate ?? 0}%</Text>
              <Text style={styles.miniStatLabel}>Nhận đơn</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Text style={styles.miniStatIcon}>⭐</Text>
              <Text style={styles.miniStatValue}>{displayStats.averageRating ?? '-'}</Text>
              <Text style={styles.miniStatLabel}>Đánh giá</Text>
            </View>
            <View style={styles.miniStatItem}>
              <Text style={styles.miniStatIcon}>❌</Text>
              <Text style={styles.miniStatValue}>{displayStats.cancellationRate ?? 0}%</Text>
              <Text style={styles.miniStatLabel}>Hủy đơn</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Thu nhập tuần này</Text>
          <Text style={styles.chartTotal}>
            {formatVND(weeklyEarnings.reduce((s, d) => s + d.amount, 0))}
          </Text>
          <View style={styles.barChart}>
            {weeklyEarnings.map((d, i) => (
              <View key={i} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (d.amount / maxEarning) * 120,
                      backgroundColor:
                        i === new Date().getDay() - 1 ? Colors.gold : Colors.gold + '50',
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{d.day}</Text>
                <Text style={styles.barValue}>
                  {(d.amount / 1000).toFixed(0)}K
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Wallet Summary */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>💰 Ví tài xế</Text>
            <TouchableOpacity>
              <Text style={styles.walletSeeAll}>Chi tiết →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletBalance}>{formatVND(displayWallet.balance)}</Text>
          <View style={styles.walletDetails}>
            <View style={styles.walletDetailItem}>
              <Text style={styles.walletDetailLabel}>Thu nhập tháng</Text>
              <Text style={[styles.walletDetailValue, { color: Colors.success }]}>
                +{formatVND(displayWallet.totalEarningsMonth ?? 0)}
              </Text>
            </View>
            <View style={styles.walletDetailItem}>
              <Text style={styles.walletDetailLabel}>Hoa hồng nền tảng</Text>
              <Text style={[styles.walletDetailValue, { color: Colors.error }]}>
                -{formatVND(displayWallet.commission ?? 0)}
              </Text>
            </View>
            <View style={styles.walletDetailItem}>
              <Text style={styles.walletDetailLabel}>Thưởng</Text>
              <Text style={[styles.walletDetailValue, { color: Colors.info }]}>
                +{formatVND(displayWallet.bonus ?? 0)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Rút tiền về tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: '📋', label: 'Lịch sử' },
            { icon: '🛡️', label: 'Bảo hiểm' },
            { icon: '📊', label: 'Báo cáo' },
            { icon: '⚙️', label: 'Cài đặt', screen: 'Settings' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickAction}
              onPress={() => (action as any).screen === 'Settings' && (navigation as any).navigate('Profile', { screen: 'Settings' })}
              activeOpacity={0.7}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.purpleDark,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: Colors.purpleDark },
  driverName: { ...Typography.h3, color: Colors.white },
  vehicleInfo: { ...Typography.caption, color: Colors.silver },
  onlineToggle: { alignItems: 'center' },
  onlineText: { ...Typography.caption, fontWeight: '600', marginBottom: 4 },

  mapSection: { marginHorizontal: Spacing.l, marginTop: Spacing.m },
  mapSectionTitle: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.s },

  statsCard: {
    backgroundColor: Colors.white,
    margin: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m },
  statsTitle: { ...Typography.h3, color: Colors.black },
  statsDate: { ...Typography.caption, color: Colors.gray },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  earningsAmount: { fontSize: 32, fontWeight: '700', color: Colors.purpleDark },
  tripsCount: { alignItems: 'center' },
  tripsNumber: { fontSize: 28, fontWeight: '700', color: Colors.gold },
  tripsLabel: { ...Typography.caption, color: Colors.gray },
  miniStats: { flexDirection: 'row', justifyContent: 'space-around' },
  miniStatItem: { alignItems: 'center' },
  miniStatIcon: { fontSize: 20, marginBottom: 2 },
  miniStatValue: { ...Typography.body, fontWeight: '700', color: Colors.black },
  miniStatLabel: { ...Typography.tiny, color: Colors.gray },

  chartCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  chartTitle: { ...Typography.h3, color: Colors.black },
  chartTotal: { ...Typography.h2, color: Colors.gold, marginTop: 4 },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: Spacing.l,
    height: 160,
  },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: 4, minHeight: 4 },
  barLabel: { ...Typography.caption, color: Colors.gray, marginTop: 6 },
  barValue: { ...Typography.tiny, color: Colors.darkGray, fontWeight: '600' },

  walletCard: {
    backgroundColor: Colors.purpleDark,
    margin: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
  },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletTitle: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  walletSeeAll: { ...Typography.caption, color: Colors.gold },
  walletBalance: { fontSize: 28, fontWeight: '700', color: Colors.gold, marginVertical: Spacing.m },
  walletDetails: { gap: Spacing.s },
  walletDetailItem: { flexDirection: 'row', justifyContent: 'space-between' },
  walletDetailLabel: { ...Typography.secondary, color: Colors.silver },
  walletDetailValue: { ...Typography.secondary, fontWeight: '600' },
  withdrawBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  withdrawText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.m,
  },
  quickAction: { alignItems: 'center' },
  quickActionIcon: { fontSize: 28, marginBottom: 4 },
  quickActionLabel: { ...Typography.caption, color: Colors.darkGray },
  statusBannerPending: {
    backgroundColor: Colors.info + '20',
    borderLeftColor: Colors.info,
  },
  statusBannerRejected: {
    backgroundColor: Colors.error + '15',
    borderLeftColor: Colors.error,
  },
  statusBannerCta: { ...Typography.body, fontWeight: '600', color: Colors.gold, marginTop: Spacing.s },
  newDriverBanner: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  newDriverBannerTitle: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark, marginBottom: 4 },
  newDriverBannerText: { ...Typography.caption, color: Colors.darkGray },
});
