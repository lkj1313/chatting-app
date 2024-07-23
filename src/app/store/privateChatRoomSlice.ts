import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { RootState } from "./store";
import { v4 as uuidv4 } from "uuid";

interface PrivateChatRoomState {
  chatRoomId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  participants: string[];
}

const initialState: PrivateChatRoomState = {
  chatRoomId: null,
  participants: [],
  status: "idle",
  error: null,
};

export const initiatePrivateChat = createAsyncThunk<
  { chatRoomId: string; participants: string[] },
  { myId: string; selectedId: string },
  { rejectValue: string; state: RootState }
>(
  "privateChatRoom/initiatePrivateChat",
  async ({ myId, selectedId }, { rejectWithValue, getState }) => {
    try {
      const chatQuery = query(
        collection(db, "privateChatRooms"),
        where("participants", "array-contains-any", [myId, selectedId])
      );
      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        const chat = chatSnapshot.docs[0];
        const chatRoomData = chat.data() as PrivateChatRoomState;
        return { chatRoomId: chat.id, participants: chatRoomData.participants };
      } else {
        const newChatRoomId = uuidv4();
        const newChatRoom = {
          chatRoomId: newChatRoomId,
          participants: [myId, selectedId],
        };
        const chatRoomRef = doc(db, "privateChatRooms", newChatRoomId);
        await setDoc(chatRoomRef, newChatRoom);
        return { chatRoomId: newChatRoomId, participants: [myId, selectedId] };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatRoomData = createAsyncThunk<
  { chatRoomId: string; participants: string[] },
  string,
  { rejectValue: string; state: RootState }
>(
  "privateChatRoom/fetchChatRoomData",
  async (chatRoomId, { rejectWithValue }) => {
    try {
      const chatRoomRef = doc(db, "privateChatRooms", chatRoomId);
      const chatRoomSnap = await getDoc(chatRoomRef);

      if (chatRoomSnap.exists()) {
        const chatRoomData = chatRoomSnap.data() as PrivateChatRoomState;
        return { chatRoomId, participants: chatRoomData.participants };
      } else {
        return rejectWithValue("No such document!");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const privateChatRoomSlice = createSlice({
  name: "privateChatRoom",
  initialState,
  reducers: {
    setChatRoomId: (state, action: PayloadAction<string | null>) => {
      state.chatRoomId = action.payload;
    },
    clearChatRoomId: (state) => {
      state.chatRoomId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePrivateChat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        initiatePrivateChat.fulfilled,
        (
          state,
          action: PayloadAction<{ chatRoomId: string; participants: string[] }>
        ) => {
          state.status = "succeeded";
          state.chatRoomId = action.payload.chatRoomId;
          state.participants = action.payload.participants;
        }
      )
      .addCase(initiatePrivateChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchChatRoomData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchChatRoomData.fulfilled,
        (
          state,
          action: PayloadAction<{ chatRoomId: string; participants: string[] }>
        ) => {
          state.status = "succeeded";
          state.chatRoomId = action.payload.chatRoomId;
          state.participants = action.payload.participants;
        }
      )
      .addCase(fetchChatRoomData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setChatRoomId, clearChatRoomId } = privateChatRoomSlice.actions;
export default privateChatRoomSlice.reducer;
