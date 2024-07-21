import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  additionalInfo: any;
  profileImg: string | undefined;
  uid: string | null;
  email: string | null;
  nickname: string | null;
  profileImgURL: string | null;
  friend: string[] | null; // 친구 목록을 배열로 수정
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    uid: null,
    email: null,
    nickname: null,
    profileImgURL: "/profile.jpg",
    additionalInfo: undefined,
    profileImg: undefined,
    friend: [], // 초기 값을 빈 배열로 설정
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Partial<User>>) => {
      state.isAuthenticated = true;
      state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
    addFriend: (state, action: PayloadAction<string>) => {
      if (state.user.friend) {
        state.user.friend.push(action.payload);
      } else {
        state.user.friend = [action.payload];
      }
    },
  },
});

export const { login, logout, addFriend } = authSlice.actions;

export default authSlice.reducer;
