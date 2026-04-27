import { Fonts } from '@/constants/theme';
import { Platform } from 'react-native';

export const ResidentTheme = {
  colors: {
    pageBg: '#F5F7FB',
    cardBg: '#FFFFFF',
    brand: '#1D4ED8',
    brandSoft: '#EAF1FF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#D7DFEA',
    inputBg: '#F8FAFD',
    danger: '#DC2626',
    success: '#059669',
  },
  fonts: {
    family: Platform.select({
      ios: 'SF Pro Text',
      android: 'sans-serif',
      default: Fonts?.sans ?? 'normal',
    }),
    tiny: 11,
    small: 12,
    base: 14,
    medium: 15,
    heading: 20,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 12,
  },
};
