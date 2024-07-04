"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../../../firebase";
import { logout } from "@/app/store/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";

const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      toast.info("Logging out...", { autoClose: 500 });
      // Firebase Auth에서 로그아웃
      await firebaseSignOut(auth);

      // 서버에 로그아웃 요청 보내기
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        // Redux 상태 초기화
        dispatch(logout());
        setTimeout(() => {
          router.push("/loginpage");
        }, 2000);
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return handleSignOut;
};

export default useSignOut;
