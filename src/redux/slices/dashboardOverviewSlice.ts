import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardOverview } from "@/api/dashboard";
import type { DashboardOverview } from "@/types/dashboard";

interface DashboardState {
  data?: DashboardOverview;
  loading: boolean;
  error?: string;
}

const initialState: DashboardState = {
  data: undefined,
  loading: false,
  error: undefined,
};

export const loadDashboardOverview = createAsyncThunk<
  DashboardOverview,
  void
>(
  "dashboardOverview/load",
  async () => {
    return await fetchDashboardOverview();
  }
);

const dashboardOverviewSlice = createSlice({
  name: "dashboardOverview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadDashboardOverview.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
      })
      .addCase(loadDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardOverviewSlice.reducer;
