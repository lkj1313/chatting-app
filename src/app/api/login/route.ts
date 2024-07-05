// app/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../firebaseAdmin"; // Firebase 초기화 파일에서 import
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    console.log("Received ID Token:", idToken);

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Decoded UID:", uid);
    // 커스텀 토큰 생성
    const customToken = await adminAuth.createCustomToken(uid);
    console.log("Generated Custom Token:", customToken);

    return NextResponse.json({
      message: "Login successful",
      customToken,
    });
  } catch (error: any) {
    console.error("Error creating custom token:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
