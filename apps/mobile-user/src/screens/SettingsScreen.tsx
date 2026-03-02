import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const LANGUAGES = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
];

export const LanguageScreen = ({ navigation }: any) => {
  const [selectedLang, setSelectedLang] = useState('vi');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ngôn ngữ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langRow, selectedLang === lang.code && styles.langRowActive]}
            onPress={() => setSelectedLang(lang.code)}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={styles.langName}>{lang.name}</Text>
            {selectedLang === lang.code && (
              <Text style={styles.langCheck}>✓</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateBtnText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const SecurityScreen = ({ navigation }: any) => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng nhập & Bảo mật</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Login section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Đăng nhập</Text>
          <View style={styles.card}>
            <View style={styles.secRow}>
              <View style={styles.secIconWrap}>
                <Text style={styles.secIcon}>🔑</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secTitle}>Mật khẩu</Text>
                <Text style={styles.secDesc}>
                  Tạo mã bảo vệ giúp bạn bảo vệ tài khoản của mình tốt hơn.
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeLink}>Thay đổi</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.secRow, { borderTopWidth: 1, borderTopColor: Colors.offWhite }]}>
              <View style={styles.secIconWrap}>
                <Text style={styles.secIcon}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secTitle}>Bật xác thực khuôn mặt/vân tay</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: Colors.lightGray, true: Colors.gold }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>

        {/* 2FA section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bảo mật nâng cao</Text>
          <View style={styles.card}>
            <View style={styles.secRow}>
              <View style={styles.secIconWrap}>
                <Text style={styles.secIcon}>📱</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secTitle}>Xác thực 2 bước (2FA)</Text>
                <Text style={styles.secDesc}>
                  Bảo vệ tài khoản với mã OTP qua SMS hoặc Authenticator App.
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.enableLink}>Bật</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.secRow, { borderTopWidth: 1, borderTopColor: Colors.offWhite }]}>
              <View style={styles.secIconWrap}>
                <Text style={styles.secIcon}>🪪</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.secTitle}>Xác thực eKYC / CCCD</Text>
                <Text style={styles.secDesc}>
                  Xác minh danh tính để mở khóa tính năng nâng cao.
                </Text>
              </View>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>✓ Đã xác thực</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Social connections */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kết nối tài khoản mạng xã hội</Text>
          <View style={styles.card}>
            {[
              { icon: '🍎', name: 'Apple', connected: false },
              { icon: '🔵', name: 'Google', connected: true },
              { icon: '📘', name: 'Facebook', connected: false },
            ].map((social, i) => (
              <View
                key={social.name}
                style={[styles.secRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.offWhite }]}
              >
                <Text style={styles.socialIcon}>{social.icon}</Text>
                <Text style={[styles.secTitle, { flex: 1 }]}>{social.name}</Text>
                <TouchableOpacity>
                  <Text
                    style={social.connected ? styles.disconnectLink : styles.connectLink}
                  >
                    {social.connected ? 'Hủy liên kết' : 'Liên kết'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <Text style={styles.socialNote}>
            Liên kết tài khoản mạng xã hội để đăng nhập không cần điện thoại. Chúng tôi chỉ sử dụng nó khi bạn cho phép.
          </Text>
        </View>

        {/* Active sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phiên đăng nhập</Text>
          <View style={styles.card}>
            <View style={styles.secRow}>
              <Text style={styles.secIcon}>📱</Text>
              <View style={{ flex: 1, marginLeft: Spacing.m }}>
                <Text style={styles.secTitle}>iPhone 15 Pro Max</Text>
                <Text style={styles.secDesc}>Hà Nội • Đang hoạt động</Text>
              </View>
              <View style={styles.activeDot} />
            </View>
            <View style={[styles.secRow, { borderTopWidth: 1, borderTopColor: Colors.offWhite }]}>
              <Text style={styles.secIcon}>💻</Text>
              <View style={{ flex: 1, marginLeft: Spacing.m }}>
                <Text style={styles.secTitle}>Chrome - Windows</Text>
                <Text style={styles.secDesc}>TP.HCM • 2 giờ trước</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.disconnectLink}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export const AccountUpdateScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={{ fontSize: 24, color: Colors.black }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật tài khoản</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeAvatarText}>Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        {/* Identity Verification Card */}
        <View style={styles.idCard}>
          <View style={styles.idCardHeader}>
            <Text style={styles.idCardLabel}>Thông tin xác thực</Text>
            <View style={styles.idCardBadge}>
              <Text style={styles.idCardBadgeText}>CCCD</Text>
            </View>
          </View>
          <View style={styles.idCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.idLabel}>Họ tên</Text>
              <Text style={styles.idValue}>NGUYỄN VĂN AN</Text>
            </View>
          </View>
          <View style={styles.idCardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.idLabel}>CCCD</Text>
              <Text style={styles.idValue}>*****3195</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.idLabel}>Quốc tịch</Text>
              <Text style={styles.idValue}>VIỆT NAM</Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <FormField label="Xưng hô" value="Ông/Anh" hasDropdown />
          <FormField label="Họ Tên" value="Nguyễn Văn An" />
          <FormField label="Giới tính" value="Nam" hasDropdown />
          <FormField label="Ngày sinh" value="15/01/1990" hasCalendar />
          <FormField label="Số điện thoại" value="+84901234567" disabled />
          <FormField label="Email (không bắt buộc)" value="an.nguyen@lifestyle.vn" verified />
        </View>

        <Text style={styles.emailNote}>
          Bạn sẽ nhận được lịch sử chuyến đi, lịch sử đơn hàng, và hoá đơn chuyến đi qua địa chỉ email này.
        </Text>

        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateBtnText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteAccountBtn}>
          <Text style={styles.deleteAccountText}>Xóa tài khoản</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const FormField = ({
  label,
  value,
  hasDropdown,
  hasCalendar,
  disabled,
  verified,
}: {
  label: string;
  value: string;
  hasDropdown?: boolean;
  hasCalendar?: boolean;
  disabled?: boolean;
  verified?: boolean;
}) => (
  <View style={styles.formField}>
    <Text style={styles.formLabel}>{label}</Text>
    <View style={[styles.formInput, disabled && styles.formInputDisabled]}>
      <Text style={[styles.formValue, disabled && { color: Colors.gray }]}>{value}</Text>
      {hasDropdown && <Text style={styles.formDropdown}>▾</Text>}
      {hasCalendar && <Text style={styles.formCalendar}>📅</Text>}
      {verified && <Text style={styles.formVerified}>✓</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
    backgroundColor: Colors.white,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },

  // Language
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  langRowActive: { backgroundColor: Colors.gold + '08' },
  langFlag: { fontSize: 24, marginRight: Spacing.l },
  langName: { ...Typography.body, color: Colors.black, flex: 1 },
  langCheck: { fontSize: 18, color: Colors.gold, fontWeight: '700' },

  // Security
  section: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.s,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
    overflow: 'hidden',
  },
  secRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.l,
    gap: Spacing.m,
  },
  secIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secIcon: { fontSize: 20 },
  secTitle: { ...Typography.body, fontWeight: '500', color: Colors.black },
  secDesc: { ...Typography.caption, color: Colors.gray, marginTop: 2, lineHeight: 16 },
  changeLink: { ...Typography.secondary, color: Colors.gold, fontWeight: '600' },
  enableLink: { ...Typography.secondary, color: Colors.success, fontWeight: '600' },
  connectLink: { ...Typography.secondary, color: Colors.info, fontWeight: '600' },
  disconnectLink: { ...Typography.secondary, color: Colors.error, fontWeight: '600' },
  socialIcon: { fontSize: 24 },
  socialNote: {
    ...Typography.caption,
    color: Colors.gray,
    marginTop: Spacing.m,
    lineHeight: 18,
  },
  verifiedTag: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedTagText: { ...Typography.caption, color: Colors.success, fontWeight: '600' },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },

  // Account Update
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 40 },
  changeAvatarText: { ...Typography.secondary, color: Colors.gold, fontWeight: '600', marginTop: Spacing.s },

  idCard: {
    marginHorizontal: Spacing.l,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  idCardLabel: { ...Typography.body, fontWeight: '700', color: Colors.black },
  idCardBadge: {
    backgroundColor: Colors.purpleDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idCardBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  idCardRow: { flexDirection: 'row', marginTop: Spacing.s },
  idLabel: { ...Typography.caption, color: Colors.gray },
  idValue: { ...Typography.body, fontWeight: '700', color: Colors.black, marginTop: 2 },

  formSection: { paddingHorizontal: Spacing.l, marginTop: Spacing.xl },
  formField: { marginBottom: Spacing.l },
  formLabel: { ...Typography.caption, color: Colors.gray, marginBottom: 6 },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: Spacing.s,
  },
  formInputDisabled: { opacity: 0.5 },
  formValue: { ...Typography.body, color: Colors.black, flex: 1 },
  formDropdown: { fontSize: 16, color: Colors.gray },
  formCalendar: { fontSize: 16 },
  formVerified: { fontSize: 16, color: Colors.success },

  emailNote: {
    ...Typography.caption,
    color: Colors.gray,
    paddingHorizontal: Spacing.l,
    lineHeight: 18,
  },

  ctaWrap: { padding: Spacing.l, marginTop: Spacing.l },
  updateBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
  },
  updateBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '700' },

  deleteAccountBtn: { alignItems: 'center', paddingVertical: Spacing.l },
  deleteAccountText: { ...Typography.body, color: Colors.error, fontWeight: '600' },
});
