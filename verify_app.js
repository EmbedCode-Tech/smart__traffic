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

    resultBox.innerHTML = "Checking...";

    try {

        // 🔍 Fetch License
        const licenseRef = doc(db, "licenses", qrId);
        const licenseSnap = await getDoc(licenseRef);

        if (licenseSnap.exists()) {

            const data = licenseSnap.data();
            const today = new Date().toISOString().split("T")[0];

            const licenseValid = data.expiry >= today;
            const pucValid = data.pucExpiry >= today;

            resultBox.innerHTML = `
                <h3 style="color:green;">✅ VALID RECORD</h3>
                <p><b>Name:</b> ${data.name}</p>
                <p><b>Vehicle:</b> ${data.vehicle}</p>
                <p><b>License Expiry:</b> ${data.expiry}</p>
                <p><b>PUC Expiry:</b> ${data.pucExpiry}</p>
                <hr>
                <p style="color:${licenseValid ? "green" : "red"};">
                    License Status: ${licenseValid ? "VALID" : "EXPIRED"}
                </p>
                <p style="color:${pucValid ? "green" : "red"};">
                    PUC Status: ${pucValid ? "VALID" : "EXPIRED"}
                </p>
            `;

            // ✅ LOG FIXED VERSION
            const logsCollection = collection(db, "verificationLogs");

            await addDoc(logsCollection, {
                license: qrId,
                status: "FOUND",
                licenseValid: licenseValid,
                pucValid: pucValid,
                timestamp: serverTimestamp()
            });

        } else {

            resultBox.innerHTML = `
                <h3 style="color:red;">❌ LICENSE NOT FOUND</h3>
            `;

            const logsCollection = collection(db, "verificationLogs");

            await addDoc(logsCollection, {
                license: qrId,
                status: "NOT_FOUND",
                timestamp: serverTimestamp()
            });
        }

    } catch (error) {
        console.error(error);
        resultBox.innerHTML = `
            <h3 style="color:red;">⚠ ERROR</h3>
            <p>${error.message}</p>
        `;
    }
};
