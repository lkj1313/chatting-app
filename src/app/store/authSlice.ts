import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    additionalInfo: any;
    profileImg: string | undefined;
    uid: string | null;
    email: string | null;
    nickname: string | null;
    profileImgURL: string | null;
  };
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
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Partial<AuthState["user"]>>) => {
      state.isAuthenticated = true;
      state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
