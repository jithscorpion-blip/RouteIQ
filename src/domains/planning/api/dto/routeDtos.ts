/** Route planning API DTO contracts for MVP endpoints. */

import type {
  CapacityMetricKey,
  DepotCode,
  GeoZoneCode,
  RouteStatus,
  UserRole,
} from "../../types";
import type { ActorDto, ApiId, ApiIsoDateTime, ApiResponseDto, ListResponseDto, PaginationRequestDto } from "./commonDtos";

export interface RouteCapacityDto {
  casesPct: number;
  weightPct: number;
  cbmPct: number;
  efPct: number;
  hardExceededMetrics: CapacityMetricKey[];
  isCritical: boolean;
}

export interface RouteCostDto {
  costPerTrip: number;
  costPerCase: number;
  redeliveryCost: number;
  currency: "OMR" | "AED" | "SAR" | "QAR" | "BHD" | "KWD";
}

export interface RouteSummaryDto {
  routeId: ApiId;
  routeNo: string;
  depot: DepotCode;
  geoZone?: GeoZoneCode;
  tripNo: number;
  vehicle: string;
  vehicleType: string;
  driver: string;
  stops: number;
  routeHours: number;
  remainingDuty: number;
  status: RouteStatus;
  capacity: RouteCapacityDto;
  cost?: RouteCostDto;
  warnings: string[];
  lockedAt?: ApiIsoDateTime;
  lockedBy?: ActorDto;
  releasedAt?: ApiIsoDateTime;
  releasedBy?: ActorDto;
}

export interface RouteDetailDto extends RouteSummaryDto {
  plannedStartTime?: ApiIsoDateTime;
  plannedEndTime?: ApiIsoDateTime;
  totalCases?: number;
  totalWeightKg?: number;
  totalCbm?: number;
  totalServiceMinutes?: number;
}

export interface GetRoutesRequestDto extends PaginationRequestDto {
  depot?: DepotCode | "ALL";
  geoZone?: GeoZoneCode | "ALL";
  status?: RouteStatus | "ALL";
  role: UserRole;
}

export type GetRoutesResponseDto = ApiResponseDto<ListResponseDto<RouteSummaryDto>>;
export type GetRouteDetailResponseDto = ApiResponseDto<RouteDetailDto>;

export interface LockRouteRequestDto {
  routeId: ApiId;
  actor: ActorDto;
  reason?: string;
}

export interface ReleaseRouteRequestDto {
  routeId: ApiId;
  actor: ActorDto;
  reason: string;
}

export interface RouteWorkflowResponseDto {
  route: RouteDetailDto;
  auditEventId: ApiId;
}

export type LockRouteResponseDto = ApiResponseDto<RouteWorkflowResponseDto>;
export type ReleaseRouteResponseDto = ApiResponseDto<RouteWorkflowResponseDto>;
