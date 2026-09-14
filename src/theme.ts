import { Platform } from 'react-native';

const rounded = Platform.select({
  ios: 'ui-rounded',
  android: 'sans-serif',
  default: 'System',
});
const roundedMedium = Platform.select({
  ios: 'ui-rounded',
  android: 'sans-serif-medium',
  default: 'System',
});

export const colors = {
  bg: '#FFF6EC',
  bgDeep: '#FBEDDD',
  card: '#FFFFFF',
  cardSoft: '#FFF2E3',
  border: '#F2DFCB',
  text: '#4A362E',
  textSoft: '#9B8577',
  textFaint: '#C3AD9C',
  accent: '#F08A5D',
  accentDeep: '#DE6F3F',
  accentSoft: '#FCE1D1',
  amber: '#F6A95F',
  amberDeep: '#E8903F',
  amberSoft: '#FBDCB4',
  cream: '#FFF4E4',
  mint: '#6FC3A4',
  mintSoft: '#D8F0E5',
  pink: '#F2A196',
  track: '#F3E2D0',
};

export const fonts = {
  regular: rounded,
  medium: roundedMedium,
  bold: rounded,
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 26,
  xl: 34,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#D9B698',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
  },
  soft: {
    shadowColor: '#D9B698',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },
  accent: {
    shadowColor: '#DE6F3F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
