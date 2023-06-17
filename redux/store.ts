import { configureStore } from "@reduxjs/toolkit";
import sampleReducer from "@redux/features/sampleSlice";
import userReducer from "@redux/features/userSlice";
import messagesReducer from "@redux/features/messagesSlice";
import artworksReducer from "@redux/features/artworksSlice";
import galleryReducer from "@redux/features/gallerySlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    sample: sampleReducer,
    user: userReducer,
    messages: messagesReducer,
    artworks: artworksReducer,
    gallery: galleryReducer,
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  // preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // https://redux-toolkit.js.org/api/getDefaultMiddleware
  // redux-thunk is added by default when using @reduxjs/toolkit
  //thunk allows action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met.
});

const preloadedState = {
  // todos: [
  //   {
  //     text: 'Eat food',
  //     completed: true,
  //   },
  //   {
  //     text: 'Exercise',
  //     completed: false,
  //   },
  // ],
  // visibilityFilter: 'SHOW_COMPLETED',
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatchType = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const AppDispatch = useDispatch<AppDispatchType>;
