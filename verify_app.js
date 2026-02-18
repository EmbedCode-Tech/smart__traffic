// Firebase v10 Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAVWRJFpMoksy3PFetDie5hVXPI5tQJM4w",
  authDomain: "smart-traffic-c5998.firebaseapp.com",
  projectId: "smart-traffic-c5998",
  storageBucket: "smart-traffic-c5998.firebasestorage.app",
  messagingSenderId: "218505366734",
  appId: "1:218505366734:web:4beba71abf4f1df282d49f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make function global for button
window.verifyQR = async function () {

  const qrValue = document.getElementById("qrInput").value.trim();
  const result = document.getElementById("result");

  if (!qrValue) {
    result.innerHTML = "Please enter QR Code ID";
    return;
  }

  console.log("Searching document ID:", qrValue);

  try {
    // 🔹 Get document directly using document ID
    const docRef = doc(db, "vehicles", qrValue);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      result.innerHTML = `
        ✅ Verified <br><br>
        Name: ${data.name} <br>
        Vehicle: ${data.vehicle} <br>
        License: ${data.license} <br>
        Expiry: ${data.expiry} <br>
        PUC Expiry: ${data.pucExpiry}
      `;

    } else {
      result.innerHTML = "❌ Not Found";
    }

  } catch (error) {
    console.error("Verification Error:", error);
    result.innerHTML = "Error verifying QR";
  }
};
