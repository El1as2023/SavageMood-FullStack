import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminTournamentService} from '@/services/adminTournamentService';
import { uploadService } from '@/services/uploadService';
import {IUpdateTournamentRequest} from "@/types";

export const useEditTournament = (id: number) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const updateTournament = async (data: IUpdateTournamentRequest, file: File | null) => {
        setIsUpdating(true);
        setError(null);

        try {
            const finalData = { ...data };

            // Якщо адмін вибрав нову картинку, завантажуємо її
            if (file) {
                const bannerUrl = await uploadService.uploadImage(file);
                finalData.bannerUrl = bannerUrl;
            }

            // Форматуємо дату, якщо вона була змінена
            if (finalData.start) {
                finalData.start = new Date(finalData.start).toISOString();
            }

            await adminTournamentService.updateTournament(id, finalData);
            router.push('/admin'); // Повертаємо в дашборд після успіху
        } catch (err: any) {
            setError(err.message || 'Сталася помилка при оновленні');
            throw err;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateTournament, isUpdating, error };
};