/**
 * Tab Nhiệm vụ: thử thách nhận X đơn để nhận XX VND (tham khảo Ahamove/Lalamove).
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { missionsService } from '../services/missions.service';
import { MOCK_MISSIONS, isDemoDriverEmail } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

type Mission = {
  id: string;
  title: string;
  reward: number;
  progress: number;
  target: number;
  unit: string;
  completed?: boolean;
};

export function MissionsScreen() {
  const { user } = useAuth();
  const isDemo = isDemoDriverEmail(user?.email);
  const [missions, setMissions] = useState<Mission[]>(isDemo ? MOCK_MISSIONS : []);
  const [loading, setLoading] = useState(!isDemo);
  const [refreshing, setRefreshing] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const loadMissions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (!isDemo) setLoading(true);
    try {
      const res = await missionsService.getList();
      const data = (res as any)?.data ?? [];
      setMissions(isDemo && data.length === 0 ? MOCK_MISSIONS : (data as Mission[]));
    } catch {
      setMissions(isDemo ? MOCK_MISSIONS : []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDemo]);

  useFocusEffect(
    useCallback(() => {
      loadMissions();
    }, [loadMissions]),
  );

  const handleClaim = useCallback(async (m: Mission) => {
    setClaimingId(m.id);
    try {
      await missionsService.claimReward(m.id);
      Alert.alert('Thành công', `Đã nhận thưởng ${m.reward.toLocaleString()}đ vào ví`);
      loadMissions(true);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể nhận thưởng');
    } finally {
      setClaimingId(null);
    }
  }, [loadMissions]);

  const list = missions.length > 0 ? missions : (isDemo ? MOCK_MISSIONS : []);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Nhiệm vụ</Text>
        <Text style={styles.subtitle}>Hoàn thành thử thách để nhận thưởng</Text>
        <View style={styles.testBadge}>
          <Text style={styles.testBadgeText}>Đang thử nghiệm</Text>
        </View>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadMissions(true)} colors={[Colors.gold]} />
        }
      >
        {loading && list.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.gold} />
          </View>
        ) : (
          list.map((m) => {
          const pct = Math.min(100, ((m.progress ?? 0) / m.target) * 100);
          const completed = pct >= 100 || m.completed;
          return (
            <View key={m.id} style={styles.card}>
              <Text style={styles.cardTitle}>{m.title}</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {m.progress ?? 0}/{m.target} {m.unit}
                </Text>
              </View>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardLabel}>Thưởng:</Text>
                <Text style={styles.rewardValue}>{new Intl.NumberFormat('vi-VN').format(m.reward)}đ</Text>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={() => completed && handleClaim(m)}
                disabled={!completed || !!claimingId}
              >
                {claimingId === m.id ? (
                  <ActivityIndicator size="small" color={Colors.purpleDark} />
                ) : (
                  <Text style={styles.btnText}>{completed ? 'Nhận thưởng' : 'Đang thực hiện'}</Text>
                )}
              </TouchableOpacity>
            </View>
          );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.l, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  title: { ...Typography.h1, color: Colors.black },
  subtitle: { ...Typography.secondary, color: Colors.gray, marginTop: 4 },
  testBadge: { marginTop: Spacing.s },
  testBadgeText: { ...Typography.caption, color: Colors.info, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.l },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  cardTitle: { ...Typography.body, fontWeight: '600', color: Colors.black, marginBottom: Spacing.m },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.m, marginBottom: Spacing.s },
  progressBar: { flex: 1, height: 8, backgroundColor: Colors.lightGray, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 4 },
  progressText: { ...Typography.caption, color: Colors.gray, minWidth: 60 },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m },
  rewardLabel: { ...Typography.secondary, color: Colors.gray },
  rewardValue: { ...Typography.body, fontWeight: '700', color: Colors.gold },
  btn: {
    backgroundColor: Colors.gold + '40',
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.s,
    alignItems: 'center',
  },
  btnText: { ...Typography.caption, color: Colors.purpleDark, fontWeight: '600' },
});
