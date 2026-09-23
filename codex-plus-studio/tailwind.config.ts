import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.32)',
        glass: '0 8px 32px rgba(255, 255, 255, 0.08)'
      },
      colors: {
        obsidian: '#050816',
        iris: '#7c3aed',
        neon: '#5eead4',
        glow: '#f5d0fe'
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top, rgba(124,58,237,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(94,234,212,0.2), transparent 35%)'
      }
    }
  },
  plugins: []
};

export default config;
