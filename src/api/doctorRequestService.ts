import {apiClient } from './apiClient';
import type {ApiResponse } from './apiClient';

export interface DoctorRequestPayload {
  blood_group_id: string;
  blood_component_ids: string[];
  receive_date_request: string; 
  citizen_id_number?: string;
  patient_code?: string;
  is_emergency: boolean;
  full_name: string;
  phone: string;
  image?: string;
  note?: string;
    request_type?: string;

}

export interface DoctorRequest {
  _id: string;
  user_id: string;
  blood_group_id: string;
  blood_component_ids: string[];
  request_process_id: string;
  health_check_id: string;
  receive_date_request: string;
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  is_emergency: boolean;
  updated_by: string;
  note?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  request_type?: string;
}



// Tạo mới một doctor request
export const createDoctorRequest = async (
  payload: DoctorRequestPayload
): Promise<DoctorRequest> => {
  const res = await apiClient.post<ApiResponse<DoctorRequest>>(
    '/requests/request-registrations',
    payload
  );
  return res.data.result;
};

// Lấy danh sách doctor requests
export const fetchDoctorRequests = async (): Promise<DoctorRequest[]> => {
  const res = await apiClient.get<ApiResponse<DoctorRequest[]>>(
    '/requests/request-registrations'
  );
  return res.data.result;
};

// Lấy chi tiết 1 doctor request theo id
export const fetchDoctorRequestById = async (
  id: string
): Promise<DoctorRequest> => {
  const res = await apiClient.get<ApiResponse<DoctorRequest>>(
    `/requests/request-registrations/${id}`
  );
    console.log("fetch image nè", res);

  return res.data.result;
};

// Duyệt & gán nhóm máu cho doctor request
export const approveDoctorRequest = async (
  id: string,
  payload: {
    status: 'Approved' | 'Rejected';
    assigned_blood_group: string;
  }
): Promise<DoctorRequest> => {
  const res = await apiClient.patch<ApiResponse<DoctorRequest>>(
    `/requests/request-registrations/${id}`,
    payload
  );
  return res.data.result;
};
