import {ILoginRequest, IUser} from "@/types";
import { create } from 'zustand';
import {authService} from "@/services/authService";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: ILoginRequest) => Promise<void>;
    logout: () => void ;

}

export const useAuthStore = create<AuthState>((set)=> ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (data: ILoginRequest) => {
        set({ isLoading: true });
        try{
            const response = await authService.login(data);
        set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
        });

        } catch(error){
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        authService.logout();
        set({
            user: null,
            isAuthenticated: false,
        });
    },
}))



