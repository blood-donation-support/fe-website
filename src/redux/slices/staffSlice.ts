import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching total staff
export const fetchTotalStaff = createAsyncThunk(
  'staff/fetchTotalStaff',
  async () => {
    const response = await fetch('/data/staff.json');
    if (!response.ok) {
      throw new Error('Failed to fetch staff data');
    }
    return response.json();
  }
);

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTotalStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default staffSlice.reducer;