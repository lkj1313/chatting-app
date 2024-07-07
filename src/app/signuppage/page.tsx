"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { toast } from "react-toastify";

interface FirebaseError extends Error {
  code: string;
}

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

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

  const validateNickname = (value: string) => {
    if (value.length < 1) {
      return "닉네임은 최소 1자 이상이어야 합니다.";
    }
    return "";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      return "비밀번호가 일치하지 않습니다.";
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

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: validateConfirmPassword(password, value),
    }));
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      nickname: validateNickname(value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword
    );
    const nicknameError = validateNickname(nickname);

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      nickname: nicknameError,
    });

    if (
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      !nicknameError
    ) {
      const toastId2 = toast("회원가입을 진행중입니다!", {
        type: "info",
        autoClose: false,
      });
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // 기본프사 이미지 경로
        const defaultProfilePictureUrl =
          "https://firebasestorage.googleapis.com/v0/b/chatting-app-33e4e.appspot.com/o/profile.jpg?alt=media";
        // Firestore에 사용자 정보 저장
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          nickname: nickname,
          profileImg: defaultProfilePictureUrl,
          createdAt: new Date(),
        });

        setTimeout(() => {
          toast.update(toastId2, {
            render: "회원가입 성공!",
            type: "success",
            autoClose: 1000,
          });
          router.push("/loginpage");
        }, 2000);
      } catch (error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === "auth/email-already-in-use") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            form: "이미 사용 중인 이메일입니다.",
          }));
        } else {
          console.error("Error creating user: ", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            form: "사용자 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
          }));
        }
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ml-1 mr-1">
      <div
        className="card p-4 shadow-sm container"
        style={{ width: "80%", maxWidth: "500px", borderRadius: "5%" }}
      >
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Signup</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="nickname" className="form-label">
                Nickname
              </label>
              <input
                type="text"
                className="form-control"
                id="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                required
              />
              {errors.nickname && (
                <p className="text-danger">{errors.nickname}</p>
              )}
            </div>
            {errors.form && <p className="text-danger mt-3">{errors.form}</p>}
            <button type="submit" className="btn btn-primary w-100">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
