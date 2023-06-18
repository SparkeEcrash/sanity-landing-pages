import { RootState } from "@redux/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ArtworksSliceState {
  showModal: boolean;
}

const initialState: ArtworksSliceState = {
  showModal: false,
};

const artworksSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const {
  setShowModal,
} = artworksSlice.actions;
export default artworksSlice.reducer;
export const getArtworks = (state: RootState) => state.artworks;
