"use client"; // 이 파일이 클라이언트 사이드에서만 렌더링되도록 함

import { useEffect } from "react";
import useAuth from "@/app/component/hooks/useAuth"; // useAuth 훅을 가져옵니다.

const ClientSideAuth = () => {
  useAuth(); // 클라이언트 사이드에서만 인증 상태를 처리합니다.

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default ClientSideAuth;
