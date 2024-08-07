import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { Message } from "../chatroompage/[id]/component/type";

// 상태 인터페이스 정의
interface PrivateChatRoomMessagesState {
  chatRoomId: string | null;
  messages: Message[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 초기 상태 정의
const initialState: PrivateChatRoomMessagesState = {
  chatRoomId: null,
  messages: [],
  status: "idle",
  error: null,
};

// 메시지 가져오기 비동기 액션
export const fetchMessagesByChatRoomId = createAsyncThunk<
  { chatRoomId: string; messages: Message[] },
  string,
  { rejectValue: string }
>(
  "privateChatRoomMessages/fetchMessagesByChatRoomId",
  async (chatRoomId, { rejectWithValue }) => {
    try {
      const messagesRef = collection(
        db,
        "privateChatRooms",
        chatRoomId,
        "messages"
      );
      const q = query(messagesRef, orderBy("time", "asc"));
      const querySnapshot = await getDocs(q);

      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // 문서 아이디
          imageUrl: data.imageUrl,
          profileImg: data.profileImg,
          readBy: data.readBy,
          text: data.text,
          time: data.time,
          userId: data.userId,
          userName: data.userName,
        };
      }) as Message[];

      return { chatRoomId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 슬라이스 생성
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
      });
  },
});

// 액션 및 리듀서 내보내기
export const { clearMessages } = privateChatRoomMessagesSlice.actions;

export default privateChatRoomMessagesSlice.reducer;
