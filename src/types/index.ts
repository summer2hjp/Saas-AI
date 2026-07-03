import type { User, Tenant, Plan, Subscription } from "@/lib/db/schema";

export type SessionUser = User & { tenant: Tenant | null };

export type SubscriptionWithPlan = Subscription & { plan: Plan };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  code?: string;
}

export type AsyncResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
