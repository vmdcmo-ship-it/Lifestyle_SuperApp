import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Typography } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const variantColors = {
  success: { bg: '#E8F5E9', text: Colors.success },
  warning: { bg: '#FFF3E0', text: Colors.warning },
  error: { bg: '#FFEBEE', text: Colors.error },
  info: { bg: '#E3F2FD', text: Colors.info },
  neutral: { bg: Colors.offWhite, text: Colors.gray },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral' }) => {
  const colors = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  text: { ...Typography.caption, fontWeight: '600' },
});
