import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AuthScreen = ({ navigation }: any) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName, phoneNumber: phone || undefined });
      }
      navigation?.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Branding - KODO */}
          <View style={styles.brandSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/kodo-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>KODO</Text>
            <Text style={styles.tagline}>The Heartbeat of Your Lifestyle</Text>
          </View>

          {/* Tab toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.nameRow}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Họ</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nguyễn"
                    placeholderTextColor={Colors.gray}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Tên</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Văn A"
                    placeholderTextColor={Colors.gray}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            )}

            {!isLogin && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0901234567"
                  placeholderTextColor={Colors.gray}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor={Colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.gray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={{ fontSize: 18 }}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            )}

            <Button
              title={loading ? '' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
              onPress={handleSubmit}
              size="large"
              disabled={loading}
              style={{ width: '100%', marginTop: Spacing.l }}
            />
            {loading && (
              <ActivityIndicator
                color={Colors.white}
                style={{ position: 'absolute', alignSelf: 'center', bottom: 80 }}
              />
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social login */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Zalo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>🔵</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>🟢</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.xl },

  // Brand - KODO
  brandSection: { alignItems: 'center', marginTop: 32, marginBottom: 28 },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.level2,
  },
  logoImage: { width: '100%', height: '100%' },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.purpleDark,
    letterSpacing: 2,
  },
  tagline: {
    ...Typography.secondary,
    color: Colors.purpleDark,
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray + '99',
    borderRadius: BorderRadius.medium,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.white, ...Shadows.level1 },
  tabText: { ...Typography.body, color: Colors.gray },
  tabTextActive: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600' },

  // Form
  form: {},
  nameRow: { flexDirection: 'row', gap: Spacing.m },
  inputWrapper: { marginBottom: Spacing.l },
  inputLabel: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.l,
    ...Typography.body,
    color: Colors.black,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { position: 'absolute', right: 12, padding: 4 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8 },
  forgotText: { ...Typography.secondary, color: Colors.gold, fontWeight: '500' },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.lightGray },
  dividerText: { ...Typography.caption, color: Colors.gray, marginHorizontal: Spacing.m },

  // Social
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.m },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: 6,
  },
  socialIcon: { fontSize: 18 },
  socialText: { ...Typography.secondary, color: Colors.darkGray, fontWeight: '500' },
});
