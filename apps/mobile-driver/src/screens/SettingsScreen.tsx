import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const SETTINGS_KEYS = {
  NOTIFICATIONS_ENABLED: 'driver_settings_notifications_enabled',
  SOUND_ENABLED: 'driver_settings_sound_enabled',
};

const APP_VERSION = '1.0.0';
const SUPPORT_URL = 'https://vmd.asia/support';
const PRIVACY_URL = 'https://vmd.asia/privacy';

export function SettingsScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const [notif, sound] = await Promise.all([
        AsyncStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS_ENABLED),
        AsyncStorage.getItem(SETTINGS_KEYS.SOUND_ENABLED),
      ]);
      setNotificationsEnabled(notif !== 'false');
      setSoundEnabled(sound !== 'false');
    } catch {
      // keep defaults
    } finally {
      setLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const setNotifications = useCallback(async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.NOTIFICATIONS_ENABLED, String(value));
    } catch {
      setNotificationsEnabled(!value);
    }
  }, []);

  const setSound = useCallback(async (value: boolean) => {
    setSoundEnabled(value);
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.SOUND_ENABLED, String(value));
    } catch {
      setSoundEnabled(!value);
    }
  }, []);

  const openUrl = (url: string, label: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Không mở được', `Không thể mở ${label}.`);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Thông báo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhận đơn</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => (navigation as any).navigate('OrderReceivingSettings')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Cài đặt nhận đơn</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>Tiền mang theo, dịch vụ, tự động nhận đơn</Text>
          </View>
        </View>

        {/* Thông báo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Bật thông báo đơn hàng</Text>
              {loaded && (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotifications}
                  trackColor={{ false: Colors.lightGray, true: Colors.gold + '60' }}
                  thumbColor={notificationsEnabled ? Colors.gold : Colors.gray}
                />
              )}
            </View>
            <View style={styles.rowBorder} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Âm thanh thông báo</Text>
              {loaded && (
                <Switch
                  value={soundEnabled}
                  onValueChange={setSound}
                  trackColor={{ false: Colors.lightGray, true: Colors.gold + '60' }}
                  thumbColor={soundEnabled ? Colors.gold : Colors.gray}
                />
              )}
            </View>
          </View>
        </View>

        {/* Ứng dụng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => openUrl(PRIVACY_URL, 'Chính sách bảo mật')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Chính sách bảo mật</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.rowBorder} />
            <TouchableOpacity
              style={styles.row}
              onPress={() => openUrl(SUPPORT_URL, 'Hỗ trợ')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Điều khoản sử dụng</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Về ứng dụng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về ứng dụng</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Phiên bản</Text>
              <Text style={styles.rowValue}>{APP_VERSION}</Text>
            </View>
            <TouchableOpacity
              style={styles.row}
              onPress={() => openUrl(SUPPORT_URL, 'Hỗ trợ')}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Liên hệ hỗ trợ</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
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
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.l },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.gray,
    marginBottom: Spacing.s,
    marginLeft: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  rowBorder: { height: 1, backgroundColor: Colors.offWhite, marginLeft: Spacing.l },
  rowLabel: { ...Typography.body, color: Colors.black },
  rowValue: { ...Typography.secondary, color: Colors.gray },
  chevron: { fontSize: 20, color: Colors.gray },
  hint: { ...Typography.caption, color: Colors.gray, marginTop: 4, marginHorizontal: Spacing.l },
});
