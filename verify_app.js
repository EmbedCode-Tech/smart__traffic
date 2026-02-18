import { db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.verifyQR = async function () {

    const qrId = document.getElementById("qrInput").value.trim();
    const resultBox = document.getElementById("resultBox");

    if (!qrId) {
        alert("Enter License Number");
        return;
    }

    resultBox.innerHTML = "<p>Checking...</p>";

    try {

        const docRef = doc(db, "licenses", qrId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();
            const today = new Date().toISOString().split("T")[0];

            const licenseValid = data.expiry >= today;
            const pucValid = data.pucExpiry >= today;

            resultBox.innerHTML = `
                <h3 style="color:green;">✅ RECORD FOUND</h3>
                <p><b>Name:</b> ${data.name}</p>
                <p><b>License:</b> ${data.license}</p>
                <p><b>Vehicle:</b> ${data.vehicle}</p>
                <p><b>License Expiry:</b> ${data.expiry}</p>
                <p><b>PUC Number:</b> ${data.pucNumber}</p>
                <p><b>PUC Expiry:</b> ${data.pucExpiry}</p>
                <p><b>Created At:</b> ${data.createdAt}</p>
                <hr>
                <p style="color:${licenseValid ? "green" : "red"};">
                    License Status: ${licenseValid ? "VALID" : "EXPIRED"}
                </p>
                <p style="color:${pucValid ? "green" : "red"};">
                    PUC Status: ${pucValid ? "VALID" : "EXPIRED"}
                </p>
            `;

            // Log verification
            await addDoc(collection(db, "verificationLogs"), {
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

            await addDoc(collection(db, "verificationLogs"), {
                license: qrId,
                status: "NOT_FOUND",
                timestamp: serverTimestamp()
            });
        }

    } catch (error) {

        resultBox.innerHTML = `
            <h3 style="color:red;">⚠ ERROR</h3>
            <p>${error.message}</p>
        `;
    }
};
