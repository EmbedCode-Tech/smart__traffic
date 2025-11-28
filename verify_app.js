// verify_app.js
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const startBtn = document.getElementById('startScan');
const stopBtn = document.getElementById('stopScan');
const readerId = 'reader';
const verifyResult = document.getElementById('verifyResult');
const statusText = document.getElementById('statusText');
const details = document.getElementById('details');

let html5QrCode = null;

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  verifyResult.classList.add('hidden');
  statusText.textContent = 'Scanning...';
  details.innerHTML = '';

  html5QrCode = new Html5Qrcode(readerId);
  const config = { fps: 10, qrbox: 250 };

  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      async (decodedText) => {
        // Stop on first read
        await html5QrCode.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
        checkDocument(decodedText);
      }
    );
  } catch (err) {
    console.error(err);
    alert('Camera permission or error: ' + err.message);
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

stopBtn.addEventListener('click', async () => {
  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch {}
  }
  startBtn.disabled = false;
  stopBtn.disabled = true;
  statusText.textContent = 'Scanner stopped.';
});

async function checkDocument(docId) {
  verifyResult.classList.remove('hidden');
  statusText.textContent = 'Checking...';
  try {
    const dref = doc(db, 'vehicles', docId);
    const snap = await getDoc(dref);
    if (!snap.exists()) {
      statusText.innerHTML = `<span style="color:${'#ef4444'}">INVALID</span>`;
      details.innerHTML = `<p>No record found for ID: <strong>${docId}</strong></p>`;
      return;
    }
    const data = snap.data();
    statusText.innerHTML = `<span style="color:${'#16a34a'}">VALID</span>`;
    details.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Vehicle:</strong> ${data.vehicle}</p>
      <p><strong>License:</strong> ${data.license}</p>
      <p><strong>Insurance Expiry:</strong> ${data.expiry}</p>
      <p><strong>PUC No:</strong> ${data.pucNumber}</p>
      <p><strong>PUC Expiry:</strong> ${data.pucExpiry}</p>
    `;
  } catch (err) {
    console.error(err);
    statusText.textContent = 'Error checking database.';
  }
}
