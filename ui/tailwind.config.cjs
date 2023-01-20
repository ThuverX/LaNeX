/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'display': ['Inter', 'sans-serif'],
                'document': ['Computer Modern Serif', 'serif'],
                'code': ['Fira Code', 'monospace'],
            },
            colors: {
                'accent': {
                    'primary': '#e91e63',
                    'secondary': '#276880',
                },
                'dark': {
                    100: "#d0d0d0",
                    200: "#a0a0a0",
                    300: "#717171",
                    400: "#414141",
                    450: "#191919",
                    500: "#121212",
                    600: "#0e0e0e",
                    700: "#0b0b0b",
                    800: "#070707",
                    900: "#040404"
                }
            }
        },
    },
    plugins: [],
}