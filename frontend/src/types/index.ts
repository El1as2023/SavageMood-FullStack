// src/types/index.ts

// --- 1. AUTH & USER TYPES ---

export interface IAuthResponse {
    token: string;
    user: IUser;
    message?: string;
}

export interface IRegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    is_verified: boolean;

    team?: ITeam;
}

// --- 2. TEAM TYPES ---

// Спочатку описуємо учасника, бо він використовується всередині ITeam
export interface ITeamMember {
    id: number;
    teamId: number;
    userId: string;
    role: 'captain' | 'player'; //
    joinedAt: string; //
    user?: { //
        username: string;
        avatarUrl?: string;
    };
}

export interface ITeam {
    id: number;
    name: string;
    captainId: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;   // camelCase
    members?: ITeamMember[];
}

// Типи для створення та вступу в команду
export interface ICreateTeamRequest {
    name: string;
    logoUrl?: string;
}

export interface IJoinTeamRequest {
    teamId: number;
}

// --- 3. TOURNAMENT TYPES ---

export interface ITournament {
    id: number;
    title: string;
    description: string;
    status: 'upcoming' | 'ongoing' | 'finished' | 'live';


    start_date: string;
    end_date?: string;
    max_teams: number;
    prize_pool: string;
    banner_url: string;
    creator_id: string;
    created_at: string;




    // Challonge info
    challongeId?: number; //
    challongeUrl?: string;

    // Список зареєстрованих команд
    teams?: ITeam[];
}

export interface ICreateTournamentRequest {
    title: string;
    description: string;
    start: string; // ISO 8601 string для time.Time в Go
    maxTeamSize: number;
    prizePoolSize: string;
    bannerUrl: string;
}

export interface IUpdateTournamentRequest {
    title?: string;
    description?: string;
    start?: string;
    maxTeamSize?: number;
    prizePoolSize?: string;
    bannerUrl?: string;
}




// --- 4. ERROR HANDLING ---

export interface IApiError {
    error: string;
}

