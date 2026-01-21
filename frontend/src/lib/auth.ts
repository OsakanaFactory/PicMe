import api from './api';

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  planType: 'FREE' | 'STARTER' | 'PRO' | 'STUDIO';
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: Tokens;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

/**
 * 新規登録
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/signup', data);
  return response.data;
}

/**
 * ログイン
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}

/**
 * ログアウト
 */
export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * トークンリフレッシュ
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/refresh', { refreshToken });
  return response.data;
}

/**
 * トークンをローカルストレージに保存
 */
export function saveTokens(tokens: Tokens): void {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
}

/**
 * 保存されたトークンを取得
 */
export function getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
}

/**
 * トークンをクリア
 */
export function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
