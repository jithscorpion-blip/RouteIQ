/** Order assignment API DTO contracts for MVP endpoints. */

import type { DepotCode, GeoZoneCode, OrderPriority, UnplannedOrderType } from "../../types";
import type { ActorDto, ApiId, ApiIsoDateTime, ApiResponseDto, ListResponseDto, PaginationRequestDto } from "./commonDtos";

export type OrderAssignmentStatusDto = "Unplanned" | "Assigned" | "Loaded" | "Delivered" | "Cancelled";

export interface OrderDto {
  orderId: ApiId;
  orderNo: string;
  customerCode: string;
  customerName: string;
  geoZone: GeoZoneCode;
  depot: DepotCode;
  cases: number;
  weightKg?: number;
  cbm?: number;
  priority: OrderPriority;
  type: UnplannedOrderType;
  status: OrderAssignmentStatusDto;
  requestedDeliveryDate?: string;
  assignedRouteId?: ApiId;
  assignedStopId?: ApiId;
}

export interface GetUnplannedOrdersRequestDto extends PaginationRequestDto {
  depot?: DepotCode | "ALL";
  geoZone?: GeoZoneCode | "ALL";
  priority?: OrderPriority | "ALL";
}

export type GetUnplannedOrdersResponseDto = ApiResponseDto<ListResponseDto<OrderDto>>;

export interface AssignOrderRequestDto {
  orderId: ApiId;
  routeId: ApiId;
  stopId?: ApiId;
  actor: ActorDto;
  note?: string;
}

export interface UnassignOrderRequestDto {
  orderId: ApiId;
  actor: ActorDto;
  reason: string;
}

export interface OrderAssignmentResultDto {
  order: OrderDto;
  routeId?: ApiId;
  stopId?: ApiId;
  auditEventId: ApiId;
  updatedAt: ApiIsoDateTime;
}

export type AssignOrderResponseDto = ApiResponseDto<OrderAssignmentResultDto>;
export type UnassignOrderResponseDto = ApiResponseDto<OrderAssignmentResultDto>;
