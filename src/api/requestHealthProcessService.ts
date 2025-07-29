import { apiClient, type ApiResponse } from "./apiClient";


export interface RequestHealthProcess {
    _id: string;
    user_id: string;
    request_process_id: string;
    health_check_id: string;
    status: string;
    receive_date_request: string;
    is_emergency: boolean;
    image?: string;
    created_at: string;
    weight: number;
    temperature: number;
    heart_rate: number;
    systolic_blood_pressure: number;
    diastolic_blood_pressure: number;
    underlying_health_condition: string[] | null;
    hemoglobin: number;
    description: string;
    blood_group: string;
    blood_components: string[];

}

// list Get Request - Health - Process By Request Id
export const fetchRequestHealthProcess = async (request_registration_id: string): Promise<RequestHealthProcess[]> => {
    const res = await apiClient.get<ApiResponse<RequestHealthProcess[]>>(

        `/requests/request-health-process/${request_registration_id}`
    );
    return res.data.result;
};