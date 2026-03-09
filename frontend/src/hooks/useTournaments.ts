import { useState, useEffect } from 'react';
import { ITournament } from '@/types';
import { tournamentService } from '@/services/tournamentService';

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<ITournament[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setIsLoading(true);
                const data = await tournamentService.getAll();
                setTournaments(data);
            } catch (err) {
                console.error("Error fetching tournaments:", err);
                setError("Не вдалося завантажити список турнірів.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    // Повертаємо дані та стани, щоб використати їх у компоненті
    return { tournaments, isLoading, error };
};