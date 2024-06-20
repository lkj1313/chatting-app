import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setCookie } from "cookies-next";
import { auth } from "../../../../firebase";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    const response = NextResponse.json({ message: "Login successful" });
    setCookie("token", idToken, {
      req: request,
      res: response,
      maxAge: 60 * 60 * 24, // 1일 동안 유효
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 401 }
    );
  }
}
