import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../firebaseAdmin";

export async function POST(request: NextRequest) {
  console.log("Request received"); // 로그 추가
  try {
    const { token } = await request.json();

    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { message: "No token provided" },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    console.log("Token verified, UID:", uid); // 로그 추가

    return NextResponse.json({ uid });
  } catch (error) {
    console.error("Error fetching user data:", error); // 오류 로그 추가
    return NextResponse.json(
      { message: "Error fetching user data" },
      { status: 500 }
    );
  }
}
