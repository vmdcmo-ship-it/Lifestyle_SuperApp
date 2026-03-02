import React from 'react';
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
import { Button } from '../components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FamilyAccountScreen = ({ navigation }: any) => {
  const features = [
    {
      icon: '🎁',
      title: 'Chia sẻ ưu đãi',
      desc: 'Chia sẻ và cùng cả nhà tận hưởng hơn 100 khuyến mại cho tất cả các dịch vụ.',
    },
    {
      icon: '📊',
      title: 'Quản lý chi tiêu dễ dàng',
      desc: 'Dùng chung phương thức thanh toán và theo dõi chi tiêu của từng thành viên theo tuần hoặc tháng.',
    },
    {
      icon: '📍',
      title: 'Di chuyển an toàn',
      desc: 'Chia sẻ thông tin chuyến đi để cả nhà cùng yên tâm và chủ động hỗ trợ khi cần.',
    },
    {
      icon: '🛡️',
      title: 'Bảo hiểm gia đình',
      desc: 'Mua BHXH, bảo hiểm sức khỏe cho cả gia đình với giá ưu đãi và quản lý tập trung.',
    },
    {
      icon: '🏃',
      title: 'Run to Earn cùng nhau',
      desc: 'Tạo nhóm gia đình, cùng nhau tích Xu qua thử thách đi bộ và chia sẻ phần thưởng.',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản Gia đình</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero illustration */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.heroTitle}>
            Tạo Tài khoản Gia đình và tận hưởng tiện ích đặc biệt cùng người thân.
          </Text>
        </View>

        {/* Features */}
        {features.map((feat, i) => (
          <View key={i} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feat.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{feat.title}</Text>
              <Text style={styles.featureDesc}>{feat.desc}</Text>
            </View>
          </View>
        ))}

        {/* Terms note */}
        <Text style={styles.termsNote}>
          Bằng việc nhấn vào nút "Thiết lập tài khoản Gia đình", tôi đồng ý với{' '}
          <Text style={styles.termsLink}>
            Điều khoản dịch vụ của Tài khoản Gia đình
          </Text>
          .
        </Text>

        {/* CTA */}
        <View style={{ paddingHorizontal: Spacing.l, marginTop: Spacing.l }}>
          <Button
            title="Thiết lập tài khoản Gia đình"
            onPress={() => {}}
            size="large"
            style={{ width: '100%' }}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },

  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  heroEmoji: { fontSize: 80, marginBottom: Spacing.l },
  heroTitle: {
    ...Typography.body,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },

  featureCard: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
    gap: Spacing.l,
  },
  featureIcon: { fontSize: 32 },
  featureTitle: { ...Typography.body, fontWeight: '700', color: Colors.black },
  featureDesc: { ...Typography.secondary, color: Colors.gray, marginTop: 4, lineHeight: 20 },

  termsNote: {
    ...Typography.caption,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
  termsLink: { color: Colors.info, textDecorationLine: 'underline' },
});
