import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SUPPORT_HOTLINE } from '../constants/support';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

export function SupportHotlineScreen() {
  const navigation = useNavigation();
  const phone = SUPPORT_HOTLINE;
  const telUrl = `tel:${phone.replace(/\s/g, '')}`;

  const handleCall = () => {
    Linking.canOpenURL(telUrl).then((supported) => {
      if (supported) Linking.openURL(telUrl);
      else Alert.alert('Không gọi được', 'Thiết bị không hỗ trợ gọi điện.');
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tổng đài hỗ trợ</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Số điện thoại hỗ trợ tài xế</Text>
        <Text style={styles.phone}>{phone}</Text>
        <Text style={styles.hint}>Nhấn nút bên dưới để gọi ngay (phí gọi theo nhà mạng).</Text>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
          <Text style={styles.callBtnText}>📞 Gọi ngay</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...Typography.secondary, color: Colors.gray, marginBottom: Spacing.s },
  phone: { ...Typography.h1, color: Colors.purpleDark, marginBottom: Spacing.m, letterSpacing: 2 },
  hint: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.xl, textAlign: 'center' },
  callBtn: {
    backgroundColor: Colors.success,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
  },
  callBtnText: { ...Typography.h3, color: Colors.white },
});
