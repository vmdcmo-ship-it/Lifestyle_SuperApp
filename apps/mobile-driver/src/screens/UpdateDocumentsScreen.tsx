import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { driverService } from '../services/driver.service';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import type { DocumentType } from './DocumentCaptureScreen';

/** Lấy tên file ngắn từ URL để hiển thị. */
function getFileName(url?: string): string {
  if (!url) return '';
  const parts = url.split('/');
  const name = parts[parts.length - 1] ?? '';
  // Giữ tối đa 24 ký tự để không tràn
  return name.length > 24 ? name.slice(0, 10) + '...' + name.slice(-8) : name;
}

const SESSION_EXPIRED_MSG = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';

type Identity = {
  citizenIdFrontImage?: string;
  citizenIdBackImage?: string;
  faceImage?: string;
  driverLicenseImage?: string;
  criminalRecordImage?: string;
};

type Vehicle = {
  id: string;
  front_image?: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  plate_closeup_image?: string;
  registration_image?: string;
  insurance_image?: string;
  license_plate?: string;
  licensePlate?: string;
  insurance_number?: string;
  insurance_expiry?: string;
};

const DOC_ITEMS: Array<{
  key: string;
  icon: string;
  title: string;
  desc: string;
  docType?: DocumentType;
  isFace?: boolean;
  identityKey?: keyof Identity;
  vehicleKey?: keyof Vehicle;
  /** Lưu vào ảnh bảo hiểm xe chính (hiển thị ở giấy tờ cá nhân) */
  savesToVehicle?: boolean;
}> = [
  {
    key: 'license',
    icon: '🪪',
    title: 'Giấy phép lái xe (GPLX)',
    desc: 'Chụp ảnh GPLX còn hạn, rõ mặt. Cập nhật khi gần hết hạn hoặc đổi bằng mới.',
    docType: 'license',
    identityKey: 'driverLicenseImage',
  },
  {
    key: 'citizen_front',
    icon: '🪪',
    title: 'CCCD mặt trước',
    desc: 'Chụp ảnh CCCD/CMND 12 số, mặt trước rõ nét.',
    docType: 'citizen_front',
    identityKey: 'citizenIdFrontImage',
  },
  {
    key: 'citizen_back',
    icon: '🪪',
    title: 'CCCD mặt sau',
    desc: 'Chụp ảnh CCCD/CMND, mặt sau rõ nét.',
    docType: 'citizen_back',
    identityKey: 'citizenIdBackImage',
  },
  {
    key: 'face',
    icon: '📷',
    title: 'Ảnh chân dung / Khuôn mặt',
    desc: 'Chụp ảnh khuôn mặt rõ ràng để quản lý vận hành xác minh. Ảnh cần đủ sáng, nhìn thẳng camera.',
    isFace: true,
    identityKey: 'faceImage',
  },
  {
    key: 'criminal',
    icon: '📄',
    title: 'Phiếu lý lịch tư pháp',
    desc: 'Chụp ảnh phiếu lý lịch tư pháp còn hiệu lực.',
    docType: 'criminal_record',
    identityKey: 'criminalRecordImage',
  },
  {
    key: 'tnds',
    icon: '🛡️',
    title: 'BH TNDS Xe máy / Ôtô',
    desc: 'Chụp ảnh giấy chứng nhận BH TNDS (xe máy hoặc ôtô) còn hạn, đúng phương tiện tham gia lái xe.',
    docType: 'insurance',
    savesToVehicle: true,
    vehicleKey: 'insurance_image',
  },
];

const VEHICLE_DOC_ITEMS: Array<{
  key: string;
  icon: string;
  title: string;
  desc: string;
  docType: DocumentType;
  vehicleKey: keyof Vehicle;
}> = [
  { key: 'registration', icon: '📋', title: 'Giấy đăng ký xe', desc: 'Chụp ảnh giấy đăng ký xe còn hiệu lực.', docType: 'registration', vehicleKey: 'registration_image' },
  { key: 'insurance', icon: '🛡️', title: 'Bảo hiểm TNDS', desc: 'Chụp ảnh bảo hiểm còn hạn, đúng phương tiện.', docType: 'insurance', vehicleKey: 'insurance_image' },
  { key: 'vehicle_front', icon: '🏍️', title: 'Ảnh xe - Mặt trước', desc: 'Chụp ảnh thực tế phương tiện, góc trước.', docType: 'vehicle_front', vehicleKey: 'front_image' },
  { key: 'vehicle_back', icon: '🏍️', title: 'Ảnh xe - Mặt sau', desc: 'Chụp ảnh thực tế phương tiện, góc sau.', docType: 'vehicle_back', vehicleKey: 'back_image' },
  { key: 'vehicle_plate', icon: '🔢', title: 'Ảnh biển số (bắt buộc)', desc: 'Chụp rõ biển số đăng ký phương tiện.', docType: 'vehicle_plate', vehicleKey: 'plate_closeup_image' },
];

/** Format ngày từ API (Date/string) sang YYYY-MM-DD cho input. */
function toDateInputValue(val?: string | Date | null): string {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/** Số ngày còn lại đến hết hạn (âm = đã hết) */
function getDaysUntilExpiry(val?: string | Date | null): number | null {
  if (!val) return null;
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function UpdateDocumentsScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { profile: sharedProfile, loading, updateProfileCache } = useProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tndsInsuranceNumber, setTndsInsuranceNumber] = useState('');
  const [tndsInsuranceExpiry, setTndsInsuranceExpiry] = useState('');
  const [savingTnds, setSavingTnds] = useState(false);

  // Đọc dữ liệu trực tiếp từ ProfileContext
  const identity: Identity | null = (sharedProfile?.identity as Identity) ?? null;
  const vehicles: Vehicle[] = (sharedProfile?.vehicles as Vehicle[]) ?? [];
  const primaryVehicle = vehicles.find((v: any) => v.is_primary) ?? vehicles[0];

  // Đồng bộ form TNDS từ xe chính
  useEffect(() => {
    if (!primaryVehicle) return;
    setTndsInsuranceNumber((primaryVehicle as any).insurance_number ?? (primaryVehicle as any).insuranceNumber ?? '');
    setTndsInsuranceExpiry(toDateInputValue((primaryVehicle as any).insurance_expiry ?? (primaryVehicle as any).insuranceExpiry));
  }, [primaryVehicle?.id, (primaryVehicle as any)?.insurance_number, (primaryVehicle as any)?.insurance_expiry]);

  const handleIdentityDocSuccess = (key: keyof Identity, url: string) => {
    driverService
      .updateIdentity({ [key]: url })
      .then(() => {
        // Cập nhật ProfileContext → thumbnail hiển thị ngay, toàn app đồng bộ
        updateProfileCache({
          identity: { ...(sharedProfile?.identity as Identity), [key]: url },
        });
      })
      .catch(async (e: any) => {
        if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
          await logout();
          Alert.alert('Hết phiên', SESSION_EXPIRED_MSG);
        } else {
          Alert.alert('Lỗi', e?.message ?? 'Không thể cập nhật');
        }
      });
  };

  const handleVehicleDocSuccess = (key: keyof Vehicle, url: string) => {
    if (!primaryVehicle?.id) {
      Alert.alert('Lưu ý', 'Bạn cần thêm phương tiện trước khi cập nhật ảnh xe.');
      return;
    }
    const payload: any = {};
    if (key === 'front_image') payload.frontImage = url;
    else if (key === 'back_image') payload.backImage = url;
    else if (key === 'left_image') payload.leftImage = url;
    else if (key === 'right_image') payload.rightImage = url;
    else if (key === 'plate_closeup_image') payload.plateCloseupImage = url;
    else if (key === 'registration_image') payload.registrationImage = url;
    else if (key === 'insurance_image') payload.insuranceImage = url;

    driverService
      .updateVehicleDocuments(primaryVehicle.id, payload)
      .then(() => {
        // Cập nhật ProfileContext → thumbnail hiển thị ngay, toàn app đồng bộ
        updateProfileCache({
          vehicles: (sharedProfile?.vehicles as Vehicle[])?.map((v: any) =>
            v.id === primaryVehicle.id ? { ...v, [key]: url } : v,
          ) ?? [],
        });
      })
      .catch(async (e: any) => {
        if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
          await logout();
          Alert.alert('Hết phiên', SESSION_EXPIRED_MSG);
        } else {
          Alert.alert('Lỗi', e?.message ?? 'Không thể cập nhật');
        }
      });
  };

  const openFaceCapture = () => {
    navigation.navigate('FaceCapture', {
      onSuccess: (url: string) => handleIdentityDocSuccess('faceImage', url),
    });
  };

  const handleSaveTndsInfo = async () => {
    if (!primaryVehicle?.id) {
      Alert.alert('Lưu ý', 'Bạn cần thêm phương tiện trước khi khai báo BH TNDS.');
      return;
    }
    setSavingTnds(true);
    try {
      await driverService.updateVehicleDocuments(primaryVehicle.id, {
        insuranceNumber: tndsInsuranceNumber.trim() || undefined,
        insuranceExpiry: tndsInsuranceExpiry.trim() || undefined,
      });
      updateProfileCache({
        vehicles: (sharedProfile?.vehicles as Vehicle[])?.map((v: any) =>
          v.id === primaryVehicle.id
            ? {
                ...v,
                insurance_number: tndsInsuranceNumber.trim() || v.insurance_number,
                insurance_expiry: tndsInsuranceExpiry.trim() || v.insurance_expiry,
              }
            : v,
        ) ?? [],
      });
      Alert.alert('Thành công', 'Đã lưu thông tin BH TNDS.');
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message ?? 'Không thể lưu.');
    } finally {
      setSavingTnds(false);
    }
  };

  const openDocumentCapture = (item: (typeof DOC_ITEMS)[0] | (typeof VEHICLE_DOC_ITEMS)[0]) => {
    if (!('docType' in item) || !item.docType) return;
    const docItem = item as (typeof DOC_ITEMS)[0];
    if ('savesToVehicle' in docItem && docItem.savesToVehicle && docItem.vehicleKey) {
      if (!primaryVehicle?.id) {
        Alert.alert(
          'Chưa có phương tiện',
          'Bạn cần thêm phương tiện tại mục Phương tiện trước khi cập nhật ảnh BH TNDS.',
          [{ text: 'OK' }],
        );
        return;
      }
      navigation.navigate('DocumentCapture', {
        documentType: item.docType,
        title: item.title,
        onSuccess: (url: string) => handleVehicleDocSuccess(docItem.vehicleKey!, url),
      });
      return;
    }
    if ('identityKey' in item && item.identityKey) {
      navigation.navigate('DocumentCapture', {
        documentType: item.docType,
        title: item.title,
        onSuccess: (url: string) => handleIdentityDocSuccess(item.identityKey!, url),
      });
    } else if ('vehicleKey' in item && item.vehicleKey) {
      navigation.navigate('DocumentCapture', {
        documentType: item.docType,
        title: item.title,
        onSuccess: (url: string) => handleVehicleDocSuccess(item.vehicleKey!, url),
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backBtnText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cập nhật giấy tờ</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backBtnText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật giấy tờ</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Chụp ảnh thực tế giấy tờ và phương tiện. Ảnh được lưu làm tài liệu quản lý. Bạn có thể xem lại và chụp lại bất cứ lúc nào.
        </Text>

        <Text style={styles.sectionTitle}>Giấy tờ cá nhân</Text>
        {DOC_ITEMS.filter((item) => item.key !== 'tnds').map((item) => {
          const savedUrl = item.savesToVehicle && item.vehicleKey
            ? primaryVehicle?.[item.vehicleKey as keyof Vehicle] as string | undefined
            : item.identityKey
              ? identity?.[item.identityKey as keyof Identity]
              : undefined;
          return (
            <View key={item.key} style={styles.card}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>

              {savedUrl ? (
                <TouchableOpacity
                  style={styles.savedPreview}
                  activeOpacity={0.85}
                  onPress={() => setPreviewUrl(savedUrl)}
                >
                  <Image source={{ uri: savedUrl }} style={styles.thumbnail} resizeMode="cover" />
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedLabel}>✅ Đã lưu</Text>
                    <Text style={styles.fileName} numberOfLines={1}>{getFileName(savedUrl)}</Text>
                    <Text style={styles.tapHint}>Chạm để xem lại</Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={[styles.captureBtn, savedUrl ? styles.captureBtnSecondary : null]}
                onPress={item.isFace ? openFaceCapture : () => openDocumentCapture(item)}
              >
                <Text style={[styles.captureBtnText, savedUrl ? styles.captureBtnTextSecondary : null]}>
                  {savedUrl ? 'Chụp lại' : item.isFace ? 'Chụp ảnh khuôn mặt' : 'Chụp ảnh'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* BH TNDS Xe máy / Ôtô: khai báo + ảnh + nút mua bảo hiểm */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🛡️</Text>
          <Text style={styles.cardTitle}>BH TNDS Xe máy / Ôtô</Text>
          <Text style={styles.cardDesc}>
            Khai báo thông tin và chụp ảnh giấy chứng nhận để kiểm soát, theo dõi nhắc gia hạn. Có ngày hết hạn để app nhắc mua lại BH (cross-selling).
          </Text>

          {primaryVehicle ? (
            <>
              {(() => {
                const expVal = tndsInsuranceExpiry || (primaryVehicle as any).insurance_expiry;
                const days = getDaysUntilExpiry(expVal);
                if (days != null && days <= 30) {
                  return (
                    <View style={[styles.tndsReminder, days < 0 ? styles.tndsReminderExpired : styles.tndsReminderExpiring]}>
                      <Text style={styles.tndsReminderText}>
                        {days < 0 ? `⚠️ BH TNDS đã hết hạn ${Math.abs(days)} ngày` : `⚠️ BH TNDS sắp hết hạn trong ${days} ngày`}
                      </Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Insurance')}>
                        <Text style={styles.tndsReminderLink}>Mua bảo hiểm ngay →</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
                return null;
              })()}
              <Text style={styles.tndsLabel}>Biển số đăng ký phương tiện</Text>
              <Text style={styles.tndsValue}>
                {primaryVehicle.license_plate ?? (primaryVehicle as any).licensePlate ?? '—'}
              </Text>

              <Text style={styles.tndsLabel}>Mã số bảo hiểm</Text>
              <TextInput
                style={styles.tndsInput}
                value={tndsInsuranceNumber}
                onChangeText={setTndsInsuranceNumber}
                placeholder="Nhập mã số BH TNDS"
                placeholderTextColor={Colors.gray}
              />

              <Text style={styles.tndsLabel}>Ngày hết hạn (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.tndsInput}
                value={tndsInsuranceExpiry}
                onChangeText={setTndsInsuranceExpiry}
                placeholder="VD: 2025-12-31"
                placeholderTextColor={Colors.gray}
              />

              <TouchableOpacity
                style={[styles.saveTndsBtn, savingTnds && styles.saveTndsBtnDisabled]}
                onPress={handleSaveTndsInfo}
                disabled={savingTnds}
              >
                {savingTnds ? (
                  <ActivityIndicator size="small" color={Colors.purpleDark} />
                ) : (
                  <Text style={styles.saveTndsBtnText}>Lưu thông tin</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.tndsHint}>Thêm phương tiện tại mục Phương tiện để khai báo BH TNDS.</Text>
          )}

          {primaryVehicle && (
            <TouchableOpacity
              style={[styles.captureBtn, primaryVehicle?.insurance_image && styles.captureBtnSecondary]}
              onPress={() => {
                const tndsItem = DOC_ITEMS.find((i) => i.key === 'tnds')!;
                if (!primaryVehicle?.id) {
                  Alert.alert('Lưu ý', 'Bạn cần thêm phương tiện trước khi cập nhật ảnh BH TNDS.');
                  return;
                }
                navigation.navigate('DocumentCapture', {
                  documentType: tndsItem.docType!,
                  title: tndsItem.title,
                  onSuccess: (url: string) => handleVehicleDocSuccess('insurance_image', url),
                });
              }}
            >
              <Text style={[styles.captureBtnText, primaryVehicle?.insurance_image && styles.captureBtnTextSecondary]}>
                {primaryVehicle?.insurance_image ? 'Chụp lại ảnh BH' : 'Chụp ảnh giấy chứng nhận BH'}
              </Text>
            </TouchableOpacity>
          )}

          {primaryVehicle?.insurance_image ? (
            <TouchableOpacity style={styles.savedPreview} onPress={() => setPreviewUrl(primaryVehicle.insurance_image)} activeOpacity={0.85}>
              <Image source={{ uri: primaryVehicle.insurance_image }} style={styles.thumbnail} resizeMode="cover" />
              <View style={styles.savedInfo}>
                <Text style={styles.savedLabel}>✅ Đã lưu ảnh</Text>
                <Text style={styles.tapHint}>Chạm để xem lại</Text>
              </View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.buyInsuranceBtn}
            onPress={() => navigation.navigate('Insurance')}
          >
            <Text style={styles.buyInsuranceBtnText}>🛒 Mua bảo hiểm</Text>
          </TouchableOpacity>
        </View>

        {primaryVehicle && (
          <>
            <Text style={styles.sectionTitle}>Phương tiện & giấy xe</Text>
            {VEHICLE_DOC_ITEMS.map((item) => {
              const savedUrl = primaryVehicle[item.vehicleKey as keyof Vehicle] as string | undefined;
              return (
                <View key={item.key} style={styles.card}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>

                  {savedUrl ? (
                    <TouchableOpacity
                      style={styles.savedPreview}
                      activeOpacity={0.85}
                      onPress={() => setPreviewUrl(savedUrl)}
                    >
                      <Image source={{ uri: savedUrl }} style={styles.thumbnail} resizeMode="cover" />
                      <View style={styles.savedInfo}>
                        <Text style={styles.savedLabel}>✅ Đã lưu</Text>
                        <Text style={styles.fileName} numberOfLines={1}>{getFileName(savedUrl)}</Text>
                        <Text style={styles.tapHint}>Chạm để xem lại</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.captureBtn, savedUrl ? styles.captureBtnSecondary : null]}
                    onPress={() => openDocumentCapture(item)}
                  >
                    <Text style={[styles.captureBtnText, savedUrl ? styles.captureBtnTextSecondary : null]}>
                      {savedUrl ? 'Chụp lại' : 'Chụp ảnh'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}

        {!primaryVehicle && (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>🏍️ Chưa có phương tiện</Text>
            <Text style={styles.noteText}>
              Vào mục Phương tiện → Thêm xe để đăng ký phương tiện, sau đó quay lại đây để cập nhật ảnh giấy đăng ký xe và bảo hiểm.
            </Text>
          </View>
        )}

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>💡 Lưu ý</Text>
          <Text style={styles.noteText}>
            Ảnh cần rõ, đủ sáng. Khi giấy tờ sắp hết hạn, ứng dụng sẽ nhắc bạn cập nhật.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Modal xem ảnh full screen */}
      <Modal visible={!!previewUrl} transparent animationType="fade" onRequestClose={() => setPreviewUrl(null)}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Pressable style={styles.modalOverlay} onPress={() => setPreviewUrl(null)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHint}>Chạm bất kỳ để đóng</Text>
            {previewUrl ? (
              <Image
                source={{ uri: previewUrl }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            ) : null}
            <Text style={styles.modalFileName}>{getFileName(previewUrl ?? '')}</Text>
          </View>
        </Pressable>
      </Modal>
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
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.m },
  loadingText: { ...Typography.body, color: Colors.gray },
  scroll: { flex: 1 },
  intro: {
    ...Typography.body,
    color: Colors.darkGray,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.purpleDark,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.s,
    marginTop: Spacing.l,
  },
  card: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.l,
    ...Shadows.level1,
  },
  cardIcon: { fontSize: 28, marginBottom: Spacing.s },
  cardTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.xs },
  cardDesc: { ...Typography.secondary, color: Colors.gray },
  tndsLabel: { ...Typography.body, fontWeight: '600', color: Colors.black, marginTop: Spacing.m, marginBottom: 4 },
  tndsValue: { ...Typography.body, color: Colors.darkGray, marginBottom: Spacing.s },
  tndsInput: {
    ...Typography.body,
    backgroundColor: Colors.offWhite,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.s,
  },
  tndsHint: { ...Typography.secondary, color: Colors.gray, marginTop: Spacing.s },
  tndsReminder: {
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.m,
    borderLeftWidth: 4,
  },
  tndsReminderExpiring: { backgroundColor: Colors.warning + '15', borderLeftColor: Colors.warning },
  tndsReminderExpired: { backgroundColor: Colors.error + '12', borderLeftColor: Colors.error },
  tndsReminderText: { ...Typography.body, fontWeight: '600', color: Colors.black },
  tndsReminderLink: { ...Typography.body, fontWeight: '600', color: Colors.info, marginTop: 4 },
  saveTndsBtn: {
    marginTop: Spacing.m,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.gold + '40',
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  saveTndsBtnDisabled: { opacity: 0.7 },
  saveTndsBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  buyInsuranceBtn: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.info,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  buyInsuranceBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
  noteCard: {
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    padding: Spacing.l,
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  noteTitle: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark, marginBottom: Spacing.xs },
  noteText: { ...Typography.caption, color: Colors.darkGray },
  savedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.m,
    padding: Spacing.s,
    backgroundColor: Colors.success + '12',
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  savedInfo: {
    flex: 1,
    marginLeft: Spacing.m,
    justifyContent: 'center',
  },
  savedLabel: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 2,
  },
  fileName: {
    ...Typography.caption,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  tapHint: {
    ...Typography.caption,
    color: Colors.gray,
    fontStyle: 'italic',
  },
  captureBtn: {
    marginTop: Spacing.m,
    backgroundColor: Colors.gold + '30',
    paddingVertical: Spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureBtnSecondary: {
    backgroundColor: Colors.lightGray,
  },
  captureBtnText: { ...Typography.body, fontWeight: '600', color: Colors.purpleDark },
  captureBtnTextSecondary: { color: Colors.gray },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
  },
  modalHint: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: Spacing.m,
  },
  fullImage: {
    width: '100%',
    height: 480,
    borderRadius: BorderRadius.medium,
  },
  modalFileName: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Spacing.m,
  },
});
