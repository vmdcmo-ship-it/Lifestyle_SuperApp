import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { MOCK_REVIEWS, MOCK_MERCHANT } from '../data/mockData';

export const ReviewsScreen = () => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: MOCK_REVIEWS.filter((r) => r.rating === star).length,
    percent: (MOCK_REVIEWS.filter((r) => r.rating === star).length / MOCK_REVIEWS.length) * 100,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Đánh giá</Text>
        </View>

        {/* Rating Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewLeft}>
            <Text style={styles.overviewScore}>{avgRating.toFixed(1)}</Text>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 18,
                    color: i < Math.round(avgRating) ? Colors.gold : Colors.lightGray,
                  }}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.overviewCount}>
              {MOCK_MERCHANT.totalReviews} đánh giá
            </Text>
          </View>
          <View style={styles.overviewRight}>
            {ratingDistribution.map((d) => (
              <View key={d.star} style={styles.distRow}>
                <Text style={styles.distStar}>{d.star} ★</Text>
                <View style={styles.distBar}>
                  <View
                    style={[
                      styles.distFill,
                      { width: `${d.percent}%` },
                    ]}
                  />
                </View>
                <Text style={styles.distCount}>{d.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterActive}>
            <Text style={styles.filterActiveText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Chưa trả lời</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>Đã trả lời</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filter}>
            <Text style={styles.filterText}>≤ 3 ★</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        {MOCK_REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            {/* Customer info */}
            <View style={styles.reviewHeader}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerInitial}>
                  {review.customer[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>{review.customer}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </Text>
              </View>
            </View>

            {/* Comment */}
            <Text style={styles.reviewComment}>{review.comment}</Text>

            {/* Reply section */}
            {review.replied ? (
              <View style={styles.replyBox}>
                <Text style={styles.replyLabel}>
                  🏪 Phản hồi từ {MOCK_MERCHANT.storeName}:
                </Text>
                <Text style={styles.replyContent}>
                  Cảm ơn bạn đã ghé quán! Chúng tôi sẽ cố gắng phục vụ tốt
                  hơn nữa. 🙏
                </Text>
              </View>
            ) : replyingTo === review.id ? (
              <View style={styles.replyForm}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Viết phản hồi..."
                  placeholderTextColor={Colors.gray}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  numberOfLines={2}
                />
                <View style={styles.replyActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                  >
                    <Text style={styles.replyCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replySendBtn}>
                    <Text style={styles.replySendText}>Gửi phản hồi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() => setReplyingTo(review.id)}
              >
                <Text style={styles.replyBtnText}>💬 Phản hồi</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: { backgroundColor: Colors.white, padding: Spacing.l },
  title: { ...Typography.h1, color: Colors.black },

  // Overview
  overviewCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    margin: Spacing.l,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  overviewLeft: { alignItems: 'center', marginRight: Spacing.xl },
  overviewScore: { fontSize: 40, fontWeight: '700', color: Colors.purpleDark },
  starsRow: { flexDirection: 'row', marginTop: 4 },
  overviewCount: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  overviewRight: { flex: 1, justifyContent: 'center', gap: 4 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distStar: { ...Typography.caption, color: Colors.gray, width: 30 },
  distBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.offWhite,
    borderRadius: 3,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  distFill: { height: 6, backgroundColor: Colors.gold, borderRadius: 3 },
  distCount: { ...Typography.caption, color: Colors.gray, width: 20, textAlign: 'right' },

  // Filter
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.s,
    marginBottom: Spacing.m,
  },
  filter: {
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
  },
  filterActive: {
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.gold,
  },
  filterText: { ...Typography.secondary, color: Colors.gray },
  filterActiveText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },

  // Review card
  reviewCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gold + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  customerInitial: { ...Typography.body, fontWeight: '700', color: Colors.gold },
  customerName: { ...Typography.secondary, fontWeight: '600', color: Colors.black },
  reviewDate: { ...Typography.caption, color: Colors.gray },
  ratingBadge: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingBadgeText: { fontSize: 12, color: Colors.gold },

  reviewComment: { ...Typography.body, color: Colors.darkGray, lineHeight: 22 },

  // Reply
  replyBox: {
    backgroundColor: Colors.offWhite,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.m,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  replyLabel: { ...Typography.caption, color: Colors.gold, fontWeight: '600', marginBottom: 4 },
  replyContent: { ...Typography.secondary, color: Colors.darkGray },

  replyBtn: { marginTop: Spacing.m },
  replyBtnText: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },

  replyForm: { marginTop: Spacing.m },
  replyInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    ...Typography.secondary,
    color: Colors.black,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.m,
    marginTop: Spacing.s,
  },
  replyCancelText: { ...Typography.secondary, color: Colors.gray, paddingVertical: 8 },
  replySendBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.l,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
  },
  replySendText: { ...Typography.secondary, color: Colors.purpleDark, fontWeight: '700' },
});
