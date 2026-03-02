/**
 * ComingSoonModal — Modal thân thiện cho tính năng đang phát triển.
 * Thay thế Alert để cải thiện UX khi người dùng chạm vào mục "sắp ra mắt".
 */
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  featureName?: string;
};

export function ComingSoonModal({ visible, onClose, featureName }: Props) {
  const displayName = featureName ? `"${featureName}"` : 'tính năng này';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🔜</Text>
          </View>
          <Text style={styles.title}>Sắp ra mắt</Text>
          <Text style={styles.message}>
            Tính năng {displayName} đang được phát triển. Chúng tôi sẽ thông báo khi ra mắt!
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Đã hiểu</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: Math.min(width - Spacing.xl * 2, 340),
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.level2,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gold + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
  },
  icon: { fontSize: 32 },
  title: {
    ...Typography.h3,
    color: Colors.purpleDark,
    marginBottom: Spacing.s,
  },
  message: {
    ...Typography.body,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  btn: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl * 2,
    borderRadius: BorderRadius.medium,
    minWidth: 140,
    alignItems: 'center',
  },
  btnText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.purpleDark,
  },
});
