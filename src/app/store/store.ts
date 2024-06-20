import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import containerReducer from "./containerSlice";

// 스토어 인스턴스를 직접 생성
const store = configureStore({
  reducer: {
    auth: authReducer,
    container: containerReducer,
  },
});

export default store;

// 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
