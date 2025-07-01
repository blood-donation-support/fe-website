import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching best blood type
export const fetchBestBloodType = createAsyncThunk(
  'bestBloodType/fetchBestBloodType',
  async () => {
    const response = await fetch('/data/bestBloodType.json');
    if (!response.ok) {
      throw new Error('Failed to fetch best blood type data');
    }
    return response.json();
  }
);

const bestBloodTypeSlice = createSlice({
  name: 'bestBloodType',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestBloodType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestBloodType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBestBloodType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bestBloodTypeSlice.reducer;