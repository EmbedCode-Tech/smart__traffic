// vehicle_app.js
import { db, auth } from './firebase-config.js';
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const form = document.getElementById('registerForm');
const resultBox = document.getElementById('result');
const qrcodeBox = document.getElementById('qrcode');
const docIdSpan = document.getElementById('docId');
const downloadBtn = document.getElementById('downloadQR');
const clearBtn = document.getElementById('clearForm');

let qrcode = null;

// protect page: require login
onAuthStateChanged(auth, user => {
  if (!user) window.location = 'index.html';
});

function clearQR() {
  qrcodeBox.innerHTML = '';
  docIdSpan.textContent = '';
  resultBox.classList.add('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const vehicle = document.getElementById('vehicle').value.trim();
  const license = document.getElementById('license').value.trim();
  const expiry = document.getElementById('expiry').value;
  const pucNumber = document.getElementById('pucNumber').value.trim();
  const pucExpiry = document.getElementById('pucExpiry').value;

  if (!name || !vehicle || !license || !expiry || !pucNumber || !pucExpiry) return alert('Please fill all fields');

  try {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      name, vehicle, license, expiry, pucNumber, pucExpiry, createdAt: new Date().toISOString()
    });

    const id = docRef.id;
    docIdSpan.textContent = id;
    clearQR();
    new QRCode(qrcodeBox, { text: id, width: 180, height: 180 });
    resultBox.classList.remove('hidden');

  } catch (err) {
    console.error(err);
    alert('Error saving: ' + err.message);
  }
});

downloadBtn.addEventListener('click', () => {
  const img = qrcodeBox.querySelector('img') || qrcodeBox.querySelector('canvas');
  if (!img) return alert('No QR');
  const href = img.tagName.toLowerCase() === 'img' ? img.src : img.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = href;
  a.download = `qr_${docIdSpan.textContent}.png`;
  a.click();
});

clearBtn.addEventListener('click', () => {
  form.reset();
  clearQR();
});
