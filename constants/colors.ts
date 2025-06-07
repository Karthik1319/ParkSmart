export type ThemeColors = {
  primary: {
    default: string;
    light: string;
    dark: string;
  };
  secondary: {
    default: string;
    light: string;
    dark: string;
  };
  accent: {
    default: string;
    light: string;
    dark: string;
  };
  success: {
    default: string;
    light: string;
    dark: string;
  };
  warning: {
    default: string;
    light: string;
    dark: string;
  };
  error: {
    default: string;
    light: string;
    dark: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: string;
  shadow: string;
};

export const lightColors: ThemeColors = {
  primary: {
    default: '#0066CC',
    light: '#4D94DB',
    dark: '#004C99',
  },
  secondary: {
    default: '#00A3A3',
    light: '#4DC4C4',
    dark: '#007A7A',
  },
  accent: {
    default: '#FF8800',
    light: '#FFAA4D',
    dark: '#CC6A00',
  },
  success: {
    default: '#34C759',
    light: '#6CD97F',
    dark: '#248A3D',
  },
  warning: {
    default: '#FFCC00',
    light: '#FFDB4D',
    dark: '#C29E00',
  },
  error: {
    default: '#FF3B30',
    light: '#FF756D',
    dark: '#C42B22',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F3F4F6',
    tertiary: '#E5E7EB',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors: ThemeColors = {
  primary: {
    default: '#0A84FF',
    light: '#4DA6FF',
    dark: '#0063CC',
  },
  secondary: {
    default: '#10D0D0',
    light: '#4FDBDB',
    dark: '#00A6A6',
  },
  accent: {
    default: '#FF9F0A',
    light: '#FFB952',
    dark: '#CC7F08',
  },
  success: {
    default: '#30D158',
    light: '#6DDE89',
    dark: '#20A341',
  },
  warning: {
    default: '#FFD60A',
    light: '#FFE152',
    dark: '#CCAB08',
  },
  error: {
    default: '#FF453A',
    light: '#FF7D75',
    dark: '#CC372E',
  },
  neutral: {
    50: '#18191A',
    100: '#242526',
    200: '#3A3B3C',
    300: '#4E4F50',
    400: '#6A6C6D',
    500: '#858687',
    600: '#A7A9AA',
    700: '#CBCDCE',
    800: '#E4E6E8',
    900: '#F5F7F9',
  },
  background: {
    primary: '#1F2937',
    secondary: '#111827',
    tertiary: '#0F172A',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
    inverse: '#111827',
  },
  border: '#374151',
  shadow: 'rgba(0, 0, 0, 0.5)',
};