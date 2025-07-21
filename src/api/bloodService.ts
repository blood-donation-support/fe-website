// export interface BloodGroup {
//   _id: string;
//   name: string;
//   created_at?: string;
//   updated_at?: string;
// }

const API_URL = "https://be-t8i8.onrender.com/api";

import axios from 'axios';
import {apiClient } from './apiClient';
import type {ApiResponse } from './apiClient';
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

const API_URL = "https://be-t8i8.onrender.com/api";
export const bloodService = {
  getBloodGroups: async (): Promise<BloodGroup[]> => {
    const res = await axios.get(`${API_URL}/bloods/blood-groups`);
    return res.data.result as BloodGroup[];
  },
  getBloodComponents: async (): Promise<BloodComponent[]> => {
    const res = await axios.get(`${API_URL}/bloods/blood-components`);
    return res.data.result as BloodComponent[];
  },
};

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


/**
 * Tạo nhóm máu
 */
export const createBloodGroups = async (name: string): Promise<BloodGroup> => {
  const res = await apiClient.post<ApiResponse<BloodGroup>>(
    '/bloods/blood-groups',
    { name }
  );
  return res.data.result;
};

/**
 * Tạo thành phần máu
 */
export const createBloodComponents = async (name: string): Promise<BloodComponent> => {
  const res = await apiClient.post<ApiResponse<BloodComponent>>(
    '/bloods/blood-components',
    { name }
  );
  return res.data.result;
};


export interface BloodUnit {
  _id: string;
  donation_process_id: string;
  request_process_id: string;
  blood_group_id: string;
  blood_group_name: string;
  citizen_id_number: string;
  blood_component_name: string;
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

