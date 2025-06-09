import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import donationService from "@/api/donationService";
import type { DonationRegistrationPayload } from "@/api/donationService";

interface DonationRegistrationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DonationRegistrationState = {
  loading: false,
  error: null,
  success: false,
};

export const registerDonation = createAsyncThunk<
  any, // từ từ sẽ thay bằng kiểu trả về chính xác
  { payload: DonationRegistrationPayload; accessToken: string },
  { rejectValue: string }
>(
  "donation/registerDonation",
  async ({ payload, accessToken }, { rejectWithValue }) => {
    try {
      const data = await donationService.registerDonation(payload, accessToken);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Đăng ký hiến máu thất bại"
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
      .addCase(registerDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerDonation.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký hiến máu thất bại";
        state.success = false;
      });
  },
});

export const { resetDonationStatus } = donationRegistrationSlice.actions;
export default donationRegistrationSlice.reducer;
