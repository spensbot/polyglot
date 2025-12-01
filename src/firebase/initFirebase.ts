// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmWPxtZNY0hmYAdfwRHVvaBfh1LjEl-X4",
  authDomain: "polyglot-a95b6.firebaseapp.com",
  projectId: "polyglot-a95b6",
  storageBucket: "polyglot-a95b6.firebasestorage.app",
  messagingSenderId: "682281439752",
  appId: "1:682281439752:web:ccab1f07fba9da26a1f7bd",
  measurementId: "G-YWJESLJJLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const creds = await signInWithPopup(auth, provider);

setTimeout(async () => {
  try {
    const functions = getFunctions(app, "us-west1"); // region must match your deployed region (default if unspecified)
    const healthFn = httpsCallable(functions, "health");
    const res = await healthFn(); // no data needed
    // For v2 callable, res.data holds what you returned ("ok")
    console.log("Health check response:", res.data);
  } catch (error) {
    console.error("Error calling health function:", error);
  }
}, 1000)
