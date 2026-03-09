import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teamService } from '@/services/teamService';

export const useJoinTeam = () => {
    const router = useRouter();

    const [teamId, setTeamId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const joinTeam = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валідація: ID має бути числом
        if (!teamId || isNaN(Number(teamId))) {
            setError("Please enter a valid numeric Team ID");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await teamService.join(Number(teamId));

            // Успіх! Перекидаємо в профіль, де юзер побачить команду
            router.push('/profile');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            // Витягуємо повідомлення помилки з бекенду (наприклад: "Max 5 players" або "Already in team")
            const msg = err.response?.data?.error || "Failed to join team. Please check the ID.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        teamId,
        setTeamId,
        isLoading,
        error,
        joinTeam
    };
};