import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

interface QRPaymentModalProps {
  visible: boolean;
  amount: number;
  orderCode: string;
  qrCodeUrl?: string; // URL to QR code image
  onClose: () => void;
  onSuccess?: () => void;
  onManualConfirm?: () => void;
}

export const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  visible,
  amount,
  orderCode,
  qrCodeUrl,
  onClose,
  onSuccess,
  onManualConfirm,
}) => {
  const [status, setStatus] = useState<'showing' | 'waiting' | 'success' | 'error'>('showing');
  const [countdown, setCountdown] = useState(300); // 5 minutes

  useEffect(() => {
    if (visible && status === 'waiting') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatus('error');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate checking payment status every 3 seconds
      const checker = setInterval(() => {
        checkPaymentStatus();
      }, 3000);

      return () => {
        clearInterval(timer);
        clearInterval(checker);
      };
    }
  }, [visible, status]);

  const checkPaymentStatus = async () => {
    // TODO: Call API to check payment status
    // If paid, call onSuccess and setStatus('success')
    // For demo: randomly succeed after 10s
    if (Math.random() > 0.95) {
      setStatus('success');
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }
  };

  const handleClose = () => {
    setStatus('showing');
    setCountdown(300);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openBankingApp = (bankId: string) => {
    // TODO: Deep link to banking apps
    const deepLinks: Record<string, string> = {
      vcb: 'vcbdigibank://',
      techcombank: 'techcombank://',
      vietinbank: 'vietinbankipay://',
      // Add more banks...
    };
    const url = deepLinks[bankId];
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Text style={styles.backIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {status === 'showing'
              ? 'Quét mã để thanh toán'
              : status === 'waiting'
              ? 'Đang chờ xác nhận'
              : status === 'success'
              ? 'Thành công'
              : 'Hết thời gian'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {status === 'showing' && (
            <>
              {/* QR Code */}
              <View style={styles.qrContainer}>
                {qrCodeUrl ? (
                  <View style={styles.qrPlaceholder}>
                    {/* TODO: Use Image component to show QR */}
                    <Text style={styles.qrText}>QR CODE</Text>
                  </View>
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <Text style={styles.qrText}>Đang tạo mã QR...</Text>
                    <ActivityIndicator color={Colors.primary} size="large" />
                  </View>
                )}
              </View>

              {/* Payment Info */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>💰 Số tiền:</Text>
                  <Text style={styles.infoValue}>{amount.toLocaleString()}đ</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📝 Nội dung:</Text>
                  <Text style={[styles.infoValue, styles.orderCode]}>{orderCode}</Text>
                </View>
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>📱 Hướng dẫn thanh toán:</Text>
                <Text style={styles.instructionStep}>1. Mở app Ngân hàng của bạn</Text>
                <Text style={styles.instructionStep}>2. Chọn Quét QR Code</Text>
                <Text style={styles.instructionStep}>
                  3. Quét mã QR phía trên
                </Text>
                <Text style={styles.instructionStep}>4. Xác nhận thanh toán</Text>
              </View>

              {/* Quick Bank Links */}
              <View style={styles.bankLinks}>
                <Text style={styles.bankTitle}>Mở nhanh app ngân hàng:</Text>
                <View style={styles.bankRow}>
                  {['Vietcombank', 'Techcombank', 'VietinBank', 'BIDV'].map((bank) => (
                    <TouchableOpacity
                      key={bank}
                      style={styles.bankButton}
                      onPress={() => openBankingApp(bank.toLowerCase())}
                    >
                      <Text style={styles.bankButtonText}>{bank}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Timer */}
              <View style={styles.timer}>
                <Text style={styles.timerText}>
                  ⏱️ Tự động xác nhận trong: {formatTime(countdown)}
                </Text>
              </View>

              {/* Actions */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setStatus('waiting')}
              >
                <Text style={styles.primaryButtonText}>Đã chuyển khoản</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Hướng dẫn chi tiết</Text>
              </TouchableOpacity>
            </>
          )}

          {status === 'waiting' && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.statusTitle}>Đang chờ xác nhận...</Text>
              <Text style={styles.statusDesc}>
                Hệ thống đang kiểm tra giao dịch{'\n'}
                Vui lòng đợi trong giây lát
              </Text>

              <View style={styles.statusInfo}>
                <Text style={styles.statusInfoText}>
                  ℹ️ Nếu đã chuyển khoản nhưng chưa nhận được xác nhận,{'\n'}
                  vui lòng liên hệ hotline: <Text style={styles.hotline}>1900-xxxx</Text>
                </Text>
              </View>

              <TouchableOpacity style={styles.secondaryButton} onPress={onManualConfirm}>
                <Text style={styles.secondaryButtonText}>Xác nhận thủ công</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.statusContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.statusTitle}>Thanh toán thành công!</Text>
              <Text style={styles.statusDesc}>
                Đơn hàng đã được xác nhận{'\n'}
                Mã đơn: #{orderCode}
              </Text>

              <View style={styles.xuBonus}>
                <Text style={styles.xuBonusText}>🎁 Bạn nhận được +50 Xu thưởng</Text>
              </View>

              <View style={styles.successActions}>
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginRight: Spacing.s }]}
                  onPress={handleClose}
                >
                  <Text style={styles.primaryButtonText}>Xem đơn hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1, marginLeft: Spacing.s }]}
                  onPress={handleClose}
                >
                  <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.statusContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.statusTitle}>Hết thời gian</Text>
              <Text style={styles.statusDesc}>
                Mã QR đã hết hạn{'\n'}
                Vui lòng thử lại hoặc chọn phương thức khác
              </Text>

              <TouchableOpacity style={styles.primaryButton} onPress={handleClose}>
                <Text style={styles.primaryButtonText}>Thử lại</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} onPress={handleClose}>
                <Text style={styles.linkButtonText}>Chọn phương thức khác</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: { padding: 4 },
  backIcon: { fontSize: 24, color: Colors.black },
  headerTitle: { ...Typography.h3, color: Colors.black },

  // Content
  content: { flex: 1, padding: Spacing.l },

  // QR Code
  qrContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  qrPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
    ...Shadows.level2,
  },
  qrText: { ...Typography.body, color: Colors.gray, marginBottom: Spacing.m },

  // Info Card
  infoCard: {
    backgroundColor: Colors.offWhite,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.l,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  infoLabel: { ...Typography.secondary, color: Colors.gray },
  infoValue: { ...Typography.secondary, fontWeight: '700', color: Colors.black },
  orderCode: { fontFamily: 'monospace', fontSize: 14 },

  // Instructions
  instructions: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.l,
  },
  instructionTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.m,
  },
  instructionStep: {
    ...Typography.secondary,
    color: Colors.darkGray,
    marginBottom: Spacing.s,
    paddingLeft: Spacing.m,
  },

  // Bank Links
  bankLinks: { marginBottom: Spacing.l },
  bankTitle: { ...Typography.caption, color: Colors.gray, marginBottom: Spacing.s },
  bankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  bankButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  bankButtonText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  // Timer
  timer: {
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  timerText: { ...Typography.secondary, color: Colors.error, fontWeight: '600' },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginBottom: Spacing.m,
    ...Shadows.level1,
  },
  primaryButtonText: { ...Typography.body, color: Colors.white, fontWeight: '700' },

  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: { ...Typography.body, color: Colors.primary, fontWeight: '700' },

  linkButton: {
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  linkButtonText: { ...Typography.secondary, color: Colors.primary, fontWeight: '600' },

  // Status Container
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  successIcon: { fontSize: 80, marginBottom: Spacing.l },
  errorIcon: { fontSize: 80, marginBottom: Spacing.l },
  statusTitle: { ...Typography.h2, color: Colors.black, marginBottom: Spacing.m },
  statusDesc: {
    ...Typography.secondary,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },

  statusInfo: {
    backgroundColor: Colors.offWhite,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xl,
  },
  statusInfoText: {
    ...Typography.caption,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  hotline: { color: Colors.primary, fontWeight: '700' },

  xuBonus: {
    backgroundColor: Colors.gold + '15',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.xl,
  },
  xuBonusText: {
    ...Typography.body,
    color: Colors.gold,
    fontWeight: '700',
    textAlign: 'center',
  },

  successActions: {
    flexDirection: 'row',
    width: '100%',
  },
});
