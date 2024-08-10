// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY8lozHZqvG69wY6MvO7WaJts28eLotE4",
  authDomain: "unipal-427212.firebaseapp.com",
  projectId: "unipal-427212",
  storageBucket: "unipal-427212.appspot.com",
  messagingSenderId: "844270508387",
  appId: "1:844270508387:web:de77e1a70df4847d421b56",
  measurementId: "G-HK80XVG41N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const perf = getPerformance(app);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);