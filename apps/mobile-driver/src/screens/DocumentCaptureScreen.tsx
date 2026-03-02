/**
 * Chụp ảnh chứng từ (CCCD, GPLX, đăng ký xe, bảo hiểm, ảnh xe).
 * Dùng camera sau với khung hướng dẫn phù hợp từng loại giấy tờ.
 * Upload kèm documentType để backend xác thực OCR chống gian lận.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { uploadService } from '../services/upload.service';
import { useAuth } from '../context/AuthContext';

export type DocumentType =
  | 'license'
  | 'citizen_front'
  | 'citizen_back'
  | 'criminal_record'
  | 'registration'
  | 'insurance'
  | 'vehicle_front'
  | 'vehicle_back'
  | 'vehicle_left'
  | 'vehicle_right'
  | 'vehicle_plate';

type DocumentCaptureRouteParams = {
  documentType: DocumentType;
  title: string;
  onSuccess: (url: string) => void | Promise<void>;
};

const DOC_FILE_NAMES: Record<DocumentType, string> = {
  license: 'gplx.jpg',
  citizen_front: 'cccd-front.jpg',
  citizen_back: 'cccd-back.jpg',
  criminal_record: 'ly-lich-tu-phap.jpg',
  registration: 'dang-ky-xe.jpg',
  insurance: 'baohiem.jpg',
  vehicle_front: 'xe-truoc.jpg',
  vehicle_back: 'xe-sau.jpg',
  vehicle_left: 'xe-trai.jpg',
  vehicle_right: 'xe-phai.jpg',
  vehicle_plate: 'bien-so.jpg',
};

/** Hint text hướng dẫn người dùng theo từng loại giấy tờ. */
const DOC_HINTS: Record<DocumentType, string> = {
  citizen_front: 'Đặt mặt TRƯỚC CCCD vào khung\nPhải đọc rõ: Họ tên · Số CCCD · Ngày sinh',
  citizen_back: 'Đặt mặt SAU CCCD vào khung\nPhải đọc rõ: Quê quán · Ngày cấp · Đặc điểm',
  license: 'Đặt Giấy phép lái xe (GPLX) vào khung\nPhải đọc rõ: Số GPLX · Hạng · Ngày hết hạn',
  registration: 'Đặt Giấy đăng ký xe vào khung\nPhải đọc rõ: Biển số · Nhãn hiệu · Số khung',
  insurance: 'Đặt Bảo hiểm xe vào khung\nPhải đọc rõ: Biển số · Thời hạn bảo hiểm',
  criminal_record: 'Đặt Phiếu lý lịch tư pháp vào khung\nPhải đọc rõ toàn bộ nội dung',
  vehicle_front: 'Chụp toàn bộ đầu xe\nĐủ sáng · Nhìn thẳng · Rõ biển số',
  vehicle_back: 'Chụp toàn bộ đuôi xe\nĐủ sáng · Nhìn thẳng · Rõ biển số',
  vehicle_left: 'Chụp cạnh trái xe\nĐủ sáng · Nhìn ngang · Thấy toàn xe',
  vehicle_right: 'Chụp cạnh phải xe\nĐủ sáng · Nhìn ngang · Thấy toàn xe',
  vehicle_plate: 'Chụp gần vào biển số\nRõ từng ký tự · Không bị che · Đủ sáng',
};

/** Các loại giấy tờ dạng thẻ ID (ISO 7810 landscape 85.6:54mm). */
const CARD_TYPES = new Set<DocumentType>(['citizen_front', 'citizen_back', 'license']);

/** Các loại ảnh xe — không có khung tài liệu, frame square-ish. */
const VEHICLE_PHOTO_TYPES = new Set<DocumentType>([
  'vehicle_front', 'vehicle_back', 'vehicle_left', 'vehicle_right', 'vehicle_plate',
]);

const SESSION_EXPIRED_MSG = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';

const { width: SCREEN_W } = Dimensions.get('window');

// Card frame: ISO 7810 ID-1 ratio = 85.6 × 54 mm (landscape)
const CARD_W = SCREEN_W * 0.88;
const CARD_H = CARD_W * (54 / 85.6); // ≈ 0.631 × width

// Paper frame: A4-like portrait for registration/insurance/criminal_record
const PAPER_W = SCREEN_W * 0.82;
const PAPER_H = PAPER_W * 1.41; // A4 ratio

// Vehicle photo frame: 4:3 landscape
const VEHICLE_W = SCREEN_W * 0.92;
const VEHICLE_H = VEHICLE_W * 0.75;

function getFrameSize(docType: DocumentType): { w: number; h: number } {
  if (CARD_TYPES.has(docType)) return { w: CARD_W, h: CARD_H };
  if (VEHICLE_PHOTO_TYPES.has(docType)) return { w: VEHICLE_W, h: VEHICLE_H };
  return { w: PAPER_W, h: PAPER_H };
}

export function DocumentCaptureScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const route = useRoute<RouteProp<{ params: DocumentCaptureRouteParams }, 'params'>>();
  const { documentType, title, onSuccess } = route.params || {};

  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission?.granted]);

  const fileName = documentType ? DOC_FILE_NAMES[documentType] ?? 'document.jpg' : 'document.jpg';
  const hint = documentType ? DOC_HINTS[documentType] ?? '' : '';
  const frame = documentType ? getFrameSize(documentType) : { w: CARD_W, h: CARD_H };

  const handleCapture = async () => {
    if (!cameraRef.current || !permission?.granted) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.92,
        base64: false,
        skipProcessing: false,
        imageType: 'jpg',
      });
      if (photo?.uri) {
        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1600 } }],
          { compress: 0.88, format: ImageManipulator.SaveFormat.JPEG },
        );
        setImageUri(manipulated.uri);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.9,
        mediaTypes: ['images'],
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1600 } }],
        { compress: 0.88, format: ImageManipulator.SaveFormat.JPEG },
      );
      setImageUri(manipulated.uri);
    } catch {
      Alert.alert('Lỗi', 'Không thể mở kho ảnh. Vui lòng thử lại.');
    }
  };

  const handleRetake = () => setImageUri(null);

  const handleConfirm = async () => {
    if (!imageUri) return;
    setUploading(true);
    try {
      const { url } = await uploadService.uploadDocument(imageUri, fileName, documentType);
      await onSuccess?.(url);
      navigation.goBack();
    } catch (e: any) {
      if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
        await logout();
        Alert.alert('Hết phiên', SESSION_EXPIRED_MSG);
      } else {
        const msg = e?.message ?? 'Không thể tải ảnh lên.';
        const isOcrError =
          typeof msg === 'string' &&
          (msg.includes('không phải') || msg.includes('Vui lòng chụp lại') || msg.includes('Vui lòng chụp rõ'));
        const is404 =
          typeof msg === 'string' && (msg.includes('cannot POST') || msg.includes('404'));
        Alert.alert(
          isOcrError ? '❌ Ảnh không hợp lệ' : 'Lỗi',
          isOcrError
            ? msg
            : is404
              ? 'Chức năng chưa sẵn sàng. Vui lòng deploy main-api mới nhất lên VPS.'
              : `${msg}\n\nThử lại sau hoặc kiểm tra kết nối mạng.`,
          isOcrError
            ? [{ text: '📷 Chụp lại', onPress: handleRetake, style: 'default' }]
            : [{ text: 'OK' }],
        );
      }
    } finally {
      setUploading(false);
    }
  };

  if (!documentType || !title || !onSuccess) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.message}>Thiếu tham số. Vui lòng thử lại.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Preview (after capture/select) ──────────────────────────────────────
  if (imageUri) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleRetake} disabled={uploading}>
            <Text style={styles.backText}>Chụp lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận ảnh</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.previewWrap}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          <View style={styles.previewOverlay}>
            <Text style={styles.previewHint}>
              Ảnh có rõ nét, đủ sáng và đọc được thông tin không?
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.confirmBtn, uploading && styles.disabled]}
            onPress={handleConfirm}
            disabled={uploading}
          >
            {uploading ? (
              <View style={styles.uploadingRow}>
                <ActivityIndicator color={Colors.purpleDark} style={{ marginRight: 8 }} />
                <Text style={styles.confirmBtnText}>Đang xác thực & lưu...</Text>
              </View>
            ) : (
              <Text style={styles.confirmBtnText}>Dùng ảnh này & Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── No camera permission ────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Huỷ</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.center}>
          <Text style={styles.message}>
            Cần quyền camera để chụp ảnh.{'\n'}Bạn cũng có thể chọn ảnh từ kho.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Cho phép camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.galleryBtnAlt, { marginTop: Spacing.m }]}
            onPress={pickFromGallery}
          >
            <Text style={styles.galleryBtnAltText}>📁 Chọn từ kho ảnh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Live camera with guide frame ────────────────────────────────────────
  const frameW = frame.w;
  const frameH = frame.h;
  const sideW = (SCREEN_W - frameW) / 2;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Huỷ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={() => setTorchOn((t) => !t)} style={styles.torchBtn}>
          <Text style={styles.torchText}>{torchOn ? '💡 Bật' : '💡 Đèn'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraWrap}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchOn}
        />

        {/* Dark overlay: top */}
        <View style={[styles.overlayDark, styles.overlayTop]} pointerEvents="none" />

        {/* Dark overlay: middle row = left | transparent frame | right */}
        <View style={[styles.overlayMiddle, { height: frameH }]} pointerEvents="none">
          <View style={[styles.overlayDark, { width: sideW }]} />

          {/* The transparent card frame with corner marks */}
          <View style={{ width: frameW, height: frameH }}>
            {/* Corner marks — gold L-shapes */}
            <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 }]} />
            <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 }]} />
            <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
            <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 }]} />
          </View>

          <View style={[styles.overlayDark, { width: sideW }]} />
        </View>

        {/* Dark overlay: bottom (hint lives here) */}
        <View style={[styles.overlayDark, styles.overlayBottom]} pointerEvents="none">
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      </View>

      {/* Bottom action row: gallery | capture | spacer */}
      <View style={styles.captureRow}>
        <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} activeOpacity={0.7}>
          <Text style={styles.galleryIcon}>📁</Text>
          <Text style={styles.galleryLabel}>Kho ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        {/* Spacer to center capture button */}
        <View style={styles.galleryBtn} />
      </View>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 28;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backText: { ...Typography.body, color: Colors.white, fontWeight: '600', minWidth: 60 },
  headerTitle: { ...Typography.h3, color: Colors.white, textAlign: 'center', flex: 1 },
  placeholder: { minWidth: 60 },
  torchBtn: { padding: Spacing.s, minWidth: 60, alignItems: 'flex-end' },
  torchText: { ...Typography.caption, color: Colors.white },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.black,
  },
  message: { ...Typography.body, color: Colors.white, textAlign: 'center', marginBottom: Spacing.l },
  permBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
  },
  permBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  galleryBtnAlt: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.medium,
  },
  galleryBtnAltText: { ...Typography.body, color: Colors.white },

  // ── Camera view ──────────────────────────────────────────────────────────
  cameraWrap: { flex: 1 },

  overlayDark: { backgroundColor: 'rgba(0,0,0,0.58)' },
  overlayTop: { flex: 1 },
  overlayMiddle: { flexDirection: 'row' },
  overlayBottom: { flex: 1.2, paddingTop: 20, paddingHorizontal: Spacing.l, alignItems: 'center' },

  // Corner L-marks
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.gold,
  },

  hintText: {
    ...Typography.secondary,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Bottom capture row ────────────────────────────────────────────────────
  captureRow: {
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  galleryBtn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryIcon: { fontSize: 24 },
  galleryLabel: { ...Typography.caption, color: Colors.white, marginTop: 2 },

  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.level2,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gold,
  },

  // ── Preview ───────────────────────────────────────────────────────────────
  previewWrap: { flex: 1, backgroundColor: Colors.black },
  preview: { flex: 1, width: '100%' },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  previewHint: { ...Typography.secondary, color: Colors.white, textAlign: 'center' },
  actions: { padding: Spacing.l, backgroundColor: Colors.black },
  confirmBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  confirmBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  disabled: { opacity: 0.7 },
  uploadingRow: { flexDirection: 'row', alignItems: 'center' },
});
