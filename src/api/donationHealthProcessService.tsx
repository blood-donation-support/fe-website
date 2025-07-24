import { apiClient, type ApiResponse } from "./apiClient"; 
export interface DonationHealthProcess {
  _id: string;
  user_id: string;
  donation_process_id: string;
  health_check_id: string;
  status: string;
  start_date_donation: string;
  donation_registration_id: string;
  weight: number;
  temperature: number;
  heart_rate: number;
  systolic_blood_pressure: number;
  diastolic_blood_pressure: number;
  underlying_health_condition: string[] | null;
  hemoglobin: number;
  description: string;
  volume_collected: number;
  donation_date: string;
  blood_group: string;
}
export const getDonationHealthProcess = async (donationId: string): Promise<DonationHealthProcess> => {
  const res = await apiClient.get<ApiResponse<DonationHealthProcess>>(
    `/donations/donation-health-process/${donationId}`
  );
  return res.data.result; 
};
