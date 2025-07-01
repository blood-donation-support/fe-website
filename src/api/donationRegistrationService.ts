import apiClient from './apiClient';
import type { DonationRegistration } from '../types/donation';

export interface ApiResponse<T> {
  message: string;
  result: T;
}

export const fetchDonationRegistrations = async (): Promise<DonationRegistration[]> => {
  console.log("call nè");
  const res = await apiClient.get<ApiResponse<DonationRegistration[]>>('/donations/donation-registrations');
  console.log(res);
  console.log(res.data.result);
return res.data.result;
};

export const updateDonationRegistration = async (
  id: string,
  payload: Pick<DonationRegistration, 'blood_group_id' | 'blood_component_id' | 'start_date_donation' | 'status'>
): Promise<DonationRegistration> => {
  const res = await apiClient.patch<ApiResponse<DonationRegistration>>(
    `/donations/donation-registrations/${id}`, 
    payload
  );
  return res.data.result;  
};
export const checkInDonationRegistration = async (
  id: string,
  status: string
): Promise<DonationRegistration> => {
  const res = await apiClient.patch<ApiResponse<DonationRegistration>>(
    `/donations/donation-registrations/${id}`,
    { status }
  );
  return res.data.result;
};
