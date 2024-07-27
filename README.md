# 채팅 애플리케이션

![Chat Application Logo](https://github.com/lkj1313/chatting-app/raw/main/public/favicon.png)

React, Firebase, Next.js, TypeScript를 사용하여 만든 웹 기반 채팅 애플리케이션입니다. 이 애플리케이션을 통해 사용자는 회원 가입, 로그인, 실시간 채팅을 할 수 있습니다. 1:1채팅, 친추 추가, 이미지 업로드, 실시간 메시징, 사용자 인증 등의 기능을 포함하고 있습니다.

## 주요 기능

- **사용자 인증**: Firebase 인증을 사용한 안전한 회원 가입 및 로그인.
- **실시간 메시징**: Firebase Firestore를 사용한 실시간 채팅 기능.
- **이미지 업로드**: 채팅에서 이미지를 업로드하고 공유할 수 있습니다.
- **친구 추가**: 사용자 간 친구를 추가하고 관리할 수 있습니다.
- **1:1 대화하기**: 친구와 1:1로 대화할 수 있는 기능.
- **반응형 디자인**: 데스크탑과 모바일 뷰에 최적화된 디자인.

## 시작하기

개발 및 테스트 목적으로 로컬 머신에 프로젝트를 설정하는 방법을 설명합니다.

### 필요 사항

- Node.js (버전 14 이상)
- npm 또는 yarn
- Firebase 계정

### 설치

1. 리포지토리를 클론합니다:

   ```bash
   git clone https://github.com/lkj1313/chatting-app.git
   cd chatting-app
   ```

2. 종속성을 설치합니다:

   ```bash
   npm install
   ```

3. TypeScript 및 관련 패키지를 설치합니다:

   ```bash
   npm install --save-dev typescript @types/react @types/node
   ```

4. 환경 변수 설정 파일 생성:
   프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.

   `.env` 파일을 생성하고 실제 값을 입력합니다.

5. `tsconfig.json` 파일을 생성합니다:

   ```bash
   npx tsc --init
   ```

6. 개발 서버를 시작합니다:

   ```bash
   npm run dev
   ```

7. 브라우저를 열고 `http://localhost:3000`로 이동합니다.

## 배포

이 애플리케이션은 Vercel을 통해 배포되었습니다. 배포된 애플리케이션은 아래 링크에서 확인할 수 있습니다:

[채팅 애플리케이션 - Vercel 배포](https://chatting-app-sandy.vercel.app/loginpage)

## 사용 방법

### 회원 가입 및 로그인

1. 애플리케이션을 열고 회원 가입 페이지로 이동합니다.
2. 이메일과 비밀번호를 입력하고 회원 가입 버튼을 클릭합니다.
3. 로그인 페이지로 이동하여 이메일과 비밀번호로 로그인합니다.

### 채팅

1. 로그인 후 채팅방 페이지로 이동합니다.
2. 메시지를 입력하고 전송 버튼을 클릭하여 메시지를 보냅니다.
3. 이미지를 업로드하려면 이미지 업로드 버튼을 클릭하고 파일을 선택합니다.

### 친구 추가 및 1:1 대화

1. 친구 추가

   - 친구 페이지로 이동합니다.
   - 사용자 검색을 통해 친구로 추가하고 싶은 사용자를 찾습니다.
   - '친구 추가' 버튼을 클릭하여 친구로 추가합니다.

2. 1:1 대화
   - 친구 목록에서 대화하고 싶은 친구를 선택합니다.
   - '대화하기' 버튼을 클릭하여 1:1 대화 페이지로 이동합니다.
   - 메시지를 입력하고 전송 버튼을 클릭하여 친구와 대화합니다.

## 코드 예제

### 로그인 처리 함수

```typescript
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (!emailError && !passwordError) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await signInWithCustomTokenHandler(data.customToken);
        const docSnap = await getDoc(doc(db, "users", user.uid));
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
          router.push("/loadingpage");
        }
      } else {
        throw new Error("커스텀 토큰으로 로그인하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }
};
```
