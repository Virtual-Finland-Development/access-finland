const plugin = require('tailwindcss/plugin');

const capitalizeFirst = plugin(({ addUtilities }) => {
  const newUtilities = {
    '.capitalize-first:first-letter': {
      textTransform: 'uppercase',
    },
  };
  addUtilities(newUtilities);
});

module.exports = {
  content: [
    // app content
    'src/**/*.{js,ts,jsx,tsx}',
    // vf-shared content
    '../../packages/vf-shared/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
        '2xl': '1140px',
      },
    },
    extend: {
      colors: {
        'suomifi-light': '#2A6EBB',
        'suomifi-light-hover': 'hsl(212,63%,49%)',
        'suomifi-dark': '#00347A',
        'suomifi-blue-bg-light': '#EAF2FA',
        'suomifi-blue-bg-dark': '#003479',
        'suomifi-orange': '#e36209',
      },
      borderColor: {
        'suomifi-light': '#2A6EBB',
        'suomifi-dark': '#00347A',
      },
      width: {
        'suomifi-input-default': '290px',
      },
    },
  },
  plugins: [capitalizeFirst],
};
