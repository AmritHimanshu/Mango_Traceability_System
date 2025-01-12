import { IUserState, userSchema } from "@/utils/Types/interfaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


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
