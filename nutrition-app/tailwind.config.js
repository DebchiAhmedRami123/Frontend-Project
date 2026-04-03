/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "surface-tint": "#43636d",
                "surface-bright": "#f8fafb",
                "on-surface-variant": "#41484a",
                "primary-fixed": "#c6e8f4",
                "secondary-fixed": "#7ffabe",
                "on-secondary-container": "#00734c",
                "primary-container": "#052b34",
                "secondary": "#006c48",
                "secondary-fixed-dim": "#61dda3",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f2f4f5",
                "surface-container": "#eceeef",
                "surface-container-high": "#e6e8e9",
                "on-surface": "#191c1d",
                "surface": "#f8fafb",
                "outline-variant": "#c1c7ca",
            },
            fontFamily: {
                "headline": ["Manrope", "sans-serif"],
                "body": ["Plus Jakarta Sans", "sans-serif"],
                "label": ["Inter", "sans-serif"]
            }
        },
    },
    plugins: [],
}