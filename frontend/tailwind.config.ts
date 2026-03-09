import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        // Якщо у вас структура проекту через папку src (що видно з ваших скріншотів),
        // то цього одного рядка достатньо для ВСІХ файлів всередині src (app, components, lib тощо).
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Тут можна додати ваші шрифти, якщо вони не підтягуються
            fontFamily: {
                orbitron: ['var(--font-orbitron)'],
                // sans: ['var(--font-inter)'],
            },
        },
    },
    plugins: [],
};

export default config;