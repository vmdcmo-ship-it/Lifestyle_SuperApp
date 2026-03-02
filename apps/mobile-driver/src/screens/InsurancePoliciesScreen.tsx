import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

export function InsurancePoliciesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email ?? null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [policies, setPolicies] = useState<any[]>([]);

  const load = useCallback(async () => {
    if (isDemo) {
      setPolicies([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setLoading(true);
    try {
      const res = await insuranceService.getMyPolicies({ limit: 50 });
      const data = (res as any)?.data ?? [];
      setPolicies(Array.isArray(data) ? data : []);
    } catch {
      setPolicies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemo]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hợp đồng bảo hiểm</Text>
        <View style={{ width: 80 }} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.gold]} />}
        >
          {policies.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>Chưa có hợp đồng bảo hiểm</Text>
              <Text style={styles.emptyHint}>Mua bảo hiểm tại mục Bảo hiểm để bắt đầu</Text>
              <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.ctaBtnText}>Đến Bảo hiểm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            policies.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.policyCard}
                onPress={() => (navigation as any).navigate('InsurancePolicyDetail', { policyId: p.id })}
                activeOpacity={0.8}
              >
                <View style={styles.policyRow}>
                  <Text style={styles.policyName}>{p.product?.name ?? 'Bảo hiểm'}</Text>
                  <Text style={[styles.policyStatus, { color: p.status === 'ACTIVE' ? Colors.success : Colors.gray }]}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </Text>
                </View>
                <Text style={styles.policyNumber}>Số HĐ: {p.policyNumber ?? p.id}</Text>
                <Text style={styles.policyDate}>
                  Hiệu lực: {formatDate(p.startDate)} - {formatDate(p.endDate)}
                </Text>
                <Text style={styles.policyAmount}>{formatVND(Number(p.premiumAmount ?? 0))}</Text>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
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
  scroll: { flex: 1 },
  emptyCard: {
    margin: Spacing.l,
    padding: Spacing.xxl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    ...Shadows.level1,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.m },
  emptyText: { ...Typography.h3, color: Colors.black },
  emptyHint: { ...Typography.caption, color: Colors.gray, marginTop: 8 },
  ctaBtn: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
  },
  ctaBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  policyCard: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    padding: Spacing.l,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
  },
  policyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  policyName: { ...Typography.body, fontWeight: '600', color: Colors.black, flex: 1 },
  policyStatus: { ...Typography.caption, fontWeight: '600', marginLeft: Spacing.m },
  policyNumber: { ...Typography.secondary, color: Colors.gray, marginTop: 4 },
  policyDate: { ...Typography.secondary, color: Colors.darkGray, marginTop: 4 },
  policyAmount: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark, marginTop: 8 },
});
