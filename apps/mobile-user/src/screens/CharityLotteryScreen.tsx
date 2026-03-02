import React, { useState } from 'react';
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
import { MOCK_CHARITY_LOTTERY } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const formatVND = (n: number) => {
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + ' tỷ';
  if (n >= 1000000) return (n / 1000000).toFixed(0) + ' triệu';
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
};

const TICKET_AMOUNTS = [1, 5, 10, 20, 50];

export const CharityLotteryScreen = ({ navigation }: any) => {
  const [selectedTickets, setSelectedTickets] = useState(5);
  const data = MOCK_CHARITY_LOTTERY;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.white }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vé số yêu thương</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 20, color: Colors.white }}>📋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero jackpot */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>❤️ Mỗi vé số = Một yêu thương</Text>
          <Text style={styles.heroJackpot}>{formatVND(data.currentJackpot)}</Text>
          <Text style={styles.heroSubtext}>Giải thưởng kỳ này</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{formatVND(data.totalRaised)}</Text>
              <Text style={styles.heroStatLabel}>Đã quyên góp</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{data.beneficiaries.toLocaleString()}</Text>
              <Text style={styles.heroStatLabel}>Người được giúp</Text>
            </View>
          </View>
          <View style={styles.nextDraw}>
            <Text style={styles.nextDrawText}>
              🎰 Quay số tiếp theo: {data.nextDrawDate} lúc {data.nextDrawTime}
            </Text>
          </View>
        </View>

        {/* Buy tickets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mua vé số yêu thương</Text>
          <View style={styles.buyCard}>
            <Text style={styles.buyLabel}>Chọn số lượng vé</Text>
            <View style={styles.ticketGrid}>
              {TICKET_AMOUNTS.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.ticketBtn,
                    selectedTickets === amt && styles.ticketBtnActive,
                  ]}
                  onPress={() => setSelectedTickets(amt)}
                >
                  <Text style={[
                    styles.ticketBtnText,
                    selectedTickets === amt && styles.ticketBtnTextActive,
                  ]}>
                    {amt} vé
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buyTotal}>
              <View>
                <Text style={styles.buyTotalLabel}>Tổng tiền</Text>
                <Text style={styles.buyTotalAmount}>
                  {new Intl.NumberFormat('vi-VN').format(selectedTickets * data.ticketPrice)}đ
                </Text>
              </View>
              <TouchableOpacity style={styles.buyBtn}>
                <Text style={styles.buyBtnText}>🎫 Mua ngay</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buyNote}>
              <Text style={styles.buyNoteIcon}>💡</Text>
              <Text style={styles.buyNoteText}>
                100% lợi nhuận được chuyển trực tiếp đến các chiến dịch từ thiện. Vé số được xổ công khai, minh bạch.
              </Text>
            </View>
          </View>
        </View>

        {/* Campaigns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chiến dịch đang diễn ra</Text>
          {data.campaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100;
            return (
              <TouchableOpacity key={campaign.id} style={styles.campaignCard}>
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignEmoji}>{campaign.image}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.campaignTitle}>{campaign.title}</Text>
                    <Text style={styles.campaignSupporters}>
                      {campaign.supporters.toLocaleString()} người ủng hộ
                    </Text>
                  </View>
                </View>

                <Text style={styles.campaignDesc}>{campaign.description}</Text>

                {/* Progress bar */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressRaised}>{formatVND(campaign.raised)}</Text>
                  <Text style={styles.progressGoal}>Mục tiêu: {formatVND(campaign.goal)}</Text>
                </View>
                <Text style={styles.campaignEnd}>Kết thúc: {campaign.endDate}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent winners */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người may mắn gần đây</Text>
          <View style={styles.winnersCard}>
            {data.recentWinners.map((winner, i) => (
              <View
                key={i}
                style={[
                  styles.winnerRow,
                  i < data.recentWinners.length - 1 && styles.winnerBorder,
                ]}
              >
                <Text style={styles.winnerEmoji}>🎉</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.winnerName}>{winner.name}</Text>
                  <Text style={styles.winnerDate}>{winner.date}</Text>
                </View>
                <Text style={styles.winnerPrize}>
                  +{new Intl.NumberFormat('vi-VN').format(winner.prize)}đ
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Impact story */}
        <View style={styles.section}>
          <View style={styles.impactCard}>
            <Text style={styles.impactEmoji}>🧓</Text>
            <Text style={styles.impactTitle}>Câu chuyện yêu thương</Text>
            <Text style={styles.impactStory}>
              "Nhờ chương trình Vé số yêu thương, cụ Nguyễn Thị Hoa (87 tuổi, Bình Dương) 
              đã được hỗ trợ tiền thuốc và chi phí sinh hoạt hàng tháng. Cụ rất xúc động 
              và gửi lời cảm ơn đến tất cả mọi người."
            </Text>
            <TouchableOpacity>
              <Text style={styles.impactMore}>Xem thêm câu chuyện →</Text>
            </TouchableOpacity>
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
    backgroundColor: Colors.red,
  },
  headerTitle: { ...Typography.h2, color: Colors.white },

  heroCard: {
    backgroundColor: Colors.red,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  heroLabel: { ...Typography.secondary, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  heroJackpot: { fontSize: 36, fontWeight: '900', color: Colors.gold },
  heroSubtext: { ...Typography.secondary, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  heroStats: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    gap: Spacing.xl,
  },
  heroStat: { alignItems: 'center' },
  heroStatValue: { ...Typography.h3, color: Colors.white, fontWeight: '700' },
  heroStatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  nextDraw: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: Spacing.l,
  },
  nextDrawText: { ...Typography.caption, color: Colors.white, fontWeight: '500' },

  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },

  buyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level2,
  },
  buyLabel: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500', marginBottom: Spacing.m },
  ticketGrid: { flexDirection: 'row', gap: Spacing.s, flexWrap: 'wrap' },
  ticketBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  ticketBtnActive: { borderColor: Colors.red, backgroundColor: Colors.red + '10' },
  ticketBtnText: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '600' },
  ticketBtnTextActive: { color: Colors.red },

  buyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.offWhite,
  },
  buyTotalLabel: { ...Typography.caption, color: Colors.gray },
  buyTotalAmount: { ...Typography.h2, color: Colors.black, fontWeight: '800' },
  buyBtn: {
    backgroundColor: Colors.red,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
  },
  buyBtnText: { ...Typography.body, color: Colors.white, fontWeight: '700' },
  buyNote: {
    flexDirection: 'row',
    marginTop: Spacing.l,
    backgroundColor: Colors.gold + '10',
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    gap: 8,
  },
  buyNoteIcon: { fontSize: 16 },
  buyNoteText: { ...Typography.caption, color: Colors.darkGray, flex: 1, lineHeight: 18 },

  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  campaignHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.m, marginBottom: Spacing.s },
  campaignEmoji: { fontSize: 40 },
  campaignTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  campaignSupporters: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  campaignDesc: { ...Typography.secondary, color: Colors.darkGray, lineHeight: 20, marginBottom: Spacing.m },
  progressBar: {
    height: 8,
    backgroundColor: Colors.offWhite,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.red,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressRaised: { ...Typography.caption, color: Colors.red, fontWeight: '700' },
  progressGoal: { ...Typography.caption, color: Colors.gray },
  campaignEnd: { ...Typography.tiny, color: Colors.gray, marginTop: 6 },

  winnersCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
    overflow: 'hidden',
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    gap: Spacing.m,
  },
  winnerBorder: { borderBottomWidth: 1, borderBottomColor: Colors.offWhite },
  winnerEmoji: { fontSize: 20 },
  winnerName: { ...Typography.secondary, color: Colors.black, fontWeight: '500' },
  winnerDate: { ...Typography.caption, color: Colors.gray },
  winnerPrize: { ...Typography.body, color: Colors.success, fontWeight: '700' },

  impactCard: {
    backgroundColor: Colors.gold + '10',
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  impactEmoji: { fontSize: 48, marginBottom: Spacing.m },
  impactTitle: { ...Typography.h3, color: Colors.purpleDark, marginBottom: Spacing.s },
  impactStory: {
    ...Typography.secondary,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  impactMore: { ...Typography.secondary, color: Colors.gold, fontWeight: '600', marginTop: Spacing.l },
});
