import type {Metadata, Viewport} from "next";
import { Inter, Orbitron, Doto } from "next/font/google"; // Імпортуємо потрібні шрифти
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


// Основний шрифт (Inter - стандартний, читабельний)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Шрифт для заголовків/лого (геймерський)
const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron", // Це ім'я має співпадати з CSS
    display: "swap",
});

// Шрифт для "цифрових" ефектів (якщо треба)
const doto = Doto({
    subsets: ["latin"],
    variable: "--font-doto", // Це ім'я має співпадати з CSS
    display: "swap",
});

export const metadata: Metadata = {
    title: "SavageMood",
    description: "Платформа для турнірів MLBB",
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // За бажанням, забороняє зум пальцями
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
        <body
            // Додаємо всі змінні шрифтів сюди
            className={`${inter.className} ${orbitron.variable} ${doto.variable} antialiased bg-background text-foreground`}
        >
        <Navbar />
        {children}
        <Footer />
        </body>
        </html>
    );
}