import type { WarehouseOverview } from "@/types/warehouse";
import { apiClient } from "./apiClient";
import type { ApiResponse } from "./apiClient";


export const fetchWarehouseOverview = async (): Promise<WarehouseOverview> => {
  const response = await apiClient.get<ApiResponse<WarehouseOverview>>(
    "/dashboards/overview-warehouse"
  );
  return response.data.result;
};