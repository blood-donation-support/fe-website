import type { HealthCheck } from '../types/donation';
import {apiClient } from './apiClient';
import type {ApiResponse } from './apiClient';
export const fetchHealthCheck = async (healthCheckId: string): Promise<HealthCheck> => {
  const res = await apiClient.get<ApiResponse<HealthCheck>>(
    `/health-checks/${healthCheckId}`
  );
  return res.data.result;
};

export const updateHealthCheck = async (
  id: string,
  payload: Partial<
    Pick<
      HealthCheck,
      | 'blood_group_id'
      | 'weight'
      | 'temperature'
      | 'heart_rate'
      | 'diastolic_blood_pressure'
      | 'systolic_blood_pressure'
      | 'hemoglobin'
      | 'underlying_health_conditions'
      | 'description'
      | 'status'
      | 'donation_type'
    >
  >
): Promise<HealthCheck> => {
  const res = await apiClient.patch<ApiResponse<HealthCheck>>(
    `/health-checks/${id}`,
    payload
  );
  console.log("check update health check");
  return res.data.result;
};
