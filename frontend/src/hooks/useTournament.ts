import { useState, useEffect, useCallback } from 'react';
import { ITournament } from '@/types';
import { tournamentService } from '@/services/tournamentService';

export const useTournament = (id: string) => {
    const [tournament, setTournament] = useState<ITournament | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Використовуємо useCallback, щоб функція не перестворювалася при кожному рендері.
    // Це дозволить нам викликати refetch() після успішної реєстрації.
    const fetchTournament = useCallback(async () => {
        if (!id) return;

        try {
            // Ми не завжди хочемо вмикати повний лоадер (спінер на весь екран) при рефетчі,
            // але для першого завантаження це потрібно.
            setIsLoading(true);
            const data = await tournamentService.getById(id);
            setTournament(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching tournament:", err);
            setError("Турнір не знайдено або сталася помилка.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTournament();
    }, [fetchTournament]);

    return {
        tournament,
        isLoading,
        error,
        refetch: fetchTournament // Тепер ми можемо оновлювати дані вручну
    };
};