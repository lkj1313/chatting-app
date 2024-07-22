import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // 기본적으로 localStorage를 사용

import authReducer from "./authSlice";
import containerReducer from "./containerSlice";
import uiReducer from "./uiSlice";
import chatRoomReducer from "./chatRoomSlice";
import chatRoomMessagesReducer from "./chatRoomMessagesSlice";
import privateChatRoomReducer from "./privateChatRoomSlice";
import privateChatRoomMessagesReducer from "./privateChatRoomMessagesSlice"; // 새로운 슬라이스 import
import participantModalSlice from "./participantModalSlice";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
};

// 루트 리듀서를 생성하여 persistReducer에 전달합니다.
const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  container: containerReducer,
  ui: uiReducer,
  chatRoom: chatRoomReducer,
  chatRoomMessages: chatRoomMessagesReducer,
  privateChatRoom: privateChatRoomReducer,
  privateChatRoomMessages: privateChatRoomMessagesReducer,
  participantModal: participantModalSlice,
};

// Redux 스토어를 구성합니다.
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
