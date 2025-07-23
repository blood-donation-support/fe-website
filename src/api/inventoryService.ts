import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';

export interface InventoryItem {
  _id: string;
  donation_process_id: string;
  request_process_id: string;
  donation_type: string;
  blood_group_id: string;
  blood_component_id: string;
  volume: number;
  status: string | null;
  update_by: string;
  note: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  blood_group_name: string;
  blood_component_name: string;
  storage_temperature: number;
}

export const fetchInventory = async (
): Promise<InventoryItem[]> => {
  const res = await apiClient.get<ApiResponse<InventoryItem[]>>(
    `/blood-units`
  );
  return res.data.result;
};

// GET: Lấy mảng InventoryItem theo donation_process_id
export const fetchInventoryByRequest = async (
  requestId: string
): Promise<InventoryItem[]> => {
  const res = await apiClient.get<ApiResponse<InventoryItem[]>>(
    `/blood-units/${requestId}`
  );
  return res.data.result;
};
export const fetchInventoryByRequestById = async (
  requestId: string
): Promise<InventoryItem[]> => {
  const res = await apiClient.get<ApiResponse<InventoryItem[]>>(
    `/blood-units/${requestId}`
  );
  return res.data.result;
};

// PATCH: Cập nhật mảng InventoryItem theo donation_process_id
export const updateInventoryByRequest = async (
  requestId: string,
  items: Partial<InventoryItem>[]
): Promise<InventoryItem[]> => {
  const formattedItems = items.map(item => ({
    blood_group_id: item.blood_group_id,
    blood_component_id: item.blood_component_id,
    note: item.note ?? '',
    volume: item.volume ?? 0,
    storage_temperature: item.storage_temperature ?? 0,
    status: item.status ?? null,
  }));

  const res = await apiClient.patch<ApiResponse<InventoryItem[]>>(
    `/blood-units/${requestId}`,
    formattedItems
  );
console.log("check update nhập kho", res);
  return res.data.result;
};

