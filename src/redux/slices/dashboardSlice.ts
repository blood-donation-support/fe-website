// dashboardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBloodStockSummary, fetchNumberOfUsers, fetchNumberOfRequests, fetchNumberOfDonations } from '@/api/dashboardService'; // Đảm bảo đã import đúng các API functions

// Define the interface for the state of the dashboard
export interface BloodComponent {
  blood_component_name: string;
  total_units: number;
  total_volume: number;
}

export interface BloodStockSummary {
  [key: string]: BloodComponent;  // Specify that bloodStockSummary will have keys with values of BloodComponent type
}

export interface DashboardState {
  bloodStockSummary: BloodStockSummary;  // Ensure correct typing here
  numberOfUsers: number;
  numberOfRequests: number;
  numberOfDonations: number;
  loading: boolean;
  error: string | null;
}
const initialState: DashboardState = {
  bloodStockSummary: {},
  numberOfUsers: 0,
  numberOfRequests: 0,
  numberOfDonations: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching the blood stock summary
export const fetchBloodStock = createAsyncThunk(
  'dashboard/fetchBloodStock',
  async () => {
    const data = await fetchBloodStockSummary(); // Gọi hàm API từ service
    return data;
  }
);

// Async thunk for fetching the number of users
export const fetchNumberOfUsersThunk = createAsyncThunk(
  'dashboard/fetchNumberOfUsers',
  async () => {
    const response = await fetchNumberOfUsers(); // Gọi hàm API từ service
    return response;
  }
);

// Async thunk for fetching the number of requests
export const fetchNumberOfRequestsThunk = createAsyncThunk(
  'dashboard/fetchNumberOfRequests',
  async () => {
    const response = await fetchNumberOfRequests(); // Gọi hàm API từ service
    return response;
  }
);

// Async thunk for fetching the number of donations
export const fetchNumberOfDonationsThunk = createAsyncThunk(
  'dashboard/fetchNumberOfDonations',
  async () => {
    const response = await fetchNumberOfDonations(); // Gọi hàm API từ service
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Blood Stock Summary
      .addCase(fetchBloodStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBloodStock.fulfilled, (state, action) => {
        state.loading = false;
        state.bloodStockSummary = action.payload;
      })
      .addCase(fetchBloodStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải thông tin lượng máu.';
      })
      
      // Fetch Number of Users
      .addCase(fetchNumberOfUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumberOfUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.numberOfUsers = action.payload;
      })
      .addCase(fetchNumberOfUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải số lượng người dùng.';
      })

      // Fetch Number of Requests
      .addCase(fetchNumberOfRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumberOfRequestsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.numberOfRequests = action.payload;
      })
      .addCase(fetchNumberOfRequestsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải số lượng yêu cầu.';
      })

      // Fetch Number of Donations
      .addCase(fetchNumberOfDonationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNumberOfDonationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.numberOfDonations = action.payload;
      })
      .addCase(fetchNumberOfDonationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Lỗi khi tải số lượng hiến máu.';
      });
  }
});

export default dashboardSlice.reducer;
