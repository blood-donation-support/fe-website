import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "@/api/userService";

export interface UserProfile {
    _id: string;
    full_name: string;
    email: string;
    date_of_birth: string; 
    role: "Admin" | "Staff" | "Staff-Warehouse" | string;
    gender: "Male" | "Female" | "Other" | string;
    citizen_id_number: string;
    blood_group_id: string | null;
    number_of_donations: number;
    number_of_requests: number;
    weight: number;
    location: string;
    phone: string;
    address: string;
    avatar_url: string;
    created_at: string; 
    updated_at: string; 
    blood_group: {
        name: string;
    } | null;
}

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunk để lấy profile
export const fetchUserProfile = createAsyncThunk<UserProfile>(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getProfile();
      return user;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Không lấy được thông tin user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = (action.payload as string) || "Lỗi lấy user";
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
