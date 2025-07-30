import type { BloodInventoryItem } from "@/types/inventory";
import { apiClient } from "./apiClient";
import type { ApiResponse } from "./apiClient";

export const fetchBloodInventoryThresholds = async (): Promise<BloodInventoryItem[]> => {
  const response = await apiClient.get<ApiResponse<BloodInventoryItem[]>>(
    "/blood-inventory-thresholds"
  );
  return response.data.result;
};

export const updateBloodInventoryThresholds = async (
  id: string,
  payload: Partial<BloodInventoryItem>
): Promise<BloodInventoryItem> => {
  const response = await apiClient.patch<ApiResponse<BloodInventoryItem>>(
    `/blood-inventory-thresholds/${id}`,
    payload
  );
  return response.data.result;
};
