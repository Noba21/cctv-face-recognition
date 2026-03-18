/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0052e6',
          600: '#0040b3',
          700: '#002d80',
          800: '#001b4d',
          900: '#000a1a',
        },
        secondary: {
          50: '#f0f0f0',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a6a6a6',
          400: '#8c8c8c',
          500: '#737373',
          600: '#595959',
          700: '#404040',
          800: '#262626',
          900: '#0d0d0d',
        },
        accent: {
          red: '#dc2626',
          green: '#16a34a',
          yellow: '#ca8a04',
          blue: '#2563eb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff00' },
          '50%': { boxShadow: '0 0 20px #00ff00' },
        }
      },
      backgroundImage: {
        'cctv-pattern': "url('/src/assets/images/cctv-pattern.png')",
        'grid-pattern': "url('/src/assets/images/grid-pattern.png')",
      }
    },
  },
  plugins: [],
}