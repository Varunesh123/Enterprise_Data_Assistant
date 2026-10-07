import { create } from "zustand";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
  } from "../api/auth";

import type { User } from "../types/auth";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (
        email: string,
        password: string,
    ) => Promise<void>;

    initializeAuth: () => Promise<void>;

    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        const tokenResponse = await loginUser({email, password});

        const user = await getCurrentUser(tokenResponse.access_token)

        set({
            user,
            accessToken: tokenResponse.access_token,
            isAuthenticated: true,
            isLoading: false
        });
    },

    initializeAuth: async () => {
        try {
            const tokenResponse = await refreshAccessToken();

            const user = await getCurrentUser(
                tokenResponse.access_token
            );
            
            set({
                user,
                accessToken: tokenResponse.access_token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch {
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
    logout: async() => {
        try {
            await logoutUser();
        } finally {
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },
}));