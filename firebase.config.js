// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsHumCvL7xEN6NtgEXuXuhsVDCJB3ZVX0",
  authDomain: "homies-ied-final-project.firebaseapp.com",
  projectId: "homies-ied-final-project",
  storageBucket: "homies-ied-final-project.appspot.com",
  messagingSenderId: "23958512245",
  appId: "1:23958512245:web:83650b6a09df49df748e3c",
  measurementId: "G-MBT4C4MT4K",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export const FirebaseAuth = getAuth(firebaseApp);
export const FirebaseDB = getFirestore(firebaseApp);
export const googleProvider = GoogleAuthProvider(firebaseApp);
