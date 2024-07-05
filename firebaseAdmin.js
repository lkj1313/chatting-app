import admin from "firebase-admin";
import dotenv from "dotenv";
import process from "process";

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

// 환경 변수를 읽어옵니다.
const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error("SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.");
}

// JSON 문자열을 객체로 변환합니다.
const serviceAccount = JSON.parse(serviceAccountKey);

// PEM 형식의 키에서 줄바꿈 문자를 올바르게 처리합니다.
if (serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

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
