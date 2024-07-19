import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { RootState } from "./store";
import { v4 as uuidv4 } from "uuid";

interface PrivateChatRoomState {
  chatRoomId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  participants: string[]; // participants 속성 추가
}

const initialState: PrivateChatRoomState = {
  chatRoomId: null,
  participants: [],
  status: "idle",
  error: null,
};

export const initiatePrivateChat = createAsyncThunk<
  { chatRoomId: string; participants: string[] }, // 반환 타입 수정
  { myId: string; selectedId: string }, // 함수 인수 타입
  { rejectValue: string; state: RootState } // 추가 옵션
>(
  "privateChatRoom/initiatePrivateChat", // 여기서 액션 타입을 수정합니다.
  async ({ myId, selectedId }, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;

    try {
      // 기존 채팅 방 조회
      const chatQuery = query(
        collection(db, "privateChatRooms"),
        where("user1Id", "in", [currentUser.uid, selectedId]),
        where("user2Id", "in", [currentUser.uid, selectedId])
      );
      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        const chat = chatSnapshot.docs[0];
        const chatRoomData = chat.data() as PrivateChatRoomState;
        return { chatRoomId: chat.id, participants: chatRoomData.participants };
      } else {
        // 새로운 채팅 방 생성
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

//슬라이스 정의
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
          state.participants = action.payload.participants; // 참가자 목록을 상태에 저장
        }
      )
      .addCase(initiatePrivateChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setChatRoomId, clearChatRoomId } = privateChatRoomSlice.actions;
export default privateChatRoomSlice.reducer;
