import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { driverService } from '../services/driver.service';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { isDemoDriverEmail } from '../data/mockData';
import { canAcceptOrders } from '../constants/driverStatus';
import { MOCK_ORDER_RECEIVING_SETTINGS } from '../data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const SERVICE_LABELS: Record<string, string> = {
  foodDelivery: 'Giao đồ ăn',
  rideBike: 'Đặt xe máy',
  rideCar4: 'Đặt xe 4 chỗ',
  rideCar7: 'Đặt xe 7 chỗ',
  parcel: 'Giao hàng',
};

const DEFAULT_SERVICES = {
  foodDelivery: true,
  rideBike: true,
  rideCar4: true,
  rideCar7: false,
  parcel: true,
};

export function OrderReceivingSettingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const isDemo = isDemoDriverEmail(user?.email ?? null);
  const canGoOnline = isDemo || canAcceptOrders(profile?.status);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cashInput, setCashInput] = useState('');
  const [settings, setSettings] = useState<{
    isOnline: boolean;
    cashOnHand: number;
    availableCash: number;
    pendingCOD: number;
    enabledServices: Record<string, boolean>;
    autoAcceptEnabled: boolean;
    autoAcceptMaxDistanceKm: number;
    autoAcceptMinAmount: number;
    maxBatchOrders: number;
  } | null>(null);

  const loadSettings = useCallback(async () => {
    if (isDemo) {
      setSettings({ ...MOCK_ORDER_RECEIVING_SETTINGS });
      setCashInput(String(MOCK_ORDER_RECEIVING_SETTINGS.cashOnHand));
      setLoading(false);
      return;
    }
    try {
      const res = await driverService.getOrderReceivingSettings();
      const data = res?.data ?? res;
      setSettings({
        isOnline: data.isOnline ?? false,
        cashOnHand: data.cashOnHand ?? 0,
        availableCash: data.availableCash ?? 0,
        pendingCOD: data.pendingCOD ?? 0,
        enabledServices: { ...DEFAULT_SERVICES, ...data.enabledServices },
        autoAcceptEnabled: data.autoAcceptEnabled ?? false,
        autoAcceptMaxDistanceKm: data.autoAcceptMaxDistanceKm ?? 5,
        autoAcceptMinAmount: data.autoAcceptMinAmount ?? 30000,
        maxBatchOrders: data.maxBatchOrders ?? 3,
      });
      setCashInput(String(data.cashOnHand ?? 0));
    } catch {
      setSettings({
        isOnline: false,
        cashOnHand: 0,
        availableCash: 0,
        pendingCOD: 0,
        enabledServices: { ...DEFAULT_SERVICES },
        autoAcceptEnabled: false,
        autoAcceptMaxDistanceKm: 5,
        autoAcceptMinAmount: 30000,
        maxBatchOrders: 3,
      });
      setCashInput('0');
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleDeclareCash = useCallback(async () => {
    const amount = parseInt(cashInput.replace(/\D/g, ''), 10) || 0;
    if (amount < 0 || amount > 10000000) {
      Alert.alert('Lỗi', 'Số tiền từ 0 đến 10.000.000đ');
      return;
    }
    if (isDemo) {
      setSettings((s) => (s ? { ...s, cashOnHand: amount, availableCash: amount - s.pendingCOD } : null));
      Alert.alert('Thành công', 'Đã cập nhật tiền mang theo (demo)');
      return;
    }
    setSaving(true);
    try {
      await driverService.declareCash(amount);
      setSettings((s) => (s ? { ...s, cashOnHand: amount, availableCash: amount - s.pendingCOD } : null));
      Alert.alert('Thành công', 'Đã cập nhật tiền mang theo');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể cập nhật');
    } finally {
      setSaving(false);
    }
  }, [cashInput, isDemo]);

  const handleServiceToggle = useCallback(
    (key: string, value: boolean) => {
      setSettings((s) =>
        s ? { ...s, enabledServices: { ...s.enabledServices, [key]: value } } : null,
      );
    },
    [],
  );

  const handleAutoAcceptToggle = useCallback((value: boolean) => {
    setSettings((s) => (s ? { ...s, autoAcceptEnabled: value } : null));
  }, []);

  const handleOnlineToggle = useCallback(
    async (value: boolean) => {
      const nextStatus = value ? 'ONLINE' : 'OFFLINE';
      setSettings((s) => (s ? { ...s, isOnline: value } : null));
      if (isDemo) return;
      try {
        await driverService.updateStatus(nextStatus);
      } catch (e: any) {
        setSettings((s) => (s ? { ...s, isOnline: !value } : null));
        Alert.alert('Lỗi', e?.message || 'Không thể đổi trạng thái. Kiểm tra hồ sơ đã duyệt chưa.');
      }
    },
    [isDemo],
  );

  const handleSaveSettings = useCallback(async () => {
    if (!settings) return;
    if (isDemo) {
      Alert.alert('Demo', 'Cài đặt chỉ xem mẫu. Tài xế thật lưu qua API.');
      return;
    }
    setSaving(true);
    try {
      await driverService.updateOrderReceivingSettings({
        enabledServices: settings.enabledServices,
        autoAcceptEnabled: settings.autoAcceptEnabled,
      });
      Alert.alert('Thành công', 'Đã lưu cài đặt nhận đơn');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu');
    } finally {
      setSaving(false);
    }
  }, [settings, isDemo]);

  const formatMoney = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

  if (loading || !settings) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cài đặt nhận đơn</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt nhận đơn</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Bật trực tuyến */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Bật trực tuyến</Text>
                <Switch
                  value={settings.isOnline}
                  onValueChange={handleOnlineToggle}
                  disabled={!canGoOnline}
                  trackColor={{ false: Colors.lightGray, true: Colors.gold + '60' }}
                  thumbColor={settings.isOnline ? Colors.gold : Colors.gray}
                />
              </View>
              <Text style={styles.hint}>
                {!canGoOnline
                  ? 'Hồ sơ cần được duyệt để bật trực tuyến. Kiểm tra màn Tài khoản.'
                  : settings.isOnline
                    ? 'Đang bật — bạn có thể nhận đơn.'
                    : 'Đang tắt — bật lên để nhận đơn mới.'}
              </Text>
            </View>
          </View>

          {/* Tiền mang theo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tiền mang theo (ứng COD)</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Đang khai báo</Text>
                <Text style={styles.rowValue}>{formatMoney(settings.cashOnHand)}</Text>
              </View>
              <View style={styles.rowBorder} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Đang ứng COD</Text>
                <Text style={styles.rowValue}>{formatMoney(settings.pendingCOD)}</Text>
              </View>
              <View style={styles.rowBorder} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Còn lại</Text>
                <Text style={[styles.rowValue, styles.cashAvailable]}>{formatMoney(settings.availableCash)}</Text>
              </View>
              <View style={styles.rowBorder} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Khai báo số tiền mới</Text>
                <TextInput
                  style={styles.input}
                  value={cashInput}
                  onChangeText={setCashInput}
                  placeholder="0"
                  placeholderTextColor={Colors.gray}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
              <TouchableOpacity
                style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]}
                onPress={handleDeclareCash}
                disabled={saving}
              >
                <Text style={styles.primaryBtnText}>{saving ? 'Đang xử lý...' : 'Cập nhật tiền mang theo'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dịch vụ của tôi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dịch vụ của tôi</Text>
            <View style={styles.card}>
              {Object.entries(settings.enabledServices).map(([key, value], idx) => (
                <React.Fragment key={key}>
                  {idx > 0 && <View style={styles.rowBorder} />}
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>{SERVICE_LABELS[key] ?? key}</Text>
                    <Switch
                      value={value}
                      onValueChange={(v) => handleServiceToggle(key, v)}
                      trackColor={{ false: Colors.lightGray, true: Colors.gold + '60' }}
                      thumbColor={value ? Colors.gold : Colors.gray}
                    />
                  </View>
                </React.Fragment>
              ))}
              <Text style={styles.hint}>Bật dịch vụ bạn muốn nhận để tăng cơ hội đơn hàng.</Text>
            </View>
          </View>

          {/* Tự động nhận đơn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tối ưu nhận đơn</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Tự động nhận đơn</Text>
                <Switch
                  value={settings.autoAcceptEnabled}
                  onValueChange={handleAutoAcceptToggle}
                  trackColor={{ false: Colors.lightGray, true: Colors.gold + '60' }}
                  thumbColor={settings.autoAcceptEnabled ? Colors.gold : Colors.gray}
                />
              </View>
              <Text style={styles.hint}>
                Hệ thống tự nhận đơn phù hợp (khoảng cách ≤ {settings.autoAcceptMaxDistanceKm}km, giá trị ≥ {formatMoney(settings.autoAcceptMinAmount)}).
              </Text>
            </View>
          </View>

          {!isDemo && (
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.primaryBtnDisabled]}
              onPress={handleSaveSettings}
              disabled={saving}
            >
              <Text style={styles.primaryBtnText}>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.gray },
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
    padding: Spacing.l,
    ...Shadows.level1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.s,
  },
  rowBorder: { height: 1, backgroundColor: Colors.offWhite, marginVertical: Spacing.xs },
  rowLabel: { ...Typography.body, color: Colors.black },
  rowValue: { ...Typography.secondary, color: Colors.gray },
  cashAvailable: { color: Colors.success, fontWeight: '600' },
  hint: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.s },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    minWidth: 120,
    textAlign: 'right',
  },
  primaryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginTop: Spacing.m,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { ...Typography.body, color: Colors.purpleDark, fontWeight: '600' },
  saveBtn: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginHorizontal: Spacing.l,
    marginTop: Spacing.xl,
  },
});
