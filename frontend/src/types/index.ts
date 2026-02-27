export interface IUser{
    id: string;
    username: string;
    email: string;
    role: string;
    is_verified: boolean;
}


export interface IAuthResponse{
    token: string;
    user: IUser;
    message?: string;
}

export  interface IRegisterRequest{
    username: string;
    email: string;
    password: string;
}

export interface ILoginRequest{
    email: string;
    password: string;
}

export interface IApiError{
    error: string;
}