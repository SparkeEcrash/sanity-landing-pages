import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchUserArtworks } from "@redux/features/userSlice";

interface Message {
  text: string;
  showLoading: boolean;
  key: string;
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
    builder.addCase(fetchUserArtworks.pending, (state) => {
      state.messages.push({
        text: "Getting your artworks",
        showLoading: true,
        key: "get user artworks",
      });
    });
    builder.addCase(fetchUserArtworks.fulfilled, (state) => {
      const newMessages = state.messages.filter(
        (message) => message.key !== "get user artworks"
      );
      state.messages = newMessages;
    });
  },
});

export const { addMessage, removeMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
