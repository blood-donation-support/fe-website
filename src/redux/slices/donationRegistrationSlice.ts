import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDonationRegistrationsByUser, registerDonation, type DonationRegistrationPayload } from "@/api/donationService"; // Import trực tiếp hàm từ service
import type { DonationRegistration } from "@/types/donation";

interface DonationRegistrationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  donationRegistrations: DonationRegistration[]; // Thêm thuộc tính donationRegistrations
}

const initialState: DonationRegistrationState = {
  loading: false,
  error: null,
  success: false,
  donationRegistrations: [], // Khởi tạo danh sách đơn yêu cầu hiến máu rỗng
};

// Async thunk cho đăng ký hiến máu
export const registerDonationThunk = createAsyncThunk<
  any, // Tạm thời để là any, bạn có thể thay bằng kiểu trả về chính xác
  { payload: DonationRegistrationPayload; accessToken: string },
  { rejectValue: string }
>(
  "donation/registerDonation",
  async ({ payload, accessToken }, { rejectWithValue }) => {
    try {
      const data = await registerDonation(payload, accessToken); // Gọi trực tiếp hàm từ service
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Đăng ký hiến máu thất bại"
      );
    }
  }
);

export const fetchDonationRegistrationsByUser = createAsyncThunk(
  "donation/fetchDonationRegistrationsByUser",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const data = await getDonationRegistrationsByUser(accessToken); // Gọi API từ donationService
      return data; // Trả về dữ liệu từ API
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Lỗi khi tải dữ liệu yêu cầu hiến máu"
      );
    }
  }
);

const donationRegistrationSlice = createSlice({
  name: "donationRegistration",
  initialState,
  reducers: {
    resetDonationStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDonationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerDonationThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerDonationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký hiến máu thất bại";
        state.success = false;
      })
      .addCase(fetchDonationRegistrationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonationRegistrationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.donationRegistrations = action.payload; // Cập nhật danh sách đơn yêu cầu hiến máu
      })
      .addCase(fetchDonationRegistrationsByUser.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { resetDonationStatus } = donationRegistrationSlice.actions;
export default donationRegistrationSlice.reducer;
