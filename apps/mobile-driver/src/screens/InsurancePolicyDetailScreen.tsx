/**
 * Chi tiết hợp đồng bảo hiểm — xem thông tin và yêu cầu bồi thường.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { insuranceService } from '../services/insurance.service';
import { isDemoDriverEmail } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + 'đ';
}

function formatDate(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('vi-VN');
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang hiệu lực',
  EXPIRED: 'Hết hạn',
  CANCELLED: 'Đã hủy',
};

const CLAIM_STATUS_LABEL: Record<string, string> = {
  SUBMITTED: 'Đã gửi',
  PROCESSING: 'Đang xử lý',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  PAID: 'Đã chi trả',
};

export function InsurancePolicyDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);
  const policyId = route.params?.policyId ?? '';

  const [loading, setLoading] = useState(true);
  const [policy, setPolicy] = useState<any>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [claimReason, setClaimReason] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  const load = useCallback(async () => {
    if (isDemo || !policyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await insuranceService.getPolicyDetail(policyId);
      setPolicy(res);
    } catch {
      setPolicy(null);
    } finally {
      setLoading(false);
    }
  }, [isDemo, policyId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleFileClaim = useCallback(async () => {
    if (isDemo) {
      Alert.alert('Thông báo', 'Tài khoản demo không thể gửi yêu cầu bồi thường.');
      return;
    }
    const amount = parseInt(claimAmount.replace(/\D/g, ''), 10);
    if (!amount || amount < 1000) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ.');
      return;
    }
    if (amount > (policy?.coverageAmount ?? 0)) {
      Alert.alert('Lỗi', `Số tiền vượt quá mức bảo hiểm ${formatVND(policy?.coverageAmount ?? 0)}.`);
      return;
    }
    if (!claimReason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do yêu cầu.');
      return;
    }
    setSubmittingClaim(true);
    try {
      await insuranceService.fileClaim({
        policyId: policy.id,
        claimAmount: amount,
        reason: claimReason.trim(),
        description: claimDescription.trim() || undefined,
      });
      setShowClaimModal(false);
      setClaimAmount('');
      setClaimReason('');
      setClaimDescription('');
      load();
      Alert.alert('Thành công', 'Yêu cầu bồi thường đã được gửi. Vui lòng chờ xử lý.');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể gửi yêu cầu.');
    } finally {
      setSubmittingClaim(false);
    }
  }, [policy, claimAmount, claimReason, claimDescription, isDemo, load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!policy) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Không tìm thấy hợp đồng</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = policy.status === 'ACTIVE' ? Colors.success : policy.status === 'EXPIRED' ? Colors.error : Colors.gray;
  const canFileClaim = policy.status === 'ACTIVE' && !isDemo;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Thông tin hợp đồng */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin hợp đồng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số hợp đồng</Text>
            <Text style={styles.infoValue}>{policy.policyNumber ?? policy.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái</Text>
            <Text style={[styles.infoValue, { color: statusColor }]}>{STATUS_LABEL[policy.status] ?? policy.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sản phẩm</Text>
            <Text style={styles.infoValue}>{policy.product?.name ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nhà cung cấp</Text>
            <Text style={styles.infoValue}>{policy.product?.provider ?? '—'}</Text>
          </View>
        </View>

        {/* Thời hạn & Quyền lợi */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thời hạn & Quyền lợi</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hiệu lực</Text>
            <Text style={styles.infoValue}>
              {formatDate(policy.startDate)} — {formatDate(policy.endDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phí đã đóng</Text>
            <Text style={styles.infoValue}>{formatVND(Number(policy.premiumAmount ?? 0))}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mức bồi thường</Text>
            <Text style={[styles.infoValue, { color: Colors.purpleDark, fontWeight: '700' }]}>
              {formatVND(Number(policy.coverageAmount ?? 0))}
            </Text>
          </View>
        </View>

        {/* Người thụ hưởng */}
        {(policy.beneficiaryName || policy.beneficiaryPhone) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Người thụ hưởng</Text>
            {policy.beneficiaryName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Họ tên</Text>
                <Text style={styles.infoValue}>{policy.beneficiaryName}</Text>
              </View>
            )}
            {policy.beneficiaryPhone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{policy.beneficiaryPhone}</Text>
              </View>
            )}
          </View>
        )}

        {/* Lịch sử yêu cầu bồi thường */}
        {policy.claims && policy.claims.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Yêu cầu bồi thường</Text>
            {policy.claims.map((c: any) => (
              <View key={c.id} style={styles.claimItem}>
                <View style={styles.claimRow}>
                  <Text style={styles.claimNumber}>{c.claimNumber ?? c.id}</Text>
                  <Text style={[styles.claimStatus, { color: c.status === 'PAID' ? Colors.success : Colors.gray }]}>
                    {CLAIM_STATUS_LABEL[c.status] ?? c.status}
                  </Text>
                </View>
                <Text style={styles.claimAmount}>{formatVND(Number(c.claimAmount ?? 0))}</Text>
                <Text style={styles.claimReason}>{c.reason}</Text>
                <Text style={styles.claimDate}>{formatDate(c.createdAt)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nút Yêu cầu bồi thường */}
        {canFileClaim && (
          <TouchableOpacity style={styles.claimBtn} onPress={() => setShowClaimModal(true)}>
            <Text style={styles.claimBtnText}>📋 Yêu cầu bồi thường</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal Yêu cầu bồi thường */}
      <Modal visible={showClaimModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => !submittingClaim && setShowClaimModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Yêu cầu bồi thường</Text>
            <Text style={styles.modalHint}>Mức bồi thường tối đa: {formatVND(Number(policy?.coverageAmount ?? 0))}</Text>
            <TextInput
              style={styles.input}
              value={claimAmount}
              onChangeText={(t) => setClaimAmount(t.replace(/\D/g, ''))}
              placeholder="Số tiền yêu cầu (VND)"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={claimReason}
              onChangeText={setClaimReason}
              placeholder="Lý do *"
              placeholderTextColor={Colors.gray}
              multiline
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={claimDescription}
              onChangeText={setClaimDescription}
              placeholder="Mô tả chi tiết (tùy chọn)"
              placeholderTextColor={Colors.gray}
              multiline
            />
            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => !submittingClaim && setShowClaimModal(false)} disabled={submittingClaim}>
                <Text style={styles.modalBtnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnOk, submittingClaim && styles.modalBtnDisabled]} onPress={handleFileClaim} disabled={submittingClaim}>
                {submittingClaim ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.modalBtnOkText}>Gửi yêu cầu</Text>}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.purpleDark },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyText: { ...Typography.body, color: Colors.gray },
  backBtn: { marginTop: Spacing.l, paddingVertical: Spacing.m, paddingHorizontal: Spacing.xl, backgroundColor: Colors.gold, borderRadius: BorderRadius.medium },
  backBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  scroll: { flex: 1 },
  card: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    padding: Spacing.l,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
  },
  cardTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.s, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  infoLabel: { ...Typography.secondary, color: Colors.gray },
  infoValue: { ...Typography.body, color: Colors.black, fontWeight: '500', flex: 1, textAlign: 'right' },
  claimItem: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  claimRow: { flexDirection: 'row', justifyContent: 'space-between' },
  claimNumber: { ...Typography.body, fontWeight: '600', color: Colors.black },
  claimStatus: { ...Typography.caption, fontWeight: '600' },
  claimAmount: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600', marginTop: 4 },
  claimReason: { ...Typography.secondary, color: Colors.darkGray, marginTop: 4 },
  claimDate: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  claimBtn: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    backgroundColor: Colors.info,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  claimBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius.large, borderTopRightRadius: BorderRadius.large, padding: Spacing.xl },
  modalTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.s },
  modalHint: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.m },
  input: {
    ...Typography.body,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  modalRow: { flexDirection: 'row', gap: Spacing.m, marginTop: Spacing.m },
  modalBtnCancel: { flex: 1, paddingVertical: Spacing.m, borderRadius: BorderRadius.medium, backgroundColor: Colors.lightGray, alignItems: 'center' },
  modalBtnCancelText: { ...Typography.body, fontWeight: '600', color: Colors.darkGray },
  modalBtnOk: { flex: 1, paddingVertical: Spacing.m, borderRadius: BorderRadius.medium, backgroundColor: Colors.gold, alignItems: 'center' },
  modalBtnOkText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  modalBtnDisabled: { opacity: 0.7 },
});
