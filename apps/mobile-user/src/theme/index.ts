// =============================================================================
// KODO - Design System / Theme
// "The Heartbeat of Your Lifestyle"
// Colors from KODO branding: yellow, dark purple, green (clover)
// =============================================================================

export const Colors = {
  // Primary - KODO Brand
  gold: '#FFD700',           // KODO yellow accent
  kodoYellow: '#FFE135',     // Logo background yellow
  purpleDark: '#2E1A47',     // KODO dark purple (logo, text)
  kodoGreen: '#228B22',      // Clover green
  kodoGreenLight: '#3CB371', // Lighter green accent
  red: '#DC143C',
  silver: '#C0C0C0',
  white: '#FFFFFF',

  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#DC143C',
  info: '#2196F3',

  // Grayscale
  black: '#1A1A1A',
  darkGray: '#4A4A4A',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  offWhite: '#F8F8F8',
  background: '#F5F5F5',

  // Insurance-specific
  insurancePink: '#FFB6C1',
  insuranceBlue: '#2E5090',
  insuranceGold: '#D4AF37',

  // Transparent
  overlay: 'rgba(0,0,0,0.5)',
  cardShadow: 'rgba(0,0,0,0.08)',
};

export const Typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 29 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 24 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  secondary: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 17 },
  tiny: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xLarge: 16,
  circle: 999,
};

export const Shadows = {
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
};
