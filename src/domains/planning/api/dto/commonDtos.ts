/**
 * RouteIQ P10 — common API DTO contracts.
 *
 * DTOs describe browser-to-backend payloads only.
 * They do not add a real backend, API implementation, database connection, or workflow change.
 */

export type ApiIsoDateTime = string;
export type ApiId = string;

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "FORBIDDEN"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface ApiErrorDto {
  code: ApiErrorCode;
  message: string;
  field?: string;
  retryable: boolean;
}

export interface ApiMetaDto {
  requestId: string;
  generatedAt: ApiIsoDateTime;
  source: "mock" | "backend" | "provider";
}

export interface ApiResponseDto<TData> {
  ok: boolean;
  data: TData | null;
  errors: ApiErrorDto[];
  meta: ApiMetaDto;
}

export interface PaginationRequestDto {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponseDto {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ListResponseDto<TItem> {
  items: TItem[];
  pagination?: PaginationResponseDto;
}

export interface ActorDto {
  userId?: ApiId;
  role: "Admin" | "Planner" | "Viewer" | "Driver" | "System";
  displayName?: string;
}

export interface AuditStampDto {
  createdAt: ApiIsoDateTime;
  createdBy: ActorDto;
  updatedAt?: ApiIsoDateTime;
  updatedBy?: ActorDto;
}
