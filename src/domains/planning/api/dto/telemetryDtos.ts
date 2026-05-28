/** Telemetry and live ETA API DTO contracts for MVP endpoints. */

import type { EtaConfidence, GpsSignalStatus } from "../../types";
import type { ApiId, ApiIsoDateTime, ApiResponseDto } from "./commonDtos";

export interface LocationPingRequestDto {
  routeId?: ApiId;
  routeNo?: string;
  tripNo?: number;
  vehicle: string;
  driverId?: ApiId;
  lat: number;
  lng: number;
  speedKph?: number;
  headingDeg?: number;
  capturedAt: ApiIsoDateTime;
  signalStatus?: GpsSignalStatus;
}

export interface LocationPingResultDto {
  telemetryId: ApiId;
  accepted: boolean;
  signalStatus: GpsSignalStatus;
  storedAt: ApiIsoDateTime;
}

export type LocationPingResponseDto = ApiResponseDto<LocationPingResultDto>;

export interface LiveEtaDto {
  routeId: ApiId;
  routeNo: string;
  tripNo: number;
  stopId: ApiId;
  plannedEta: string;
  latestEta: string;
  etaVarianceMinutes: number;
  confidence: EtaConfidence;
  source: "Mock" | "Routing Provider" | "Driver GPS";
  calculatedAt: ApiIsoDateTime;
}

export interface GetLiveEtaRequestDto {
  routeId: ApiId;
}

export type GetLiveEtaResponseDto = ApiResponseDto<LiveEtaDto[]>;
