// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')], // <--- **คืนค่าบรรทัดนี้**
  daisyui: { // <--- **คืนค่า block นี้ทั้งหมด**
    themes: [
      "light",
      "dark",
      // เพิ่มธีมอื่นๆ ที่คุณต้องการใช้จาก https://daisyui.com/docs/themes/
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}