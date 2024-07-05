//login route

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../firebaseAdmin"; // 초기화한 Firebase Admin SDK를 가져옵니다.

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      throw new Error("Missing ID token");
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("decodetoken", decodedToken);
    const uid = decodedToken.uid;

    // Custom Token 생성
    const customToken = await adminAuth.createCustomToken(uid);
    console.log("Generated Custom Token:", customToken);
    return NextResponse.json({
      message: "Login successful",
      customToken,
    });
  } catch (error: any) {
    console.error("Error verifying ID token:", error.message);
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
