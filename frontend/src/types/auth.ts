export interface User {
    id: string;
    name: string;
    email: string;
    team: string | null;
    role: string;
    is_active: boolean;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    team?: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }