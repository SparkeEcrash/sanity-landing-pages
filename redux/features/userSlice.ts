import {
  PayloadAction,
  createSlice,
  createAsyncThunk,
  isAnyOf,
} from "@reduxjs/toolkit";
import { RootState } from "@redux/store";
import { addUserProfile } from "utils/postData";
import {
  editUserProfile,
  deleteUserProfile,
  resetPassword,
} from "utils/patchData";
import { getUserLikedArtworks, getUserCommentedArtworks } from "utils/getData";

export interface UserProfileData {
  [key: string]: any;
  name: string;
  userEmail: string;
  userImage: string;
  username: string;
  password: string;
  confirmPassword: string;
  errors: {
    name: boolean;
    userEmail: boolean;
    isUserEmailInvalid: boolean;
    isUserImageInvalid: boolean;
    password: boolean;
    isPasswordUnconfirmed: boolean;
    delete: boolean;
  };
}

const initialUserProfileData = {
  name: "",
  userEmail: "",
  userImage: "",
  username: "",
  password: "",
  confirmPassword: "",
  errors: {
    name: false,
    userEmail: false,
    isUserEmailInvalid: false,
    isUserImageInvalid: false,
    password: false,
    isPasswordUnconfirmed: false,
    delete: false,
  },
};

interface UserSliceState {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  username: string;
  uid: string;
  userImage: string;
  userEmail: string;
  roles: string[];
  isPasswordSet: boolean;
  accessToken: string;
  locale?: string;
  signedIn: boolean;
  userLoading: boolean;
  userProfileData: UserProfileData;
  showUserProfileModal: boolean;
  editUserProfileModal: boolean;
  deleteUserProfileModal: boolean;
  isSendingUserProfile: boolean;
  isNewAccountCreated: boolean;
  addUserProfileError: string;
  newAccountCredentials: {
    userEmail: string;
  };
  updateSessionFlag: boolean;
  showResetPasswordModal: boolean;
  isResettingPassword: boolean;
  resetPasswordError: string;
  artworksLiked: ArtworkProps[];
  artworksLikedLoading: boolean;
  artworksCommented: ArtworkProps[];
  artworksCommentedLoading: boolean;
}

export const initialState: UserSliceState = {
  id: "",
  name: "",
  username: "",
  uid: "",
  userImage: "",
  userEmail: "",
  signedIn: false,
  userLoading: true,
  roles: [],
  isPasswordSet: false,
  accessToken: "",
  userProfileData: initialUserProfileData,
  showUserProfileModal: false,
  editUserProfileModal: false,
  deleteUserProfileModal: false,
  isSendingUserProfile: false,
  isNewAccountCreated: false,
  addUserProfileError: "",
  newAccountCredentials: {
    userEmail: "",
  },
  updateSessionFlag: false,
  showResetPasswordModal: false,
  isResettingPassword: false,
  resetPasswordError: "",
  artworksLiked: [],
  artworksLikedLoading: true,
  artworksCommented: [],
  artworksCommentedLoading: true,
};

export const fetchAddUserProfile = createAsyncThunk(
  "user/fetchAddUserProfile",
  addUserProfile
);

export const fetchEditUserProfile = createAsyncThunk(
  "user/fetchEditUserProfile",
  editUserProfile
);

export const fetchDeleteUserProfile = createAsyncThunk(
  "user/fetchDeleteUserProfile",
  deleteUserProfile
);

export const fetchResetPassword = createAsyncThunk(
  "user/fetchResetPassword",
  resetPassword
);

export const fetchUserLikedArtworks = createAsyncThunk(
  "user/fetchUserLikedArtworks",
  getUserLikedArtworks
);

export const fetchUserCommentedArtworks = createAsyncThunk(
  "user/fetchUserCommentedArtworks",
  getUserCommentedArtworks
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUpdateSessionFlag: (state, action: PayloadAction<boolean>) => {
      state.updateSessionFlag = action.payload;
    },
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
    setShowUserProfileModal: (
      state,
      action: PayloadAction<{
        show: boolean;
        edit?: boolean;
        delete?: boolean;
        _id?: string;
      }>
    ) => {
      state.showUserProfileModal = action.payload.show;
      if (!action.payload.show) {
        state.editUserProfileModal = false;
        state.deleteUserProfileModal = false;
        state.userProfileData = initialUserProfileData;
        state.addUserProfileError = "";
      }
      if (action.payload.edit) {
        state.editUserProfileModal = true;
      }
      if (action.payload.delete) {
        state.deleteUserProfileModal = true;
      }
    },
    setResetPasswordModal: (state, action: PayloadAction<boolean>) => {
      state.showResetPasswordModal = action.payload;
    },
    loadUserProfile: (state, action: PayloadAction<UserProfileProps>) => {
      for (const [key, value] of Object.entries(action.payload)) {
        state.userProfileData[key] = value;
      }
    },
    onChangeUserForm: (state, action: PayloadAction<UserProfileData>) => {
      state.userProfileData = { ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAddUserProfile.fulfilled, (state, action) => {
      state.isSendingUserProfile = false;
      if (action.payload.data) {
        state.isNewAccountCreated = true;
        state.showUserProfileModal = false;
        state.newAccountCredentials.userEmail = action.payload.data.email;
        state.userProfileData = initialUserProfileData;
      } else if (
        action.payload.error === "An account with the email already exists"
      ) {
        state.addUserProfileError = action.payload.error;
      } else if (
        action.payload.error === "An account with the username already exists"
      ) {
        state.addUserProfileError = action.payload.error;
      } else {
        state.addUserProfileError =
          "An error occured while creating your account";
      }
    });
    builder.addCase(fetchResetPassword.pending, (state, action) => {
      state.isResettingPassword = true;
    });
    builder.addCase(fetchResetPassword.fulfilled, (state, action) => {
      state.isResettingPassword = false;
      if (
        action.payload.data === "password was reset" ||
        action.payload.data === "password was set"
      ) {
        state.showResetPasswordModal = false;
        state.resetPasswordError = "";
        state.isPasswordSet = true;
      }
      if (action.payload.data === "wrong password") {
        state.resetPasswordError = "The password you entered was incorrect";
      }
    });
    builder.addCase(fetchUserLikedArtworks.pending, (state) => {
      state.artworksLikedLoading = true;
    });
    builder.addCase(fetchUserLikedArtworks.fulfilled, (state, action) => {
      const userLikedArtworks: ArtworkProps[] = [];
      const sortedLikedArtworks = action.payload.data.sort(
        (a: ILike, b: ILike) =>
          Date.parse(b._createdAt) - Date.parse(a._createdAt)
      );
      sortedLikedArtworks.forEach(({ artwork }: ILike) => {
        userLikedArtworks.push({
          _id: artwork._id,
          _updatedAt: artwork._updatedAt,
          title: artwork.title,
          images: artwork.images,
          posted: artwork.posted,
          tags: artwork.tags,
          uid: artwork.uid,
          user: artwork.user,
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
      });
      state.artworksLiked = userLikedArtworks;
      state.artworksLikedLoading = false;
    });
    builder.addCase(fetchUserCommentedArtworks.pending, (state) => {
      state.artworksCommentedLoading = true;
    });
    builder.addCase(fetchUserCommentedArtworks.fulfilled, (state, action) => {
      const userCommentedArtworks: ArtworkProps[] = [];
      const sortedCommentedArtworks = action.payload.data.sort(
        (a: IComment, b: IComment) =>
          Date.parse(b._createdAt) - Date.parse(a._createdAt)
      );

      sortedCommentedArtworks.forEach(({ artwork }: IComment) => {
        if (artwork.posted) {
          userCommentedArtworks.push({
            _id: artwork._id,
            _updatedAt: artwork._updatedAt,
            title: artwork.title,
            images: artwork.images,
            posted: artwork.posted,
            tags: artwork.tags,
            uid: artwork.uid,
            user: artwork.user,
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
      state.artworksCommented = userCommentedArtworks;
      state.artworksCommentedLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        fetchAddUserProfile.pending,
        fetchEditUserProfile.pending,
        fetchDeleteUserProfile.pending
      ),
      (state) => {
        state.addUserProfileError = "";
        state.isSendingUserProfile = true;
      }
    );
    builder.addMatcher(
      isAnyOf(fetchEditUserProfile.fulfilled, fetchDeleteUserProfile.fulfilled),
      (state, action) => {
        state.isSendingUserProfile = false;
        state.showUserProfileModal = false;
      }
    );
    builder.addMatcher(
      isAnyOf(fetchEditUserProfile.fulfilled),
      (state, { payload }) => {
        if (!payload.data) {
          return;
        }
        const { name, email, image, username } = payload.data;
        state.name = name;
        state.userEmail = email;
        state.userImage = image;
        state.username = username;
        state.updateSessionFlag = true;
      }
    );
  },
});

export const {
  signIn,
  signOut,
  userLoaded,
  setShowUserProfileModal,
  loadUserProfile,
  onChangeUserForm,
  setUpdateSessionFlag,
  setResetPasswordModal,
} = userSlice.actions;
export default userSlice.reducer;
export const findUser = (state: RootState) => state.user;
