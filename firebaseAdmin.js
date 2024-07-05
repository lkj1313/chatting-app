import admin from "firebase-admin";
import dotenv from "dotenv";

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

// Vercel 환경 변수를 우선 사용하고, 로컬 환경에서는 .env 파일의 변수를 사용합니다.
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// Firebase 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Firebase 인증 및 Firestore 내보내기
const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db };
