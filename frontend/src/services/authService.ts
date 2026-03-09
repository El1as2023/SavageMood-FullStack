import axios from "axios";
import {IAuthResponse, ILoginRequest, IRegisterRequest} from "@/types";
import api from "@/lib/api";

export const authService = {
    async register (data: IRegisterRequest){
        const response = await api.post<IAuthResponse>("/auth/register", data);
        return response.data;
    },
   async login (data: ILoginRequest){
        const response = await api.post<IAuthResponse>("/auth/login", data);
        if (response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
   },
   async verifyEmail (token: string){
        const response = await api.get<{message:string}>(`/verify-email?token=${token}`);
        return response.data;
   },
    logout() {
        localStorage.removeItem("token");
    },
    async getMe(){
        const response = await api.get<IAuthResponse>("/profile");
        return response.data;
    }
};