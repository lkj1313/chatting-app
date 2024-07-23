import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  userName: string | undefined;
  profileImg: string | undefined;
  userId: string | null;
  readBy: string[];
}

interface PrivateChatRoomMessagesState {
  chatRoomId: string | null;
  messages: Message[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PrivateChatRoomMessagesState = {
  chatRoomId: null,
  messages: [],
  status: "idle",
  error: null,
};

export const fetchMessagesByChatRoomId = createAsyncThunk<
  { chatRoomId: string; messages: Message[] },
  string,
  { rejectValue: string }
>(
  "privateChatRoomMessages/fetchMessagesByChatRoomId",
  async (chatRoomId: string, { rejectWithValue }) => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, where("chatRoomId", "==", chatRoomId));
      const querySnapshot = await getDocs(q);

      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          timestamp: data.timestamp,
          userName: data.userName,
          profileImg: data.profileImg,
          userId: data.userId,
          readBy: data.readBy || [],
        } as Message;
      });

      return { chatRoomId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk<
  void,
  { chatRoomId: string; text: string; senderId: string },
  { rejectValue: string }
>(
  "privateChatRoomMessages/sendMessage",
  async ({ chatRoomId, text, senderId }, { rejectWithValue }) => {
    try {
      const newMessageId = uuidv4();
      const newMessage = {
        id: newMessageId,
        chatRoomId,
        text,
        senderId,
        timestamp: Date.now(),
        userName: "", // Set default value
        profileImg: "", // Set default value
        userId: null, // Set default value
        readBy: [], // Set default value
      };
      await setDoc(doc(db, "messages", newMessageId), newMessage);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const privateChatRoomMessagesSlice = createSlice({
  name: "privateChatRoomMessages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByChatRoomId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchMessagesByChatRoomId.fulfilled,
        (
          state,
          action: PayloadAction<{ chatRoomId: string; messages: Message[] }>
        ) => {
          state.status = "succeeded";
          state.chatRoomId = action.payload.chatRoomId;
          state.messages = action.payload.messages;
          state.error = null;
        }
      )
      .addCase(fetchMessagesByChatRoomId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = privateChatRoomMessagesSlice.actions;

export default privateChatRoomMessagesSlice.reducer;
