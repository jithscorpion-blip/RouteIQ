/** Driver mobile workflow API DTO contracts for MVP endpoints. */

import type { DriverStopExecutionStatus, RouteNavigationProvider } from "../../types";
import type { ActorDto, ApiId, ApiIsoDateTime, ApiResponseDto } from "./commonDtos";

export interface DriverRouteStopDto {
  stopId: ApiId;
  sequenceNo: number;
  customerCode: string;
  customerName: string;
  plannedEta: string;
  latestEta?: string;
  deliveryCases: number;
  status: DriverStopExecutionStatus;
  proofRequired: boolean;
  navigationProvider: RouteNavigationProvider;
  navigationUrl: string;
  driverNotes?: string;
}

export interface DriverRouteDto {
  routeId: ApiId;
  routeNo: string;
  tripNo: number;
  driverId?: ApiId;
  driverName: string;
  vehicle: string;
  plannedStartTime?: ApiIsoDateTime;
  stops: DriverRouteStopDto[];
}

export interface GetTodayDriverRoutesRequestDto {
  driverId?: ApiId;
  vehicle?: string;
}

export type GetTodayDriverRoutesResponseDto = ApiResponseDto<DriverRouteDto[]>;

export interface UpdateStopExecutionStatusRequestDto {
  stopId: ApiId;
  status: DriverStopExecutionStatus;
  actor: ActorDto;
  eventTime: ApiIsoDateTime;
  latitude?: number;
  longitude?: number;
  exceptionReason?: string;
  proofReference?: string;
  note?: string;
}

export interface UpdateStopExecutionStatusResultDto {
  stopId: ApiId;
  status: DriverStopExecutionStatus;
  auditEventId: ApiId;
  updatedAt: ApiIsoDateTime;
}

export type UpdateStopExecutionStatusResponseDto = ApiResponseDto<UpdateStopExecutionStatusResultDto>;
