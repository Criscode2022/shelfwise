/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui'], display: ['"Fraunces"', 'Georgia', 'serif'] },
      colors: { ink: '#122117', leaf: { 50: '#f3f7f1', 400: '#6f9a58', 500: '#4f7a3c', 700: '#2f4d24' }, clay: '#c45c26', cream: '#f6f1e7' }
    }
  },
  plugins: []
};
