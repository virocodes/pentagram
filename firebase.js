// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAu_vPzfmHBwmVR_yWGLisXDIyMBi7BXHU",
  authDomain: "pentagram-f9473.firebaseapp.com",
  projectId: "pentagram-f9473",
  storageBucket: "pentagram-f9473.firebasestorage.app",
  messagingSenderId: "728166366660",
  appId: "1:728166366660:web:347a0d9732429f6940f891",
  measurementId: "G-TPHQVWN7JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
});
  
export {app, firestore, auth, googleProvider, storage}