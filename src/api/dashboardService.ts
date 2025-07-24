import { apiClient } from './apiClient';

export interface BloodStorageItem {
  blood_component_name: string;
  blood_group_name: string;
  total_units: number;
  total_volume: number;
  blood_component_id: string;
  blood_group_id: string;
}

export interface BloodStockSummary {
  [key: string]: {
    blood_component_name: string;
    total_units: number;
    total_volume: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  result: T;
}

// Function to fetch the blood storage summary
export const fetchBloodStorageSummary = async (): Promise<BloodStorageItem[]> => {
  const response = await apiClient.get<ApiResponse<BloodStorageItem[]>>('/dashboards/blood-storage-summary');
  return response.data.result;
};

// Function to fetch the blood stock summary (existing)
export const fetchBloodStockSummary = async (): Promise<BloodStockSummary> => {
  const response = await apiClient.get<ApiResponse<BloodStockSummary>>('/dashboards/blood-stock-summary');
  return response.data.result;
};

export interface UserResponse {
  number_user: number;
}

export const fetchNumberOfUsers = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<UserResponse>>('/dashboards/number-user');
  return response.data.result.number_user;
};

export interface RequestResponse {
  number_request: number;
}

export const fetchNumberOfRequests = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<RequestResponse>>('/dashboards/number-request');
  return response.data.result.number_request;
};

export interface DonationResponse {
  number_donation: number;
}

export const fetchNumberOfDonations = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<DonationResponse>>('/dashboards/number-donation');
  return response.data.result.number_donation;
};