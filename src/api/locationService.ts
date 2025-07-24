import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';
import type { Location } from '@/types/location';

export const FindUserByLocation = async (payload: Location): Promise<Location> => {
    const res = await apiClient.post<ApiResponse<Location>>('/locations/find-compatible-donors', payload);
    return res.data.result;
};
