import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recognized: "",
  pitch: "",
  error: "",
  end: "",
  started: "",
  results: [],
  partialResults: [],
};

export const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    setRecognized: (state, action) => {
      state.recognized = action.payload;
    },
    setPitch: (state, action) => {
      state.pitch = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEnd: (state, action) => {
      state.end = action.payload;
    },
    setStarted: (state, action) => {
      state.started = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setPartialResults: (state, action) => {
      state.partialResults = action.payload;
    },
  },
});

export const {
  setRecognized,
  setPitch,
  setError,
  setEnd,
  setStarted,
  setResults,
  setPartialResults,
} = voiceSlice.actions;

export default voiceSlice.reducer;
