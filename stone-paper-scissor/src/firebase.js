// Import Firebase core and services
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// ✅ Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo24kMVfgCoBMk48quai3F8RsMt5kebug",
  authDomain: "stone-paper-scissor-37a78.firebaseapp.com",
  projectId: "stone-paper-scissor-37a78",
  storageBucket: "stone-paper-scissor-37a78.appspot.com", // 🔧 corrected URL (".app" → ".appspot.com")
  messagingSenderId: "441925396155",
  appId: "1:441925396155:web:0ac8932cd035f9e6202b9e",
  measurementId: "G-FFTP4W9EQ2"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Analytics
const analytics = getAnalytics(app);

// ✅ Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };
