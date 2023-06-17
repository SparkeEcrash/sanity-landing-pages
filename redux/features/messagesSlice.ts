import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchUserArtworks } from "@redux/features/userSlice";
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
    // builder.addCase(fetchUserArtworks.pending, (state) => {
    //   state.messages.push({
    //     text: "Getting your artworks",
    //     showLoading: true,
    //     key: "get user artworks",
    //   });
    // });
    // builder.addCase(fetchUserArtworks.fulfilled, (state) => {
    //   const newMessages = state.messages.filter(
    //     (message) => message.key !== "get user artworks"
    //   );
    //   state.messages = newMessages;
    // });
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
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
