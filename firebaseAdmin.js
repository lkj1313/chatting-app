import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 환경 변수를 로드합니다.
dotenv.config();

// 환경 변수에서 필요한 값을 가져옵니다.
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const privateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;
const clientId = process.env.FIREBASE_CLIENT_ID;
const authUri = process.env.FIREBASE_AUTH_URI;
const tokenUri = process.env.FIREBASE_TOKEN_URI;
const authProviderX509CertUrl =
  process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
const clientX509CertUrl = process.env.FIREBASE_CLIENT_X509_CERT_URL;
const universeDomain = process.env.FIREBASE_UNIVERSE_DOMAIN;

// JSON 파일에서 키를 읽어와 비교하는 함수
const compareKeysAndInitializeApp = () => {
  // 절대 경로로 변경
  const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");
  let privateKeyFromJson = "";

  fs.readFile(serviceAccountPath, "utf8", (err, data) => {
    if (err) throw err;
    const serviceAccount = JSON.parse(data);
    privateKeyFromJson = serviceAccount.private_key;

    // 환경 변수와 JSON 파일에서 읽어온 키 값을 출력
    console.log("Private Key from JSON:", privateKeyFromJson);
    console.log("Private Key from ENV:", privateKey);

    // 두 키를 비교합니다.
    if (privateKey === privateKeyFromJson) {
      console.log("The keys are identical.");
    } else {
      console.log("The keys are different.");
    }

    // Firebase 초기화
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
          privateKeyId,
          clientId,
          authUri,
          tokenUri,
          authProviderX509CertUrl,
          clientX509CertUrl,
          universeDomain,
        }),
      });
    }
  });
};

// 비교 및 초기화 함수 호출
compareKeysAndInitializeApp();

// Firebase 인증 및 Firestore 내보내기
const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db };
