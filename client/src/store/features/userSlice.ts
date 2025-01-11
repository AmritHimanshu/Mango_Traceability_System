import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userSchema {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Farmer";
  isAuthenticated: boolean;
}

export interface IUserState {
  userState: userSchema | null;
}

const initialState: IUserState = {
  userState: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<userSchema>) => {
      state.userState = action.payload;
    },
  },
});

export const { setUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;
