// auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const onIndex = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.endsWith('');
const onRegister = location.pathname.endsWith('register.html');

if (onRegister) {
  const regBtn = document.getElementById("registerBtn");
  const back = document.getElementById("backLogin");
  regBtn.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    if (!email || !password) return alert("Fill email & password");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      await setDoc(doc(db, "users", uid), { email, role });
      alert("Account created.");
      window.location = 'index.html';
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  });

  back.addEventListener("click", () => window.location = 'index.html');
}

if (onIndex) {
  const loginBtn = document.getElementById("loginBtn");
  const toRegister = document.getElementById("toRegister");

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const selectedRole = document.getElementById("roleSelect").value;

    if (!email || !password) return alert("Fill email & password");
    try {
      const u = await signInWithEmailAndPassword(auth, email, password);
      const uid = u.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        alert("Role not found. Contact admin.");
        return;
      }
      const role = userDoc.data().role;
      if (role !== selectedRole) {
        alert("Role mismatch. Select correct login type.");
        return;
      }
      if (role === 'user') window.location = 'user_dashboard.html';
      else window.location = 'police_dashboard.html';
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  });

  toRegister.addEventListener("click", () => window.location = 'register.html');
}
