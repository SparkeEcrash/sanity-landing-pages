import { RootState } from "@redux/store";
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { getGalleryArtwork } from "utils/getData";
import { toggleLike, updateComment, deleteComment } from "utils/patchData";
import { addComment } from "utils/postData";

interface GallerySliceState {
  artwork: ArtworkProps;
  artworks: ArtworkProps[];
  isArtworkNotFound: boolean;
  comment: string;
  isTogglingLike: boolean;
  isSendingComment: boolean;
  showCommentModal: boolean;
  editCommentModal: boolean;
  deleteCommentModal: boolean;
  toUpdateCommentId: string;
}

const artworkInitialState: ArtworkProps = {
  _id: "",
  _updatedAt: "",
  title: "",
  images: [],
  comment: "",
  posted: false,
  tags: [],
  uid: "",
  name: "",
  userImage: "",
  userEmail: "",
  username: "",
  views: 0,
  likes: [],
  comments: [],
  isMaker: false,
  isForSale: false,
  price: "",
  dateUploaded: "",
  dateUploadedNumber: 0,
  dateModified: "",
  aid: "",
  isVisitorLiked: false,
};

const initialState: GallerySliceState = {
  artwork: artworkInitialState,
  artworks: [],
  isArtworkNotFound: false,
  comment: "",
  isTogglingLike: false,
  isSendingComment: false,
  showCommentModal: false,
  editCommentModal: false,
  deleteCommentModal: false,
  toUpdateCommentId: "",
};

export const fetchGalleryArtwork = createAsyncThunk(
  "gallery/fetchGalleryArtwork",
  getGalleryArtwork
);

export const fetchToggleLike = createAsyncThunk(
  "gallery/fetchToggleLike",
  toggleLike
);

export const fetchAddComment = createAsyncThunk(
  "gallery/fetchAddComment",
  addComment
);

export const fetchUpdateComment = createAsyncThunk(
  "gallery/fetchUpdateComment",
  updateComment
);

export const fetchDeleteComment = createAsyncThunk(
  "gallery/fetchDeleteComment",
  deleteComment
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    onChangeComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    resetArtwork: (state) => {
      state.artwork = initialState.artwork;
    },
    setShowCommentModal: (
      state,
      action: PayloadAction<{
        show: boolean;
        edit?: boolean;
        delete?: boolean;
        _id?: string;
      }>
    ) => {
      state.showCommentModal = action.payload.show;
      if (!action.payload.show) {
        state.editCommentModal = false;
        state.deleteCommentModal = false;
      }
      if (action.payload.edit && action.payload._id) {
        state.editCommentModal = true;
        state.toUpdateCommentId = action.payload._id;
      }
      if (action.payload.delete && action.payload._id) {
        state.deleteCommentModal = true;
        state.toUpdateCommentId = action.payload._id;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchGalleryArtwork.pending, (state) => {
      state.artwork = initialState.artwork;
      state.isArtworkNotFound = false;
    });
    builder.addCase(fetchGalleryArtwork.fulfilled, (state) => {
      state.comment = "";
    });
    //TODO: Combine the cases
    builder.addCase(fetchAddComment.pending, (state) => {
      state.isSendingComment = true;
    });
    builder.addCase(fetchAddComment.fulfilled, (state) => {
      state.comment = "";
      state.isSendingComment = false;
      state.showCommentModal = false;
    });
    builder.addCase(fetchUpdateComment.pending, (state) => {
      state.isSendingComment = true;
    });
    builder.addCase(fetchUpdateComment.fulfilled, (state) => {
      state.comment = "";
      state.editCommentModal = false;
      state.isSendingComment = false;
      state.showCommentModal = false;
    });
    builder.addCase(fetchDeleteComment.pending, (state) => {
      state.isSendingComment = true;
    });
    builder.addCase(fetchDeleteComment.fulfilled, (state) => {
      state.comment = "";
      state.deleteCommentModal = false;
      state.isSendingComment = false;
      state.showCommentModal = false;
    });
    builder.addCase(fetchToggleLike.pending, (state) => {
      state.isTogglingLike = true;
    });
    builder.addCase(fetchToggleLike.fulfilled, (state) => {
      state.isTogglingLike = false;
    });
    builder.addMatcher(
      isAnyOf(
        fetchGalleryArtwork.fulfilled,
        fetchToggleLike.fulfilled,
        fetchAddComment.fulfilled,
        fetchUpdateComment.fulfilled,
        fetchDeleteComment.fulfilled
      ),
      (state, { payload }) => {
        if (payload.data) {
          state.isArtworkNotFound = false;
          state.artwork = {
            _id: payload.data._id,
            _updatedAt: payload.data._updatedAt,
            title: payload.data.title,
            images: payload.data.images,
            comment: payload.data.comment,
            posted: payload.data.posted,
            tags: payload.data.tags,
            uid: payload.data.uid,
            name: payload.data.name,
            userImage: payload.data.userImage,
            userEmail: payload.data.userEmail,
            username: payload.data.username,
            views: payload.data.views,
            likes: payload.data.likes ? payload.data.likes : [],
            comments: payload.data.comments ? payload.data.comments : [],
            isMaker: payload.data.isMaker,
            isForSale: payload.data.isForSale,
            price: payload.data.price,
            dateUploaded: payload.data.dateUploaded,
            dateUploadedNumber: payload.data.dateUploadedNumber,
            dateModified:
              payload.data._updatedAt &&
              payload.data._updatedAt.substring(0, 10),
            aid: payload.data._id,
            isVisitorLiked: payload.data.isVisitorLiked,
          };
        } else {
          state.isArtworkNotFound = true;
        }
      }
    );
  },
});

export const { onChangeComment, resetArtwork, setShowCommentModal } =
  gallerySlice.actions;
export default gallerySlice.reducer;
export const findGallery = (state: RootState) => state.gallery;
// function getState() {
//   throw new Error("Function not implemented.");
// }
