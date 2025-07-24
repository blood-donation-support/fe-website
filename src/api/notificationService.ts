import { apiClient } from './apiClient';

export type Notification = {
  _id: string;
  receiver_id: string;
  title: string;
  message: string;
  donation_registration_id?: string;
  is_read: boolean;
  created_at: string;
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await apiClient.get<{ result: Notification[] }>('/notifications/user');
  return res.data.result;
};
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const res = await apiClient.patch<{ result: Notification }>(`/notifications/${id}/read`);
  return res.data.result;
};

export const markAllNotificationsAsRead = async (): Promise<Notification[]> => {
  const res = await apiClient.patch<{ result: Notification[] }>('/notifications/user/read-all');
  return res.data.result;
};