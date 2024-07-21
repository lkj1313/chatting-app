import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/loginpage", request.url));
  }

  // 토큰이 있다면 사용자가 원하는 대로 진행
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // 루트 경로
    "/chatroompage/:path*",
    "/friendpage",
    "/privatechatpage/:path*", // chatroompage 경로 및 모든 하위 경로
  ],
};
