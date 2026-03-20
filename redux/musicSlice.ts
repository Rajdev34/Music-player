import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Track } from "@/types/track";
type FetchTracksParams = {
  query?: string;
  offset?: number;
  limit?: number;
};

type MusicState = {
  tracks: Track[];
  currentIndex: number;
  loading: boolean;
  isPlaying: boolean;
};

const initialState: MusicState = {
  tracks: [],
  currentIndex: 0,
  loading: false,
  isPlaying: false,
};

export const fetchTracks = createAsyncThunk<
  Track[], // return type
  FetchTracksParams // arg type
  >(
  "music/fetchTracks",
  async (params = {}) => { 
    const { query = "", offset = 0, limit = 20 } = params;

    const url = new URL("/api/music", location.origin);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("offset", (params.offset || 0).toString());

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "API error");

    return data.tracks;
  }
);

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextTrack: (state) => {
      state.currentIndex =
        (state.currentIndex + 1) % state.tracks.length;
    },
    prevTrack: (state) => {
      state.currentIndex =
        state.currentIndex === 0
          ? state.tracks.length - 1
          : state.currentIndex - 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        const offset = action.meta.arg?.offset || 0;
        if(offset>0){
          const newTracks = action.payload;
          const uniqueTracks = newTracks.filter((newTrack) => {
            return !state.tracks.some((existingTrack) => existingTrack.id === newTrack.id);
          });
        state.tracks = [...state.tracks, ...uniqueTracks];
        }
        else{
          state.tracks= action.payload;
        }
        state.loading= false;
      })
      .addCase(fetchTracks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCurrentIndex, togglePlayPause, nextTrack, prevTrack } =
  musicSlice.actions;

export default musicSlice.reducer;