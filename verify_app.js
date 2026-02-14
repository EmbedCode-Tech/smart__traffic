window.addEventListener("load", function () {

  const startBtn = document.getElementById("startScan");
  const stopBtn = document.getElementById("stopScan");
  const resultBox = document.getElementById("verifyResult");
  const statusText = document.getElementById("statusText");
  const detailsDiv = document.getElementById("details");

  let html5QrCode;
  let scanning = false;
  const VALID_QR_DATA = "TRAFFIC-VALID-12345";

  startBtn.addEventListener("click", async function () {
    try {
      html5QrCode = new Html5Qrcode("reader");

      const devices = await Html5Qrcode.getCameras();
      if (!devices.length) {
        alert("No camera found");
        return;
      }

      const cameraId = devices[0].id;

      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          resultBox.classList.remove("hidden");

          if (decodedText === VALID_QR_DATA) {
            statusText.innerText = "✅ Data is Correct";
            statusText.style.color = "green";
          } else {
            statusText.innerText = "❌ Invalid QR Code";
            statusText.style.color = "red";
          }

          detailsDiv.innerHTML = `<p><strong>QR Content:</strong> ${decodedText}</p>`;

          stopScanner();
        }
      );

      scanning = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;

    } catch (err) {
      alert("Camera error: " + err.message);
    }
  });

  stopBtn.addEventListener("click", stopScanner);

  async function stopScanner() {
    if (html5QrCode && scanning) {
      await html5QrCode.stop();
      await html5QrCode.clear();
      scanning = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }

});
