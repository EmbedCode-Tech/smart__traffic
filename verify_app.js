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
  "https://firestore.googleapis.com/v1/projects/smart-traffic-c5998/databases/(default)/documents/vehicles/latest" + qrID;

  try {

    const response = await fetch(url);

    if (response.status === 200) {

      const data = await response.json();
      const fields = data.fields;

      const name = fields.name?.stringValue || "N/A";
      const vehicle = fields.vehicle?.stringValue || "N/A";
      const license = fields.license?.stringValue || "N/A";
      const expiry = fields.expiry?.stringValue || "N/A";

      let pucStatus = "✅ PUC VALID";

      const today = new Date();
      const expiryDate = new Date(expiry);

      if (expiryDate < today) {
        pucStatus = "❌ PUC EXPIRED";
      }

      result.innerHTML = `
        <h2 style="color:green;">✅ VERIFIED</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>License:</b> ${license}</p>
        <p><b>PUC Expiry:</b> ${expiry}</p>
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
