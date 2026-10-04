/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: 'rgb(var(--brand-50, 240 249 255) / <alpha-value>)',
          100: 'rgb(var(--brand-100, 224 242 254) / <alpha-value>)',
          200: 'rgb(var(--brand-200, 186 230 253) / <alpha-value>)',
          300: 'rgb(var(--brand-300, 125 211 252) / <alpha-value>)',
          400: 'rgb(var(--brand-400, 56 189 248) / <alpha-value>)',
          500: 'rgb(var(--brand-500, 14 165 233) / <alpha-value>)',
          600: 'rgb(var(--brand-600, 2 132 199) / <alpha-value>)',
          700: 'rgb(var(--brand-700, 3 105 161) / <alpha-value>)',
          800: 'rgb(var(--brand-800, 7 89 133) / <alpha-value>)',
          900: 'rgb(var(--brand-900, 12 74 110) / <alpha-value>)',
          950: 'rgb(var(--brand-950, 8 47 73) / <alpha-value>)',
        },
      },
      boxShadow: {
        'antigravity': '0 20px 40px -15px var(--brand-shadow, rgba(14, 165, 233, 0.15))',
        'antigravity-hover': '0 30px 60px -12px var(--brand-shadow-hover, rgba(14, 165, 233, 0.3))',
        'glow-sky': '0 0 25px var(--brand-glow, rgba(56, 189, 248, 0.35))',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-medium': 'floatMedium 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.8))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
