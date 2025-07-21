// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHEv56P1oi5-vWWtJtpHc3ziAop9h0KrU",
  authDomain: "blood-donation-system-bds.firebaseapp.com",
  projectId: "blood-donation-system-bds",
  storageBucket: "blood-donation-system-bds.firebasestorage.app",
  messagingSenderId: "1074899790425",
  appId: "1:1074899790425:web:f70555b7b8944bb4cadf48",
  measurementId: "G-MKHSZK2EN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);