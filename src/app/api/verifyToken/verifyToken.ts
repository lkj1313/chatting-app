import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "../../../../firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { token } = req.body;

  try {
    // 토큰 검증
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 사용자 정보 가져오기
    const userRecord = await adminAuth.getUser(uid);

    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      nickname: userRecord.displayName,
      profileImg: userRecord.photoURL,
    });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
