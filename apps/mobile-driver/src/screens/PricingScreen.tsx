import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

/** Bảng giá tham khảo (có thể thay bằng API sau). */
const PRICING_ROWS = [
  { label: 'Xe máy – Cước cơ bản', value: '12.000đ' },
  { label: 'Xe máy – Theo km', value: '4.200đ/km' },
  { label: 'Xe máy – Theo phút', value: '300đ/phút' },
  { label: 'Xe 4 chỗ – Cước cơ bản', value: '25.000đ' },
  { label: 'Xe 4 chỗ – Theo km', value: '8.500đ/km' },
  { label: 'Xe 4 chỗ – Theo phút', value: '500đ/phút' },
  { label: 'Xe 7 chỗ – Cước cơ bản', value: '30.000đ' },
  { label: 'Xe 7 chỗ – Theo km', value: '10.000đ/km' },
  { label: 'Xe 7 chỗ – Theo phút', value: '600đ/phút' },
];

export function PricingScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bảng giá</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Bảng giá tham khảo cho khách hàng. Thu nhập của tài xế được tính theo chính sách hiện hành (sau hoa hồng nền tảng).
        </Text>

        <View style={styles.table}>
          {PRICING_ROWS.map((row, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
              <Text style={styles.tableLabel}>{row.label}</Text>
              <Text style={styles.tableValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Giá có thể điều chỉnh theo giờ cao điểm và khu vực. Chi tiết áp dụng theo thông báo từ hệ thống.
          </Text>
        </View>

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
  intro: {
    ...Typography.body,
    color: Colors.darkGray,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
  },
  table: {
    marginHorizontal: Spacing.l,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level1,
  },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.l, paddingVertical: Spacing.m },
  tableRowAlt: { backgroundColor: Colors.offWhite },
  tableLabel: { ...Typography.body, color: Colors.black, flex: 1 },
  tableValue: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600', marginLeft: Spacing.m },
  note: { marginHorizontal: Spacing.l, marginTop: Spacing.l, padding: Spacing.m },
  noteText: { ...Typography.caption, color: Colors.gray },
});
