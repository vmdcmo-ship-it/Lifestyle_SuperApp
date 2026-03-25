import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e3a8a',
          emerald: '#10b981',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #10b981 100%)',
      },
      boxShadow: {
        glow: '0 0 24px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
