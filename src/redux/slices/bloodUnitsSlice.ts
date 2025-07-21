import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching total blood units
export const fetchTotalBloodUnits = createAsyncThunk(
  'bloodUnits/fetchTotalBloodUnits',
  async () => {
    const response = await fetch('/data/bloodUnits.json');
    if (!response.ok) {
      throw new Error('Failed to fetch blood units data');
    }
    return response.json();
  }
);

const bloodUnitsSlice = createSlice({
  name: 'bloodUnits',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalBloodUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalBloodUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTotalBloodUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bloodUnitsSlice.reducer;
