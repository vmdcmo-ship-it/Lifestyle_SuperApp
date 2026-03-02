/**
 * Chụp ảnh chân dung (selfie) phục vụ xác minh tài xế.
 * Dùng camera trước — ảnh selfie thường bị mirrored, nên flip ngang để khớp chuẩn avatar (ImagePicker).
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
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { uploadService } from '../services/upload.service';
import { useAuth } from '../context/AuthContext';

type FaceCaptureRouteParams = {
  onSuccess?: (url: string) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OVAL_SIZE = SCREEN_WIDTH * 0.75;

const SESSION_EXPIRED_MSG = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';

export function FaceCaptureScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const route = useRoute<RouteProp<{ params: FaceCaptureRouteParams }, 'params'>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const onSuccess = route.params?.onSuccess;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission?.granted]);

  const handleCapture = async () => {
    if (!cameraRef.current || !permission?.granted) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        skipProcessing: false,
        imageType: 'jpg',
      });
      if (photo?.uri) {
        // Camera trước (selfie) chụp ảnh mirrored — flip ngang để khớp chuẩn avatar, nhận diện đúng.
        const manipulated = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ flip: ImageManipulator.FlipType.Horizontal }, { resize: { width: 800 } }],
          { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
        );
        setCapturedUri(manipulated.uri);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    }
  };

  const handleRetake = () => setCapturedUri(null);

  const handleConfirm = async () => {
    if (!capturedUri) return;
    setUploading(true);
    try {
      const { url } = await uploadService.uploadFace(capturedUri);
      if (onSuccess) onSuccess(url);
      else navigation.navigate('UpdateDocuments' as never, { faceImageUrl: url } as never);
      navigation.goBack();
    } catch (e: any) {
      if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
        await logout();
        Alert.alert('Hết phiên', SESSION_EXPIRED_MSG);
      } else {
        const msg = e?.message ?? 'Không thể tải ảnh lên. Vui lòng thử lại.';
        const is404 = typeof msg === 'string' && (msg.includes('cannot POST') || msg.includes('404'));
        Alert.alert(
          'Lỗi upload',
          is404
            ? 'Chức năng chưa sẵn sàng. Vui lòng deploy main-api mới nhất lên VPS (có route /drivers/upload/face).'
            : `${msg}\n\nThử lại sau hoặc kiểm tra kết nối mạng.`,
        );
      }
    } finally {
      setUploading(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.gold} />
          <Text style={styles.message}>Đang kiểm tra quyền camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Huỷ</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chụp ảnh khuôn mặt</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.center}>
          <Text style={styles.message}>Cần quyền truy cập camera để chụp ảnh.</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Cho phép camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (capturedUri) {
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
          <Image source={{ uri: capturedUri }} style={styles.preview} resizeMode="cover" />
          <View style={styles.previewOverlay}>
            <Text style={styles.previewHint}>
              Ảnh có đủ sáng và rõ mặt không?{'\n'}Đảm bảo khuôn mặt có thể nhận diện được.
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
              <ActivityIndicator color={Colors.purpleDark} />
            ) : (
              <Text style={styles.confirmBtnText}>Dùng ảnh này</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Huỷ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chụp ảnh khuôn mặt</Text>
        <TouchableOpacity
          onPress={() => setTorchOn((t) => !t)}
          style={styles.torchBtn}
        >
          <Text style={styles.torchText}>{torchOn ? '💡 Bật' : '💡 Đèn'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraWrap}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
          enableTorch={torchOn && Platform.OS === 'android'}
        />
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.ovalBorder} />
        </View>
        <View style={styles.hintOverlay}>
          <Text style={styles.hintText}>
            Đặt khuôn mặt trong khung{'\n'}Chụp ở nơi đủ sáng
          </Text>
        </View>
      </View>

      <View style={styles.captureRow}>
        <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backText: { ...Typography.body, color: Colors.white, fontWeight: '600' },
  headerTitle: { ...Typography.h3, color: Colors.white },
  placeholder: { width: 60 },
  torchBtn: { padding: Spacing.s },
  torchText: { ...Typography.caption, color: Colors.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  message: { ...Typography.body, color: Colors.white, textAlign: 'center', marginBottom: Spacing.l },
  permBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.medium,
  },
  permBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  cameraWrap: { flex: 1, position: 'relative' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalBorder: {
    width: OVAL_SIZE,
    height: OVAL_SIZE * 1.3,
    borderRadius: OVAL_SIZE / 2,
    borderWidth: 3,
    borderColor: Colors.gold,
    borderStyle: 'solid',
  },
  hintOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: { ...Typography.secondary, color: Colors.white, textAlign: 'center', lineHeight: 22 },
  captureRow: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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
  previewWrap: { flex: 1, backgroundColor: Colors.black },
  preview: { flex: 1, width: '100%' },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  previewHint: {
    ...Typography.secondary,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: { padding: Spacing.l, backgroundColor: Colors.black },
  confirmBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  confirmBtnText: { ...Typography.body, fontWeight: '700', color: Colors.purpleDark },
  disabled: { opacity: 0.7 },
});
