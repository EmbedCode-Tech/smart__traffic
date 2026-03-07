const params = new URLSearchParams(window.location.search);
const qrID = params.get("id");

const result = document.getElementById("result");

if (!qrID) {
  result.innerHTML = "❌ No QR ID Found";
} else {
  verifyQR(qrID);
}

async function verifyQR(qrID) {

  const url =
  "https://firestore.googleapis.com/v1/projects/smart-traffic-c5998/databases/(default)/documents/vehicles/" + qrID;

  try {

    const response = await fetch(url);

    if (response.status === 200) {

      const data = await response.json();
      const fields = data.fields;

      const name = fields.name?.stringValue || "N/A";
      const vehicle = fields.vehicle?.stringValue || "N/A";
      const license = fields.license?.stringValue || "N/A";

      const pucExpiry = fields.expiry?.stringValue || "N/A";
      const licenseExpiry = fields.licenseExpiry?.stringValue || "N/A";

      const today = new Date();

      // PUC status
      let pucStatus = "✅ PUC VALID";
      const pucDate = new Date(pucExpiry);
      if (pucDate < today) {
        pucStatus = "❌ PUC EXPIRED";
      }

      // License status
      let licenseStatus = "✅ LICENSE VALID";
      const licDate = new Date(licenseExpiry);
      if (licDate < today) {
        licenseStatus = "❌ LICENSE EXPIRED";
      }

      result.innerHTML = `
        <h2 style="color:green;">✅ VERIFIED</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>

        <p><b>License Number:</b> ${license}</p>
        <p><b>License Expiry:</b> ${licenseExpiry}</p>
        <p>${licenseStatus}</p>

        <hr>

        <p><b>PUC Expiry:</b> ${pucExpiry}</p>
        <p>${pucStatus}</p>
      `;

    }
    else if (response.status === 404) {

      result.innerHTML = `
        <h2 style="color:red;">❌ NOT FOUND</h2>
        Invalid QR Code
      `;

    }
    else {

      result.innerHTML = "Error verifying QR";

    }

  }
  catch (error) {

    console.error(error);
    result.innerHTML = "Server Error";

  }
}

console.log("QR ID:", qrID);
console.log("Firestore URL:", url);
