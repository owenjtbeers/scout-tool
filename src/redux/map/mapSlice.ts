import { createSlice } from "@reduxjs/toolkit";
import type { Region } from "react-native-maps";

export const MAP_REDUCER_KEY = "map";
export const mapSlice = createSlice({
  name: MAP_REDUCER_KEY,

  initialState: {
    // Not intended to reflect the current region of the map, but
    // so we can save the region when the map is unmounted, and then initialize
    // the map with the same region when it is mounted again.
    region: null as Region | null,
  },
  reducers: {
    setRegion: (state, action) => {
      console.log("setRegion", action.payload);
      state.region = action.payload;
    },
    clearRegion: (state) => {
      state.region = null;
    },
  },
});
