import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Avatar, Button } from '../components/ui';
import { MOCK_USER } from '../data/mockData';

export const AccountUpdateScreen = ({ navigation }: any) => {
  const [form, setForm] = useState({
    title: 'Ông/Anh',
    fullName: MOCK_USER.displayName,
    gender: 'Nam',
    dob: '15/01/1990',
    phone: MOCK_USER.phone,
    email: MOCK_USER.email,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật tài khoản</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Avatar name={MOCK_USER.displayName} size={80} />
        </View>

        {/* eKYC Verification Card */}
        <View style={styles.verifyCard}>
          <View style={styles.verifyHeader}>
            <Text style={styles.verifyLabel}>Thông tin xác thực</Text>
            <View style={styles.verifyBadge}>
              <Text style={styles.verifyBadgeText}>CCCD</Text>
            </View>
          </View>
          <View style={styles.verifyInfo}>
            <View style={styles.verifyRow}>
              <Text style={styles.verifyKey}>Họ tên</Text>
              <Text style={styles.verifyValue}>{MOCK_USER.displayName.toUpperCase()}</Text>
            </View>
            <View style={styles.verifyRow}>
              <Text style={styles.verifyKey}>CCCD</Text>
              <Text style={styles.verifyValue}>*****3195</Text>
            </View>
            <View style={styles.verifyRow}>
              <Text style={styles.verifyKey}>Quốc tịch</Text>
              <Text style={styles.verifyValue}>VIỆT NAM</Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <FormField label="Xưng hô" value={form.title} dropdown />
          <FormField label="Họ Tên" value={form.fullName} />
          <FormField label="Giới tính" value={form.gender} dropdown />
          <FormField label="Ngày sinh" value={form.dob} calendar />
          <FormField label="Số điện thoại" value={form.phone} disabled />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email (không bắt buộc)</Text>
            <View style={styles.fieldRow}>
              <TextInput
                style={[styles.fieldInput, { flex: 1 }]}
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
              />
              <Text style={{ fontSize: 18, color: Colors.success }}>✓</Text>
            </View>
            <Text style={styles.fieldNote}>
              Bạn sẽ nhận được lịch sử chuyến đi, lịch sử đơn hàng, và hóa đơn chuyến đi qua địa chỉ email này.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: Spacing.l, marginTop: Spacing.xl }}>
          <Button title="Cập nhật" onPress={() => {}} size="large" style={{ width: '100%' }} />
        </View>

        {/* Delete account */}
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Xóa tài khoản</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const FormField = ({
  label,
  value,
  dropdown,
  calendar,
  disabled,
}: {
  label: string;
  value: string;
  dropdown?: boolean;
  calendar?: boolean;
  disabled?: boolean;
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity style={styles.fieldRow} disabled={!dropdown && !calendar}>
      <Text style={[styles.fieldValue, disabled && { color: Colors.gray }]}>{value}</Text>
      {dropdown && <Text style={styles.fieldIcon}>▾</Text>}
      {calendar && <Text style={styles.fieldIcon}>📅</Text>}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },

  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl },

  verifyCard: {
    marginHorizontal: Spacing.l,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  verifyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifyLabel: { ...Typography.secondary, fontWeight: '600', color: Colors.darkGray },
  verifyBadge: {
    backgroundColor: Colors.purpleDark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifyBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  verifyInfo: { marginTop: Spacing.m },
  verifyRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  verifyKey: { ...Typography.caption, color: Colors.gray },
  verifyValue: { ...Typography.secondary, fontWeight: '700', color: Colors.black },

  form: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  fieldGroup: { marginBottom: Spacing.xl },
  fieldLabel: { ...Typography.caption, color: Colors.gray, marginBottom: 4 },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingVertical: 10,
  },
  fieldValue: { ...Typography.body, color: Colors.black },
  fieldInput: { ...Typography.body, color: Colors.black, padding: 0 },
  fieldIcon: { fontSize: 16, color: Colors.gray },
  fieldNote: { ...Typography.caption, color: Colors.gray, marginTop: 8, lineHeight: 16 },

  deleteBtn: { alignItems: 'center', paddingVertical: Spacing.xl },
  deleteText: { ...Typography.body, color: Colors.red, fontWeight: '600' },
});
