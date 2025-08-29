import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your config
const firebaseConfig = {
  apiKey: "AIzaSyCD3IOJx-wUg-70nYYje2IkEWGavoctEnU",
  authDomain: "levelup-c595e.firebaseapp.com",
  projectId: "levelup-c595e",
  storageBucket: "levelup-c595e.firebasestorage.app",
  messagingSenderId: "479790442959",
  appId: "1:479790442959:web:fd6d058e5c1ae35fc0caba",
  measurementId: "G-CWF3FSN5T6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to ensure we have a signed-in user (anonymous auth)
export function ensureUser() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) { unsub(); resolve(user); }
      else signInAnonymously(auth).catch(reject);
    });
  });
}
