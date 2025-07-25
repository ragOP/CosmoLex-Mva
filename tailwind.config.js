/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3F6FF',
          100: '#E3E9FF',
          200: '#C7D3FE',
          300: '#A3B6F7',
          400: '#7A97F2',
          500: '#4C6FEF',
          600: '#254EDB',
          700: '#1939B7',
          800: '#102693',
          900: '#0B1A6F',
        },
        teal: {
          50: '#E6FAF8',
          100: '#C2F0EA',
          200: '#8FE3DA',
          300: '#4FD1C5',
          400: '#2BC1B1',
          500: '#13A89E',
          600: '#0E8B82',
          700: '#0B6C67',
          800: '#08504D',
          900: '#063B38',
        },
        gray: {
          light: '#F8F9FB',
          lightHover: '#F1F3F7',
          lightActive: '#E9ECF2',
          neutral: '#D1D6E0',
          neutralHover: '#BFC5D2',
          neutralActive: '#AEB4C2',
          dark: '#6B7280',
          darkHover: '#4B5563',
          darkActive: '#374151',
          extra: '#111827',
        },
        success: {
          50: '#E6F9F0',
          100: '#C2F0D9',
          200: '#8FE3B8',
          300: '#4FD18C',
          400: '#2BC16F',
          500: '#13A85A',
          600: '#0E8B4A',
          700: '#0B6C3A',
          800: '#08502B',
          900: '#063B1F',
        },
        error: {
          50: '#FFE6E6',
          100: '#FFC2C2',
          200: '#FF8F8F',
          300: '#FF4F4F',
          400: '#FF2B2B',
          500: '#E01313',
          600: '#B70B0B',
          700: '#930808',
          800: '#6F0606',
          900: '#4B0404',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF2C2',
          200: '#FFE38F',
          300: '#FFD14F',
          400: '#FFC12B',
          500: '#E0A813',
          600: '#B78B0E',
          700: '#93700B',
          800: '#6F5608',
          900: '#4B3C06',
        },
      },
      backgroundImage: {
        'gradient-linear': 'linear-gradient(135deg, #6251FF 0%, #C6A5FB 100%)',
        'gradient-mesh-1':
          'radial-gradient(circle at 20% 20%, #F2D1FE 0%, #90A8FF 100%)',
        'gradient-mesh-2':
          'radial-gradient(circle at 80% 80%, #F2D1FE 0%, #90A8FF 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: [
          'Satoshi',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'title-xxl': ['3.75rem', { lineHeight: '4.25rem', fontWeight: '700' }],
        'title-xl': ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }],
        'title-l': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '700' }],
        'title-m': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'title-s': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'text-xxl': ['2rem', { lineHeight: '2.5rem', fontWeight: '400' }],
        'text-xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '400' }],
        'text-l': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'text-m': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'text-s': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'text-xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        bold: '700',
      },
    },
  },
  plugins: [],
};
