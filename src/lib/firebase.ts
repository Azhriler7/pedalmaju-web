// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3jLOUmC45zuXjA8Rh9BCXbpBi8tt-oj0",
  authDomain: "pedalmaju-6ee0e.firebaseapp.com",
  projectId: "pedalmaju-6ee0e",
  storageBucket: "pedalmaju-6ee0e.firebasestorage.app",
  messagingSenderId: "507551151339",
  appId: "1:507551151339:web:ffcf9e119fddc505d37aae",
  measurementId: "G-WDMDZC8VJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);