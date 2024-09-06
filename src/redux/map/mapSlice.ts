import { createSlice } from "@reduxjs/toolkit";
import type { Region } from "react-native-maps";

export const MAP_REDUCER_KEY = "map";
const initialState = {
  region: null as Region | null,
};

export const mapSlice = createSlice({
  name: MAP_REDUCER_KEY,

  initialState,
  reducers: {
    setRegion: (state, action) => ({
      ...state,
      region: action.payload,
    }),
    clearRegion: (state) => {
      state.region = null;
    },
    clearState: (state) => {
      return initialState;
    },
  },
});
