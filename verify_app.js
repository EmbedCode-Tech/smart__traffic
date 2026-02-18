import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVWRJFpMoksy3PFetDie5hVXPI5tQJM4w",
  authDomain: "smart-traffic-c5998.firebaseapp.com",
  projectId: "smart-traffic-c5998",
  storageBucket: "smart-traffic-c5998.firebasestorage.app",
  messagingSenderId: "218505366734",
  appId: "1:218505366734:web:4beba71abf4f1df282d49f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Get ID from URL
const params = new URLSearchParams(window.location.search);
const qrID = params.get("id");

const result = document.getElementById("result");

if (!qrID) {
  result.innerHTML = "❌ No QR ID Found";
} else {
  verifyQR(qrID);
}

async function verifyQR(qrID) {

  try {
    const docRef = doc(db, "vehicles", qrID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      result.innerHTML = `
        ✅ VERIFIED <br><br>
        Name: ${data.name} <br>
        Vehicle: ${data.vehicle} <br>
        License: ${data.license} <br>
        Expiry: ${data.expiry}
      `;

    } else {
      result.innerHTML = "❌ NOT FOUND";
    }

  } catch (error) {
    console.error(error);
    result.innerHTML = "Error verifying";
  }
}
