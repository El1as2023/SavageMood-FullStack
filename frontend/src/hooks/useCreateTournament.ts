// src/hooks/useCreateTournament.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminTournamentService } from '@/services/adminTournamentService';
import { uploadService } from '@/services/uploadService'; // твій сервіс
import { ICreateTournamentRequest } from '@/types';

export const useCreateTournament = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const createTournament = async (data: Omit<ICreateTournamentRequest, 'bannerUrl'>, file: File | null) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!file) {
                throw new Error("Будь ласка, завантажте банер турніру");
            }

            // 1. Завантажуємо банер у Cloudinary
            const bannerUrl = await uploadService.uploadImage(file);

            // 2. Формуємо повний об'єкт для Go-бекенду
            const finalData: ICreateTournamentRequest = {
                ...data,
                bannerUrl: bannerUrl,
                // Приводимо дату до формату RFC3339 для Go time.Time
                start: new Date(data.start).toISOString(),
            };

            // 3. Відправляємо на свій сервер
            const newTournament = await adminTournamentService.createTournament(finalData);

            router.push(`/tournaments/${newTournament.id}`);
            return newTournament;
        } catch (err: any) {
            setError(err.message || 'Сталася помилка');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createTournament, isLoading, error };
};