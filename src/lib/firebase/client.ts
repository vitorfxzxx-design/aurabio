import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCtSC-kOZ_DEVRsLnLpeYy3mvR0VVxy9eY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aurabio-b8191.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aurabio-b8191",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aurabio-b8191.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1064962602406",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1064962602406:web:7a8bec8db585bf63aacb67"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
