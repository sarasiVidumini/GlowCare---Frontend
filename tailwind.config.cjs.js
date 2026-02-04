/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans all files in src
    ],
    theme: {
        extend: {
            colors: {
                'skin-primary': '#4a7c59',
                'skin-secondary': '#8fc0a9',
                'skin-accent': '#faf3dd',
                'skin-clinical': '#e63946',
            },
        },
    },
    plugins: [],
}