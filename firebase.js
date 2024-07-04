// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz4RHsjgbE-dpbuA0KXY3_kIq3p711JT4",
  authDomain: "chatting-app-33e4e.firebaseapp.com",
  projectId: "chatting-app-33e4e",
  storageBucket: "chatting-app-33e4e.appspot.com",
  messagingSenderId: "362950588475",
  appId: "1:362950588475:web:eefd480996b759b160841e",
  measurementId: "G-0Y41CEGQBZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, app, storage };
