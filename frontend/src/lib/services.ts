/**
 * Typed API service layer. One function per backend endpoint.
 * All functions return the `data` payload from the `{ success, data, meta }`
 * envelope (throwing on error via the underlying apiCall).
 */
import { api, apiCall } from './api';

// ── Shared types ────────────────────────────────────────────────
export type Role = 'USER' | 'SUB_ADMIN' | 'MASTER_ADMIN';
export type KycStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WalletBalance {
  availableBalance: number;
  pendingBalance: number;
  availableFormatted: string;
  pendingFormatted: string;
}

export interface MeResponse {
  id: string;
  adsId: string;
  fullName: string;
  email: string;
  mobile: string;
  state: string;
  role: Role;
  kycStatus: KycStatus;
  referralCode: string;
  referredById: string | null;
  isActive: boolean;
  twoFAEnabled: boolean;
  createdAt: string;
  wallet: WalletBalance;
  partnerTier: { tier: { name: string; slug: string } } | null;
}

export interface CoursePackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  sortOrder: number;
  description: string | null;
}

export interface PartnerTier {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  downlineAdsPercent: string | number;
  sortOrder: number;
}

export interface LedgerEntry {
  id: string;
  type: string;
  status: string;
  amount: number;
  amountFormatted: string;
  direction: 'CREDIT' | 'DEBIT';
  note: string | null;
  createdAt: string;
}

// ── Auth ────────────────────────────────────────────────────────
export const authService = {
  register: (body: {
    fullName: string;
    email: string;
    mobile: string;
    state: string;
    password: string;
    referralCode?: string;
  }) => api.post('/auth/register', body).then((r) => r.data),

  login: (body: { email: string; password: string }) =>
    api.post('/auth/login', body).then((r) => r.data as { accessToken: string; user: MeResponse }),

  logout: () => api.post('/auth/logout', {}).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }).then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
};

// ── Users ───────────────────────────────────────────────────────
export const userService = {
  getMe: () => api.get('/users/me').then((r) => r.data as MeResponse),
  updateMe: (body: { fullName?: string; state?: string }) =>
    api.put('/users/me', body).then((r) => r.data),
};

// ── Wallet ──────────────────────────────────────────────────────
export const walletService = {
  getWallet: () => api.get('/users/me/wallet').then((r) => r.data as WalletBalance),
  getTransactions: (page = 1, pageSize = 20) =>
    apiCall(`/users/me/transactions?page=${page}&pageSize=${pageSize}`).then((r) => ({
      items: r.data as LedgerEntry[],
      meta: r.meta as { page: number; pageSize: number; total: number },
    })),
  getCommissions: () => api.get('/users/me/commissions').then((r) => r.data),
  getPurchases: () => api.get('/users/me/purchases').then((r) => r.data),
};

// ── Catalog (public) ────────────────────────────────────────────
export const catalogService = {
  getPackages: () => api.get('/packages').then((r) => r.data as CoursePackage[]),
  getPartnerTiers: () => api.get('/partner-tiers').then((r) => r.data as PartnerTier[]),
};

// ── Courses ─────────────────────────────────────────────────────
export interface MyCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  minTier: number;
  locked: boolean;
}
export interface MyCoursesResponse {
  currentPackage: string | null;
  maxTier: number;
  unlockedCount: number;
  totalCount: number;
  courses: MyCourse[];
}
export const coursesService = {
  getMy: () => api.get('/courses/my').then((r) => r.data as MyCoursesResponse),
};

// ── Referrals ───────────────────────────────────────────────────
export const referralsService = {
  getMyLinks: () =>
    api.get('/referrals/my-links').then((r) => r.data as { referralCode: string; referralLink: string }),
  getMyTeam: () => api.get('/referrals/my-team').then((r) => r.data),
  getLeaderboard: (limit = 10) =>
    apiCall(`/leaderboard?limit=${limit}`).then((r) => r.data),
};

// ── Payments ────────────────────────────────────────────────────
export const paymentsService = {
  createOrder: (body: {
    packageSlug?: string;
    partnerTierSlug?: string;
    idempotencyKey: string;
  }) =>
    api.post('/payments/create-order', body).then(
      (r) => r.data as { orderId: string; amount: number; currency: string; key: string },
    ),
  getStatus: (orderId: string) =>
    api.get(`/payments/status/${orderId}`).then((r) => r.data),
};

// ── Ads ─────────────────────────────────────────────────────────
export const adsService = {
  getEligibility: () => api.get('/ads/eligibility').then((r) => r.data),
  startSession: () => api.post('/ads/start-session', {}).then((r) => r.data as { sessionId: string }),
  completeSession: (sessionId: string) =>
    api.post('/ads/complete-session', { sessionId }).then((r) => r.data),
};

// ── KYC ─────────────────────────────────────────────────────────
export const kycService = {
  getStatus: () => api.get('/kyc/status').then((r) => r.data),
  getUploadUrl: (documentType: string) =>
    api.post('/kyc/upload-url', { documentType }).then((r) => r.data),
  submit: (documents: { documentType: string; filePublicId: string; fileUrl: string }[]) =>
    api.post('/kyc/submit', { documents }).then((r) => r.data),
};

// ── Withdrawals ─────────────────────────────────────────────────
export const withdrawalsService = {
  getConfig: () => api.get('/withdrawals/config').then((r) => r.data),
  getMyRequests: () => api.get('/withdrawals/my-requests').then((r) => r.data),
  request: (body: {
    amount: number;
    method: 'UPI' | 'BANK';
    upiId?: string;
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  }) => api.post('/withdrawals/request', body).then((r) => r.data),
};

// ── Admin ───────────────────────────────────────────────────────
export const adminService = {
  dashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  users: (search = '', page = 1) =>
    apiCall(`/admin/users?search=${encodeURIComponent(search)}&page=${page}`).then((r) => ({
      items: r.data,
      meta: r.meta,
    })),
  user: (id: string) => api.get(`/admin/users/${id}`).then((r) => r.data),
  ban: (id: string, reason?: string) => api.post(`/admin/users/${id}/ban`, { reason }).then((r) => r.data),
  unban: (id: string) => api.post(`/admin/users/${id}/unban`, {}).then((r) => r.data),
  kycPending: () => api.get('/admin/kyc/pending').then((r) => r.data),
  kycDocs: (userId: string) => api.get(`/admin/kyc/${userId}`).then((r) => r.data),
  kycApprove: (userId: string) => api.post(`/admin/kyc/${userId}/approve`, {}).then((r) => r.data),
  kycReject: (userId: string, reason: string) =>
    api.post(`/admin/kyc/${userId}/reject`, { reason }).then((r) => r.data),
  withdrawalsPending: () => api.get('/admin/withdrawals/pending').then((r) => r.data),
  withdrawalApprove: (id: string, transactionRef: string) =>
    api.post(`/admin/withdrawals/${id}/approve`, { transactionRef }).then((r) => r.data),
  withdrawalReject: (id: string, reason: string) =>
    api.post(`/admin/withdrawals/${id}/reject`, { reason }).then((r) => r.data),
  transactions: (page = 1) => apiCall(`/admin/transactions?page=${page}`).then((r) => ({ items: r.data, meta: r.meta })),
  payments: (page = 1) => apiCall(`/admin/payments?page=${page}`).then((r) => ({ items: r.data, meta: r.meta })),
  auditLogs: (page = 1) => apiCall(`/admin/audit-logs?page=${page}`).then((r) => ({ items: r.data, meta: r.meta })),
};

// ── Master Admin ────────────────────────────────────────────────
export const masterAdminService = {
  getCommissionMatrix: () => api.get('/master-admin/commission-matrix').then((r) => r.data),
  updateCommissionRate: (rateId: string, amount: number) =>
    api.put('/master-admin/commission-matrix', { rateId, amount }).then((r) => r.data),
  reconciliation: () => api.get('/master-admin/reconciliation').then((r) => r.data),
};
