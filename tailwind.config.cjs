/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    backdropFilter: {
      'none': 'none',
      'blur': 'blur(20px)',
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwindcss-filters'),
  ],
  daisyui: {
    themes: ['synthwave']
  }
};
