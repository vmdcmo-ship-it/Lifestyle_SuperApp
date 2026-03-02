import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card, Avatar, Badge } from '../components/ui';
import {
  MOCK_RUN_TO_EARN,
  RUN_TO_EARN_TIERS,
  RUN_CHALLENGES,
  RUN_LEADERBOARD,
} from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Circular Progress Ring ─────────────────────────────────────────────────

const CircularProgress = ({
  progress,
  size = 200,
  strokeWidth = 12,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressAngle = Math.min(progress, 1) * 360;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background circle */}
      <View
        style={[
          circleStyles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.lightGray + '40',
          },
        ]}
      />
      {/* Progress arc (visual approximation with border) */}
      <View
        style={[
          circleStyles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: Colors.gold,
            borderRightColor: progressAngle > 90 ? Colors.gold : 'transparent',
            borderBottomColor: progressAngle > 180 ? Colors.gold : 'transparent',
            borderLeftColor: progressAngle > 270 ? Colors.gold : 'transparent',
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />
      {/* Center content */}
      <View style={circleStyles.center}>{children}</View>
    </View>
  );
};

const circleStyles = StyleSheet.create({
  ring: { position: 'absolute' },
  center: { alignItems: 'center' },
});

// ─── Main Run to Earn Screen ────────────────────────────────────────────────

export const RunToEarnScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<'today' | 'challenges' | 'leaderboard' | 'rewards' | 'groups'>('today');
  const data = MOCK_RUN_TO_EARN;
  const progress = data.todaySteps / data.todayGoal;

  // Animated step counter
  const animatedSteps = useRef(new Animated.Value(0)).current;
  const [displaySteps, setDisplaySteps] = useState(0);

  useEffect(() => {
    Animated.timing(animatedSteps, {
      toValue: data.todaySteps,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedSteps.addListener(({ value }) => {
      setDisplaySteps(Math.round(value));
    });

    return () => animatedSteps.removeListener(listener);
  }, []);

  const maxWeeklySteps = Math.max(...data.weeklySteps.map((d) => d.steps));

  // Find current tier
  const currentTier = [...RUN_TO_EARN_TIERS]
    .reverse()
    .find((t) => data.todaySteps >= t.steps);
  const nextTier = RUN_TO_EARN_TIERS.find((t) => t.steps > data.todaySteps);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ─── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.white }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Run to Earn 🏃</Text>
        <View style={styles.headerXu}>
          <Text style={styles.headerXuText}>🪙 {data.totalXuEarned}</Text>
        </View>
      </View>

      {/* ─── Tab Selector ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabRow}
      >
        {([
          { key: 'today', label: 'Hôm nay' },
          { key: 'challenges', label: 'Thử thách' },
          { key: 'leaderboard', label: 'BXH' },
          { key: 'rewards', label: 'Đổi điểm' },
          { key: 'groups', label: 'Nhóm' },
        ] as const).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => {
              if (t.key === 'rewards') {
                navigation?.navigate('Rewards');
              } else if (t.key === 'groups') {
                navigation?.navigate('Groups');
              } else {
                setTab(t.key);
              }
            }}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════════════ TODAY TAB ═══════════════════════ */}
        {tab === 'today' && (
          <>
            {/* Main progress circle */}
            <View style={styles.progressSection}>
              <CircularProgress progress={progress} size={220} strokeWidth={14}>
                <Text style={styles.stepsEmoji}>👟</Text>
                <Text style={styles.stepsCount}>
                  {displaySteps.toLocaleString()}
                </Text>
                <Text style={styles.stepsGoal}>/ {data.todayGoal.toLocaleString()} bước</Text>
                <Text style={styles.stepsPercent}>
                  {Math.round(progress * 100)}%
                </Text>
              </CircularProgress>

              {/* Current tier indicator */}
              {currentTier && (
                <View style={styles.tierBadge}>
                  <Text style={styles.tierIcon}>{currentTier.icon}</Text>
                  <Text style={styles.tierLabel}>{currentTier.label}</Text>
                  <Text style={styles.tierXu}>+{currentTier.xu} Xu</Text>
                </View>
              )}

              {/* Next milestone */}
              {nextTier && (
                <Text style={styles.nextMilestone}>
                  Còn {(nextTier.steps - data.todaySteps).toLocaleString()} bước
                  để đạt {nextTier.icon} {nextTier.label} (+{nextTier.xu} Xu)
                </Text>
              )}
            </View>

            {/* Today stats */}
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statIcon}>📏</Text>
                <Text style={styles.statValue}>{data.todayDistance} km</Text>
                <Text style={styles.statLabel}>Khoảng cách</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{data.todayCalories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statIcon}>🪙</Text>
                <Text style={styles.statValue}>+{data.todayXuEarned}</Text>
                <Text style={styles.statLabel}>Xu hôm nay</Text>
              </Card>
            </View>

            {/* Xu earning tiers */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mốc nhận Xu hôm nay</Text>
              <View style={styles.tiersContainer}>
                {RUN_TO_EARN_TIERS.map((tier, i) => {
                  const reached = data.todaySteps >= tier.steps;
                  return (
                    <View key={i} style={styles.tierRow}>
                      <View
                        style={[
                          styles.tierCheck,
                          reached && styles.tierCheckActive,
                        ]}
                      >
                        <Text style={{ fontSize: 14 }}>
                          {reached ? '✅' : tier.icon}
                        </Text>
                      </View>
                      <View style={styles.tierInfo}>
                        <Text
                          style={[
                            styles.tierSteps,
                            reached && styles.tierStepsReached,
                          ]}
                        >
                          {tier.steps.toLocaleString()} bước - {tier.label}
                        </Text>
                        <View style={styles.tierProgressBar}>
                          <View
                            style={[
                              styles.tierProgressFill,
                              {
                                width: `${Math.min(100, (data.todaySteps / tier.steps) * 100)}%`,
                                backgroundColor: reached ? Colors.success : Colors.gold,
                              },
                            ]}
                          />
                        </View>
                      </View>
                      <View style={[styles.tierReward, reached && styles.tierRewardReached]}>
                        <Text
                          style={[
                            styles.tierRewardText,
                            reached && styles.tierRewardTextReached,
                          ]}
                        >
                          🪙 +{tier.xu}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Weekly chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tuần này</Text>
              <Card>
                <View style={styles.weeklyChart}>
                  {data.weeklySteps.map((d, i) => {
                    const isToday = i === 6;
                    const reached = d.steps >= data.todayGoal;
                    return (
                      <View key={i} style={styles.weekBarCol}>
                        <Text style={styles.weekBarXu}>+{d.xu}</Text>
                        <View
                          style={[
                            styles.weekBar,
                            {
                              height: Math.max(4, (d.steps / maxWeeklySteps) * 100),
                              backgroundColor: reached
                                ? Colors.success
                                : isToday
                                ? Colors.gold
                                : Colors.gold + '50',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.weekBarLabel,
                            isToday && { color: Colors.gold, fontWeight: '700' },
                          ]}
                        >
                          {d.day}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.weeklyTotal}>
                  <Text style={styles.weeklyTotalLabel}>Tổng tuần</Text>
                  <Text style={styles.weeklyTotalValue}>
                    🪙 +{data.weeklySteps.reduce((s, d) => s + d.xu, 0)} Xu
                  </Text>
                </View>
              </Card>
            </View>

            {/* Streak & Level */}
            <View style={styles.streakRow}>
              <Card style={styles.streakCard}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakValue}>{data.currentStreak}</Text>
                <Text style={styles.streakLabel}>Chuỗi ngày</Text>
                <Text style={styles.streakBest}>Kỷ lục: {data.bestStreak}</Text>
              </Card>
              <Card style={styles.streakCard}>
                <Text style={styles.streakIcon}>⚡</Text>
                <Text style={styles.streakValue}>Lv.{data.level}</Text>
                <Text style={styles.streakLabel}>{data.levelName}</Text>
                <View style={styles.xpBar}>
                  <View
                    style={[
                      styles.xpFill,
                      { width: `${(data.xpCurrent / data.xpNextLevel) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.xpText}>
                  {data.xpCurrent}/{data.xpNextLevel} XP
                </Text>
              </Card>
            </View>
          </>
        )}

        {/* ═══════════════ CHALLENGES TAB ═════════════════ */}
        {tab === 'challenges' && (
          <View style={styles.section}>
            {RUN_CHALLENGES.map((challenge) => {
              const progressPct = (challenge.progress / challenge.total) * 100;
              const isCompleted = challenge.status === 'COMPLETED';

              return (
                <Card
                  key={challenge.id}
                  style={[
                    styles.challengeCard,
                    isCompleted && styles.challengeCompleted,
                  ]}
                >
                  <View style={styles.challengeHeader}>
                    <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <Text style={styles.challengeDesc}>
                        {challenge.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.challengeReward,
                        isCompleted && styles.challengeRewardDone,
                      ]}
                    >
                      <Text style={styles.challengeRewardText}>
                        🪙 {challenge.reward}
                      </Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View style={styles.challengeProgressRow}>
                    <View style={styles.challengeProgressBar}>
                      <View
                        style={[
                          styles.challengeProgressFill,
                          {
                            width: `${Math.min(100, progressPct)}%`,
                            backgroundColor: isCompleted
                              ? Colors.success
                              : Colors.gold,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.challengeProgressText}>
                      {typeof challenge.progress === 'number' && challenge.progress % 1 !== 0
                        ? challenge.progress.toFixed(1)
                        : challenge.progress}
                      /{challenge.total}
                    </Text>
                  </View>

                  {isCompleted && (
                    <View style={styles.challengeCompletedBadge}>
                      <Text style={styles.challengeCompletedText}>
                        ✅ Hoàn thành! Xu đã được cộng vào ví
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}

        {/* ═══════════════ LEADERBOARD TAB ════════════════ */}
        {tab === 'leaderboard' && (
          <View style={styles.section}>
            {/* Top 3 podium */}
            <View style={styles.podium}>
              {[1, 0, 2].map((idx) => {
                const user = RUN_LEADERBOARD[idx];
                if (!user) return null;
                const isFirst = user.rank === 1;
                return (
                  <View
                    key={user.rank}
                    style={[
                      styles.podiumItem,
                      isFirst && styles.podiumFirst,
                    ]}
                  >
                    <Text style={styles.podiumMedal}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </Text>
                    <Avatar
                      name={user.name}
                      size={isFirst ? 56 : 44}
                    />
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {user.name.split(' ').pop()}
                    </Text>
                    <Text style={styles.podiumSteps}>
                      {(user.steps / 1000).toFixed(0)}K
                    </Text>
                    <Text style={styles.podiumXu}>🪙 {user.xu}</Text>
                  </View>
                );
              })}
            </View>

            {/* Full ranking */}
            {RUN_LEADERBOARD.map((user) => (
              <View
                key={user.rank}
                style={[
                  styles.rankRow,
                  (user as any).isMe && styles.rankRowMe,
                ]}
              >
                <Text style={styles.rankNumber}>#{user.rank}</Text>
                <Avatar name={user.name} size={36} />
                <View style={{ flex: 1, marginLeft: Spacing.m }}>
                  <Text
                    style={[
                      styles.rankName,
                      (user as any).isMe && styles.rankNameMe,
                    ]}
                  >
                    {user.name} {(user as any).isMe ? '(Bạn)' : ''}
                  </Text>
                  <Text style={styles.rankSteps}>
                    {user.steps.toLocaleString()} bước
                  </Text>
                </View>
                <View style={styles.rankXu}>
                  <Text style={styles.rankXuText}>🪙 {user.xu}</Text>
                </View>
              </View>
            ))}

            {/* My rank info */}
            <Card variant="premium" style={styles.myRankCard}>
              <Text style={styles.myRankTitle}>Vị trí của bạn</Text>
              <Text style={styles.myRankPosition}>#5 / 1,250 người tham gia</Text>
              <Text style={styles.myRankHint}>
                Cần thêm 70,000 bước nữa để lên Top 4! 💪
              </Text>
            </Card>
          </View>
        )}

        {/* ═══════════════ REWARDS TAB ═════════════════ */}
        {tab === 'rewards' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.fullFeatureCard}
              onPress={() => navigation?.navigate('Rewards')}
            >
              <Text style={styles.fullFeatureIcon}>🎁</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullFeatureTitle}>Đổi điểm lấy quà</Text>
                <Text style={styles.fullFeatureDesc}>
                  Dùng Xu để đổi quà tặng, voucher, phụ kiện chạy bộ
                </Text>
              </View>
              <Text style={styles.fullFeatureArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════════════ GROUPS TAB ══════════════════ */}
        {tab === 'groups' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.fullFeatureCard}
              onPress={() => navigation?.navigate('Groups')}
            >
              <Text style={styles.fullFeatureIcon}>👥</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.fullFeatureTitle}>Tham gia nhóm chạy</Text>
                <Text style={styles.fullFeatureDesc}>
                  Kết nối với cộng đồng runner, cùng nhau hoạt động
                </Text>
              </View>
              <Text style={styles.fullFeatureArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.purpleDark,
  },
  headerTitle: { ...Typography.h2, color: Colors.white, flex: 1, marginLeft: Spacing.m },
  headerXu: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerXuText: { ...Typography.secondary, color: Colors.gold, fontWeight: '700' },

  // Tabs
  tabScroll: { backgroundColor: Colors.white },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    gap: 4,
  },
  tab: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.gold },
  tabText: { ...Typography.secondary, color: Colors.gray, fontWeight: '500' },
  tabTextActive: { color: Colors.purpleDark, fontWeight: '700' },

  // Progress section
  progressSection: { alignItems: 'center', paddingVertical: Spacing.xxl, backgroundColor: Colors.white },
  stepsEmoji: { fontSize: 32, marginBottom: 4 },
  stepsCount: { fontSize: 42, fontWeight: '800', color: Colors.purpleDark },
  stepsGoal: { ...Typography.secondary, color: Colors.gray },
  stepsPercent: { ...Typography.h3, color: Colors.gold, marginTop: 4 },

  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: Spacing.l,
    gap: 6,
  },
  tierIcon: { fontSize: 18 },
  tierLabel: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '600' },
  tierXu: { ...Typography.secondary, color: Colors.gold, fontWeight: '700' },
  nextMilestone: {
    ...Typography.caption,
    color: Colors.gray,
    marginTop: Spacing.m,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
    marginTop: Spacing.l,
  },
  statCard: { flex: 1, alignItems: 'center', padding: Spacing.m },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { ...Typography.h3, color: Colors.purpleDark },
  statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },

  // Sections
  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },

  // Tiers
  tiersContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m },
  tierCheck: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  tierCheckActive: { backgroundColor: Colors.success + '20' },
  tierInfo: { flex: 1 },
  tierSteps: { ...Typography.secondary, color: Colors.darkGray },
  tierStepsReached: { color: Colors.success, fontWeight: '600', textDecorationLine: 'line-through' },
  tierProgressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  tierProgressFill: { height: 4, borderRadius: 2 },
  tierReward: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: Spacing.s,
  },
  tierRewardReached: { backgroundColor: Colors.success + '15' },
  tierRewardText: { ...Typography.caption, color: Colors.gray, fontWeight: '600' },
  tierRewardTextReached: { color: Colors.success },

  // Weekly chart
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: Spacing.m,
  },
  weekBarCol: { alignItems: 'center', flex: 1 },
  weekBar: { width: 24, borderRadius: 4, minHeight: 4 },
  weekBarLabel: { ...Typography.caption, color: Colors.gray, marginTop: 6 },
  weekBarXu: { ...Typography.tiny, color: Colors.gold, fontWeight: '600', marginBottom: 4 },
  weeklyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.m,
  },
  weeklyTotalLabel: { ...Typography.secondary, color: Colors.gray },
  weeklyTotalValue: { ...Typography.body, color: Colors.gold, fontWeight: '700' },

  // Streak
  streakRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
    marginTop: Spacing.xl,
  },
  streakCard: { flex: 1, alignItems: 'center' },
  streakIcon: { fontSize: 32, marginBottom: 4 },
  streakValue: { ...Typography.h2, color: Colors.purpleDark },
  streakLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  streakBest: { ...Typography.tiny, color: Colors.gold, marginTop: 4 },
  xpBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    marginTop: Spacing.s,
    overflow: 'hidden',
  },
  xpFill: { height: 6, backgroundColor: Colors.gold, borderRadius: 3 },
  xpText: { ...Typography.tiny, color: Colors.gray, marginTop: 4 },

  // Challenges
  challengeCard: { marginBottom: Spacing.m },
  challengeCompleted: { opacity: 0.8 },
  challengeHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  challengeIcon: { fontSize: 32, marginRight: Spacing.m },
  challengeTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  challengeDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  challengeReward: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  challengeRewardDone: { backgroundColor: Colors.success + '15' },
  challengeRewardText: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },
  challengeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.m,
    gap: Spacing.m,
  },
  challengeProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeProgressFill: { height: 8, borderRadius: 4 },
  challengeProgressText: { ...Typography.caption, color: Colors.darkGray, fontWeight: '600', width: 50, textAlign: 'right' },
  challengeCompletedBadge: {
    backgroundColor: Colors.success + '10',
    padding: Spacing.s,
    borderRadius: BorderRadius.small,
    marginTop: Spacing.m,
  },
  challengeCompletedText: { ...Typography.caption, color: Colors.success, textAlign: 'center' },

  // Leaderboard
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: Spacing.xl,
    gap: Spacing.m,
  },
  podiumItem: { alignItems: 'center', width: 90 },
  podiumFirst: { marginBottom: 20 },
  podiumMedal: { fontSize: 24, marginBottom: 4 },
  podiumName: { ...Typography.caption, color: Colors.black, fontWeight: '600', marginTop: 6 },
  podiumSteps: { ...Typography.tiny, color: Colors.gray },
  podiumXu: { ...Typography.tiny, color: Colors.gold, fontWeight: '600' },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.medium,
    marginBottom: 4,
  },
  rankRowMe: { backgroundColor: Colors.gold + '10', borderWidth: 1, borderColor: Colors.gold },
  rankNumber: { ...Typography.body, fontWeight: '700', color: Colors.gray, width: 30 },
  rankName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  rankNameMe: { color: Colors.gold },
  rankSteps: { ...Typography.caption, color: Colors.gray },
  rankXu: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rankXuText: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },

  myRankCard: { marginTop: Spacing.l, alignItems: 'center' },
  myRankTitle: { ...Typography.secondary, color: Colors.silver },
  myRankPosition: { ...Typography.h2, color: Colors.gold, marginVertical: 4 },
  myRankHint: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Full feature cards (for Rewards & Groups tabs)
  fullFeatureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    ...Shadows.level2,
  },
  fullFeatureIcon: { fontSize: 48, marginRight: Spacing.l },
  fullFeatureTitle: { ...Typography.h3, color: Colors.black, marginBottom: 4 },
  fullFeatureDesc: { ...Typography.secondary, color: Colors.gray, lineHeight: 18 },
  fullFeatureArrow: { fontSize: 24, color: Colors.primary },
});
