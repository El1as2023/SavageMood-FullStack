import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import { authService } from "@/services/authService";

export function useProfile() {
    const router = useRouter();
    const pathname = usePathname(); // 1. Додаємо відстеження маршруту
    const logoutAction = useAuthStore((state) => state.logout);

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            // Якщо токена немає (гостьовий режим або щойно вийшли)
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            // Якщо токен є, але дані юзера ще не завантажені
            if (!user) {
                setIsLoading(true);
                try {
                    const data = await authService.getMe();
                    if (data.user) {
                        setUser(data.user);
                    } else {
                        // @ts-ignore
                        setUser(data);
                    }
                } catch (error) {
                    console.error("Не вдалось завантажити профіль", error);
                    logoutAction();
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();

    }, [pathname, logoutAction]);

    const handleLogout = () => {
        logoutAction();
        setUser(null); // Одразу чистимо стейт візуально
        router.push("/login");
    };

    return { user, isLoading, handleLogout };
}