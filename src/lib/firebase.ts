import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR7LfzRnoSPppH2jXJxReCAob7QPl2O3A",
  authDomain: "netflix-clone-0115.firebaseapp.com",
  projectId: "netflix-clone-0115",
  storageBucket: "netflix-clone-0115.firebasestorage.app",
  messagingSenderId: "485136836276",
  appId: "1:485136836276:web:e5c3b2b8de1b7e2a1c59e1",
  measurementId: "G-1PTFS76Z4Y"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };
