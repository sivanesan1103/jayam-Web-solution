// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs59AzO26Q6jwevvgW44xQ-9tYsJCW3UM",
  authDomain: "oauth2-a2cf5.firebaseapp.com",
  projectId: "oauth2-a2cf5",
  storageBucket: "oauth2-a2cf5.firebasestorage.app",
  messagingSenderId: "294008847357",
  appId: "1:294008847357:web:8205e141beb922c0d9f794"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();

export { app, auth, GoogleProvider };