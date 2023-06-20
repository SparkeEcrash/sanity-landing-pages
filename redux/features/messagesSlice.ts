import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  fetchAddUserArtwork,
  fetchEditUserArtwork,
  fetchDeleteUserArtwork,
  fetchToggleHideComment,
} from "@redux/features/artworksSlice";
import {
  fetchAddComment,
  fetchUpdateComment,
  fetchToggleLike,
  fetchDeleteComment,
} from "@redux/features/gallerySlice";

interface Message {
  text: string;
  showLoading: boolean;
  key: string;
  dark?: boolean;
}

interface MessagesSliceState {
  messages: Message[];
}

const initialState: MessagesSliceState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{
        text: string;
        showLoading: boolean;
        key: string;
        dark?: boolean;
      }>
    ) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      // https://redux-toolkit.js.org/usage/immer-reducers
      const newMessages = state.messages.filter(
        (message) => message.key !== action.payload
      );
      state.messages = newMessages;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchAddUserArtwork.pending, (state) => {
      state.messages.push({
        text: "Uploading your artwork",
        showLoading: true,
        key: "add user artwork",
        dark: true,
      });
    });
    builder.addCase(fetchAddUserArtwork.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "add user artwork"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchEditUserArtwork.pending, (state) => {
      state.messages.push({
        text: "Updating your artwork",
        showLoading: true,
        key: "update user artwork",
        dark: true,
      });
    });
    builder.addCase(fetchEditUserArtwork.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "update user artwork"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchDeleteUserArtwork.pending, (state) => {
      state.messages.push({
        text: "Deleting your artwork",
        showLoading: true,
        key: "delete user artwork",
        dark: true,
      });
    });
    builder.addCase(fetchDeleteUserArtwork.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "delete user artwork"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchToggleLike.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "toggling a like"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchAddComment.pending, (state) => {
      state.messages.push({
        text: "Adding your comment",
        showLoading: true,
        key: "add user comment",
        dark: true,
      });
    });
    builder.addCase(fetchAddComment.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "add user comment"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchUpdateComment.pending, (state) => {
      state.messages.push({
        text: "Updating your comment",
        showLoading: true,
        key: "update user comment",
        dark: true,
      });
    });
    builder.addCase(fetchUpdateComment.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "update user comment"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchDeleteComment.pending, (state) => {
      state.messages.push({
        text: "Deleting your comment",
        showLoading: true,
        key: "delete user comment",
        dark: true,
      });
    });
    builder.addCase(fetchDeleteComment.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "delete user comment"
      );
      state.messages = newMessages;
    });
    builder.addCase(fetchToggleHideComment.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "toggle hide for selected comment"
      );
      state.messages = newMessages;
    });
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
