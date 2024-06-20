import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.projectId,
      clientEmail: process.env.clientEmail,
      privateKey: procee.env.privateKey,
    }),
  });
}

const adminAuth = admin.auth();
export { adminAuth };
