/** Import/export API DTO contracts for MVP endpoints. */

import type { DriverStopListRow, WarehousePickListRow } from "../../types";
import type { ApiId, ApiIsoDateTime, ApiResponseDto } from "./commonDtos";
import type {
  ImportedCustomerRecord,
  ImportedOrderRecord,
  ImportedRouteRecord,
  ImportedVehicleRecord,
} from "../../data/importContracts";

export type ImportEntityTypeDto = "customers" | "orders" | "routes" | "vehicles";
export type ImportValidationSeverityDto = "error" | "warning";

export interface ImportValidationIssueDto {
  rowNumber: number;
  field: string;
  severity: ImportValidationSeverityDto;
  message: string;
}

export interface ImportPreviewRequestDto {
  entityType: ImportEntityTypeDto;
  fileName: string;
  rows:
    | ImportedCustomerRecord[]
    | ImportedOrderRecord[]
    | ImportedRouteRecord[]
    | ImportedVehicleRecord[];
}

export interface ImportPreviewResultDto {
  importId: ApiId;
  entityType: ImportEntityTypeDto;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  issues: ImportValidationIssueDto[];
  previewedAt: ApiIsoDateTime;
}

export type ImportPreviewResponseDto = ApiResponseDto<ImportPreviewResultDto>;

export interface CommitImportRequestDto {
  importId: ApiId;
  committedByRole: "Admin" | "Planner";
}

export interface CommitImportResultDto {
  importId: ApiId;
  insertedRows: number;
  updatedRows: number;
  skippedRows: number;
  committedAt: ApiIsoDateTime;
}

export type CommitImportResponseDto = ApiResponseDto<CommitImportResultDto>;

export interface DriverStopListExportResponseDto {
  routeId: ApiId;
  fileName: string;
  rows: DriverStopListRow[];
  generatedAt: ApiIsoDateTime;
}

export interface WarehousePickListExportResponseDto {
  routeId: ApiId;
  fileName: string;
  rows: WarehousePickListRow[];
  generatedAt: ApiIsoDateTime;
}

export type DriverStopListExportApiResponseDto = ApiResponseDto<DriverStopListExportResponseDto>;
export type WarehousePickListExportApiResponseDto = ApiResponseDto<WarehousePickListExportResponseDto>;
