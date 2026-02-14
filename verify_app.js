const startBtn = document.getElementById("startScan");
const stopBtn = document.getElementById("stopScan");
const resultBox = document.getElementById("verifyResult");
const statusText = document.getElementById("statusText");
const detailsDiv = document.getElementById("details");

const html5QrCode = new Html5Qrcode("reader");
let scanning = false;

// 🔹 Change this to your expected QR value
const VALID_QR_DATA = "TRAFFIC-VALID-12345";

startBtn.addEventListener("click", async () => {
  try {
    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      onScanSuccess,
      onScanError
    );

    scanning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

  } catch (err) {
    alert("Camera error: " + err);
  }
});

stopBtn.addEventListener("click", async () => {
  if (scanning) {
    await html5QrCode.stop();
    scanning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

function onScanSuccess(decodedText) {

  resultBox.classList.remove("hidden");

  if (decodedText === VALID_QR_DATA) {
    statusText.innerText = "✅ Data is Correct";
    statusText.className = "success";
  } else {
    statusText.innerText = "❌ Invalid QR Code";
    statusText.className = "error";
  }

  detailsDiv.innerHTML = `<p><strong>QR Content:</strong> ${decodedText}</p>`;

  // Stop after scan
  html5QrCode.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function onScanError(errorMessage) {
  // ignore minor scan errors
}
