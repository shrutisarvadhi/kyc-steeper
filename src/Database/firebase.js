// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4O7ua-cR8p5gJGMwiRXsSZp0UuAYIaoE",
  authDomain: "kyc-steeper.firebaseapp.com",
  projectId: "kyc-steeper",
  storageBucket: "kyc-steeper.firebasestorage.app",
  messagingSenderId: "574713967928",
  appId: "1:574713967928:web:d6d39e3e7905882bc57dcd",
  measurementId: "G-8HFPX101Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };