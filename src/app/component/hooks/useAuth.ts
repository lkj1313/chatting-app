"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "@/app/store/authSlice";
import { auth, db } from "../../../../firebase";
import { signInWithCustomToken } from "firebase/auth";
import { getCookie, deleteCookie } from "cookies-next";
import { doc, getDoc } from "firebase/firestore";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getCookie("authToken");

    if (token) {
      // 토큰이 존재하면 Firebase로 로그인 시도
      signInWithCustomToken(auth, token as string)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const idTokenResult = await user.getIdTokenResult();

          // Firestore에서 추가 사용자 정보 로드
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          dispatch(
            login({
              uid: user.uid,
              email: user.email,
              nickname: userData.nickname || null,
              profileImgURL: userData.profileImgURL || "/profile.jpg",
            })
          );
        })
        .catch((error) => {
          console.error("Failed to sign in with custom token:", error);
          deleteCookie("authToken"); // 실패 시 쿠키 제거
        });
    } else {
      dispatch(logout());
    }
  }, [dispatch]);
};

export default useAuth;
