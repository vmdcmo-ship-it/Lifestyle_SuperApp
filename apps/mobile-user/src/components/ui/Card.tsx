import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'premium' | 'flat';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  style,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'premium':
        return styles.premium;
      case 'flat':
        return styles.flat;
      default:
        return styles.standard;
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: Spacing.l,
    borderRadius: BorderRadius.large,
  },
  standard: {
    backgroundColor: Colors.white,
    ...Shadows.level2,
  },
  premium: {
    backgroundColor: Colors.purpleDark,
    ...Shadows.level3,
  },
  flat: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
});
