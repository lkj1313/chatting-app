import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/loginpage", request.url));
  }

  try {
    const response = await fetch(new URL("/api/auth", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: token }),
    });

    if (response.ok) {
      console.log("Token verification successful.");
      return NextResponse.next();
    } else {
      const { message } = await response.json();
      console.error("Token verification failed:", message);
      const redirectResponse = NextResponse.redirect(
        new URL("/loginpage", request.url)
      );
      redirectResponse.cookies.set("authToken", "", { maxAge: 0 });
      return redirectResponse;
    }
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return NextResponse.redirect(new URL("/loginpage", request.url));
  }
}

export const config = {
  matcher: "/",
};
