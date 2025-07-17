import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface StaffItemProps {
  full_name: string;
  _id: string;
  role: string;
  phone: string;
  avatar_url: string;
  bgColor: string;
  status: number;
}

export interface Staff {
  _id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  role: string;
  gender: string;
  phone: string;
  avatar_url: string;
  status: number;
}


export const fetchStaffList = createAsyncThunk<
  StaffItemProps[],
  void,
  { rejectValue: string }
>(
  "staffList/fetchStaffList",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/staffList.json");
      
      // Kiểm tra xem response trả về có thành công không
      if (!response.ok) {
        console.error("fetchStaffList: HTTP error", response.status);
        return thunkAPI.rejectWithValue("Failed to fetch staff list");
      }

      const staffList: Staff[] = await response.json();

      // Kiểm tra kiểu dữ liệu trả về
      if (!Array.isArray(staffList)) {
        console.error("fetchStaffList: invalid data format", staffList);
        return thunkAPI.rejectWithValue("Invalid data format");
      }

      // Map dữ liệu full Staff thành StaffItemProps (chỉ lấy trường cần thiết + bgColor)
      const mappedStaffList: StaffItemProps[] = staffList.map((staff) => {
        let bgColor = "#f3f4f6"; // default

        if (staff.status === 0) bgColor = "#dbeafe";
        else if (staff.status === 1) bgColor = "#d1fae5";
        else if (staff.status === 2) bgColor = "#fee2e2";

        return {
          _id: staff._id,
          full_name: staff.full_name,
          role: staff.role,
          phone: staff.phone,
          avatar_url: staff.avatar_url,
          status: staff.status,
          bgColor,
        };
      });

      return mappedStaffList;
    } catch (error) {
      console.error("fetchStaffList error:", error);
      return thunkAPI.rejectWithValue("Failed to fetch staff list");
    }
  }
);

interface StaffListState {
  staffList: StaffItemProps[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffListState = {
  staffList: [],
  loading: false,
  error: null,
};

const staffListSlice = createSlice({
  name: "staffList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffList.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("staffListSlice: fetchStaffList.pending");
      })
      .addCase(
        fetchStaffList.fulfilled,
        (state, action: PayloadAction<StaffItemProps[]>) => {
          state.loading = false;
          state.staffList = action.payload;
          console.log("staffListSlice: fetchStaffList.fulfilled", action.payload);
        }
      )
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        console.error("staffListSlice: fetchStaffList.rejected", action.payload);
      });
  },
});

export default staffListSlice.reducer;
