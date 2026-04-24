/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette tuned to the hero image: vivid purple, coral, and deep navy
        brand: {
          50: '#f5f0ff',
          100: '#efe6ff',
          200: '#d8c7ff',
          300: '#c09bff',
          400: '#a567ff',
          500: '#6d00ff',
          600: '#5b00e6',
          700: '#4700b4',
          800: '#32107a',
          900: '#1e0b40'
        },
        coral: {
          50: '#fff5f3',
          100: '#ffeae6',
          200: '#ffd1c9',
          300: '#ffb3a6',
          400: '#ff8a73',
          500: '#ff6b5b',
          600: '#ff4f45',
          700: '#e04339',
          800: '#b2362b',
          900: '#7f231c'
        },
        navy: {
          50: '#f3f6f8',
          100: '#e6eef4',
          200: '#cfe1ea',
          300: '#b6d2df',
          400: '#8eb5c8',
          500: '#304452',
          600: '#273a44',
          700: '#1f3036',
          800: '#172427',
          900: '#0f181b'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
