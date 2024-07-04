import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    console.log("ID Token:", idToken);

    if (!idToken) {
      return NextResponse.json(
        { message: "Missing ID token" },
        { status: 400 }
      );
    }

    // ID 토큰을 검증하여 디코딩된 토큰 정보를 얻음
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken);

    return NextResponse.json({ message: "Token is valid" }, { status: 200 });
  } catch (error: any) {
    console.error("Error verifying ID token:", error.message);
    return NextResponse.json(
      { message: "Invalid token", error: error.message },
      { status: 401 }
    );
  }
}
