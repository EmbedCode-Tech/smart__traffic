import { db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

window.verifyQR = async function () {
    const qrId = document.getElementById("qrInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if (!qrId) {
        alert("Enter License Number");
        return;
    }

    const licenseRef = doc(db, "licenses", qrId);
    const licenseSnap = await getDoc(licenseRef);

    if (licenseSnap.exists()) {
        resultBox.innerHTML = "Found";
    } else {
        resultBox.innerHTML = "Not Found";
    }
};
