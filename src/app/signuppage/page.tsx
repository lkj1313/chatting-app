"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
interface FirebaseError extends Error {
  code: string;
}
const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    const nicknameError = validateNickname(nickname);

    setErrors({
      email: emailError,
      password: passwordError,
      nickname: nicknameError,
    });

    if (!emailError && !passwordError && !nicknameError) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        // 기본프사 이미지 경로
        const defaultProfilePictureUrl = "/profile.jpg";
        // Firestore에 사용자 정보 저장
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          nickname: nickname,
          profileImg: defaultProfilePictureUrl,
          createdAt: new Date(),
        });

        console.log("Form submitted successfully!");
        // 여기서 추가적으로 원하는 동작을 수행할 수 있습니다.
        alert("회원가입이 완료되었습니다, 로그인 해주세요!");
        router.push("loginpage");
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
        style={{ width: "100%", maxWidth: "500px", borderRadius: "5%" }}
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
            <button type="submit" className="btn btn-primary w-100">
              Signup
            </button>
            {errors.form && <p className="text-danger mt-3">{errors.form}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
