
import {ICreateTournamentRequest, ITournament, IUpdateTournamentRequest} from '@/types';
import api from "@/lib/api";

export const adminTournamentService = {
    // 1. Створення
    createTournament: async (data: ICreateTournamentRequest) => {
        const response = await api.post('/admin/create-tournament', data);
        return response.data;
    },

    // 2. Отримання всіх турнірів для дашборду
    getAllTournaments: async (): Promise<ITournament[]> => {
        const response = await api.get('/tournaments'); // Припускаю, що цей роут публічний або в api/
        return response.data;
    },

    // 3. Запуск турніру (генерує сітку на Challonge)
    startTournament: async (id: number) => {
        const response = await api.post(`/admin/tournaments/${id}/start`);
        return response.data;
    },
    updateTournament: async (id: number, data: IUpdateTournamentRequest) => {
        const response = await api.patch(`/admin/tournaments/${id}`, data);
        return response.data;
    },

    // 4. Видалення турніру
    deleteTournament: async (id: number) => {
        const response = await api.delete(`/admin/tournaments/${id}`);
        return response.data;
    },

    // 5. Завершення турніру (виклик FinishedTournamentHandler)
    finishTournament: async (id: number) => {
        const response = await api.post(`/admin/tournaments/${id}/finish`); // Переконайся, що в Go є цей роут
        return response.data;
    }
};