"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { db } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";

import { useDispatch } from "react-redux";
import { login } from "@/app/store/authSlice";

import { doc, getDoc } from "firebase/firestore";

import { setCookie } from "cookies-next";

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const validateEmail = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
      return "유효한 이메일 주소를 입력해야 합니다.";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
    if (!passwordPattern.test(value)) {
      return "비밀번호는 최소 7자 이상이어야 하며, 적어도 하나의 영문자, 하나의 숫자, 하나의 특수 문자를 포함해야 합니다.";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("로그인 완료");
        const user = userCredential.user;

        const idToken = await user.getIdToken();
        console.log(idToken);
        const aa = JSON.stringify({ idToken });
        console.log(aa);

        // 토큰을 백엔드로 보내서 추가 처리
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const customToken = data.customToken;
          console.log("Received Custom Token:", customToken);

          // 커스텀 토큰으로 Firebase Auth에 로그인
          const customUserCredential = await signInWithCustomToken(
            auth,
            customToken
          );
          const idTokenResult = await customUserCredential.user.getIdToken();
          console.log("New ID Token:", idTokenResult);

          setCookie("authToken", idTokenResult, {
            maxAge: 60 * 60 * 24, // 1일 동안 유효
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            dispatch(
              login({
                uid: user.uid,
                email: userData.email,
                nickname: userData.nickname,
                profileImgURL: userData.profileImg,
              })
            );
          }

          router.push("/");
        } else {
          const errorData = await response.json();
          throw new Error("커스텀 토큰으로 로그인하는 중 오류가 발생했습니다.");
        }
      } catch (error: any) {
        console.error("Error signing in: ", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setShowCard(true);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ml-1 mr-1">
      <div
        className={`card p-4 shadow-sm container card-box ${
          showCard ? "show" : ""
        }`}
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "5%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          style={{ width: "50%", height: "10%" }}
          src="/favicon.png"
          className={`card-img-top`}
          alt=""
        />
        <div className="card-body" style={{ width: "100%" }}>
          <h5 className="card-title text-center mb-4">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                value={email}
                onChange={handleEmailChange}
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                required
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                value={password}
                onChange={handlePasswordChange}
                type="password"
                className="form-control"
                id="password"
                required
              />
              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}
            </div>
            {errors.form && <p className="text-danger">{errors.form}</p>}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
          <Link href="/signuppage">
            <button type="button" className="btn btn-secondary w-100 mt-2">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
LoginPage.getLayout = function getLayout(page: React.ReactNode) {
  return null;
};
