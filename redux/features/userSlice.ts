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
  postedView: boolean;
  filterPosted: string;
  filterSaved: string;
}

export const initialState: UserSliceState = {
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
  postedView: false,
  filterPosted: "Updated",
  filterSaved: "Updated",
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
    togglePostedView: (state) => {
      state.postedView = !state.postedView;
    },
    toggleFilterOptions: (
      state,
      action: PayloadAction<{ value: string; options: string[] }>
    ) => {
      const { value, options } = action.payload;
      const index = action.payload.options.findIndex(
        (option) => option === value
      );
      if (state.postedView) {
        if (index === options.length - 1) {
          state.filterPosted = options[0];
        } else {
          state.filterPosted = options[index + 1];
        }
      } else {
        if (index === options.length - 1) {
          state.filterSaved = options[0];
        } else {
          state.filterSaved = options[index + 1];
        }
      }
    },
    sortArtworksPostedByFilter: (state, action: PayloadAction<string>) => {
      let sortedArtworks = [...state.artworksPosted];
      if (action.payload === "Updated") {
        state.artworksPosted = sortedArtworks.sort(
          (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
        );
      }
      if (action.payload === "Most Liked") {
        state.artworksPosted = sortedArtworks.sort(
          (a, b) => b.likes.length - a.likes.length
        );
      }
      if (action.payload === "Most Viewed") {
        state.artworksPosted = sortedArtworks.sort((a, b) => a.views - b.views);
      }
      if (action.payload === "Alphabetical") {
        state.artworksPosted = sortedArtworks.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      }
    },
    sortArtworksSavedByFilter: (state, action: PayloadAction<string>) => {
      let sortedArtworks = [...state.artworksSaved];
      if (action.payload === "Updated") {
        state.artworksSaved = sortedArtworks.sort(
          (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
        );
      }
      if (action.payload === "Newest") {
        state.artworksSaved = sortedArtworks.sort(
          (a, b) => b.dateUploadedNumber - a.dateUploadedNumber
        );
      }
      if (action.payload === "Oldest") {
        state.artworksSaved = sortedArtworks.sort(
          (a, b) => a.dateUploadedNumber - b.dateUploadedNumber
        );
      }
      if (action.payload === "Alphabetical") {
        state.artworksSaved = sortedArtworks.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserArtworks.fulfilled, (state, action) => {
      const userArtworksSaved: ArtworkProps[] = [];
      // const existingArtworksSaved = state.artworksSaved;
      const userArtworksPosted: ArtworkProps[] = [];
      // const existingArtworksPosted = state.artworksPosted;
      action.payload.data.forEach((artwork: IArtwork) => {
        if (artwork.posted) {
          userArtworksPosted.push({
            _id: artwork._id,
            _updatedAt: artwork._updatedAt,
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
          userArtworksSaved.push({
            _id: artwork._id,
            _updatedAt: artwork._updatedAt,
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

      //sort for intial fetch of saved artworks
      if (state.filterSaved === "Updated") {
        state.artworksSaved = userArtworksSaved.sort(
          (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
        );
      }
      if (state.filterSaved === "Newest") {
        state.artworksSaved = userArtworksSaved.sort(
          (a, b) => b.dateUploadedNumber - a.dateUploadedNumber
        );
      }
      if (state.filterSaved === "Oldest") {
        state.artworksSaved = userArtworksSaved.sort(
          (a, b) => a.dateUploadedNumber - b.dateUploadedNumber
        );
      }
      if (state.filterSaved === "Alphabetical") {
        state.artworksSaved = userArtworksSaved.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      } else {
        state.artworksSaved = userArtworksSaved;
      }

      //sort for intial fetch of posted artworks
      if (state.filterPosted === "Updated") {
        state.artworksPosted = userArtworksPosted.sort(
          (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
        );
      }
      if (state.filterPosted === "Most Liked") {
        state.artworksPosted = userArtworksPosted.sort(
          (a, b) => b.likes.length - a.likes.length
        );
      }
      if (state.filterPosted === "Most Viewed") {
        state.artworksPosted = userArtworksPosted.sort(
          (a, b) => a.views - b.views
        );
      }
      if (state.filterPosted === "Alphabetical") {
        state.artworksPosted = userArtworksPosted.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        });
      } else {
        state.artworksPosted = userArtworksPosted;
      }
      state.artworksLoading = false;
    });
  },
});

export const {
  signIn,
  signOut,
  userLoaded,
  togglePostedView,
  toggleFilterOptions,
  sortArtworksPostedByFilter,
  sortArtworksSavedByFilter,
} = userSlice.actions;
export default userSlice.reducer;
export const findUser = (state: RootState) => state.user;
