'use client'

import { useState } from 'react';
import { usePathname } from "next/navigation";
import { Menu, X, Loader2 } from 'lucide-react'; // Додав Loader2 для спінера

import Logo from "@/components/ui/Logo";
import NavLinks from "@/components/ui/NavLinks";
import Button from "@/components/ui/Button";


import { useProfile } from "@/hooks/useProfile";

const Navbar = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const { user, isLoading, handleLogout } = useProfile();


    const isLoggedIn = !!user;

    const disableNavbarRoutes = ["/login", "/register", "/verify"];

    if (disableNavbarRoutes.includes(pathname)) {
        return null;
    }

    return (
        <header className="container w-full mx-auto px-6 py-4 flex items-center justify-between relative z-50">

            {/* 1. Логотип */}
            <Logo />

            {/* 2. Десктопне меню */}
            <div className="hidden md:flex items-center gap-8">
                <NavLinks />
            </div>

            {/* 3. Десктопна кнопка */}
            <div className="hidden md:flex items-center justify-end min-w-[140px]">
                {isLoading ? (
                    // Поки чекаємо відповідь від сервера, крутимо спінер
                    <Loader2 size={20} className="animate-spin text-[#7777f6]" />
                ) : isLoggedIn ? (
                    // Якщо залогінений -> кнопка Logout
                    <Button
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                    >
                        Logout
                    </Button>
                ) : (
                    // Якщо гість -> кнопка реєстрації
                    <Button href="/register">
                        Get Started
                    </Button>
                )}
            </div>

            {/* 4. Кнопка Гамбургера */}
            <button
                className="md:hidden text-white hover:text-[#7777f6] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* 5. Мобільне меню */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[#0f1418] border-b border-white/10 flex flex-col items-center py-6 gap-6 md:hidden shadow-2xl animate-in slide-in-from-top-2">
                    <NavLinks />

                    <div className="w-full px-6 flex justify-center mt-4">
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin text-[#7777f6]" />
                        ) : isLoggedIn ? (
                            <Button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false); // закриваємо меню після кліку
                                }}
                                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button href="/register" className="w-full">
                                Get Started
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar;