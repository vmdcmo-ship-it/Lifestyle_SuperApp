import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Card, Button } from '../components/ui';
import { PENSION_CONTRIBUTION_LEVELS, PENSION_FAQ } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Pension Calculator Logic ───────────────────────────────────────────────

interface PensionResult {
  totalContribution: number;
  monthlyPension: number;
  pensionRate: number;
  yearsContributed: number;
  monthlyContribution: number;
  roi: number;
  paybackYears: number;
  dailyEquivalent: string;
}

function calculatePension(
  gender: 'male' | 'female',
  currentAge: number,
  contributionLevel: number,
  yearsToContribute: number,
): PensionResult {
  const level = PENSION_CONTRIBUTION_LEVELS[contributionLevel];
  const baseSalary = level.baseSalary;
  const monthlyContribution = level.monthlyContribution;
  const totalContribution = monthlyContribution * 12 * yearsToContribute;

  // Pension rate: 45% for first 20 years, then +2% (male) or +3% (female) per extra year, max 75%
  let pensionRate: number;
  if (yearsToContribute < 20) {
    pensionRate = (yearsToContribute / 20) * 45;
  } else {
    const extraYears = yearsToContribute - 20;
    const ratePerExtraYear = gender === 'male' ? 2 : 3;
    pensionRate = Math.min(75, 45 + extraYears * ratePerExtraYear);
  }

  const monthlyPension = (pensionRate / 100) * baseSalary;
  const annualPension = monthlyPension * 12;
  const roi = totalContribution > 0 ? ((annualPension * 15) / totalContribution) * 100 : 0;
  const paybackYears = annualPension > 0 ? Math.ceil(totalContribution / annualPension) : 0;

  const dailyAmount = monthlyContribution / 30;
  let dailyEquivalent = '';
  if (dailyAmount < 20000) dailyEquivalent = `= ${Math.round(dailyAmount / 10000)} ly trà đá/ngày`;
  else if (dailyAmount < 50000) dailyEquivalent = `= ${(dailyAmount / 25000).toFixed(1)} bát phở/ngày`;
  else dailyEquivalent = `= ${(dailyAmount / 50000).toFixed(1)} bữa cơm/ngày`;

  return {
    totalContribution,
    monthlyPension,
    pensionRate,
    yearsContributed: yearsToContribute,
    monthlyContribution,
    roi,
    paybackYears,
    dailyEquivalent,
  };
}

// ─── Insurance Hub Screen ───────────────────────────────────────────────────

export const InsuranceScreen = ({ navigation }: any) => {
  /** Danh mục đồng bộ với App Driver - cross-sell bảo hiểm */
  const insuranceProducts = [
    { id: 'bhxh', icon: '🌸', title: 'BHXH Tự nguyện', subtitle: 'Tích lũy thảnh thơi - An nhàn tuổi già', color: '#FFB6C1', textColor: '#8B3A62' },
    { id: 'tnds', icon: '🏍️', title: 'TNDS Bắt buộc', subtitle: 'BH trách nhiệm dân sự xe máy/ô tô', color: '#E3F2FD', textColor: '#1565C0' },
    { id: 'vatChat', icon: '🚗', title: 'Vật chất xe', subtitle: 'Bảo vệ toàn diện cho xế yêu', color: '#FFF3E0', textColor: '#E65100' },
    { id: 'life', icon: '🛡️', title: 'Bảo hiểm nhân thọ', subtitle: 'Bản Thiết Kế Tương Lai', color: '#F3E5F5', textColor: '#6A1B9A' },
    { id: 'health', icon: '🏥', title: 'Bảo hiểm Y tế', subtitle: 'Chăm sóc sức khỏe toàn diện', color: '#E1F5FE', textColor: '#0277BD' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.insuranceHeader}>
          <Text style={styles.insuranceTitle}>Bảo hiểm</Text>
          <Text style={styles.insuranceSubtitle}>
            Bảo vệ tương lai cho bạn và gia đình
          </Text>
        </View>

        {/* Product Cards */}
        <View style={styles.productsList}>
          {insuranceProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: product.color }]}
              onPress={() => {
                if (product.id === 'bhxh') navigation?.navigate('PensionCalculator');
              }}
            >
              <Text style={styles.productIcon}>{product.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.productTitle, { color: product.textColor }]}>
                  {product.title}
                </Text>
                <Text style={[styles.productSubtitle, { color: product.textColor }]}>
                  {product.subtitle}
                </Text>
              </View>
              <Text style={{ fontSize: 20, color: product.textColor }}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <Card style={{ marginHorizontal: Spacing.l, marginTop: Spacing.xl }}>
          <Text style={styles.statsTitle}>📊 Bảo hiểm của tôi</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Hợp đồng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0đ</Text>
              <Text style={styles.statLabel}>Đã đóng</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Quyền lợi</Text>
            </View>
          </View>
          <Button
            title="Bắt đầu tham gia ngay"
            onPress={() => navigation?.navigate('PensionCalculator')}
            variant="primary"
            style={{ marginTop: Spacing.l }}
          />
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Pension Calculator Screen ──────────────────────────────────────────────

export const PensionCalculatorScreen = ({ navigation }: any) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [currentAge, setCurrentAge] = useState('30');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [yearsToContribute, setYearsToContribute] = useState('25');
  const [showResult, setShowResult] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const result = useMemo(() => {
    return calculatePension(
      gender,
      parseInt(currentAge) || 30,
      selectedLevel,
      parseInt(yearsToContribute) || 20,
    );
  }, [gender, currentAge, selectedLevel, yearsToContribute]);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + 'đ';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.calcHeader}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={{ fontSize: 24, color: Colors.purpleDark }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.calcTitle}>Tính lương hưu</Text>
            <Text style={styles.calcSubtitle}>
              BHXH Tự nguyện - Tích lũy thảnh thơi 🌸
            </Text>
          </View>
        </View>

        {/* Gender selector */}
        <Card style={styles.formCard}>
          <Text style={styles.fieldLabel}>Giới tính</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'male' && styles.genderActive,
              ]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.genderIcon}>👨</Text>
              <Text
                style={[
                  styles.genderText,
                  gender === 'male' && styles.genderTextActive,
                ]}
              >
                Nam
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'female' && styles.genderActive,
              ]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.genderIcon}>👩</Text>
              <Text
                style={[
                  styles.genderText,
                  gender === 'female' && styles.genderActive && styles.genderTextActive,
                ]}
              >
                Nữ
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Age input */}
        <Card style={styles.formCard}>
          <Text style={styles.fieldLabel}>Tuổi hiện tại</Text>
          <View style={styles.ageRow}>
            <TouchableOpacity
              style={styles.ageBtn}
              onPress={() =>
                setCurrentAge(String(Math.max(18, (parseInt(currentAge) || 30) - 1)))
              }
            >
              <Text style={styles.ageBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.ageInput}
              value={currentAge}
              onChangeText={setCurrentAge}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.ageBtn}
              onPress={() =>
                setCurrentAge(String(Math.min(55, (parseInt(currentAge) || 30) + 1)))
              }
            >
              <Text style={styles.ageBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.fieldHint}>
            Tuổi nghỉ hưu: {gender === 'male' ? '62' : '60'} tuổi
          </Text>
        </Card>

        {/* Contribution level */}
        <Card style={styles.formCard}>
          <Text style={styles.fieldLabel}>Mức đóng hàng tháng</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            {PENSION_CONTRIBUTION_LEVELS.map((level, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.levelChip,
                  selectedLevel === i && styles.levelChipActive,
                ]}
                onPress={() => setSelectedLevel(i)}
              >
                <Text
                  style={[
                    styles.levelAmount,
                    selectedLevel === i && styles.levelAmountActive,
                  ]}
                >
                  {formatVND(level.monthlyContribution)}
                </Text>
                <Text
                  style={[
                    styles.levelLabel,
                    selectedLevel === i && styles.levelLabelActive,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.dailyEquiv}>
            💡 {result.dailyEquivalent}
          </Text>
        </Card>

        {/* Years slider */}
        <Card style={styles.formCard}>
          <Text style={styles.fieldLabel}>Số năm đóng</Text>
          <View style={styles.ageRow}>
            <TouchableOpacity
              style={styles.ageBtn}
              onPress={() =>
                setYearsToContribute(
                  String(Math.max(5, (parseInt(yearsToContribute) || 20) - 1)),
                )
              }
            >
              <Text style={styles.ageBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.ageInput}
              value={yearsToContribute}
              onChangeText={setYearsToContribute}
              keyboardType="numeric"
              maxLength={2}
            />
            <TouchableOpacity
              style={styles.ageBtn}
              onPress={() =>
                setYearsToContribute(
                  String(Math.min(40, (parseInt(yearsToContribute) || 20) + 1)),
                )
              }
            >
              <Text style={styles.ageBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.fieldHint}>
            Tối thiểu 20 năm để nhận lương hưu hàng tháng
          </Text>
        </Card>

        {/* Calculate button */}
        <View style={{ paddingHorizontal: Spacing.l, marginTop: Spacing.l }}>
          <Button
            title="🔍 Tính lương hưu của tôi"
            onPress={() => setShowResult(true)}
            size="large"
            style={{ width: '100%' }}
          />
        </View>

        {/* ─── Result Section ────────────────────────────── */}
        {showResult && (
          <View style={styles.resultSection}>
            {/* Main result card */}
            <Card variant="premium" style={styles.resultMainCard}>
              <Text style={styles.resultLabel}>Lương hưu hàng tháng dự kiến</Text>
              <Text style={styles.resultAmount}>
                {formatVND(result.monthlyPension)}
              </Text>
              <Text style={styles.resultSubtext}>
                Tỷ lệ hưởng: {result.pensionRate.toFixed(0)}% mức bình quân
              </Text>

              {/* Progress visual */}
              <View style={styles.progressVisual}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressThumb,
                      { width: `${(result.pensionRate / 75) * 100}%` },
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressMin}>0%</Text>
                  <Text style={styles.progressMax}>75% (tối đa)</Text>
                </View>
              </View>
            </Card>

            {/* Stats breakdown */}
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statCardIcon}>💰</Text>
                <Text style={styles.statCardValue}>
                  {formatVND(result.totalContribution)}
                </Text>
                <Text style={styles.statCardLabel}>Tổng đóng</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statCardIcon}>📈</Text>
                <Text style={styles.statCardValue}>{result.roi.toFixed(0)}%</Text>
                <Text style={styles.statCardLabel}>ROI (15 năm)</Text>
              </Card>
            </View>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statCardIcon}>⏱️</Text>
                <Text style={styles.statCardValue}>{result.paybackYears} năm</Text>
                <Text style={styles.statCardLabel}>Hoàn vốn sau</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statCardIcon}>🏦</Text>
                <Text style={styles.statCardValue}>
                  {formatVND(result.monthlyPension * 12)}
                </Text>
                <Text style={styles.statCardLabel}>Thu nhập/năm</Text>
              </Card>
            </View>

            {/* Comparison with bank savings */}
            <Card style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>
                📊 So sánh với gửi tiết kiệm ngân hàng
              </Text>
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonCol}>
                  <Text style={styles.comparisonHeader}>🌸 BHXH</Text>
                  <Text style={styles.comparisonValue}>
                    {formatVND(result.monthlyPension)}/tháng
                  </Text>
                  <Text style={styles.comparisonNote}>Hưởng trọn đời</Text>
                  <Text style={styles.comparisonNote}>+ Bảo hiểm y tế miễn phí</Text>
                  <Text style={styles.comparisonNote}>+ Trợ cấp tử tuất</Text>
                </View>
                <View style={styles.comparisonDivider} />
                <View style={styles.comparisonCol}>
                  <Text style={styles.comparisonHeader}>🏦 Ngân hàng</Text>
                  <Text style={styles.comparisonValue}>
                    {formatVND(result.totalContribution * 0.005)}/tháng
                  </Text>
                  <Text style={styles.comparisonNote}>Lãi suất ~6%/năm</Text>
                  <Text style={styles.comparisonNote}>Hết tiền = hết hưởng</Text>
                  <Text style={styles.comparisonNote}>Không có bảo hiểm y tế</Text>
                </View>
              </View>
            </Card>

            {/* CTA */}
            <View style={{ paddingHorizontal: Spacing.l, marginTop: Spacing.l }}>
              <Button
                title="📞 Đăng ký tư vấn miễn phí"
                onPress={() => {}}
                size="large"
                variant="primary"
                style={{ width: '100%' }}
              />
              <Button
                title="💬 Chat với chuyên viên"
                onPress={() => {}}
                size="large"
                variant="outline"
                style={{ width: '100%', marginTop: Spacing.m }}
              />
            </View>
          </View>
        )}

        {/* ─── FAQ Section ─────────────────────────────── */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>❓ Câu hỏi thường gặp</Text>
          {PENSION_FAQ.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
            >
              <View style={styles.faqQuestion}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Text style={styles.faqChevron}>
                  {expandedFAQ === i ? '▼' : '▶'}
                </Text>
              </View>
              {expandedFAQ === i && (
                <Text style={styles.faqA}>{item.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Insurance Hub
  insuranceHeader: {
    padding: Spacing.l,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.white,
  },
  insuranceTitle: { ...Typography.h1, color: Colors.black },
  insuranceSubtitle: { ...Typography.secondary, color: Colors.gray, marginTop: 4 },
  productsList: { padding: Spacing.l, gap: Spacing.m },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
    gap: Spacing.m,
  },
  productIcon: { fontSize: 36 },
  productTitle: { ...Typography.h3, marginBottom: 2 },
  productSubtitle: { ...Typography.caption },
  statsTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { ...Typography.h2, color: Colors.purpleDark },
  statLabel: { ...Typography.caption, color: Colors.gray, marginTop: 4 },

  // Calculator
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  calcTitle: { ...Typography.h1, color: Colors.black },
  calcSubtitle: { ...Typography.caption, color: Colors.insurancePink, fontWeight: '500' },
  formCard: { marginHorizontal: Spacing.l, marginTop: Spacing.m },
  fieldLabel: { ...Typography.body, color: Colors.black, fontWeight: '600', marginBottom: 8 },
  fieldHint: { ...Typography.caption, color: Colors.gray, marginTop: 8 },

  // Gender
  genderRow: { flexDirection: 'row', gap: Spacing.m },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    gap: 8,
  },
  genderActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '10' },
  genderIcon: { fontSize: 24 },
  genderText: { ...Typography.body, color: Colors.darkGray },
  genderTextActive: { color: Colors.purpleDark, fontWeight: '600' },

  // Age
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.l,
  },
  ageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageBtnText: { fontSize: 22, color: Colors.purpleDark, fontWeight: '700' },
  ageInput: {
    ...Typography.h1,
    color: Colors.black,
    textAlign: 'center',
    width: 80,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
    paddingBottom: 4,
  },

  // Contribution levels
  levelChip: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginRight: Spacing.s,
    minWidth: 140,
    alignItems: 'center',
  },
  levelChipActive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '15',
  },
  levelAmount: { ...Typography.body, fontWeight: '700', color: Colors.darkGray },
  levelAmountActive: { color: Colors.purpleDark },
  levelLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  levelLabelActive: { color: Colors.purpleDark },
  dailyEquiv: {
    ...Typography.secondary,
    color: Colors.success,
    fontWeight: '500',
    marginTop: Spacing.m,
    textAlign: 'center',
  },

  // Result
  resultSection: { marginTop: Spacing.xxl },
  resultMainCard: {
    marginHorizontal: Spacing.l,
    alignItems: 'center',
  },
  resultLabel: { ...Typography.secondary, color: Colors.silver, marginBottom: 4 },
  resultAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.gold,
    marginVertical: Spacing.s,
  },
  resultSubtext: { ...Typography.secondary, color: 'rgba(255,255,255,0.7)' },
  progressVisual: { width: '100%', marginTop: Spacing.l },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressThumb: {
    height: 8,
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressMin: { ...Typography.tiny, color: 'rgba(255,255,255,0.5)' },
  progressMax: { ...Typography.tiny, color: 'rgba(255,255,255,0.5)' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    gap: Spacing.m,
    marginTop: Spacing.m,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statCardIcon: { fontSize: 28, marginBottom: 4 },
  statCardValue: { ...Typography.h3, color: Colors.purpleDark },
  statCardLabel: { ...Typography.caption, color: Colors.gray, marginTop: 2 },

  // Comparison
  comparisonCard: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.l,
  },
  comparisonTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.m },
  comparisonRow: { flexDirection: 'row' },
  comparisonCol: { flex: 1 },
  comparisonDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.m,
  },
  comparisonHeader: { ...Typography.body, fontWeight: '700', marginBottom: 8 },
  comparisonValue: { ...Typography.h3, color: Colors.success, marginBottom: 8 },
  comparisonNote: { ...Typography.caption, color: Colors.darkGray, marginBottom: 4 },

  // FAQ
  faqSection: {
    padding: Spacing.l,
    marginTop: Spacing.xl,
  },
  faqTitle: { ...Typography.h2, color: Colors.black, marginBottom: Spacing.l },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: { ...Typography.body, fontWeight: '600', color: Colors.black, flex: 1, marginRight: 8 },
  faqChevron: { fontSize: 12, color: Colors.gray },
  faqA: { ...Typography.secondary, color: Colors.darkGray, marginTop: Spacing.m, lineHeight: 22 },
});
