import { RootState } from "@redux/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ArtworksSliceState {
  showModal: boolean;
  postedView: boolean;
  filterPosted: number;
  filterSaved: boolean;
}

const initialState: ArtworksSliceState = {
  showModal: false,
  postedView: false,
  filterPosted: 0,
  filterSaved: false,
};

const artworksSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    togglePostedView: (state) => {
      state.postedView = !state.postedView;
    },
    toggleFilterPosted: (state, action: PayloadAction<number>) => {
      state.filterPosted = (state.filterPosted + 1) % 3;
    },
    toggleFilterSaved: (state, action: PayloadAction<boolean>) => {
      state.filterSaved = !state.filterSaved;
    },
  },
  extraReducers(builder) {},
});

export const { setShowModal, togglePostedView, toggleFilterPosted, toggleFilterSaved } =
  artworksSlice.actions;
export default artworksSlice.reducer;
export const getArtworks = (state: RootState) => state.artworks;