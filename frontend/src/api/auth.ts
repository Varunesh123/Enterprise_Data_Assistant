import api from './axios';
import type {
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    User
} from "../types/auth";

export const registerUser = async (
    data: RegisterRequest,
): Promise<User> => {
    const response = await api.post<User>("/auth/register", data)

    return response.data;
};

export const loginUser = async (
    data: LoginRequest,
): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>("/auth/login", data)

    return response.data;
};

export const getCurrentUser = async (
    accessToken: string,
): Promise<User> => {
    const response = await api.get<User>("/auth/me",{
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    return response.data;
}

export const refreshAccessToken = async(): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>("/auth/refresh");

    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    await api.post("/auth/logout");
};