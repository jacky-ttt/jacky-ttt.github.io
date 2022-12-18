/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

const cardFlipPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".rotate3d-y-180": {
      transform: "rotateY(180deg)",
    },
    ".rotate3d-x-10": {
      transform: "rotateX(10deg)",
    },
    ".rotate3d-x-5": {
      transform: "rotateX(5deg)",
    },
    ".rotate3d-x-180": {
      transform: "rotateX(180deg)",
    },
    ".translate3d-z-20": {
      transform: "translateZ(20px)",
    },
    ".preserve-3d": {
      transformStyle: "preserve-3d",
    },
    ".perspective": {
      perspective: "1000px",
    },
    '.backface-visible': {
      'backface-visibility': 'visible',
      '-moz-backface-visibility': 'visible',
      '-webkit-backface-visibility': 'visible',
      '-ms-backface-visibility': 'visible'
    },
    '.backface-hidden': {
      'backface-visibility': 'hidden',
      '-moz-backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden',
      '-ms-backface-visibility': 'hidden'
    }
  })
});

const textShadowPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".text-shadow-white": {
      'text-shadow': "2px 2px #ef4444"
    },
    ".text-shadow-blue": {
      'text-shadow': "3px 3px #06b6d4"
    }
  })
});

module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    cardFlipPlugin,
    textShadowPlugin,
    require("tailwindcss-animate"),
  ],
}
