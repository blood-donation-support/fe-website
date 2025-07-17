import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching best staff
export const fetchBestStaff = createAsyncThunk(
  'bestStaff/fetchBestStaff',
  async () => {
    const response = await fetch('/data/bestStaff.json');
    if (!response.ok) {
      throw new Error('Failed to fetch best staff data');
    }
    return response.json();
  }
);

const bestStaffSlice = createSlice({
  name: 'bestStaff',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBestStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bestStaffSlice.reducer;