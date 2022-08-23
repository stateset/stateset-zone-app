module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stateset-yellow': '#f7ca00',
        'stateset-dark-yellow': '#e8c117',
        'stateset-copy': '#3498db'
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class'
};