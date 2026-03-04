import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_WALLET, MOCK_WEEKLY_EARNINGS, isDemoDriverEmail, EMPTY_WALLET, EMPTY_WEEKLY_EARNINGS } from '../data/mockData';
import { walletService } from '../services/wallet.service';
import { driverService } from '../services/driver.service';
import { useAuth } from '../context/AuthContext';
import { ComingSoonModal } from '../components/ComingSoonModal';

const BANK_STORAGE_KEY = 'driver_bank_account';
type BankInfo = { accountNumber: string; bankName: string; accountHolder: string };
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

function toBankString(b: BankInfo | null): string {
  if (!b || !b.accountNumber) return '';
  return [b.accountNumber, b.bankName, b.accountHolder].filter(Boolean).join(' - ');
}

export const EarningsScreen = () => {
  const { user } = useAuth();
  const isDemoAccount = isDemoDriverEmail(user?.email);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [wallet, setWallet] = useState(isDemoAccount ? MOCK_WALLET : EMPTY_WALLET);
  const [weeklyEarnings, setWeeklyEarnings] = useState(isDemoAccount ? MOCK_WEEKLY_EARNINGS : EMPTY_WEEKLY_EARNINGS);
  const [refreshing, setRefreshing] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [showLinkBank, setShowLinkBank] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [linkAccountNumber, setLinkAccountNumber] = useState('');
  const [linkBankName, setLinkBankName] = useState('');
  const [linkAccountHolder, setLinkAccountHolder] = useState('');
  const [showComingSoonDeposit, setShowComingSoonDeposit] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(BANK_STORAGE_KEY).then((s) => {
      if (s) try { setBankInfo(JSON.parse(s)); } catch {}
    });
  }, []);

  const handleSaveBank = useCallback(async () => {
    const trimmed = linkAccountNumber.trim();
    if (!trimmed) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tài khoản.');
      return;
    }
    const info: BankInfo = {
      accountNumber: trimmed,
      bankName: linkBankName.trim() || 'Ngân hàng',
      accountHolder: linkAccountHolder.trim() || 'Chủ tài khoản',
    };
    await AsyncStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(info));
    setBankInfo(info);
    setWithdrawBank(toBankString(info));
    setShowLinkBank(false);
    setLinkAccountNumber('');
    setLinkBankName('');
    setLinkAccountHolder('');
    Alert.alert('Thành công', 'Đã lưu thông tin tài khoản ngân hàng.');
  }, [linkAccountNumber, linkBankName, linkAccountHolder]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [walletRes, dashboardRes] = await Promise.allSettled([
        walletService.getInfo(),
        driverService.getDashboard(),
      ]);
      const w = walletRes.status === 'fulfilled' ? walletRes.value : null;
      const d = dashboardRes.status === 'fulfilled' ? dashboardRes.value : null;

      const mapWallet = (data: any) => ({
        balance: data.balance ?? 0,
        pendingWithdraw: data.pendingWithdraw ?? data.reservedBalance ?? 0,
        totalEarningsMonth: data.totalEarningsMonth ?? data.totalEarned ?? data.totals?.earned ?? 0,
        commission: data.commission ?? 0,
        bonus: data.bonus ?? 0,
      });

      if (isDemoAccount) {
        setWallet(w && typeof (w as any).balance === 'number' ? mapWallet(w) : MOCK_WALLET);
        setWeeklyEarnings(MOCK_WEEKLY_EARNINGS);
      } else {
        setWallet(w && typeof (w as any).balance === 'number' ? mapWallet(w) : EMPTY_WALLET);
        if (d && Array.isArray((d as any).weeklyEarnings)) {
          const raw = (d as any).weeklyEarnings;
          setWeeklyEarnings(
            raw.map((item: { day: string; earnings?: number; amount?: number }) => ({
              day: item.day,
              amount: item.earnings ?? item.amount ?? 0,
            })),
          );
        } else {
          setWeeklyEarnings(EMPTY_WEEKLY_EARNINGS);
        }
      }
    } catch {
      if (isDemoAccount) {
        setWallet(MOCK_WALLET);
        setWeeklyEarnings(MOCK_WEEKLY_EARNINGS);
      } else {
        setWallet(EMPTY_WALLET);
        setWeeklyEarnings(EMPTY_WEEKLY_EARNINGS);
      }
    } finally {
      setRefreshing(false);
    }
  }, [isDemoAccount]);

  const handleWithdraw = useCallback(async () => {
    if (isDemoAccount) {
      Alert.alert('Thông báo', 'Tài khoản demo không thể rút tiền.');
      return;
    }
    const amount = parseInt(withdrawAmount.replace(/\D/g, ''), 10);
    if (!amount || amount < 50000) {
      Alert.alert('Lỗi', 'Số tiền tối thiểu 50.000đ.');
      return;
    }
    if (amount > (wallet.balance ?? 0)) {
      Alert.alert('Lỗi', 'Số dư không đủ.');
      return;
    }
    const bankStr = withdrawBank.trim() || toBankString(bankInfo);
    if (!bankStr) {
      Alert.alert('Lỗi', 'Vui lòng liên kết tài khoản ngân hàng hoặc nhập thông tin khi rút tiền.');
      return;
    }
    setWithdrawing(true);
    try {
      await walletService.withdraw(amount, bankStr);
      setShowWithdraw(false);
      setWithdrawAmount('');
      setWithdrawBank('');
      loadData(true);
      Alert.alert('Thành công', 'Yêu cầu rút tiền đã được gửi. Tiền sẽ chuyển trong 1-3 ngày làm việc.');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể rút tiền.');
    } finally {
      setWithdrawing(false);
    }
  }, [withdrawAmount, withdrawBank, bankInfo, wallet.balance, isDemoAccount, loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const weeklyTotal = weeklyEarnings.reduce((s, d) => s + d.amount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} colors={[Colors.gold]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ví tài xế</Text>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>Rút tiền & Thu nhập — Đang thử nghiệm</Text>
          </View>
        </View>

        {/* Số dư chính */}
        <View style={styles.mainCard}>
          <Text style={styles.mainLabel}>Số dư khả dụng</Text>
          <Text style={styles.mainAmount}>{formatVND(wallet.balance)}</Text>
        </View>

        {/* Nạp tiền / Rút tiền */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giao dịch</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowComingSoonDeposit(true)}>
              <Text style={styles.actionIcon}>📥</Text>
              <Text style={styles.actionLabel}>Nạp tiền</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Sắp ra mắt</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => { setWithdrawBank(toBankString(bankInfo)); setShowWithdraw(true); }}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionLabel}>Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chi tiết thu nhập / Số dư */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thu nhập</Text>

          <View style={styles.breakdownCard}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.gold }]} />
              <Text style={styles.breakdownLabel}>Chở khách</Text>
              <Text style={styles.breakdownValue}>{formatVND(weeklyTotal * 0.65)}</Text>
              <Text style={styles.breakdownPercent}>65%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.breakdownLabel}>Giao đồ ăn</Text>
              <Text style={styles.breakdownValue}>{formatVND(weeklyTotal * 0.25)}</Text>
              <Text style={styles.breakdownPercent}>25%</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.info }]} />
              <Text style={styles.breakdownLabel}>Thưởng & Tips</Text>
              <Text style={styles.breakdownValue}>{formatVND(weeklyTotal * 0.1)}</Text>
              <Text style={styles.breakdownPercent}>10%</Text>
            </View>
          </View>

          {/* Visual bar */}
          <View style={styles.stackedBar}>
            <View style={[styles.stackedSegment, { flex: 65, backgroundColor: Colors.gold }]} />
            <View style={[styles.stackedSegment, { flex: 25, backgroundColor: '#FF6B6B' }]} />
            <View style={[styles.stackedSegment, { flex: 10, backgroundColor: Colors.info }]} />
          </View>
        </View>

        {/* Commission & Deductions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khấu trừ</Text>
          <View style={styles.deductionCard}>
            <View style={styles.deductionItem}>
              <Text style={styles.deductionLabel}>Hoa hồng nền tảng (10%)</Text>
              <Text style={styles.deductionValue}>-{formatVND(wallet.commission)}</Text>
            </View>
            <View style={styles.deductionDivider} />
            <View style={styles.deductionItem}>
              <Text style={styles.deductionLabel}>Thuế TNCN</Text>
              <Text style={styles.deductionValue}>-0đ</Text>
            </View>
            <View style={styles.deductionDivider} />
            <View style={styles.deductionItem}>
              <Text style={[styles.deductionLabel, { fontWeight: '700' }]}>Thực nhận</Text>
              <Text style={[styles.deductionValue, { color: Colors.success, fontWeight: '700', fontSize: 18 }]}>
                {formatVND(wallet.totalEarningsMonth - wallet.commission)}
              </Text>
            </View>
          </View>
        </View>

        {/* Wallet */}
        <View style={styles.walletSection}>
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Số dư ví</Text>
            <Text style={styles.walletAmount}>{formatVND(wallet.balance)}</Text>
            <TouchableOpacity style={styles.withdrawBtn} onPress={() => { setWithdrawBank(toBankString(bankInfo)); setShowWithdraw(true); }}>
              <Text style={styles.withdrawText}>💳 Rút tiền về ngân hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tài khoản ngân hàng liên kết */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản ngân hàng</Text>
          <View style={styles.bankCard}>
            {bankInfo?.accountNumber ? (
              <Text style={styles.bankInfoText}>
                {bankInfo.accountNumber} · {bankInfo.bankName} · {bankInfo.accountHolder}
              </Text>
            ) : (
              <Text style={styles.placeholderText}>Tài khoản ngân hàng dùng để rút tiền (tài xế khai báo)</Text>
            )}
            <TouchableOpacity style={styles.linkBtn} onPress={() => { setLinkAccountNumber(bankInfo?.accountNumber ?? ''); setLinkBankName(bankInfo?.bankName ?? ''); setLinkAccountHolder(bankInfo?.accountHolder ?? ''); setShowLinkBank(true); }}>
              <Text style={styles.linkBtnText}>{bankInfo?.accountNumber ? 'Cập nhật TKNH' : 'Liên kết TKNH'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ví ký quỹ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ví ký quỹ</Text>
          <View style={styles.depositCard}>
            <Text style={styles.depositLabel}>Số dư ký quỹ</Text>
            <Text style={styles.depositValue}>{formatVND(0)}</Text>
          </View>
        </View>

        {/* Ví chờ xét duyệt */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ví chờ xét duyệt</Text>
          <View style={styles.pendingCard}>
            <Text style={styles.placeholderText}>
              Khi có khiếu nại hoặc báo cáo vi phạm, số tiền liên quan có thể tạm chuyển vào đây. Sau khi giải quyết xong sẽ hạch toán về đúng mục.
            </Text>
            <Text style={styles.pendingValue}>{formatVND(wallet.pendingWithdraw ?? 0)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal Liên kết TKNH */}
      <Modal visible={showLinkBank} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowLinkBank(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Liên kết tài khoản ngân hàng</Text>
            <TextInput
              style={styles.modalInput}
              value={linkAccountNumber}
              onChangeText={setLinkAccountNumber}
              placeholder="Số tài khoản *"
              placeholderTextColor={Colors.gray}
            />
            <TextInput
              style={styles.modalInput}
              value={linkBankName}
              onChangeText={setLinkBankName}
              placeholder="Ngân hàng (VD: Vietcombank)"
              placeholderTextColor={Colors.gray}
            />
            <TextInput
              style={styles.modalInput}
              value={linkAccountHolder}
              onChangeText={setLinkAccountHolder}
              placeholder="Chủ tài khoản"
              placeholderTextColor={Colors.gray}
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowLinkBank(false)}>
                <Text style={styles.modalBtnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnOk} onPress={handleSaveBank}>
                <Text style={styles.modalBtnOkText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Rút tiền */}
      <Modal visible={showWithdraw} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => !withdrawing && setShowWithdraw(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Rút tiền về ngân hàng</Text>
            <Text style={styles.modalHint}>Số dư: {formatVND(wallet.balance ?? 0)}</Text>
            <TextInput
              style={styles.modalInput}
              value={withdrawAmount}
              onChangeText={(t) => setWithdrawAmount(t.replace(/\D/g, ''))}
              placeholder="Số tiền (VND)"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={withdrawBank}
              onChangeText={setWithdrawBank}
              placeholder="STK - Ngân hàng - Chủ TK (hoặc dùng TK đã liên kết)"
              placeholderTextColor={Colors.gray}
              multiline
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => !withdrawing && setShowWithdraw(false)} disabled={withdrawing}>
                <Text style={styles.modalBtnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnOk, withdrawing && styles.modalBtnDisabled]} onPress={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.modalBtnOkText}>Rút tiền</Text>}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <ComingSoonModal
        visible={showComingSoonDeposit}
        onClose={() => setShowComingSoonDeposit(false)}
        featureName="Nạp tiền"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.white, padding: Spacing.l },
  title: { ...Typography.h1, color: Colors.black },
  testBadge: { marginTop: Spacing.s },
  testBadgeText: { ...Typography.caption, color: Colors.info, fontWeight: '600' },

  periodRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
    gap: Spacing.s,
  },
  periodBtn: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
  },
  periodBtnActive: { backgroundColor: Colors.gold },
  periodText: { ...Typography.secondary, color: Colors.gray, fontWeight: '500' },
  periodTextActive: { color: Colors.purpleDark, fontWeight: '700' },

  mainCard: {
    backgroundColor: Colors.purpleDark,
    margin: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  mainLabel: { ...Typography.secondary, color: Colors.silver },
  mainAmount: { fontSize: 36, fontWeight: '700', color: Colors.gold, marginVertical: Spacing.s },
  compareRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  compareUp: { ...Typography.secondary, color: Colors.success, fontWeight: '600' },
  compareText: { ...Typography.caption, color: Colors.silver },

  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.l },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },

  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    gap: Spacing.m,
    ...Shadows.level1,
  },
  breakdownItem: { flexDirection: 'row', alignItems: 'center' },
  breakdownDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.m },
  breakdownLabel: { ...Typography.secondary, color: Colors.darkGray, flex: 1 },
  breakdownValue: { ...Typography.secondary, fontWeight: '600', color: Colors.black, marginRight: Spacing.m },
  breakdownPercent: { ...Typography.caption, color: Colors.gray, width: 30, textAlign: 'right' },

  stackedBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.m,
  },
  stackedSegment: { height: 8 },

  deductionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  deductionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  deductionLabel: { ...Typography.secondary, color: Colors.darkGray },
  deductionValue: { ...Typography.secondary, color: Colors.error, fontWeight: '600' },
  deductionDivider: { height: 1, backgroundColor: Colors.lightGray, marginVertical: 6 },

  walletSection: { padding: Spacing.l, marginTop: Spacing.m },
  walletCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.level2,
  },
  walletLabel: { ...Typography.secondary, color: Colors.gray },
  walletAmount: { fontSize: 28, fontWeight: '700', color: Colors.purpleDark, marginVertical: Spacing.s },
  withdrawBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: Spacing.m,
  },
  withdrawText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },

  actionRow: { flexDirection: 'row', gap: Spacing.m },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    padding: Spacing.l,
    alignItems: 'center',
    ...Shadows.level1,
  },
  actionIcon: { fontSize: 28, marginBottom: Spacing.xs },
  actionLabel: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  comingSoonBadge: {
    backgroundColor: Colors.gold + '30',
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
    marginTop: Spacing.xs,
  },
  comingSoonText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '600' },

  bankCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  placeholderText: { ...Typography.secondary, color: Colors.gray, marginBottom: Spacing.m },
  linkBtn: {
    backgroundColor: Colors.gold + '40',
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.s,
    alignItems: 'center',
  },
  linkBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },

  depositCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  depositLabel: { ...Typography.secondary, color: Colors.gray },
  depositValue: { ...Typography.h3, color: Colors.purpleDark, marginTop: 4 },

  pendingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  pendingValue: { ...Typography.h3, color: Colors.warning, marginTop: Spacing.s },
  bankInfoText: { ...Typography.body, color: Colors.black, marginBottom: Spacing.m },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 24,
  },
  modalTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  modalHint: { ...Typography.secondary, color: Colors.gray, marginBottom: Spacing.s },
  modalInput: {
    ...Typography.body,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  modalRow: { flexDirection: 'row', gap: Spacing.m, marginTop: Spacing.m },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
  },
  modalBtnCancelText: { ...Typography.body, fontWeight: '600', color: Colors.darkGray },
  modalBtnOk: {
    flex: 1,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.gold,
    alignItems: 'center',
  },
  modalBtnOkText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  modalBtnDisabled: { opacity: 0.7 },
});
