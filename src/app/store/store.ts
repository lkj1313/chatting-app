import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import containerReducer from "./containerSlice";
import uiReducer from "./uiSlice";
import chatRoomReducer from "./chatRoomSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    container: containerReducer,
    ui: uiReducer,
    chatRoom: chatRoomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
