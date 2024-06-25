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

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Decoded Token:", decodedToken);
    const uid = decodedToken.uid;
    const customToken = await adminAuth.createCustomToken(uid);
    return NextResponse.json(
      { message: "Login successful", customToken },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying ID token:", error.message);
    return NextResponse.json(
      { message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
