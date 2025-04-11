import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementUnread: (state) => {
      state.unreadCount += 1;
    },
    resetUnread: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { incrementUnread, resetUnread } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
