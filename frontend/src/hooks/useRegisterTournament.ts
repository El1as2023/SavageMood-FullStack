import { useState } from 'react';
import { tournamentService } from '@/services/tournamentService';
import { useRouter } from 'next/navigation';

export const useRegisterTournament = (tournamentId: number) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const registerTeam = async (teamId: number) => {
        setIsRegistering(true);
        setError(null);

        try {
            await tournamentService.registerTeam(tournamentId, teamId);

            router.refresh();
        } catch (err: any) {
            const msg = err.response?.data?.error || "Failed to register for tournament";
            setError(msg);
        } finally {
            setIsRegistering(false);
        }
    };

    return { registerTeam, isRegistering, error, setError };
};