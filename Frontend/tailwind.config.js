import { Children } from 'react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{ 
        'background': 'linear-gradient(135deg, #5D9CEC 0%, #E7F3FF 100%)'
      }, 
      colors :{
        'primary': '#5D9CEC',
        'secondary':'#E7F3FF',
        'accent': '#4A89DC',
        'text':'#2C3E50',
      }
    },
  },
  plugins: [],
}