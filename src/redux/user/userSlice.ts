import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ScoutingAppUser } from "./types";
import { baseApi } from "../baseApi";

interface UserState {
  currentUser: ScoutingAppUser | null;
  token: string | null;
}

const initialState: UserState = {
  currentUser: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<ScoutingAppUser>) => {
      state.currentUser = action.payload;
      return state;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      return state;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      return state;
    },
    clearState: (state) => {
      return initialState;
    }
  },
});

export const { setCurrentUser } = userSlice.actions;
