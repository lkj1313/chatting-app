import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");

  // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
  if (!token) {
    return NextResponse.redirect(new URL("/loginpage", request.url));
  }

  // 토큰이 있는 경우 요청을 계속 진행
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ["/", "/home", "/dashboard"], // 로그인 필요 경로
};
