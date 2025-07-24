// src/api/userService.ts
import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';
import type { User, NewUserPayload, ChangePasswordPayload, UpdateProfilePayload  } from '../types/user';
import type { UserProfile } from '@/redux/slices/userSlice';


export const fetchUserAll = async (): Promise<User[]> => {
  const res = await apiClient.get<ApiResponse<User[]>>(`/users`);
  return res.data.result;
};
export const fetchUser = async (): Promise<User> => {
  const res = await apiClient.get<ApiResponse<User>>(`/users/me`);
  return res.data.result;
};

export const deleteUser = async (id: string): Promise<User> => {
  const res = await apiClient.patch<ApiResponse<User>>(`/users/is-active/${id}`);
  return res.data.result;
};

export const createUser = async (
  userData: NewUserPayload
): Promise<User> => {
  const res = await apiClient.post<ApiResponse<User>>(
    `/users/register`,
    userData
  );
  return res.data.result;
};
export const getProfile = async (): Promise<UserProfile> => {
  const res = await apiClient.get<ApiResponse<UserProfile>>(`/users/me`);
  return res.data.result;
}
export const changePassword = async (
  data: ChangePasswordPayload
): Promise<string> => {
  const res = await apiClient.post<ApiResponse<null>>(`/users/change-password`, data);
  return res.data.message; // "Change password success"
};
export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const res = await apiClient.patch<ApiResponse<UserProfile>>('/users/update-me', payload);
  return res.data.result;
};

export const getCCCD = async (id: string): Promise<User> => {
  const res = await apiClient.get<ApiResponse<User>>(
    `users/${id}`

  );
  return res.data.result;
};
