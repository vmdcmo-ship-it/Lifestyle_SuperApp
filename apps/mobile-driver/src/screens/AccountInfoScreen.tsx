import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { driverService } from '../services/driver.service';
import { uploadService } from '../services/upload.service';
import { normalizeAvatarUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

const SESSION_EXPIRED_MSG = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
import { MOCK_DRIVER, isDemoDriverEmail } from '../data/mockData';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { DRIVER_STATUS_LABEL } from '../constants/driverStatus';

export function AccountInfoScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { profile: sharedProfile, loading, updateProfileCache } = useProfile();
  const isDemo = isDemoDriverEmail(user?.email ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  // Sử dụng dữ liệu từ ProfileContext (shared); với demo account thì dùng mock
  const profile = isDemo
    ? {
        firstName: 'Trần Văn',
        lastName: 'Bảo',
        email: user?.email ?? 'demo@driver.vmd.asia',
        phoneNumber: MOCK_DRIVER.phone,
        driverNumber: 'LS-DRV-000001',
        vehicleType: MOCK_DRIVER.vehicleType,
        vehiclePlate: MOCK_DRIVER.vehiclePlate,
        status: 'ACTIVE',
        rating: MOCK_DRIVER.rating,
        totalTrips: MOCK_DRIVER.totalTrips,
        avatar_url: sharedProfile?.avatar_url,
      }
    : sharedProfile;

  // Reset lỗi ảnh mỗi khi avatar_url thay đổi — phải đặt SAU khi profile đã được khai báo
  useEffect(() => {
    setAvatarLoadError(false);
  }, [sharedProfile?.avatar_url]);

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email || '—'
    : '—';

  const row = (label: string, value: string | number | undefined) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value ?? '—'}</Text>
    </View>
  );

  const pickImage = async (source: 'camera' | 'library') => {
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập camera.');
        return;
      }
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập kho ảnh.');
        return;
      }
    }
    const pickerOptions = { quality: 0.9, mediaTypes: ['images'] as const };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (result.canceled || !result.assets?.[0]?.uri) return;
    const uri = result.assets[0].uri;
    setUploadingAvatar(true);
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
      );
      let url: string;
      try {
        const res = await uploadService.uploadAvatar(manipulated.uri);
        url = res.url;
      } catch (uploadErr: any) {
        const m = uploadErr?.message ?? 'Không tải được ảnh lên.';
        Alert.alert('Lỗi tải ảnh', `${m}\n\nAPI upload hoạt động trên Swagger. Kiểm tra kết nối mạng hoặc thử chụp ảnh nhỏ hơn.`);
        return;
      }
      try {
        await driverService.updateProfile({ avatar_url: url });
      } catch (profileErr: any) {
        Alert.alert('Lỗi lưu profile', profileErr?.message ?? 'Đã tải ảnh nhưng không cập nhật được. Thử lại sau.');
        return;
      }
      // Cập nhật cache ngay lập tức — ảnh hiện ngay, không chờ API
      updateProfileCache({ avatar_url: url });
      Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện.');
    } catch (e: any) {
      if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
        await logout();
        Alert.alert('Hết phiên', SESSION_EXPIRED_MSG);
      } else {
        const msg = e?.message ?? 'Không thể cập nhật ảnh đại diện.';
        Alert.alert('Lỗi', `${msg}\n\nThử lại sau hoặc kiểm tra kết nối mạng.`);
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const showAvatarOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Hủy', 'Chụp ảnh', 'Chọn từ kho ảnh'],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) pickImage('camera');
          else if (i === 2) pickImage('library');
        },
      );
    } else {
      Alert.alert('Ảnh đại diện', 'Chọn cách thêm ảnh', [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chụp ảnh', onPress: () => pickImage('camera') },
        { text: 'Chọn từ kho ảnh', onPress: () => pickImage('library') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
        <View style={styles.backBtn} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrap}
              onPress={showAvatarOptions}
              disabled={uploadingAvatar}
            >
              {profile?.avatar_url && !avatarLoadError ? (
                <Image
                  key={profile.avatar_url}
                  source={{ uri: normalizeAvatarUrl(profile.avatar_url) ?? profile.avatar_url }}
                  style={styles.avatarImg}
                  onError={() => { setAvatarLoadError(true); }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'TX'}
                  </Text>
                </View>
              )}
              {uploadingAvatar && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Chạm để thay ảnh đại diện</Text>
            <View style={styles.avatarNotice}>
              <Text style={styles.avatarNoticeTitle}>Tiêu chuẩn ảnh đại diện</Text>
              <Text style={styles.avatarNoticeText}>
                Trang phục lịch sự · Không lộ hình xăm · Không đeo kính râm, khẩu trang
              </Text>
              <Text style={styles.avatarCta}>Hãy tạo cho mình 1 Hồ sơ thật xịn</Text>
            </View>
          </View>
          <View style={styles.card}>
            {row('Họ và tên', displayName)}
            <View style={styles.rowBorder} />
            {row('Email', profile?.email)}
            <View style={styles.rowBorder} />
            {row('Số điện thoại', profile?.phoneNumber)}
            <View style={styles.rowBorder} />
            {row('Mã tài xế', profile?.driverNumber)}
            <View style={styles.rowBorder} />
            {row('Loại xe', profile?.vehicleType)}
            <View style={styles.rowBorder} />
            {row('Biển số xe', profile?.vehiclePlate)}
            <View style={styles.rowBorder} />
            {row(
              'Trạng thái',
              profile?.status ? DRIVER_STATUS_LABEL[profile.status] ?? profile.status : undefined,
            )}
            {profile?.status === 'INACTIVE' && profile?.rejectionReason ? (
              <>
                <View style={styles.rowBorder} />
                {row('Lý do từ chối', profile.rejectionReason)}
              </>
            ) : null}
            <View style={styles.rowBorder} />
            {row('Đánh giá', profile?.rating != null ? `⭐ ${profile.rating}` : undefined)}
            <View style={styles.rowBorder} />
            {row('Tổng chuyến đi', profile?.totalTrips != null ? String(profile.totalTrips) : undefined)}
          </View>

          <Text style={styles.sectionTitle}>Điều kiện & Tiêu chuẩn hợp tác Đối tác</Text>

          <View style={styles.policyCardHighlight}>
            <Text style={styles.policyTitle}>🤝 Chào mừng Đối tác Driver</Text>
            <Text style={styles.policyText}>
              Điều kiện hợp tác, tiêu chuẩn và chính sách được thiết lập để đồng hành bền vững. Hoàn thành hồ sơ đầy đủ để bắt đầu nhận đơn trên nền tảng.
            </Text>
          </View>

          <Text style={styles.hint}>Chỉnh sửa thông tin cá nhân tại Cài đặt hoặc liên hệ tổng đài hỗ trợ.</Text>
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
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
  avatarSection: {
    margin: Spacing.l,
    alignItems: 'center',
    paddingVertical: Spacing.l,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    ...Shadows.level1,
  },
  avatarWrap: { position: 'relative' },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gold + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: { fontSize: 32, fontWeight: '700', color: Colors.purpleDark },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.s },
  avatarNotice: {
    marginTop: Spacing.l,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  avatarNoticeTitle: { ...Typography.caption, color: Colors.gray, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  avatarNoticeText: { ...Typography.secondary, color: Colors.darkGray, textAlign: 'center', lineHeight: 20 },
  avatarCta: { ...Typography.body, fontWeight: '700', color: Colors.gold, marginTop: Spacing.m },
  card: {
    margin: Spacing.l,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
    ...Shadows.level1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.l, paddingVertical: Spacing.m },
  rowBorder: { height: 1, backgroundColor: Colors.offWhite, marginLeft: Spacing.l },
  rowLabel: { ...Typography.body, color: Colors.gray },
  rowValue: { ...Typography.body, color: Colors.black, flex: 1, textAlign: 'right', marginLeft: Spacing.m },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.gray,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.xl,
    marginBottom: Spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  policyCard: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  policyCardHighlight: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    backgroundColor: Colors.info + '12',
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  policyTitle: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark, marginBottom: Spacing.xs },
  policyText: { ...Typography.secondary, color: Colors.darkGray },
  hint: { ...Typography.caption, color: Colors.gray, marginHorizontal: Spacing.l, marginTop: Spacing.m },
});
