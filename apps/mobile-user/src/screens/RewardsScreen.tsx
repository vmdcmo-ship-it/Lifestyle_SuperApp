import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card } from '../components/ui';
import {
  DAILY_CHECKIN,
  REWARD_MISSIONS,
  REWARD_CATEGORIES,
  REWARD_SHOP_ITEMS,
  type RewardCategory,
} from '../data/mockData';

export const RewardsScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all');

  const filteredItems =
    selectedCategory === 'all'
      ? REWARD_SHOP_ITEMS
      : REWARD_SHOP_ITEMS.filter((item) => item.category === selectedCategory);

  const userPoints = 649; // From MOCK_RUN_TO_EARN.totalXuEarned

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.headerBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi điểm</Text>
        <View style={styles.headerPoints}>
          <Text style={styles.headerPointsText}>🪙 {userPoints}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Daily Check-in */}
        <View style={styles.checkinSection}>
          <View style={styles.checkinHeader}>
            <View>
              <Text style={styles.checkinTitle}>Điểm của bạn</Text>
              <Text style={styles.checkinPoints}>🪙 {userPoints}</Text>
            </View>
            <TouchableOpacity style={styles.checkinManageBtn}>
              <Text style={styles.checkinManageText}>Quản lý quà & điểm</Text>
            </TouchableOpacity>
          </View>

          {/* Daily streak */}
          <View style={styles.dailyRow}>
            {DAILY_CHECKIN.rewards.map((reward, idx) => {
              const isCurrent = idx === DAILY_CHECKIN.streak - 1;
              const isPast = idx < DAILY_CHECKIN.streak - 1;
              return (
                <View key={idx} style={styles.dailyItem}>
                  <View
                    style={[
                      styles.dailyCircle,
                      isPast && styles.dailyCirclePast,
                      isCurrent && styles.dailyCircleCurrent,
                    ]}
                  >
                    <Text style={styles.dailyPoints}>
                      {reward.points >= 1000 ? `${reward.points / 1000}k` : reward.points}
                    </Text>
                  </View>
                  <Text style={[styles.dailyLabel, isCurrent && styles.dailyLabelCurrent]}>
                    {idx === 6 ? `Ngày ${idx + 1}` : `${reward.points}`}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Checkin button */}
          <TouchableOpacity
            style={[styles.checkinBtn, DAILY_CHECKIN.todayChecked && styles.checkinBtnDone]}
            disabled={DAILY_CHECKIN.todayChecked}
          >
            <Text style={styles.checkinBtnText}>
              {DAILY_CHECKIN.todayChecked
                ? 'Điểm danh hôm nay thành công ✅'
                : `Điểm danh nhận ngay ${DAILY_CHECKIN.rewards[DAILY_CHECKIN.streak]?.points} điểm`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nhiệm vụ tích điểm</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {REWARD_MISSIONS.map((mission) => (
            <Card key={mission.id} style={styles.missionCard}>
              <View style={styles.missionContent}>
                <Text style={styles.missionIcon}>{mission.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDesc}>{mission.desc}</Text>
                </View>
                <View style={styles.missionReward}>
                  <Text style={styles.missionPoints}>🪙 {mission.points}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Rewards Shop */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đổi quà</Text>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {REWARD_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.key && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat.key && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.icon} {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Products grid */}
          <View style={styles.productsGrid}>
            {filteredItems.map((item) => {
              const canAfford = userPoints >= item.points;
              const isOutOfStock = item.stock === 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productCard}
                  disabled={!canAfford || isOutOfStock}
                >
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  {isOutOfStock && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Tạm hết quà</Text>
                    </View>
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View style={styles.productFooter}>
                      <View style={styles.productPoints}>
                        <Text
                          style={[
                            styles.productPointsText,
                            !canAfford && styles.productPointsTextDisabled,
                          ]}
                        >
                          🪙 {item.points.toLocaleString()}
                        </Text>
                      </View>
                      <Text style={styles.productStock}>Còn lại {item.stock}</Text>
                    </View>
                    {!isOutOfStock && (
                      <TouchableOpacity
                        style={[styles.exchangeBtn, !canAfford && styles.exchangeBtnDisabled]}
                        disabled={!canAfford}
                      >
                        <Text style={styles.exchangeBtnText}>
                          {canAfford ? 'Đổi ngay' : 'Không đủ điểm'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerBack: { fontSize: 24, color: Colors.purpleDark },
  headerTitle: {
    ...Typography.h3,
    flex: 1,
    marginLeft: Spacing.m,
    color: Colors.black,
  },
  headerPoints: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerPointsText: { ...Typography.secondary, color: Colors.gold, fontWeight: '700' },

  // Check-in
  checkinSection: {
    backgroundColor: '#8B4513', // brown gradient background
    padding: Spacing.l,
  },
  checkinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  checkinTitle: { ...Typography.caption, color: Colors.white },
  checkinPoints: { ...Typography.h2, color: Colors.gold, fontWeight: '800' },
  checkinManageBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  checkinManageText: { ...Typography.caption, color: Colors.white },

  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.l,
  },
  dailyItem: { alignItems: 'center' },
  dailyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dailyCirclePast: { backgroundColor: Colors.gold + '80' },
  dailyCircleCurrent: {
    backgroundColor: Colors.gold,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  dailyPoints: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  dailyLabel: { ...Typography.tiny, color: 'rgba(255,255,255,0.6)' },
  dailyLabelCurrent: { color: Colors.gold, fontWeight: '700' },

  checkinBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  checkinBtnDone: { backgroundColor: Colors.success },
  checkinBtnText: { ...Typography.body, color: Colors.white, fontWeight: '700' },

  // Sections
  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionTitle: { ...Typography.h3, color: Colors.black },
  sectionLink: { ...Typography.secondary, color: Colors.primary, fontWeight: '600' },

  // Missions
  missionCard: { marginBottom: Spacing.m },
  missionContent: { flexDirection: 'row', alignItems: 'center' },
  missionIcon: { fontSize: 32, marginRight: Spacing.m },
  missionTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  missionDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  missionReward: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: Spacing.s,
  },
  missionPoints: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },

  // Categories
  categoriesScroll: { marginBottom: Spacing.m },
  categoriesContent: { paddingRight: Spacing.l },
  categoryChip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    marginRight: Spacing.s,
  },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryChipText: { ...Typography.caption, color: Colors.gray, fontWeight: '600' },
  categoryChipTextActive: { color: Colors.white },

  // Products
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  productCard: {
    width: '50%',
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: BorderRadius.medium,
    borderTopRightRadius: BorderRadius.medium,
    backgroundColor: Colors.lightGray,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outOfStockText: { ...Typography.tiny, color: Colors.white, fontWeight: '600' },
  productInfo: {
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderBottomLeftRadius: BorderRadius.medium,
    borderBottomRightRadius: BorderRadius.medium,
    ...Shadows.level1,
  },
  productName: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.black,
    minHeight: 32,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPoints: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  productPointsText: { ...Typography.tiny, color: Colors.gold, fontWeight: '700' },
  productPointsTextDisabled: { color: Colors.gray },
  productStock: { ...Typography.tiny, color: Colors.gray },
  exchangeBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  exchangeBtnDisabled: { backgroundColor: Colors.lightGray },
  exchangeBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
});
