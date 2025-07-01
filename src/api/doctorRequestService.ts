import apiClient from './apiClient';

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
}

export interface ApiResponse<T> {
  message: string;
  result: T;
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

export interface BloodGroup {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BloodComponent {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Lấy danh sách nhóm máu từ BE
 */
export const fetchBloodGroups = async (): Promise<BloodGroup[]> => {
  const res = await apiClient.get<ApiResponse<BloodGroup[]>>(
    '/bloods/blood-groups'
  );
  return res.data.result;
};

/**
 * Lấy danh sách thành phần máu từ BE
 */
export const fetchBloodComponents = async (): Promise<BloodComponent[]> => {
  const res = await apiClient.get<ApiResponse<BloodComponent[]>>(
    '/bloods/blood-components'
  );
  return res.data.result;
};

/**
 * Lấy ID nhóm máu theo tên
 */
export const getBloodGroupIdByName = async (
  name: string
): Promise<string | undefined> => {
  const groups = await fetchBloodGroups();
  const found = groups.find(g => g.name === name);
  return found?._id;
};

/**
 * Lấy ID thành phần máu theo tên
 */
export const getBloodComponentIdByName = async (
  name: string
): Promise<string | undefined> => {
  const comps = await fetchBloodComponents();
  // Try exact match first
  let found = comps.find(c => c.name === name);
  if (!found) {
    // Fallback: case-insensitive partial match
    const lower = name.toLowerCase();
    found = comps.find(c => c.name.toLowerCase().includes(lower));
  }
  return found?._id;
};


export interface BloodUnit {
  _id: string;
  donation_process_id: string;
  request_process_id: string;
  blood_group_id: string;
  blood_group_name: string;
  citizen_id_number: string;
  blood_components_name: string[];
  blood_component_id: string;
  volume: number;
  status: string | null;
  updated_by: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Lấy tất cả blood units theo nhóm máu và thành phần máu
 */
export const fetchBloodUnits = async (
  bloodGroupId: string,
  bloodComponentId: string
): Promise<BloodUnit[]> => {
  const res = await apiClient.get<ApiResponse<BloodUnit[]>>(
    `/blood-units/${bloodGroupId}/${bloodComponentId}`
  );
  return res.data.result;
};
