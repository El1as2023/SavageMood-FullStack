import api from "@/lib/api"; // Твій налаштований axios instance
import { ITournament } from "@/types";

export const tournamentService = {
    // Отримати всі турніри
    getAll: async (): Promise<ITournament[]> => {
        const response = await api.get<ITournament[]>('/tournaments');
        return response.data;
    },

    // Отримати один турнір (знадобиться для сторінки деталей)
    getById: async (id: string | number): Promise<ITournament> => {
        const response = await api.get<ITournament>(`/tournaments/${id}`);
        return response.data;
    },
    registerTeam: async (tournamentId: number, teamId: number) => {
        // Твій хендлер чекає JSON { "teamId": number }
        const response = await api.post(`/tournaments/${tournamentId}/register`, { teamId });
        return response.data;
    }
};