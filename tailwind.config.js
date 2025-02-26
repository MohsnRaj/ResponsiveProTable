/** @type {import('tailwindcss').Config} */

const labelsClasses = [
  "indigo",
  "yellow",
  "gray",
  "green",
  "blue",
  "red",
  "purple",
  "orange",
  "pink",
  "slate"
];
const number = [1, 2, 3, 4, 5, 6, 7];
export const mode = "jit";
export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx}',
  './src/components/**/*.{js,ts,jsx,tsx}',
  "./src/**/*.{js,jsx,ts,tsx}",
  "./src/**/*.{html,js}",
  "./public/index.html",
];
export const safelist = [
  ...labelsClasses.map((lbl) => `bg-${lbl}-500`),
  ...labelsClasses.map((lbl) => `bg-${lbl}-300`),
  ...labelsClasses.map((lbl) => `border-${lbl}-500`),
  ...labelsClasses.map((lbl) => `border-${lbl}-300`),
  ...labelsClasses.map((lbl) => `text-${lbl}-500`),
  ...labelsClasses.map((lbl) => `text-${lbl}-400`),
  ...labelsClasses.map((lbl) => `text-${lbl}-300`),
  ...labelsClasses.map((lbl) => `bg-${lbl}-600`),
  ...labelsClasses.map((lbl) => `bg-${lbl}-700`),
  ...labelsClasses.map((lbl) => `hover:bg-${lbl}-800`),
  ...labelsClasses.map((lbl) => `dark:bg-${lbl}-600`),
  ...labelsClasses.map((lbl) => `dark:hover:bg-${lbl}-700`),
  ...labelsClasses.map((lbl) => `dark:focus:ring-${lbl}-800`),
  ...labelsClasses.map((lbl) => `bg-${lbl}-200`),
  ...labelsClasses.map((lbl) => `text-${lbl}-400`),
  ...number.map((num) => `md:grid-cols-${num}`),
  "slate-100",
  "slate-200",
  "slate-300",
  "bg-orange-200",
  "bg-orange-700",
  "hover:bg-orange-800",
  "dark:bg-orange-600",
  "dark:hover:bg-orange-700",
  "dark:focus:ring-orange-800",
];
export const darkMode = "class";
export const theme = {
  fontFamily: {
    display: ["Open Sans", "sans-serif"],
    body: ["Open Sans", "sans-serif"],
  },
  screens: {
    "xs": '480px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  extend: {
    fontSize: {
      14: "14px",
    },
    backgroundColor: {
      "main-bg": "#f8f9fa",
      "pink-SPC": "#FF94C0",
      "main-dark-bg": "#20232A",
      "secondary-dark-bg": "#33373E",
      "light-gray": "#F7F7F7",
      "half-transparent": "rgba(0, 0, 0, 0.5)",
      "white-primary": "rgba(255, 255, 255, 0.3)",
    },
    colors: {
      "pink-SPC": "#FF94C0",
      "blue-SPC": "#8CE9F0",
    },
    borderWidth: {
      1: "1px",
    },
    borderColor: {
      color: "rgba(0, 0, 0, 0.1)",
    },
    width: {
      110: "30rem",
      400: "400px",
      760: "760px",
      780: "780px",
      800: "800px",
      1000: "1000px",
      1200: "1200px",
      1400: "1400px",
      45100: "45%",
    },
    height: {
      80: "80px",
      68: "17rem",
      84: "20rem",
      92: "22rem",
    },
    minHeight: {
      590: "590px",
    },
    inset: {
      110: "30rem",
    },
    boxShadow: {
      specific: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
    },
  },
};
export const plugins = [
  function ({ addVariant }) {
    addVariant("child", "& > *");
    addVariant("child-hover", "& > *:hover");
  }
];

