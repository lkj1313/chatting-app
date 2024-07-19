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
  chatId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  participants: string[]; // participants 속성 추가
}

const initialState: PrivateChatRoomState = {
  chatId: null,
  status: "idle",
  error: null,
  participants: [], // 초기값 설정
};

export const fetchPrivateChatRoomById = createAsyncThunk<
  string, // 반환 타입: 비동기 작업이 성공적으로 완료되었을 때 반환되는 값의 타입 (채팅방 ID)
  string, // 인수 타입: 비동기 작업에 전달되는 인수의 타입 (참가자 ID)
  { rejectValue: string } // Thunk API 옵션 타입: 실패 시 반환되는 에러 메시지의 타입
>(
  "privateChatRoom/fetchPrivateChatRoomById", // 여기서 액션 타입을 수정합니다.
  async (participantId, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const currentUser = state.auth.user;

    try {
      // 기존 채팅 방 조회
      const chatQuery = query(
        collection(db, "privateChatRooms"),
        where("user1Id", "in", [currentUser.uid, participantId]),
        where("user2Id", "in", [currentUser.uid, participantId])
      );
      const chatSnapshot = await getDocs(chatQuery);

      if (!chatSnapshot.empty) {
        const chat = chatSnapshot.docs[0];
        return chat.id;
      } else {
        // 새로운 채팅 방 생성
        if (currentUser && currentUser.uid && participantId) {
          const newChatRoomId = uuidv4(); // 유니크 ID 생성
          const newChatRoom = {
            chatRoomId: newChatRoomId,
            user1Id: currentUser.uid,
            user2Id: participantId,
            participants: [currentUser.uid, participantId], // 참가자 필드 추가
          };

          await setDoc(doc(db, "privateChatRooms", newChatRoomId), newChatRoom);
          return newChatRoomId;
        } else {
          throw new Error(
            "Both user IDs must be available to create a chat room."
          );
        }
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//슬라이스 정의
const privateChatRoomSlice = createSlice({
  name: "privateChatRoom", // 여기서 슬라이스 이름을 수정합니다.
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivateChatRoomById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPrivateChatRoomById.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.chatId = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPrivateChatRoomById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default privateChatRoomSlice.reducer;
