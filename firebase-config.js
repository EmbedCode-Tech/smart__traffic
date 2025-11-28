// firebase-config.js
// Replace the firebaseConfig object below with your project's config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVWRJFpMoksy3PFetDie5hVXPI5tQJM4w",
  authDomain: "smart-traffic-c5998.firebaseapp.com",
  projectId: "smart-traffic-c5998",
  storageBucket: "smart-traffic-c5998.firebasestorage.app",
  messagingSenderId: "218505366734",
  appId: "1:218505366734:web:4beba71abf4f1df282d49f",
  measurementId: "G-QX4X5GD3WT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
