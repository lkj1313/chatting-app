import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import containerReducer from "./containerSlice";
import uiReducer from "./uiSlice";
import chatRoomReducer from "./chatRoomSlice";
import chatRoomMessagesReducer from "./chatRoomMessagesSlice";
import privateChatRoomReducer from "./privateChatRoomSlice";
import privateChatRoomMessagesReducer from "./privateChatRoomMessagesSlice"; // 새로운 슬라이스 import

// Redux 스토어를 구성합니다.
const store = configureStore({
  reducer: {
    auth: authReducer,
    container: containerReducer,
    ui: uiReducer,
    chatRoom: chatRoomReducer,
    chatRoomMessages: chatRoomMessagesReducer,
    privateChatRoom: privateChatRoomReducer,
    privateChatRoomMessages: privateChatRoomMessagesReducer, // 새로운 슬라이스 추가
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
