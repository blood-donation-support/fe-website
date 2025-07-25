// donationHealthProcessSlice.ts
import { getDonationHealthProcess, type DonationHealthProcess } from "@/api/donationHealthProcessService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface DonationHealthProcessState {
  loadingHealthProcess: boolean; // Đang tải dữ liệu chi tiết
  error: string | null;
  donationHealthProcess: DonationHealthProcess | null;
}

const initialState: DonationHealthProcessState = {
  loadingHealthProcess: false,
  error: null,
  donationHealthProcess: null,
};

// Async thunk để lấy thông tin chi tiết
export const fetchDonationHealthProcess = createAsyncThunk(
  "donationHealthProcess/fetchDonationHealthProcess",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getDonationHealthProcess(id); // Gọi API để lấy chi tiết
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi khi lấy thông tin chi tiết.");
    }
  }
);

const donationHealthProcessSlice = createSlice({
  name: "donationHealthProcess",
  initialState,
  reducers: {
    resetHealthProcess: (state) => {
      state.donationHealthProcess = null;
      state.error = null;
      state.loadingHealthProcess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonationHealthProcess.pending, (state) => {
        state.loadingHealthProcess = true;
        state.error = null;
      })
      .addCase(fetchDonationHealthProcess.fulfilled, (state, action) => {
        state.loadingHealthProcess = false;
        state.donationHealthProcess = action.payload;
      })
      .addCase(fetchDonationHealthProcess.rejected, (state, action) => {
        state.loadingHealthProcess = false;
        // Gán error là chuỗi hợp lệ
        state.error = action.payload ? (action.payload as string) : "Lỗi khi lấy thông tin chi tiết";
      });
  },
});

export const { resetHealthProcess } = donationHealthProcessSlice.actions;
export default donationHealthProcessSlice.reducer;
