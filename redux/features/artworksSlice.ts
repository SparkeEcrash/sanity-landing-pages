import { RootState } from "@redux/store";
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { getUserArtworks } from "utils/getData";
import { addUserArtwork } from "utils/postData";
import {
  editUserArtwork,
  deleteUserArtwork,
  toggleHideComment,
} from "utils/patchData";

export interface ArtworkFormData {
  [key: string]: any;
  title: string;
  comment: string;
  tags: string[];
  tag: string;
  isMaker: boolean;
  isForSale: boolean;
  price: string;
  errors: {
    image: boolean;
    images: boolean;
    title: boolean;
    comment: boolean;
    tags: boolean;
    tag: boolean;
    tagAlreadyExists: boolean;
    delete: boolean;
  };
  imagesFromRedux: string[];
  imageDetailsFromRedux: {
    name: string;
    path: string;
    dimensions?: { height: number; width: number };
  }[];
  _id: string;
  _updatedAt: string;
  uid: string;
  name: string;
  userEmail: string;
  username: string;
  userImage: string;
  views: number;
  likes: LikeProps[];
  comments: CommentProps[];
  dateUploaded: string;
  dateUploadedNumber: number;
  aid: string;
}

const initialStateArtworkFormData = {
  title: "",
  comment: "",
  tags: [],
  tag: "",
  isMaker: false,
  isForSale: false,
  price: "0",
  imagesFromRedux: [],
  imageDetailsFromRedux: [],
  errors: {
    image: false,
    images: false,
    title: false,
    comment: false,
    tags: false,
    tag: false,
    tagAlreadyExists: false,
    delete: false,
  },
  _id: "",
  _updatedAt: "",
  uid: "",
  name: "",
  userEmail: "",
  username: "",
  userImage: "",
  views: 0,
  likes: [],
  comments: [],
  dateUploaded: "",
  dateUploadedNumber: 0,
  aid: "",
};

interface ArtworksSliceState {
  artworksSaved: ArtworkProps[];
  artworksPosted: ArtworkProps[];
  artworksLoading: boolean;
  postedView: boolean;
  filterPosted: string;
  filterSaved: string;
  showArtworkModal: boolean;
  editArtworkModal: boolean;
  deleteArtworkModal: boolean;
  toUpdateArtworkId: string;
  artworkFormData: ArtworkFormData;
  isSendingArtwork: boolean;
  isTogglingHideComment: boolean;
}

const initialState: ArtworksSliceState = {
  artworksSaved: [],
  artworksPosted: [],
  artworksLoading: true,
  postedView: false,
  filterPosted: "Updated",
  filterSaved: "Updated",
  showArtworkModal: false,
  editArtworkModal: false,
  deleteArtworkModal: false,
  toUpdateArtworkId: "",
  artworkFormData: initialStateArtworkFormData,
  isSendingArtwork: false,
  isTogglingHideComment: false,
};

export const fetchUserArtworks = createAsyncThunk(
  "user/fetchUserArtworks",
  getUserArtworks
);

export const fetchAddUserArtwork = createAsyncThunk(
  "artworks/fetchAddUserArtwork",
  addUserArtwork
);

export const fetchEditUserArtwork = createAsyncThunk(
  "artworks/fetchEditUserArtwork",
  editUserArtwork
);

export const fetchDeleteUserArtwork = createAsyncThunk(
  "artworks/fetchDeleteUserArtwork",
  deleteUserArtwork
);

export const fetchToggleHideComment = createAsyncThunk(
  "artworks/fetchToggleHideComment",
  toggleHideComment
);

const artworksSlice = createSlice({
  name: "artworks",
  initialState,
  reducers: {
    setShowArtworkModal: (
      state,
      action: PayloadAction<{
        show: boolean;
        edit?: boolean;
        delete?: boolean;
        _id?: string;
      }>
    ) => {
      state.showArtworkModal = action.payload.show;
      if (!action.payload.show) {
        state.editArtworkModal = false;
        state.deleteArtworkModal = false;
        state.artworkFormData = initialStateArtworkFormData;
      }
      if (action.payload.edit && action.payload._id) {
        state.editArtworkModal = true;
        state.toUpdateArtworkId = action.payload._id;
      }
      if (action.payload.delete && action.payload._id) {
        state.deleteArtworkModal = true;
        state.toUpdateArtworkId = action.payload._id;
      }
    },
    onChangeArtwork: (state, action: PayloadAction<ArtworkFormData>) => {
      state.artworkFormData = { ...action.payload };
    },
    loadSavedArtwork: (state, action: PayloadAction<ArtworkProps>) => {
      for (const [key, value] of Object.entries(action.payload)) {
        if (key === "images" && value && value.length > 0) {
          state.artworkFormData.imageDetailsFromRedux = value.map(
            (image: { imageUrl: string; height: number; width: number }) => ({
              path: image.imageUrl,
              dimensions: { height: image.height, width: image.width },
              name: "Uploaded Image",
            })
          );
          state.artworkFormData.imagesFromRedux = value.map(
            (image: { _id: string }) => image._id
          );
        } else if (key === "tags" && value && value.length > 0) {
          state.artworkFormData.tags = value.map(
            (tag: { label: string }) => tag.label
          );
        } else {
          state.artworkFormData[key] = value;
        }
      }
    },
    resetArtwork: (state) => {
      state.artworkFormData = initialStateArtworkFormData;
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
    // builder.addCase(fetchUserArtworks.fulfilled, (state, action) => {
    //   const userArtworksSaved: ArtworkProps[] = [];
    //   // const existingArtworksSaved = state.artworksSaved;
    //   const userArtworksPosted: ArtworkProps[] = [];
    //   // const existingArtworksPosted = state.artworksPosted;
    //   action.payload.data.forEach((artwork: IArtwork) => {
    //     if (artwork.posted) {
    //       userArtworksPosted.push({
    //         _id: artwork._id,
    //         _updatedAt: artwork._updatedAt,
    //         title: artwork.title,
    //         images: artwork.images,
    //         posted: artwork.posted,
    //         tags: artwork.tags,
    //         uid: artwork.uid,
    //         name: artwork.name,
    //         userImage: artwork.userImage,
    //         userEmail: artwork.userEmail,
    //         username: artwork.username,
    //         isMaker: artwork.isMaker,
    //         isForSale: artwork.isForSale,
    //         views: artwork.views,
    //         likes: artwork.likes ? artwork.likes : [],
    //         comments: artwork.comments ? artwork.comments : [],
    //         price: artwork.price,
    //         comment: artwork.comment,
    //         dateUploaded: artwork.dateUploaded,
    //         dateUploadedNumber: artwork.dateUploadedNumber,
    //         aid: artwork._id,
    //       });
    //     } else {
    //       userArtworksSaved.push({
    //         _id: artwork._id,
    //         _updatedAt: artwork._updatedAt,
    //         title: artwork.title,
    //         images: artwork.images,
    //         posted: artwork.posted,
    //         tags: artwork.tags,
    //         uid: artwork.uid,
    //         name: artwork.name,
    //         userImage: artwork.userImage,
    //         userEmail: artwork.userEmail,
    //         username: artwork.username,
    //         isMaker: artwork.isMaker,
    //         isForSale: artwork.isForSale,
    //         views: artwork.views,
    //         likes: artwork.likes ? artwork.likes : [],
    //         comments: artwork.comments ? artwork.comments : [],
    //         price: artwork.price,
    //         comment: artwork.comment,
    //         dateUploaded: artwork.dateUploaded,
    //         dateUploadedNumber: artwork.dateUploadedNumber,
    //         aid: artwork._id,
    //       });
    //     }
    //   });

    //   //sort for intial fetch of saved artworks
    //   if (state.filterSaved === "Updated") {
    //     state.artworksSaved = userArtworksSaved.sort(
    //       (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
    //     );
    //   }
    //   if (state.filterSaved === "Newest") {
    //     state.artworksSaved = userArtworksSaved.sort(
    //       (a, b) => b.dateUploadedNumber - a.dateUploadedNumber
    //     );
    //   }
    //   if (state.filterSaved === "Oldest") {
    //     state.artworksSaved = userArtworksSaved.sort(
    //       (a, b) => a.dateUploadedNumber - b.dateUploadedNumber
    //     );
    //   }
    //   if (state.filterSaved === "Alphabetical") {
    //     state.artworksSaved = userArtworksSaved.sort((a, b) => {
    //       if (a.title < b.title) {
    //         return -1;
    //       }
    //       if (a.title > b.title) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //   } else {
    //     state.artworksSaved = userArtworksSaved;
    //   }

    //   //sort for intial fetch of posted artworks
    //   if (state.filterPosted === "Updated") {
    //     state.artworksPosted = userArtworksPosted.sort(
    //       (a, b) => Date.parse(b._updatedAt) - Date.parse(a._updatedAt)
    //     );
    //   }
    //   if (state.filterPosted === "Most Liked") {
    //     state.artworksPosted = userArtworksPosted.sort(
    //       (a, b) => b.likes.length - a.likes.length
    //     );
    //   }
    //   if (state.filterPosted === "Most Viewed") {
    //     state.artworksPosted = userArtworksPosted.sort(
    //       (a, b) => a.views - b.views
    //     );
    //   }
    //   if (state.filterPosted === "Alphabetical") {
    //     state.artworksPosted = userArtworksPosted.sort((a, b) => {
    //       if (a.title < b.title) {
    //         return -1;
    //       }
    //       if (a.title > b.title) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //   } else {
    //     state.artworksPosted = userArtworksPosted;
    //   }
    //   state.artworksLoading = false;
    // });
    builder.addCase(fetchToggleHideComment.pending, (state) => {
      state.isTogglingHideComment = true;
    });
    builder.addCase(fetchToggleHideComment.fulfilled, (state, action) => {
      state.artworkFormData.comments = action.payload.data;
      state.isTogglingHideComment = false;
    });
    // builder.addCase(fetchEditUserArtwork.pending, (state) => {
    //   state.isSendingArtwork = true;
    // });
    // builder.addCase(fetchEditUserArtwork.fulfilled, (state) => {
    //   state.isSendingArtwork = false;
    //   state.showArtworkModal = false;
    // });
    builder.addMatcher(
      isAnyOf(
        fetchAddUserArtwork.pending,
        fetchEditUserArtwork.pending,
        fetchDeleteUserArtwork.pending
      ),
      (state) => {
        state.isSendingArtwork = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        fetchAddUserArtwork.fulfilled,
        fetchEditUserArtwork.fulfilled,
        fetchDeleteUserArtwork.fulfilled
      ),
      (state) => {
        state.isSendingArtwork = false;
        state.showArtworkModal = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        fetchUserArtworks.fulfilled,
        fetchAddUserArtwork.fulfilled,
        fetchEditUserArtwork.fulfilled,
        fetchDeleteUserArtwork.fulfilled
      ),
      (state, { payload }) => {
        const userArtworksSaved: ArtworkProps[] = [];
        // const existingArtworksSaved = state.artworksSaved;
        const userArtworksPosted: ArtworkProps[] = [];
        // const existingArtworksPosted = state.artworksPosted;
        payload.data.forEach((artwork: IArtwork) => {
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
      }
    );
    // builder.addMatcher(
    //   isAnyOf(fetchToggleHideComment.fulfilled),
    //   (state, { payload }) => {
    // for (const [key, value] of Object.entries(action.payload)) {
    //   if (key === "images") {
    //     state.artworkFormData.imageDetailsFromRedux = value.map(
    //       (image: { imageUrl: string; height: number; width: number }) => ({
    //         path: image.imageUrl,
    //         dimensions: { height: image.height, width: image.width },
    //         name: "Uploaded Image",
    //       })
    //     );
    //     state.artworkFormData.imagesFromRedux = value.map(
    //       (image: { _id: string }) => image._id
    //     );
    //   } else if (key === "tags") {
    //     state.artworkFormData.tags = value.map(
    //       (tag: { label: string }) => tag.label
    //     );
    //   } else {
    //     state.artworkFormData[key] = value;
    //   }
    // }
    //   }
    // );
  },
});

export const {
  onChangeArtwork,
  loadSavedArtwork,
  togglePostedView,
  toggleFilterOptions,
  sortArtworksPostedByFilter,
  sortArtworksSavedByFilter,
  setShowArtworkModal,
  resetArtwork,
} = artworksSlice.actions;
export default artworksSlice.reducer;
export const getArtworks = (state: RootState) => state.artworks;
