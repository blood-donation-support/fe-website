import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWarehouseOverview } from "@/api/warehouse"; 
import type { WarehouseOverview } from "@/types/warehouse";

interface WarehouseState {
  data?: WarehouseOverview;
  loading: boolean;
  error?: string;
}

const initialState: WarehouseState = {
  data: undefined,
  loading: false,
  error: undefined,
};

export const loadWarehouseOverview = createAsyncThunk<
  WarehouseOverview,
  void
>(
  "warehouseOverview/load",
  async () => {
    return await fetchWarehouseOverview();
  }
);

const warehouseOverviewSlice = createSlice({
  name: "warehouseOverview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWarehouseOverview.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadWarehouseOverview.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
      })
      .addCase(loadWarehouseOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default warehouseOverviewSlice.reducer;
