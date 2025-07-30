import type { HealthCheck } from "../types/donation";
import { apiClient } from "./apiClient";
import type { ApiResponse } from "./apiClient";
export const fetchHealthCheck = async (
	healthCheckId: string,
): Promise<HealthCheck> => {
	const res = await apiClient.get<ApiResponse<HealthCheck>>(
		`/health-checks/${healthCheckId}`,
	);
	return res.data.result;
};

export const updateHealthCheckDonation = async (
	id: string,
	payload: Partial<
		Pick<
			HealthCheck,
			| "blood_group_id"
			| "weight"
			| "temperature"
			| "heart_rate"
			| "diastolic_blood_pressure"
			| "systolic_blood_pressure"
			| "hemoglobin"
			| "underlying_health_conditions"
			| "description"
			| "status"
			| "donation_type"
		>
	>,
): Promise<HealthCheck> => {
	const res = await apiClient.patch<ApiResponse<HealthCheck>>(
		`/health-checks/${id}`,
		payload,
	);
	console.log("check update health check");
	return res.data.result;
};

export interface HealthCheckUpdatePayload {
	blood_group_id: string;
	request_type: string;
	weight: number;
	temperature: number;
	heart_rate: number;
	diastolic_blood_pressure: number;
	systolic_blood_pressure: number;
	hemoglobin: number;
	underlying_health_conditions: string[];
	description: string;
	status: string;
	donation_type: string;
}

// Update health check
export const updateHealthCheck = async (
	id: string,
	payload: HealthCheckUpdatePayload,
): Promise<HealthCheck> => {
	const res = await apiClient.patch<ApiResponse<HealthCheck>>(
		`/health-checks/${id}`,
		payload,
	);
	return res.data.result;
};
