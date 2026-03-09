'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Підключаємо твій існуючий хук профілю
import { useProfile } from '@/hooks/useProfile';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useProfile();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Чекаємо, поки завантажиться профіль
        if (!isLoading) {
            if (!user) {
                // 1. Якщо гравець взагалі не авторизований -> на сторінку логіну
                router.push('/login');
            } else if (user.role !== 'admin') {
                // 2. Якщо авторизований, але НЕ адмін -> кидаємо на головну сторінку
                // (або можеш зробити router.push('/403') якщо є сторінка "Доступ заборонено")
                router.push('/');
            } else {
                // 3. Якщо це адмін -> даємо зелене світло
                setIsAuthorized(true);
            }
        }
    }, [user, isLoading, router]);

    // Поки йде перевірка, показуємо спінер на весь екран,
    // щоб звичайний юзер навіть на мілісекунду не побачив адмінку
    if (isLoading || !isAuthorized) {
        return (
            <div className="min-h-screen bg-[#0f1418] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#7777f6]" size={48} />
            </div>
        );
    }

    // Якщо все ок, рендеримо саму сторінку адмінки
    return <>{children}</>;
}