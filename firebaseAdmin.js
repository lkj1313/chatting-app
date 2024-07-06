import admin from "firebase-admin";
import dotenv from "dotenv";

// 환경 변수 설정 파일 로드
dotenv.config();

const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error("SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.");
}

const serviceAccount = JSON.parse(serviceAccountKey);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
console.log(serviceAccount.private_key);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized");
}

const adminAuth = admin.auth();

export { adminAuth };
