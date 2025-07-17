import { apiClient } from "./apiClient"; // Import apiClient
import type { ApiResponse } from "./apiClient"; // Kiểu dữ liệu trả về
import type { DonationRegistration } from "../types/donation"; // Kiểu đơn yêu cầu hiến máu

// Định nghĩa kiểu cho payload khi đăng ký hiến máu
export interface DonationRegistrationPayload {
  blood_group_id: string;
  donation_type: string;
  start_date_donation: string;
}

// Hàm đăng ký hiến máu
export const registerDonation = async (
  payload: DonationRegistrationPayload,
  accessToken: string // Thêm accessToken để gửi qua header
): Promise<DonationRegistration> => {
  const res = await apiClient.post<ApiResponse<DonationRegistration>>(
    "/donations/donation-registrations", // Endpoint API
    payload, // Payload chứa thông tin đơn hiến máu
    {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Gửi token trong header
      },
    }
  );
  return res.data.result; // Trả về kết quả từ API
};
export const getDonationRegistrationsByUser = async (accessToken: string): Promise<DonationRegistration[]> => {
  const res = await apiClient.get<ApiResponse<DonationRegistration[]>>('/donations/donation-registrations/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Thêm token vào header
    },
  });
  return res.data.result; // Trả về danh sách các đơn yêu cầu hiến máu
};