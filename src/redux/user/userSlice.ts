import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ScoutingAppUser, Organization } from "./types";
import { baseApi } from "../baseApi";

interface UserState {
  currentUser: ScoutingAppUser;
  token: string | null;
  hasDismissedWelcomeScreen: boolean;
}

const initialState: UserState = {
  // @ts-expect-error Best to turn this off here, once the user is auth'd this is always here
  currentUser: null,
  token: null,
  hasDismissedWelcomeScreen: false,
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
    updateUserOrganization: (state, action: PayloadAction<Organization>) => {
      if (state.currentUser && state.currentUser.Organization) {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            Organization: action.payload,
          },
        };
      }
      return state;
    },
    setHasDismissedWelcomeScreen: (state, action: PayloadAction<boolean>) => {
      state.hasDismissedWelcomeScreen = action.payload;
      return state;
    },
    logout: (state) => {
      // @ts-expect-error This should only ever be bull if we are logged out
      // And if we are logged out we don't need the current user
      state.currentUser = null;
      state.token = null;
      return state;
    },
    clearState: (state) => {
      return initialState;
    },
  },
});

export const { setCurrentUser, setHasDismissedWelcomeScreen } =
  userSlice.actions;
