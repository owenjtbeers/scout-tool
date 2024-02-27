import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ScoutingAppUser } from './types';

interface UserState {
  currentUser: ScoutingAppUser | null;
  token: string | null;
}

const initialState: UserState = {
  currentUser: null,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<ScoutingAppUser>) => {
      state.currentUser = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      console.log('Setting token', action.payload)
      state.token = action.payload;
    }
  },
});

export const { setCurrentUser } = userSlice.actions;
