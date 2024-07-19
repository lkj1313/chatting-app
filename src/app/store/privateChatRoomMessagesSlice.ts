import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

interface Message {
  id: string;
  text: string;
  time: string;
  userId: string;
  userName: string;
  profileImg: string;
  imageUrl?: string;
  readBy: string[];
}

interface MessagesState {
  messages: Message[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  status: "idle",
  error: null,
};

export const fetchPrivateChatMessagesByChatRoomId = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>(
  "privateChatRoomMessages/fetchPrivateChatMessagesByChatRoomId",
  async (chatRoomId, { rejectWithValue }) => {
    try {
      const messagesRef = collection(
        db,
        "privateChatRooms",
        chatRoomId,
        "messages"
      );
      const q = query(messagesRef, orderBy("time"));
      const messagesSnap = await getDocs(q);
      const messages: Message[] = messagesSnap.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        time: doc.data().time,
        userId: doc.data().userId,
        userName: doc.data().userName,
        profileImg: doc.data().profileImg || "",
        imageUrl: doc.data().imageUrl || "",
        readBy: doc.data().readBy || [],
      }));
      return messages;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const privateChatRoomMessagesSlice = createSlice({
  name: "privateChatRoomMessages", // 슬라이스의 이름
  initialState, // 슬라이스의 초기 상태값
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivateChatMessagesByChatRoomId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPrivateChatMessagesByChatRoomId.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.status = "succeeded";
          state.messages = action.payload;
          state.error = null;
        }
      )
      .addCase(
        fetchPrivateChatMessagesByChatRoomId.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        }
      );
  },
});

export const { setMessages } = privateChatRoomMessagesSlice.actions;
export default privateChatRoomMessagesSlice.reducer;
