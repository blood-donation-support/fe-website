import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching total users
export const fetchTotalUsers = createAsyncThunk(
  'users/fetchTotalUsers',
  async () => {
    const response = await fetch('/data/users.json');
    if (!response.ok) {
      throw new Error('Failed to fetch users data');
    }
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTotalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;