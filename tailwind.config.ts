import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#13283C', paper: '#F3F6F5', leaf: '#1E7B5B', leafdark: '#145B43', ember: '#C2502F', gold: '#D9A21B', line: '#D5DEDB', mist: '#E7EEEC' },
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
} satisfies Config;