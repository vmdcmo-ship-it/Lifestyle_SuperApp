import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Typography } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'destructive':
        return styles.destructive;
      case 'ghost':
        return styles.ghost;
      default:
        return styles.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.white;
      case 'outline':
        return Colors.purpleDark;
      case 'ghost':
        return Colors.purpleDark;
      default:
        return Colors.white;
    }
  };

  const sizeStyle = {
    small: { height: 36, paddingHorizontal: 16 },
    medium: { height: 48, paddingHorizontal: 24 },
    large: { height: 56, paddingHorizontal: 32 },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        getVariantStyle(),
        sizeStyle[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.medium,
    gap: 8,
  },
  primary: { backgroundColor: Colors.purpleDark },
  secondary: { backgroundColor: Colors.kodoGreen },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.purpleDark,
  },
  destructive: { backgroundColor: Colors.red },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  text: { ...Typography.body, fontWeight: '600' },
});
