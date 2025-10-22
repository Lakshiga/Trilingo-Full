export const colors = {
  primary: '#4ECDC4',
  primaryDark: '#44A08D',
  secondary: '#FF6B6B',
  secondaryLight: '#FF8E8E',
  info: '#45B7D1',
  success: '#96CEB4',
  warning: '#FECA57',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
};

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  round: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 30,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const gradients = {
  brand: [colors.secondary, colors.secondaryLight, '#FFB6C1'],
  aqua: [colors.primary, colors.primaryDark, colors.success],
  sky: [colors.info, '#5BC0DE'],
};

export const typography = {
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  button: { fontSize: 16, fontWeight: '700' },
};


