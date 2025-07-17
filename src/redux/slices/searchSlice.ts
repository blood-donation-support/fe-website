import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  staffSearch: string;
  staffStatusFilter: string; // empty string means no filter
}

const initialState: SearchState = {
  staffSearch: "",
  staffStatusFilter: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setStaffSearch(state, action: PayloadAction<string>) {
      state.staffSearch = action.payload;
    },
    setStaffStatusFilter(state, action: PayloadAction<string>) {
      state.staffStatusFilter = action.payload;
    },
  },
});

export const { setStaffSearch, setStaffStatusFilter } = searchSlice.actions;
export default searchSlice.reducer;
