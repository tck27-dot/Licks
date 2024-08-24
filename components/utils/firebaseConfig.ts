// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as firebaseAuth from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALwYesSaPkDhl-hkNnNnEnruEmUxIuIw8",
  authDomain: "licks-5edf4.firebaseapp.com",
  projectId: "licks-5edf4",
  storageBucket: "licks-5edf4.appspot.com",
  messagingSenderId: "799013023999",
  appId: "1:799013023999:web:3fc2aba0b18f1754b3dcca",
  measurementId: "G-DJTF1T42XG"
};

// const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // Initialize Firebase Auth with AsyncStorage for persistence
// const auth = initializeAuth(app, {
//   persistence: reactNativePersistence(AsyncStorage)
// });

// export { auth };
