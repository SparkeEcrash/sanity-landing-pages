import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@redux/store";

interface UserSliceState {
  name: string;
  first_name?: string;
  last_name?: string;
  username: string;
  uid: string;
  userImage: string;
  userEmail: string;
  roles: string[];
  accessToken: string;
  locale?: string;
  signedIn: boolean;
  userLoading: boolean;
}

export const initialState: UserSliceState = {
  name: "",
  username: "",
  uid: "",
  userImage: "",
  userEmail: "",
  signedIn: false,
  userLoading: true,
  roles: [],
  accessToken: "",
};

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
  },
  extraReducers(builder) {},
});

export const {
  signIn,
  signOut,
  userLoaded,
} = userSlice.actions;
export default userSlice.reducer;
export const findUser = (state: RootState) => state.user;
