import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import containerReducer from "./containerSlice";
import uiReducer from "./uiSlice";
import chatRoomReducer from "./chatRoomSlice";
import messagesReducer from "./messagesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    container: containerReducer,
    ui: uiReducer,
    chatRoom: chatRoomReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
