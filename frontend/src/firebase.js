import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDndlgwxmrY7z5UQGrQTKss5uDu-UnwHHU",
  authDomain: "dream-lineup-c788d.firebaseapp.com",
  projectId: "dream-lineup-c788d",
  storageBucket: "dream-lineup-c788d.firebasestorage.app",
  messagingSenderId: "94207890217",
  appId: "1:94207890217:web:7a483644b519b830c5dd38",
  measurementId: "G-VSSEYX1J1C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);