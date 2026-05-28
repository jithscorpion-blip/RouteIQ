/** Manual stop sequencing API DTO contracts for MVP endpoints. */

import type {
  DepotCode,
  GeoZoneCode,
  RouteStopSequenceSource,
  RouteStopStatus,
  RouteStopType,
} from "../../types";
import type { ActorDto, ApiId, ApiIsoDateTime, ApiResponseDto } from "./commonDtos";

export interface StopDto {
  stopId: ApiId;
  routeId: ApiId;
  routeNo: string;
  depot: DepotCode;
  tripNo: number;
  plannedSeq: number;
  manualSeq: number | null;
  activeSeq: number;
  sequenceSource: RouteStopSequenceSource;
  customerCode: string;
  customerName: string;
  geoZone: GeoZoneCode;
  stopType: RouteStopType;
  status: RouteStopStatus;
  cases: number;
  serviceMinutes: number;
  plannedEta: string;
  latestEta?: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface GetStopSequenceResponseDto {
  routeId: ApiId;
  routeNo: string;
  tripNo: number;
  stops: StopDto[];
  hasManualChanges: boolean;
}

export interface StopSequenceChangeDto {
  stopId: ApiId;
  manualSeq: number;
}

export interface UpdateStopSequenceRequestDto {
  routeId: ApiId;
  actor: ActorDto;
  reason: "manual-move-up" | "manual-move-down" | "manual-drag-drop" | "planner-resequence";
  changes: StopSequenceChangeDto[];
  note?: string;
}

export interface UpdateStopSequenceResultDto {
  routeId: ApiId;
  stops: StopDto[];
  auditEventId: ApiId;
  updatedAt: ApiIsoDateTime;
}

export type GetStopSequenceApiResponseDto = ApiResponseDto<GetStopSequenceResponseDto>;
export type UpdateStopSequenceApiResponseDto = ApiResponseDto<UpdateStopSequenceResultDto>;
