import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";
import { getUserArtworks } from "utils/getData";

interface UserSliceState {
  name: string;
  first_name?: string;
  last_name?: string;
  username: string;
  uid: string;
  userImage: string;
  userEmail: string;
  provider: string;
  locale?: string;
  signedIn: boolean;
  userLoading: boolean;
  artworksSaved: ArtworkProps[];
  artworksPosted: ArtworkProps[];
  artworksLoading: boolean;
}

const initialState: UserSliceState = {
  name: "",
  username: "",
  uid: "",
  userImage: "",
  userEmail: "",
  provider: "",
  signedIn: false,
  userLoading: true,
  artworksSaved: [],
  artworksPosted: [],
  artworksLoading: true,
};

export const fetchUserArtworks = createAsyncThunk(
  "user/fetchUserArtworks",
  getUserArtworks
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<UserSliceState>) => {
      return { ...state, ...action.payload };
    },
    signOut: () => {
      return initialState;
    },
    userLoaded: () => {
      const loadingState = { ...initialState };
      loadingState.userLoading = false;
      return loadingState;
    },
    sortArtworksSavedByUploadDate: (state, action: PayloadAction<boolean>) => {
      let sortedArtworks = [...state.artworksSaved];
      if (action.payload) {
        state.artworksSaved = sortedArtworks.sort(
          (a, b) => a.dateUploadedNumber - b.dateUploadedNumber
        );
      } else {
        state.artworksSaved = sortedArtworks.sort(
          (a, b) => b.dateUploadedNumber - a.dateUploadedNumber
        );
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserArtworks.fulfilled, (state, action) => {
      const existingArtworksSaved: ArtworkProps[] = [];
      // const existingArtworksSaved = state.artworksSaved;
      const existingArtworksPosted: ArtworkProps[] = [];
      // const existingArtworksPosted = state.artworksPosted;
      action.payload.data.forEach((artwork: IArtwork) => {
        if (artwork.posted) {
          existingArtworksPosted.push({
            _id: artwork._id,
            title: artwork.title,
            images: artwork.images,
            posted: artwork.posted,
            tags: artwork.tags,
            uid: artwork.uid,
            name: artwork.name,
            userImage: artwork.userImage,
            userEmail: artwork.userEmail,
            username: artwork.username,
            isMaker: artwork.isMaker,
            isForSale: artwork.isForSale,
            views: artwork.views,
            likes: artwork.likes ? artwork.likes : [],
            comments: artwork.comments ? artwork.comments : [],
            price: artwork.price,
            comment: artwork.comment,
            dateUploaded: artwork.dateUploaded,
            dateUploadedNumber: artwork.dateUploadedNumber,
            aid: artwork._id,
          });
        } else {
          existingArtworksSaved.push({
            _id: artwork._id,
            title: artwork.title,
            images: artwork.images,
            posted: artwork.posted,
            tags: artwork.tags,
            uid: artwork.uid,
            name: artwork.name,
            userImage: artwork.userImage,
            userEmail: artwork.userEmail,
            username: artwork.username,
            isMaker: artwork.isMaker,
            isForSale: artwork.isForSale,
            views: artwork.views,
            likes: artwork.likes ? artwork.likes : [],
            comments: artwork.comments ? artwork.comments : [],
            price: artwork.price,
            comment: artwork.comment,
            dateUploaded: artwork.dateUploaded,
            dateUploadedNumber: artwork.dateUploadedNumber,
            aid: artwork._id,
          });
        }
      });
      state.artworksSaved = existingArtworksSaved;
      state.artworksPosted = existingArtworksPosted;
      state.artworksLoading = false;
    });
  },
});

export const { signIn, signOut, userLoaded, sortArtworksSavedByUploadDate } =
  userSlice.actions;
export default userSlice.reducer;
export const findUser = (state: RootState) => state.user;
