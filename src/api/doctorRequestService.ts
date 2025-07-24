import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';

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
  full_name?: string;
  blood_group_name?: string;
  phone: string;
  citizen_id_number: string;
  health_check_status:string;
}
export interface DoctorRequestForm {
  patient_code: string;
  citizen_id_number: string;
  full_name: string;
  phone: string;
  bloodGroupName: string;
  request_type: string;
  receive_date_request: string;
  is_emergency: boolean;
  image: string;
  note: string;
}

export interface RequestProcessDetail {

  id: string;
  request_process_id: string;
  blood_component_id: string;
  blood_group_id: string;
  volume_required: number;
  status: string;
  blood_group_name: string;
  blood_component_name: string;

}
export interface RequestProcessDetailPayLoad {

  blood_component_id: string;
  volume_required: number;
  status: "Pending";

}
export interface RequestProcessBlood {
  blood_component_id: string;
  blood_group_id: string;
  volume: number;
  status: string;
  updated_at: Date;
  blood_group_name: string;
  blood_component_name: string;
  blood_unit_id: string;
}
export interface RequestProcessBloodPayLoad {
  blood_unit_id: string;
  status: string;
  blood_component_id: string;
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


// lấy dữ liệu máu và unit cần truyền máu
export const fetchRequestProcessDetail = async (
  id: string
): Promise<RequestProcessDetail[]> => {
  const res = await apiClient.get<ApiResponse<RequestProcessDetail[]>>(
    `/requests/request-process-details/${id}`
  );
  console.log("res", res);

  return res.data.result;
};

//update unit để của người xin máu khi xin máu
export const updateRequestProcessDetail = async (
  id: string,
  payload: RequestProcessDetailPayLoad[]
): Promise<RequestProcessDetailPayLoad[]> => {
  const res = await apiClient.patch<ApiResponse<RequestProcessDetailPayLoad[]>>(
    `/requests/request-process-details/${id}`, payload

  );
  return res.data.result;
};

// danh sách máu phù hợp với người xin máu
export const fetchRequestProcessBlood = async (
  id: string
): Promise<RequestProcessBlood[]> => {
  const res = await apiClient.get<ApiResponse<RequestProcessBlood[]>>(
    `/requests/request-process-bloods/${id}`
  );
  console.log("res", res);

  return res.data.result;
};
//chọn túi máu phù hợp để xin máu
export const updateRequestProcessBloodAPI = async (
  id: string,
  payload: RequestProcessBloodPayLoad[]
): Promise<RequestProcessBloodPayLoad[]> => {
  const res = await apiClient.patch<ApiResponse<RequestProcessBloodPayLoad[]>>(
    `/requests/request-process-bloods/${id}`, payload

  );
  return res.data.result;
};
//confirm
export const confirmRequestProcessBloodAPI = async (
  id: string,
): Promise<RequestProcessBloodPayLoad[]> => {
  const res = await apiClient.patch<ApiResponse<RequestProcessBloodPayLoad[]>>(
    `/requests/request-process-bloods/${id}/confirm`,

  );
  return res.data.result;
};
