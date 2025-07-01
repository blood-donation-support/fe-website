import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching total donations
export const fetchTotalDonations = createAsyncThunk(
  'donations/fetchTotalDonations',
  async () => {
    const response = await fetch('/data/donations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch donations data');
    }
    return response.json();
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTotalDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default donationSlice.reducer;