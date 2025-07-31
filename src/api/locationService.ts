import { apiClient } from './apiClient';
import type { ApiResponse } from './apiClient';
import type { Location } from '@/types/location';

export const FindUserByLocation = async (payload: Location): Promise<Location> => {
    const res = await apiClient.post<ApiResponse<Location>>('/locations/find-compatible-donors', payload);
    return res.data.result;
};


import axios from 'axios';

const API_KEY = 'pk.5c2de160686b48739eeb7bdc3b664aa9';

export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${encodeURIComponent(
        address
      )}&format=json`
    );
    const location = response.data[0];
    return {
      lat: location.lat,
      lon: location.lon,
      display_name: location.display_name,
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
    );
    return response.data.display_name;
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
};

// Thêm vào LocationService.js
export const searchLocationSuggestions = async (query, countryCode = 'vn') => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}&format=json&limit=5&countrycodes=${countryCode}`
    );
    
    return response.data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      place_id: item.place_id,
      type: item.type,
      importance: item.importance
    }));
  } catch (error) {
    console.error('Error searching location suggestions:', error);
    return [];
  }
};

// Validate if address exists in LocationIQ
export const validateAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );
    return response.data.length > 0;
  } catch (error) {
    console.error('Error validating address:', error);
    return false;
  }
};

