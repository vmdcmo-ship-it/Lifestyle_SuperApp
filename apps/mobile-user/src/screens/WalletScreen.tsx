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
import { MOCK_USER } from '../data/mockData';
import { walletService } from '../services/wallet.service';
import { loyaltyService } from '../services/loyalty.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

const PAYMENT_METHODS = [
  { id: 'momo', icon: '🟣', name: 'MoMo', detail: '********0800', connected: true },
  { id: 'vnpay', icon: '🔵', name: 'VNPay', detail: '********1234', connected: true },
  { id: 'zalopay', icon: '🔷', name: 'ZaloPay', detail: '********0567', connected: true },
];

const ADD_METHODS = [
  { id: 'visa', icon: '💳', name: 'Thẻ quốc tế', desc: 'Visa, Mastercard, JCB' },
  { id: 'bank', icon: '🏦', name: 'Liên kết Ngân hàng Nội địa', desc: 'Vietcombank, BIDV, Techcombank...' },
  { id: 'viettel', icon: '📱', name: 'Viettel Money', desc: 'Thanh toán qua số điện thoại' },
  { id: 'sepay', icon: '💰', name: 'SePay', desc: 'Cổng thanh toán QR' },
];

const TRANSFER_OPTIONS = [
  {
    id: 'p2p',
    icon: '👤',
    name: 'Chuyển cho bạn bè',
    desc: 'Chuyển số dư Ví cho người dùng Lifestyle khác',
    color: Colors.info,
  },
  {
    id: 'xu',
    icon: '🪙',
    name: 'Tặng Xu',
    desc: 'Tặng Lifestyle Xu cho bạn bè, người thân',
    color: Colors.gold,
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    name: 'Chuyển cho Gia đình',
    desc: 'Nạp tiền vào ví thành viên trong nhóm Gia đình',
    color: Colors.success,
  },
  {
    id: 'merchant',
    icon: '🏪',
    name: 'Thanh toán Merchant',
    desc: 'Chuyển trực tiếp cho cửa hàng trên Lifestyle',
    color: Colors.purpleDark,
  },
];

const RECENT_TRANSACTIONS = [
  { id: 't1', type: 'Đặt xe', amount: -32800, time: '14:30 hôm nay', icon: '🏍️' },
  { id: 't2', type: 'Nạp Xu (Run to Earn)', amount: 68, time: '12:00 hôm nay', icon: '🏃', isXu: true },
  { id: 't3', type: 'Đồ ăn - Phở Hòa', amount: -85000, time: 'Hôm qua', icon: '🍜' },
  { id: 't4', type: 'Hoàn tiền', amount: 15000, time: '12/02', icon: '💰' },
  { id: 't5', type: 'BHXH tháng 2', amount: -396000, time: '10/02', icon: '🛡️' },
];

export const WalletScreen = ({ navigation }: any) => {
  const [showBalance, setShowBalance] = useState(true);
  const [showTransferSheet, setShowTransferSheet] = useState(false);
  const [balance, setBalance] = useState(MOCK_USER.walletBalance);
  const [xuBal, setXuBal] = useState(MOCK_USER.xuBalance);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [w, xuRes, tx] = await Promise.allSettled([
          walletService.getWallet(),
          loyaltyService.getXuBalance(),
          walletService.getTransactions({ limit: 10 }),
        ]);
        if (w.status === 'fulfilled' && w.value) {
          if (w.value.balance != null) setBalance(w.value.balance);
        }
        if (xuRes.status === 'fulfilled' && xuRes.value?.xuBalance != null) {
          setXuBal(xuRes.value.xuBalance);
        } else if (w.status === 'fulfilled' && w.value?.xu != null) {
          setXuBal(w.value.xu);
        }
        if (tx.status === 'fulfilled' && tx.value?.data) {
          setTransactions(tx.value.data);
        }
      } catch { /* keep mock */ }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <TouchableOpacity>
          <Text style={styles.headerRight}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Lifestyle Wallet Card ──────────────────────── */}
        <View style={styles.walletCard}>
          <View style={styles.walletTop}>
            <Text style={styles.walletLabel}>Ví Lifestyle</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Text style={{ fontSize: 18 }}>{showBalance ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.walletBalance}>
            {showBalance ? formatVND(balance) : '••••••••'}
          </Text>
          <View style={styles.walletXu}>
            <Text style={styles.walletXuText}>
              🪙 {xuBal.toLocaleString()} Xu
            </Text>
          </View>
          <View style={styles.walletNote}>
            <Text style={styles.walletNoteText}>
              Sử dụng trong hệ sinh thái Lifestyle
            </Text>
          </View>
          <View style={styles.walletActions}>
            <TouchableOpacity style={styles.walletActionBtn}>
              <Text style={styles.walletActionIcon}>+</Text>
              <Text style={styles.walletActionLabel}>Nạp tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.walletActionBtn}
              onPress={() => setShowTransferSheet(!showTransferSheet)}
            >
              <Text style={styles.walletActionIcon}>↗️</Text>
              <Text style={styles.walletActionLabel}>Chuyển</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionBtn}>
              <Text style={styles.walletActionIcon}>🎁</Text>
              <Text style={styles.walletActionLabel}>Đổi quà</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Transfer Options (hiện khi nhấn Chuyển) ────── */}
        {showTransferSheet && (
          <View style={styles.transferSheet}>
            <Text style={styles.transferTitle}>Chuyển trong hệ sinh thái</Text>
            <Text style={styles.transferNote}>
              Số dư Ví Lifestyle chỉ sử dụng cho các dịch vụ trong hệ sinh thái. Không hỗ trợ rút về ngân hàng.
            </Text>
            {TRANSFER_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.transferRow,
                  i < TRANSFER_OPTIONS.length - 1 && styles.methodBorder,
                ]}
              >
                <View style={[styles.transferIconWrap, { backgroundColor: opt.color + '15' }]}>
                  <Text style={styles.transferIcon}>{opt.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.transferName}>{opt.name}</Text>
                  <Text style={styles.transferDesc}>{opt.desc}</Text>
                </View>
                <Text style={styles.methodChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Connected Payment Methods ──────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.methodsCard}>
            {PAYMENT_METHODS.map((method, i) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  i < PAYMENT_METHODS.length - 1 && styles.methodBorder,
                ]}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDetail}>{method.detail}</Text>
                </View>
                <Text style={styles.methodChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Add New Methods ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thêm phương thức thanh toán</Text>
          <View style={styles.methodsCard}>
            {ADD_METHODS.map((method, i) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  i < ADD_METHODS.length - 1 && styles.methodBorder,
                ]}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDetail}>{method.desc}</Text>
                </View>
                <Text style={styles.methodChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Recent Transactions ────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.methodsCard}>
            {RECENT_TRANSACTIONS.map((tx, i) => (
              <View
                key={tx.id}
                style={[
                  styles.txRow,
                  i < RECENT_TRANSACTIONS.length - 1 && styles.methodBorder,
                ]}
              >
                <Text style={styles.txIcon}>{tx.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txType}>{tx.type}</Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    {
                      color:
                        tx.amount > 0
                          ? Colors.success
                          : (tx as any).isXu
                          ? Colors.gold
                          : Colors.black,
                    },
                  ]}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {(tx as any).isXu
                    ? `+${tx.amount} Xu`
                    : formatVND(Math.abs(tx.amount))}
                </Text>
              </View>
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
  headerRight: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  walletCard: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    backgroundColor: Colors.purpleDark,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    ...Shadows.level3,
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { ...Typography.secondary, color: Colors.silver },
  walletBalance: { fontSize: 32, fontWeight: '800', color: Colors.white, marginTop: 4 },
  walletXu: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: Spacing.s,
  },
  walletXuText: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },
  walletNote: {
    marginTop: Spacing.s,
  },
  walletNoteText: {
    ...Typography.tiny,
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },
  walletActions: { flexDirection: 'row', gap: Spacing.s, marginTop: Spacing.l },
  walletActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.medium,
    gap: 6,
  },
  walletActionIcon: { fontSize: 16, color: Colors.gold },
  walletActionLabel: { ...Typography.secondary, color: Colors.white, fontWeight: '500' },

  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.l },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.darkGray,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.s,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.s },
  seeAll: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  methodsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level1,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
  },
  methodBorder: { borderBottomWidth: 1, borderBottomColor: Colors.offWhite },
  methodIcon: { fontSize: 24, marginRight: Spacing.m, width: 36, textAlign: 'center' },
  methodName: { ...Typography.body, color: Colors.black, fontWeight: '500' },
  methodDetail: { ...Typography.caption, color: Colors.gray, marginTop: 1 },
  methodChevron: { fontSize: 20, color: Colors.lightGray },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: 12,
  },
  txIcon: { fontSize: 20, marginRight: Spacing.m, width: 36, textAlign: 'center' },
  txType: { ...Typography.secondary, color: Colors.black, fontWeight: '500' },
  txTime: { ...Typography.caption, color: Colors.gray, marginTop: 1 },
  txAmount: { ...Typography.body, fontWeight: '700' },

  // Transfer sheet
  transferSheet: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  transferTitle: { ...Typography.h3, color: Colors.black, marginBottom: 4 },
  transferNote: {
    ...Typography.caption,
    color: Colors.gray,
    lineHeight: 18,
    marginBottom: Spacing.l,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: Spacing.m,
  },
  transferIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferIcon: { fontSize: 20 },
  transferName: { ...Typography.body, fontWeight: '600', color: Colors.black },
  transferDesc: { ...Typography.caption, color: Colors.gray, marginTop: 1 },
});
