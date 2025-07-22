import { apiClient } from './apiClient';

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

// Function to fetch the blood stock summary
export const fetchBloodStockSummary = async (): Promise<BloodStockSummary> => {
  const response = await apiClient.get<ApiResponse<BloodStockSummary>>('/dashboards/blood-stock-summary');
  return response.data.result;  // Ensure the return type is BloodStockSummary
};

export interface UserResponse {
  number_user: number;
}

export const fetchNumberOfUsers = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<UserResponse>>('/dashboards/number-user');
  return response.data.result.number_user;  // Return the number of users
};

// Function to fetch the number of requests
export interface RequestResponse {
  number_request: number;
}

export const fetchNumberOfRequests = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<RequestResponse>>('/dashboards/number-request');
  return response.data.result.number_request;  // Return the number of requests
};

// Function to fetch the number of donations
export interface DonationResponse {
  number_donation: number;
}

export const fetchNumberOfDonations = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<DonationResponse>>('/dashboards/number-donation');
  return response.data.result.number_donation;  // Return the number of donations
};
