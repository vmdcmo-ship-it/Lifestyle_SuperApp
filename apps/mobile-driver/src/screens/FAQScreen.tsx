import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Làm sao để bắt đầu nhận đơn?',
    a: 'Đăng ký làm tài xế, hoàn thành hồ sơ (GPLX, CCCD, xe, bảo hiểm) và chờ duyệt. Sau khi được kích hoạt, bật trực tuyến tại màn Nhận đơn để nhận đơn.',
  },
  {
    q: 'Tôi có thể tắt nhận đơn bất cứ lúc nào không?',
    a: 'Có. Bạn bật/tắt trạng thái trực tuyến tại màn Nhận đơn hoặc Cài đặt nhận đơn. Khi tắt, bạn sẽ không nhận được đơn mới.',
  },
  {
    q: 'Thu nhập được chuyển khi nào?',
    a: 'Thu nhập từ các chuyến hoàn thành được cộng vào Ví tài xế. Bạn có thể rút về tài khoản ngân hàng theo quy định (thường 1–3 ngày làm việc).',
  },
  {
    q: 'Giấy tờ sắp hết hạn thì làm thế nào?',
    a: 'Vào mục Cập nhật giấy tờ để xem danh sách giấy tờ cần gia hạn. Cập nhật ảnh giấy tờ mới qua hồ sơ hoặc liên hệ Tổng đài hỗ trợ.',
  },
  {
    q: 'Tôi bị khách hủy đơn có bị trừ điểm không?',
    a: 'Hủy do khách hàng thường không ảnh hưởng đến đánh giá của tài xế. Hủy do tài xế có thể ảnh hưởng tỷ lệ chấp nhận đơn.',
  },
  {
    q: 'Liên hệ hỗ trợ ở đâu?',
    a: 'Gọi Tổng đài hỗ trợ (mục Tổng đài hỗ trợ trong Tài khoản) hoặc gửi yêu cầu qua ứng dụng.',
  },
];

export function FAQScreen() {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => setOpenIndex(isOpen ? null : idx)}
              activeOpacity={0.8}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.q}</Text>
                <Text style={styles.chevron}>{isOpen ? '▼' : '▶'}</Text>
              </View>
              {isOpen && <Text style={styles.answer}>{item.a}</Text>}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 80 }} />
      </ScrollView>
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
  backBtn: { minWidth: 80 },
  backBtnText: { ...Typography.body, color: Colors.info, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.purpleDark },
  scroll: { flex: 1 },
  card: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.s,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    overflow: 'hidden',
    ...Shadows.level1,
  },
  questionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  question: { ...Typography.body, color: Colors.black, fontWeight: '600', flex: 1, marginRight: Spacing.s },
  chevron: { ...Typography.caption, color: Colors.gray },
  answer: { ...Typography.secondary, color: Colors.darkGray, marginTop: Spacing.m, paddingTop: Spacing.m, borderTopWidth: 1, borderTopColor: Colors.offWhite },
});
