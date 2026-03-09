// src/services/teamService.ts

import api from "@/lib/api";
import { ITeam, ICreateTeamRequest, IJoinTeamRequest } from "@/types";

export const teamService = {
    // 1. Створення команди
    // Route: protected.POST("/team", ...)
    create: async (data: ICreateTeamRequest): Promise<ITeam> => {
        const response = await api.post<{ team: ITeam }>('/team', data);
        return response.data.team;
    },

    // 2. Отримання команди за ID
    // Route: protected.GET("/team/:id", ...)
    getById: async (id: string | number): Promise<ITeam> => {
        // ВИПРАВЛЕНО: /team замість /teams
        const response = await api.get<ITeam>(`/team/${id}`);
        return response.data;
    },

    // 3. Вступ до команди
    // Route: protected.POST("/team/join", ...)
    join: async (teamId: number): Promise<any> => {
        // Твій хендлер чекає JSON { "teamId": 123 }
        return api.post('/team/join', { teamId });
    },

    // 4. Вихід з команди
    // Route: protected.POST("/team/leave", ...)
    leave: async (teamId: number): Promise<any> => {
        // Твій хендлер чекає JSON { "teamId": 123 }
        return api.post('/team/leave', { teamId });
    },

    // 5. Видалення команди (тільки для капітана)
    // Route: protected.DELETE("/team/delete/:id", ...)
    delete: async (teamId: number): Promise<any> => {
        return api.delete(`/team/delete/${teamId}`);
    }
};