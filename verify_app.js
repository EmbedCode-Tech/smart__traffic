window.addEventListener("load", function () {

    const startBtn = document.getElementById("startScan");
    const stopBtn = document.getElementById("stopScan");
    const resultBox = document.getElementById("verifyResult");
    const statusText = document.getElementById("statusText");
    const detailsDiv = document.getElementById("details");

    let html5QrCode;
    let scanning = false;

    startBtn.addEventListener("click", async function () {
        try {
            html5QrCode = new Html5Qrcode("reader");

            // Get available cameras
            const devices = await Html5Qrcode.getCameras();
            if (!devices || devices.length === 0) {
                alert("No camera found");
                return;
            }

            const cameraId = devices[0].id;

            // Start scanning
            await html5QrCode.start(
                cameraId,
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    handleScan(decodedText);
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

    function handleScan(decodedText) {
        resultBox.classList.remove("hidden");

        try {
            // Parse JSON from QR
            const data = JSON.parse(decodedText);

            // Validate required fields
            if (data.license && data.vehicle && data.name) {
                statusText.innerText = "✅ Data is Correct";
                statusText.style.color = "green";

                detailsDiv.innerHTML = `
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>License:</strong> ${data.license}</p>
                    <p><strong>Vehicle:</strong> ${data.vehicle}</p>
                    <p><strong>PUC Number:</strong> ${data.pucNumber || "-"}</p>
                    <p><strong>PUC Expiry:</strong> ${data.pucExpiry || "-"}</p>
                    <p><strong>Expiry:</strong> ${data.expiry || "-"}</p>
                    <p><strong>Created At:</strong> ${data.createdAt || "-"}</p>
                `;
            } else {
                statusText.innerText = "❌ Invalid QR Code";
                statusText.style.color = "red";
                detailsDiv.innerHTML = `<p>QR Content: ${decodedText}</p>`;
            }

        } catch (err) {
            // Not valid JSON
            statusText.innerText = "❌ Invalid QR Code";
            statusText.style.color = "red";
            detailsDiv.innerHTML = `<p>QR Content: ${decodedText}</p>`;
        }

        // Stop scanning after reading
        stopScanner();
    }

});
