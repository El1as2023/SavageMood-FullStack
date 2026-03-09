import { useState, useEffect, useCallback } from 'react';
import { adminTournamentService } from '@/services/adminTournamentService';
import { ITournament } from '@/types';

export const useAdminTournaments = () => {
    const [tournaments, setTournaments] = useState<ITournament[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTournaments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminTournamentService.getAllTournaments();
            setTournaments(data.sort((a, b) => b.id - a.id));
        } catch (err: any) {
            setError(err.message || 'Не вдалося завантажити турніри');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTournaments();
    }, [fetchTournaments]);

    const handleStart = async (id: number) => {
        if (!confirm("Впевнені, що хочете запустити турнір? Це згенерує сітку на Challonge.")) return;
        setActionLoading(id);
        try {
            await adminTournamentService.startTournament(id);
            await fetchTournaments();
        } catch (err: any) {
            alert(err.message || "Помилка запуску");
        } finally {
            setActionLoading(null);
        }
    };

    const handleFinish = async (id: number) => {
        if (!confirm("Завершити турнір?")) return;
        setActionLoading(id);
        try {
            await adminTournamentService.finishTournament(id);
            await fetchTournaments();
        } catch (err: any) {
            alert(err.message || "Помилка завершення");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("ВИДАЛИТИ турнір назавжди? Цю дію неможливо скасувати!")) return;
        setActionLoading(id);
        try {
            await adminTournamentService.deleteTournament(id);
            await fetchTournaments();
        } catch (err: any) {
            alert(err.message || "Помилка видалення");
        } finally {
            setActionLoading(null);
        }
    };

    return {
        tournaments, isLoading, actionLoading, error,
        handleStart, handleFinish, handleDelete
    };
};