import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect("/loginpage");
  }

  return NextResponse.next(); // 요청을 다음 핸들러로 전달합니다.
}

export const config = {
  matcher: "/",
};
