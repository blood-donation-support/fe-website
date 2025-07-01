// src/api/donationProcessService.ts
import apiClient from './apiClient';
import type { DonationProcess } from '../types/donation';
import type { ApiResponse } from './donationRegistrationService';

/**
 * Lấy DonationProcess theo đúng donation_process_id
 */
export const fetchDonationProcess = async (
  donationProcessId: string
): Promise<DonationProcess> => {
  const res = await apiClient.get<ApiResponse<DonationProcess>>(
    `/donations/donation-processes/${donationProcessId}`
  );
  return res.data.result;
};

/**
 * Cập nhật các field của DonationProcess
 */
export const updateDonationProcess = async (
  id: string,
  payload: Partial<
    Pick<
      DonationProcess,
      'status' | 'description' | 'donation_date' | 'volume_collected'
    >
  >
): Promise<DonationProcess> => {
  const res = await apiClient.patch<ApiResponse<DonationProcess>>(
    `/donations/donation-processes/${id}`,
    payload
  );
  return res.data.result;
};
