import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect("/loginpage");
  }

  // 토큰을 검증하는 추가적인 로직을 수행할 수 있습니다.
  // 예를 들어, 서버에서 토큰을 검증하고 결과에 따라 처리합니다.

  return NextResponse.next(); // 요청을 다음 핸들러로 전달합니다.
}

export const config = {
  matcher: "/",
};
