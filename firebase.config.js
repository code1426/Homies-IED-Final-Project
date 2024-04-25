import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsHumCvL7xEN6NtgEXuXuhsVDCJB3ZVX0",
  authDomain: "homies-ied-final-project.firebaseapp.com",
  projectId: "homies-ied-final-project",
  storageBucket: "homies-ied-final-project.appspot.com",
  messagingSenderId: "23958512245",
  appId: "1:23958512245:web:83650b6a09df49df748e3c",
  measurementId: "G-MBT4C4MT4K",
};

export const firebaseApp = initializeApp(firebaseConfig);
initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase
export const FirebaseAuth = getAuth(firebaseApp);
export const FirebaseDB = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseDatabase = getDatabase(firebaseApp);
