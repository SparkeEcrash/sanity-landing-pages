import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

//slice has the same functionality as a reducer did before except that instead of invoking the proper function by matching a string sent from the action payload it invokes the function by using the exported {func1, func2,... } = slice.actions at the bottom.
//slice removes the necessity to build reducers and actions separately

interface SampleSliceState {
  value: number;
  auth: UserState;
}

interface UserState {
  isAuth: boolean;
  username: string;
  uid: string;
  isModerator: boolean;
}

const initialState: SampleSliceState = {
  value: 0,
  auth: {
    isAuth: false,
    username: "usernamestring",
    uid: "123",
    isModerator: true,
  },
};

const exportableFunction: CaseReducer<SampleSliceState, PayloadAction<number>> = (
  state,
  action
) => {
  return {
    value: action.payload,
    auth: {
      isAuth: false,
      username: "usernamestring",
      uid: "123",
      isModerator: true,
    },
  };
};

export const sampleSlice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: () => {
      return initialState;
    },
    login: (
      state,
      action: PayloadAction<{ string: string; number: number }>
    ) => {
      return {
        auth: {
          isAuth: true,
          username: action.payload.string,
          uid: "uid text",
          isModerator: false,
        },
        value: action.payload.number,
      };
    },
    exportableFunction,
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount, reset, login } =
  sampleSlice.actions;

export default sampleSlice.reducer;

// https://dev.to/ifeanyichima/what-is-createasyncthunk-in-redux--mhe
