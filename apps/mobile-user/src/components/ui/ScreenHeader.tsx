import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconBtn}>
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  left: { width: 44 },
  center: { flex: 1, alignItems: 'center' },
  right: { width: 44, alignItems: 'flex-end' },
  title: { ...Typography.h3, color: Colors.black },
  subtitle: { ...Typography.caption, color: Colors.gray },
  iconBtn: { padding: 4 },
});
