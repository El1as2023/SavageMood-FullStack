import { useState, useEffect, useCallback } from 'react'; // Додано useCallback
import { teamService } from '@/services/teamService';
import { ITeam } from '@/types';

export const useTeam = (teamId: string) => {
    const [team, setTeam] = useState<ITeam | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Використовуємо useCallback, щоб функція не перестворювалася при кожному рендері
    const fetchTeam = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await teamService.getById(teamId);
            setTeam(data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load team data");
        } finally {
            setIsLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        if (teamId) {
            fetchTeam();
        }
    }, [fetchTeam]); // Тепер це безпечно додавати в dependency array

    return { team, isLoading, error, refetch: fetchTeam };
};