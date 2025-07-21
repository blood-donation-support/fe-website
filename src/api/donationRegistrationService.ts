import {apiClient } from './apiClient';
import type {ApiResponse } from './apiClient';
import type { DonationRegistration } from '../types/donation';



export const fetchDonationRegistrations = async (): Promise<DonationRegistration[]> => {
  console.log("call nè");
  const res = await apiClient.get<ApiResponse<DonationRegistration[]>>('/donations/donation-registrations');
  console.log(res);
  console.log(res.data.result);
return res.data.result;
};

export const fetchDonationRegistrationById = async (id: string): Promise<DonationRegistration> => {
  const res = await apiClient.get<ApiResponse<DonationRegistration>>(`/donations/donation-registrations/${id}`);
  return res.data.result;
};
export const updateDonationRegistration = async (
  id: string,
  payload: Pick<DonationRegistration, 'blood_group_id' | 'donation_type' | 'start_date_donation' | 'status'>
): Promise<DonationRegistration> => {
  const res = await apiClient.patch<ApiResponse<DonationRegistration>>(
    `/donations/donation-registrations/${id}`, 
    payload
  );
  return res.data.result;  
};
export const checkInDonationRegistration = async (
  id: string,
  status: string,
  donation_type?: string 
): Promise<DonationRegistration> => {
  const res = await apiClient.patch<ApiResponse<DonationRegistration>>(
    `/donations/donation-registrations/${id}`,
      { status, donation_type }
  );
  console.log("check lại hàm checkin", res.data.result);
  return res.data.result;
};
