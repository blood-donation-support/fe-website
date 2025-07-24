// src/api/userService.ts
import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';
import type { User, NewUserPayload } from '../types/user';

export const fetchUserAll = async (): Promise<User[]> => {
  const res = await apiClient.get<ApiResponse<User[]>>(`/users`);
  return res.data.result;
};
export const fetchUser = async (): Promise<User> => {
  const res = await apiClient.get<ApiResponse<User>>(`/users/me`);
  return res.data.result;
};

export const deleteUser = async (id: string): Promise<User> => {
  const res = await apiClient.delete<ApiResponse<User>>(`/users/${id}`);
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

export const getCCCD = async (id: string): Promise<User> => {
  const res = await apiClient.get<ApiResponse<User>>(
    `users/${id}`

  );
  return res.data.result;
};
