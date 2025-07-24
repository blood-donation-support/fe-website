import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead, type Notification } from "@/api/notificationService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface NotificationState {
  list: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  list: [],
  loading: false,
  error: null,
};

// Async thunk để lấy notifications
export const fetchNotiList = createAsyncThunk<Notification[]>(
  "noti/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNotifications();
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Không lấy được thông báo"
      );
    }
  }
);
export const markNotiRead = createAsyncThunk<Notification, string>(
  "noti/markRead",
  async (id, { rejectWithValue }) => {
    try {
      return await markNotificationAsRead(id);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Không đánh dấu được thông báo");
    }
  }
);

export const markAllNotiRead = createAsyncThunk<Notification[]>(
  "noti/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllNotificationsAsRead();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || "Không đánh dấu được tất cả thông báo");
    }
  }
);

const notiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    resetNoti(state) {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
    markAllRead(state) {
    state.list = state.list.map((notification: Notification) => ({
      ...notification,
      is_read: true
    }));
}

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotiList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotiList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchNotiList.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = (action.payload as string) || "Lỗi lấy thông báo";
      })
      .addCase(markNotiRead.fulfilled, (state, action) => {
        const idx = state.list.findIndex(n => n._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(markAllNotiRead.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload)) {
          state.list = state.list.map(notification => ({
            ...notification,
            is_read: true 
          }));
        } else {
          state.error = "Không có thông báo nào để đánh dấu";
        }
      });
  },
});

export const { resetNoti, markAllRead } = notiSlice.actions;
export default notiSlice.reducer;
