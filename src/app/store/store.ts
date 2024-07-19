import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import containerReducer from "./containerSlice";
import uiReducer from "./uiSlice";
import chatRoomReducer from "./chatRoomSlice";
import messagesReducer from "./messagesSlice";
import privateChatRoomReducer from "./privateChatRoomSlice"; // 올바른 이름으로 import

// Redux 스토어를 구성합니다.
const store = configureStore({
  reducer: {
    auth: authReducer,
    container: containerReducer,
    ui: uiReducer,
    chatRoom: chatRoomReducer,
    messages: messagesReducer,
    privateChatRoom: privateChatRoomReducer, // 올바른 이름으로 설정
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
