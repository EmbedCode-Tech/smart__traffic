```javascript
/* ---------------- Get QR ID from URL ---------------- */

const params = new URLSearchParams(window.location.search);
const qrID = params.get("id");

const result = document.getElementById("result");

if (!qrID) {
  result.innerHTML = "❌ No QR ID Found";
} else {
  verifyQR(qrID);
}

/* ---------------- Verify QR using Firestore REST API ---------------- */

async function verifyQR(qrID) {

  const url =
    "https://firestore.googleapis.com/v1/projects/smart-traffic-c5998/databases/(default)/documents/vehicles/" +
    qrID;

  try {

    const response = await fetch(url);

    if (response.status === 200) {

      const data = await response.json();

      const fields = data.fields;

      const name = fields.name?.stringValue || "N/A";
      const vehicle = fields.vehicle?.stringValue || "N/A";
      const license = fields.license?.stringValue || "N/A";
      const expiry = fields.expiry?.stringValue || "N/A";

      result.innerHTML = `
        <h2 style="color:green;">✅ VERIFIED</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>License:</b> ${license}</p>
        <p><b>Expiry:</b> ${expiry}</p>
      `;

    } 
    else if (response.status === 404) {

      result.innerHTML = `
        <h2 style="color:red;">❌ NOT FOUND</h2>
        <p>Invalid QR Code</p>
      `;

    } 
    else {

      result.innerHTML = `
        <h2 style="color:red;">Error verifying QR</h2>
      `;

    }

  } catch (error) {

    console.error(error);

    result.innerHTML = `
      <h2 style="color:red;">Server Error</h2>
    `;

  }
}
```
