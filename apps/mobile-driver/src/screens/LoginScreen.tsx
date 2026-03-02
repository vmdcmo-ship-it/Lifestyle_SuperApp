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

export function LoginScreen({ onRegister }: { onRegister: () => void }) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }
    clearError();
    try {
      await login(email.trim(), password);
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Text style={styles.title}>Đăng nhập Tài xế</Text>
          <Text style={styles.subtitle}>Ứng dụng dành cho đối tác tài xế</Text>
        </View>

        <View style={styles.form}>
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
          <Text style={styles.label}>Mật khẩu</Text>
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.purpleDark} />
            ) : (
              <Text style={styles.btnPrimaryText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={onRegister} disabled={isLoading}>
            <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký tài xế</Text>
          </TouchableOpacity>

          {/* CTA: Kêu gọi đăng ký tài xế — bám đuổi hành trình, tuyển dụng tài xế mới */}
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>🚗 Đăng ký tài xế ngay</Text>
            <Text style={styles.ctaSubtitle}>
              Thu nhập linh hoạt, làm chủ thời gian. Tham gia đội ngũ đối tác vận chuyển.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaButtonText}>Đăng ký tài xế</Text>
            </TouchableOpacity>
          </View>
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
  header: { marginBottom: Spacing.xxl },
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
  ctaCard: {
    marginTop: Spacing.xxl,
    padding: Spacing.l,
    backgroundColor: Colors.purpleDark,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
  },
  ctaTitle: { ...Typography.h3, color: Colors.white, marginBottom: Spacing.s },
  ctaSubtitle: { ...Typography.caption, color: Colors.silver, textAlign: 'center', marginBottom: Spacing.l },
  ctaButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
    minWidth: 200,
    alignItems: 'center',
  },
  ctaButtonText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
});
