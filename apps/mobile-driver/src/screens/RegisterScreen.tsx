import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { useAuth } from '../context/AuthContext';

export function RegisterScreen({ onLogin }: { onLogin: () => void }) {
  const { register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đủ email, mật khẩu, họ và tên.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu tối thiểu 6 ký tự.');
      return;
    }
    clearError();
    try {
      await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      });
    } catch {
      // error set in context
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Đăng ký tài xế ngay</Text>
            <Text style={styles.subtitle}>
              Tạo tài khoản đối tác tài xế — Thu nhập ổn định, thời gian linh hoạt. Hoàn thành hồ sơ (GPLX, loại xe, CCCD, BHTNDS) để bắt đầu nhận đơn.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Họ</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nguyễn"
              placeholderTextColor={Colors.gray}
              editable={!isLoading}
            />
            <Text style={styles.label}>Tên</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Văn A"
              placeholderTextColor={Colors.gray}
              editable={!isLoading}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor={Colors.gray}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
            <Text style={styles.label}>Số điện thoại (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="0912345678"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <Text style={styles.label}>Mật khẩu (tối thiểu 6 ký tự)</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray}
              secureTextEntry
              editable={!isLoading}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.purpleDark} />
              ) : (
                <Text style={styles.btnPrimaryText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={onLogin} disabled={isLoading}>
              <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl },
  header: { marginBottom: Spacing.xl },
  title: { ...Typography.h1, color: Colors.purpleDark, marginBottom: Spacing.s },
  subtitle: { ...Typography.secondary, color: Colors.gray },
  form: {},
  label: { ...Typography.secondary, color: Colors.darkGray, marginBottom: 4, marginTop: Spacing.m },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.l,
    paddingVertical: 14,
    ...Typography.body,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  error: { ...Typography.caption, color: Colors.error, marginTop: Spacing.s },
  btn: {
    borderRadius: BorderRadius.medium,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  btnPrimary: { backgroundColor: Colors.gold },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  link: { alignItems: 'center', marginTop: Spacing.l },
  linkText: { ...Typography.secondary, color: Colors.info },
});
