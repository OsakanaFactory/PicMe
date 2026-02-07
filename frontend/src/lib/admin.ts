import api from './api';

// 型定義
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  paidUsers: number;
  monthlyRevenue: number;
  adRevenue: number;
  usersByPlan: Record<string, number>;
  usersByPlanPercentage: Record<string, number>;
  recentUsers: {
    id: number;
    username: string;
    planType: string;
    createdAt: string;
  }[];
  pendingInquiries: number;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  planType: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  usage: {
    artworkCount: number;
    artworkLimit: number;
    socialLinkCount: number;
    socialLinkLimit: number;
    postCount: number;
    postLimit: number;
  };
}

export interface SubscriptionStats {
  planStats: Record<string, {
    count: number;
    percentage: number;
    monthlyRevenue: number;
  }>;
  mrr: number;
  churnRate: number;
  recentSubscriptions: {
    username: string;
    planType: string;
    status: string;
    startDate: string;
  }[];
}

export interface Inquiry {
  id: number;
  userId: number | null;
  username: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemMetrics {
  cpu: { usagePercent: number; status: string };
  memory: { usagePercent: number; status: string };
  disk: { usagePercent: number; status: string };
  database: {
    activeConnections: number;
    maxConnections: number;
    avgResponseTimeMs: number;
  };
  errors: {
    error5xx: number;
    error4xx: number;
    period: string;
  };
}

// 認証
export async function adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
  const response = await api.post('/admin/auth/login', data);
  return response.data.data;
}

export async function adminRefreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const response = await api.post('/admin/auth/refresh', {}, {
    headers: { Authorization: `Bearer ${refreshToken}` }
  });
  return response.data.data;
}

// ダッシュボード
export async function getDashboard(): Promise<DashboardStats> {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
}

// ユーザー管理
export async function getUsers(params: { search?: string; planType?: string; page?: number; size?: number }): Promise<{ content: AdminUser[]; totalElements: number; totalPages: number }> {
  const response = await api.get('/admin/users', { params });
  return response.data.data;
}

export async function getUser(userId: number): Promise<AdminUser> {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data.data;
}

export async function suspendUser(userId: number): Promise<void> {
  await api.post(`/admin/users/${userId}/suspend`);
}

export async function activateUser(userId: number): Promise<void> {
  await api.post(`/admin/users/${userId}/activate`);
}

// サブスクリプション
export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const response = await api.get('/admin/subscriptions/stats');
  return response.data.data;
}

// 問い合わせ
export async function getInquiries(params: { status?: string; page?: number; size?: number }): Promise<{ content: Inquiry[]; totalElements: number; totalPages: number }> {
  const response = await api.get('/admin/inquiries', { params });
  return response.data.data;
}

export async function getInquiry(inquiryId: number): Promise<Inquiry> {
  const response = await api.get(`/admin/inquiries/${inquiryId}`);
  return response.data.data;
}

export async function updateInquiryStatus(inquiryId: number, data: { status: string; adminNote?: string }): Promise<Inquiry> {
  const response = await api.put(`/admin/inquiries/${inquiryId}/status`, data);
  return response.data.data;
}

// システムメトリクス
export async function getSystemMetrics(): Promise<SystemMetrics> {
  const response = await api.get('/admin/system/metrics');
  return response.data.data;
}
