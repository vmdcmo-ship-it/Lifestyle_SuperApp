export const Colors = {
  gold: '#FDB813',
  purpleDark: '#2E1A47',
  red: '#DC143C',
  white: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#DC143C',
  info: '#2196F3',
  black: '#1A1A1A',
  darkGray: '#4A4A4A',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  offWhite: '#F8F8F8',
  background: '#F5F5F5',
  overlay: 'rgba(0,0,0,0.5)',
  silver: '#C0C0C0',
};

export const Typography = {
  h1: { fontSize: 24, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  secondary: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  tiny: { fontSize: 10, fontWeight: '400' as const },
};

export const Spacing = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 };
export const BorderRadius = { small: 4, medium: 8, large: 12, xLarge: 16, circle: 999 };
export const Shadows = {
  level1: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 2 },
  level2: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
};
